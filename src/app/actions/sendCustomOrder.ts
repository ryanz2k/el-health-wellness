"use server";

import { Resend } from "resend";
import nodemailer from "nodemailer";

export async function sendCustomOrder(formData: FormData) {
  try {
    const customerEmail = formData.get("email") as string;
    const productNamesArray = formData.getAll("productName") as string[];
    const productNames = productNamesArray.join(", ");
    const description = formData.get("description") as string;
    
    if (!customerEmail || productNamesArray.length === 0 || !description) {
      return { success: false, error: "Missing required fields" };
    }

    // Handle multiple file attachments
    const files = formData.getAll("image") as File[];
    const nodeMailerAttachments = [];
    const resendAttachments = [];

    for (const file of files) {
      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        nodeMailerAttachments.push({
          filename: file.name,
          content: buffer,
          contentType: file.type || "application/octet-stream",
        });

        resendAttachments.push({
          filename: file.name,
          content: buffer,
        });
      }
    }

    const htmlBody = `
      <div style="font-family: sans-serif; color: #333;">
        <h2>El Health & Wellness Custom Order Request</h2>
        <p><strong>Customer Contact:</strong> ${customerEmail}</p>
        <p><strong>Selected Target Product(s):</strong> ${productNames}</p>
        <br />
        <p><strong>Description & Special Requests:</strong></p>
        <p style="white-space: pre-wrap; background: #f4f4f4; padding: 15px; border-radius: 8px;">${description}</p>
        <br />
        ${resendAttachments.length > 0 ? `<p><em>${resendAttachments.length} image reference(s) attached.</em></p>` : ""}
      </div>
    `;

    const confirmationHtmlBody = `
      <div style="font-family: sans-serif; color: #333;">
        <h2 style="color: #ff69b4;">Request Received!</h2>
        <p>Dear Customer,</p>
        <p>We have successfully received your custom order inquiry for <strong>${productNames}</strong>.</p>
        <p>Our administrative team will carefully review your requirements and respond to you as soon as possible.</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #ff69b4;">
          <strong>Your Message:</strong>
          <p style="white-space: pre-wrap; margin-top: 5px;">${description}</p>
        </div>
        <p style="margin-top: 30px;">Best regards,<br/><strong>EL Health and Wellness Team</strong></p>
      </div>
    `;

    let transporter;
    let authUser;

    if (process.env.SMTP_HOST) {
      // Production Mode
      authUser = process.env.SMTP_USER;
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Testing Mode (Ethereal)
      const testAccount = await nodemailer.createTestAccount();
      authUser = testAccount.user;
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    // Try Production Resend First
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      // 1. Admin Email
      await resend.emails.send({
        from: "EL Health and Wellness <onboarding@resend.dev>", // Resend default testing domain
        to: "johnryangomez812@gmail.com",
        replyTo: customerEmail,
        subject: `El Health & Wellness Custom Order Request`,
        html: htmlBody,
        attachments: resendAttachments,
      });

      // 2. Customer Confirmation Email
      await resend.emails.send({
        from: "EL Health and Wellness <onboarding@resend.dev>",
        to: customerEmail,
        subject: `Confirmation: Custom Order Request for EL Health and Wellness`,
        html: confirmationHtmlBody,
      });

      console.log("Emails successfully sent via Resend API.");
      return { success: true };
    } 
    
    // Fallback to Nodemailer Ethereal Testing if no API Key is provided
    else {
      console.warn("RESEND_API_KEY is not set. Falling back to Ethereal Testing Mode.");
      
      const adminInfo = await transporter.sendMail({
        from: `"${customerEmail}" <${authUser}>`, // Ethereal / Production Auth
        replyTo: customerEmail,
        to: "johnryangomez812@gmail.com",
        subject: `El Health & Wellness Custom Order Request`,
        html: htmlBody,
        attachments: nodeMailerAttachments,
      });

      const senderInfo = await transporter.sendMail({
        from: `"EL Health and Wellness" <${authUser}>`,
        to: customerEmail,
        subject: `Confirmation: Custom Order Request for EL Health and Wellness`,
        html: confirmationHtmlBody,
      });

      return { 
        success: true, 
        previewUrl: nodemailer.getTestMessageUrl(adminInfo) || undefined,
        senderPreviewUrl: nodemailer.getTestMessageUrl(senderInfo) || undefined
      };
    }

  } catch (error) {
    console.error("Failed to send custom order email:", error);
    return { success: false, error: "Failed to send email. Please try again." };
  }
}
