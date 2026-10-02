import { useState } from "react";

// Distinct from the testimonials section: a full-width gradient "Get in Touch"
// band with contact details on the left and the form in a white card on the right.

const contactInfo = [
  { icon: "✉️", label: "Email", value: "praathviraj@gmail.com" },
  { icon: "📍", label: "Clinic", value: "Sports Physiotherapy Clinic" },
  { icon: "🕐", label: "Hours", value: "Mon – Sat · 9:00 AM – 7:00 PM" },
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ type: "error", msg: "Please fill in your name, email, and message." });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", msg: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        /* ignore parse errors */
      }

      if (!res.ok) throw new Error(data.error || `Server responded with ${res.status}`);

      setName("");
      setEmail("");
      setMessage("");
      setStatus({ type: "success", msg: `✅ ${data.message}` });
    } catch (err) {
      console.error("Failed to send contact message:", err);
      setStatus({ type: "error", msg: `⚠️ ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="contact-section">
      <div className="container contact-grid">
        <div className="contact-info">
          <h2 className="contact-title">Get in Touch</h2>
          <p className="contact-lead">
            Questions about a treatment, a specific injury, or booking an
            appointment? Send a message and we'll get back to you.
          </p>
          <ul className="contact-list">
            {contactInfo.map((c) => (
              <li key={c.label}>
                <span>{c.icon}</span>
                <div>
                  <div className="contact-label">{c.label}</div>
                  <div className="contact-value">{c.value}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <form id="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="c-name">Your Name</label>
            <input
              type="text"
              id="c-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul S."
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="c-email">Email</label>
            <input
              type="email"
              id="c-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label htmlFor="c-message">Message</label>
            <textarea
              id="c-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you?"
              maxLength={2000}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Sending…" : "Send Message"}
          </button>

          {status.msg && <p className={`status-msg ${status.type}`}>{status.msg}</p>}
        </form>
      </div>
    </section>
  );
}
