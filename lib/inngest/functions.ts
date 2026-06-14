/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAllUsersForNewsEmail } from "../actions/user.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { getNews } from "../actions/finnhub.actions";
import { SendNewsSummaryEmail, SendWelcomeEmail } from "../nodemailer";
import { inngest } from "./client";
import {
  NEWS_SUMMARY_EMAIL_PROMPT,
  PERSONALIZED_WELCOME_EMAIL_PROMPT,
} from "./prompt";
import { formatDateToday } from "../utils";

// Simple type definitions used in this file
interface UserForNewsEmail {
  email: string;
  name?: string;
  country?: string;
  investmentGoals?: string;
  riskTolerance?: string;
  preferredIndustry?: string;
}

interface MarketNewsArticle {
  source?: string;
  headline?: string;
  url?: string;
  summary?: string;
  symbol?: string;
  datetime?: string | number;
}

export const sendSignUpEmail = inngest.createFunction(
  {
    id: "sign-up-email",
    triggers: [{ event: "app/user-created" }],
  },
  async ({ event, step }) => {
    const userProfile = `
      - Country: ${event.data.country}
      - Investment goals: ${event.data.investmentGoals}
      - Risk tolerance: ${event.data.riskTolerance}
      - Preferred industry: ${event.data.preferredIndustry}
    `;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{userProfile}}",
      userProfile,
    );

    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    await step.run("send-welcome-email", async () => {
      const part = response.candidates?.[0]?.content?.parts?.[0];
      const introText =
        (part && "text" in part ? part.text : null) ||
        "Thanks for signing up! We're excited to have you on board.";

      const {
        data: { email, name },
      } = event;
      return await SendWelcomeEmail({
        email,
        name,
        intro: introText,
      });
    });

    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  },
);

export const sendDailyNewsSummary = inngest.createFunction(
  {
    id: "daily-news-summary",
    triggers: [{ event: "app/send.daily.news" }, { cron: "0 12 * * *" }],
  },
  async ({ step }) => {
    const users = await step.run("get-all-users", getAllUsersForNewsEmail);

    if (!users || users.length === 0) {
      return { success: false, message: "No users to send news summary to" };
    }

    const results = await step.run("fetch-user-news", async () => {
      const perUser: Array<{
        user: UserForNewsEmail;
        articles: MarketNewsArticle[];
      }> = [];
      for (const user of users as UserForNewsEmail[]) {
        try {
          const symbols = await getWatchlistSymbolsByEmail(user.email);
          let articles = await getNews(symbols);
          articles = (articles || []).slice(0, 6);
          if (!articles || articles.length === 0) {
            articles = await getNews();
            articles = (articles || []).slice(0, 6);
          }
          perUser.push({ user, articles });
        } catch (e) {
          console.error("daily-news: error preparing user news", e);
          perUser.push({ user, articles: [] });
        }
      }
      return perUser;
    });
    const userNewsSummary: {
      user: UserForNewsEmail;
      newsContent: string | null;
    }[] = [];
    for (const { user, articles } of results) {
      try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
          "{{news}}",
          JSON.stringify(articles, null, 2),
        );

        const response = await step.ai.infer(`summarize-news-${user.email}`, {
          model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
          body: {
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
          },
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        const newsContent =
          (part && "text" in part ? part.text : null) ||
          "No market news available today.";

        userNewsSummary.push({ user, newsContent });
      } catch (e) {
        console.error("Failed to summarise news for user");
        userNewsSummary.push({ user, newsContent: null });
      }
    }

    await step.run("send-news-emails", async () => {
      await Promise.all(
        userNewsSummary.map(async ({ user, newsContent }) => {
          if (!newsContent) return false;

          return await SendNewsSummaryEmail({
            email: user.email,
            date: formatDateToday(),

            newsContent,
          });
        }),
      );
    });

    return { success: true, message: "Daily news summary process completed" };
  },
);
