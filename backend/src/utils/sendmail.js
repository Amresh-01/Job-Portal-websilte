import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendResetEmail(to, resetUrl) {
  try {
    const info = await transporter.sendMail({
      from: `"Jobify Support" <${process.env.MAIL_USER}>`,
      to,
      subject: "Password reset",
      text: `Hi, reset your password using this link: ${resetUrl}`,
      html: `<p>Reset your password using the link: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    console.log("Password reset email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending reset email:", error);
    throw new Error("Email could not be sent. Please try again later.");
  }
}
