import { useState } from "react";
import { submitTestimonial } from "../lib/api";

export default function TestimonialForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !review.trim() || !rating) {
      setStatus({ type: "error", msg: "Please fill in your name, a rating, and your review." });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", msg: "" });

    try {
      const data = await submitTestimonial({ name, rating, review });
      // Reset the form
      setName("");
      setRating(0);
      setReview("");
      setStatus({ type: "success", msg: `✅ ${data.message}` });
      onSuccess && onSuccess(); // refresh the testimonials list
    } catch (err) {
      console.error("Failed to submit testimonial:", err);
      setStatus({ type: "error", msg: `⚠️ ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="submit" className="section section-alt">
      <div className="container container-narrow">
        <h2 className="section-title">Share Your Recovery Story</h2>
        <form id="testimonial-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sudeep S."
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label>Rating</label>
            <div className="rating-picker" role="radiogroup" aria-label="Choose a rating from 1 to 5 stars">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  className={v <= rating ? "star active" : "star"}
                  aria-label={`${v} star${v > 1 ? "s" : ""}`}
                  onClick={() => setRating(v)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="review">Your Experience</label>
            <textarea
              id="review"
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us how your recovery went…"
              maxLength={2000}
            />
          </div>

          <button type="submit" id="submit-btn" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Testimonial"}
          </button>

          {status.msg && <p className={`status-msg ${status.type}`}>{status.msg}</p>}
        </form>
      </div>
    </section>
  );
}
