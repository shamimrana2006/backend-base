import nodemailer from "nodemailer";
import { GOOGLE_APP_PASSWORD } from "../secrete";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shamimranaprofessional@gmail.com",
    pass: GOOGLE_APP_PASSWORD,
  },
});

export const emailSender = async (
  to: string = "",
  subject: string = "Notice from e-commerce",
  html: string
) => {
  const info = await transporter.sendMail({
    from: '"e-commerce SHAMIM base" <shamimranaprofessional@gmail.com>',
    to,
    subject,
    text: "notice you, can you check you all notification please",
    html,
  });
  return info;
};
