// api/contact.js
// Vercel serverless function — POST /api/contact
// Sends a "Get in Touch" message to the clinic via Resend.
// Body: { name: string, email: string, message: string }

import { Resend } from "resend";

// Recipient = the clinic (Shweta). Change CONTACT_TO_EMAIL in Vercel's
// Environment Variables to update it — no code change needed.
const TO = process.env.CONTACT_TO_EMAIL || "praathviraj@gmail.com";
// FROM must be an address on a domain verified in Resend.
const FROM = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  if (!process.env.RESEND_API_KEY) {
    // Fail fast with a clear message if the key isn't configured yet.
    return res.status(503).json({
      error: "Email sending is not configured yet. Please try again later.",
    });
  }

  const { name, email, message } = req.body ?? {};

  // --- Validate ---
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
  if (
    typeof name !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !message.trim() ||
    !validEmail
  ) {
    return res.status(400).json({
      error: "Please provide your name, a valid email, and a message.",
    });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject: `New message from ${name.trim()}`,
      // A readable HTML email for the clinic.
      html: `
        <h2>New message from the website</h2>
        <table cellpadding="6" style="font-family: Arial, sans-serif; border-collapse: collapse;">
          <tr><td style="font-weight:bold; color:#0e7490;">Name</td><td>${escapeHtml(name.trim())}</td></tr>
          <tr><td style="font-weight:bold; color:#0e7490;">Email</td><td>${escapeHtml(email.trim())}</td></tr>
          <tr><td style="font-weight:bold; color:#0e7490;">Message</td><td>${escapeHtml(message.trim())}</td></tr>
        </table>
      `,
    });

    if (error) throw error;

    res.status(200).json({
      message: "Thank you for reaching out! We'll get back to you soon.",
    });
  } catch (err) {
    console.error("contact email error:", err);
    res.status(500).json({ error: "Could not send your message. Please try again later." });
  }
}

// Prevent HTML injection in the email body.
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
