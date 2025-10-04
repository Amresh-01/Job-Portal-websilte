import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

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
      from: `"Jobify Support" <${process.env.MAIL_USER}>`, // Sender name & email
      to, // Recipient email
      subject: "Jobify: Password Reset Request",
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #2c3e50;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>You have requested to reset your Jobify account password. Click the link below to proceed:</p>
      <p><a href="${resetUrl}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br>Jobify Support Team</p>
    </div>
  `,
    });

    console.log("Password reset email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending reset email:", error);
    throw new Error("Email could not be sent. Please try again later.");
  }
}
