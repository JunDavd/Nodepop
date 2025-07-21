import nodemailer from "nodemailer";

export function createTransport() {
  const options = {
    host: process.env.EMAIL_SERVICE_HOST,
    port: process.env.EMAIL_SERVICE_PORT,
    secure: process.env.EMAIL_SERVICE_SECURE === "true",
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_SERVICE_PASSWORD,
    },
  };
  console.log(options);
  return nodemailer.createTransport(options);
}

export async function sendEmail({ transport, to, subject, body }) {
  const result = await transport.sendMail({
    from: process.env.EMAIL_SERVICE_FROM,
    to,
    subject,
    html: body,
  });
}
