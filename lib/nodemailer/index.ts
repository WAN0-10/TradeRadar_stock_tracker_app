import nodemailer from "nodemailer";
import {
  NEWS_SUMMARY_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./templates";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL!,
    pass: process.env.NODEMAILER_PASSWORD!,
  },
});

export const SendWelcomeEmail = async ({
  email,
  name,
  intro,
}: WelcomeEmailData) => {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace(
    "{{intro}}",
    intro,
  );

  const mailOptions = {
    from: `"Trade Radar" <traderadar@wano.com>`,
    to: email,
    subject: "Welcome to Trade Radar! Your stock market toolkit is ready",
    text: "Thanks for signing up! We're excited to have you on board. Your personalized stock market insights and tools are ready to explore.",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};

export const SendNewsSummaryEmail = async ({
  email,
  date,
  newsContent,
}: {
  email: string;
  date: string;
  newsContent: string;
}): Promise<void> => {
  const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE.replace(
    "{{date}}",
    date,
  ).replace("{{newsContent}}", newsContent);

  const mailOptions = {
    from: `"Trade Radar News" <traderadar@wano.com>`,
    to: email,
    subject: `📈 Market News Summary Today - ${date}`,
    text: "Today's market news summary is ready! Check out the latest insights and updates on the stock market to stay informed and make smarter trading decisions.",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};
