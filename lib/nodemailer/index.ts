import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "./templates";

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
