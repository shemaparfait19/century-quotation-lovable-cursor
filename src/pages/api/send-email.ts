import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { to, subject, content, attachment } = req.body;

    // Validate required fields
    if (!to || !subject || !content) {
      return res.status(400).json({
        message: "Missing required fields",
        details: { to, subject, content },
      });
    }

    // Log environment variables (without sensitive data)
    console.log("SMTP Configuration:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM,
    });

    // Create a transporter using your email service credentials
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (error) {
      console.error("SMTP connection verification failed:", error);
      return res.status(500).json({
        message: "Failed to connect to email server",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text: content,
      attachments: attachment
        ? [
            {
              filename: "Century_Cleaning_Quotation.pdf",
              content: attachment,
              encoding: "base64",
            },
          ]
        : [],
    });

    console.log("Email sent successfully:", info);
    res.status(200).json({
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      message: "Failed to send email",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
