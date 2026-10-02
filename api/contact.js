// api/contact.js
// Vercel serverless function — POST /api/contact
// Forwards the "Get in Touch" form to Formspree.
//
// The email *recipient* is configured in the Formspree dashboard (Project
// settings), NOT in code — so the form can later be re-pointed to Shweta's
// address (or her own Formspree form) without touching any code.
// Body: { name: string, email: string, message: string }

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // FORMSPREE_ENDPOINT looks like: https://api.formspree.io/f/abcd1234
  const endpoint = process.env.FORMSPREE_ENDPOINT;
  if (!endpoint) {
    return res.status(503).json({
      error: "Contact form is not configured yet. Please try again later.",
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

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        // Formspree meta field: the email subject line.
        _subject: `New message from ${name.trim()}`,
      }),
    });

    if (!upstream.ok) {
      // Log Formspree's response (rate limit, bad endpoint, etc.) for debugging.
      const detail = await upstream.text();
      console.error("Formspree error:", upstream.status, detail);
      return res
        .status(502)
        .json({ error: "Could not send your message right now. Please try again later." });
    }

    res.status(200).json({
      message: "Thank you for reaching out! We'll get back to you soon.",
    });
  } catch (err) {
    console.error("contact error:", err);
    res.status(500).json({ error: "Could not send your message. Please try again later." });
  }
}
