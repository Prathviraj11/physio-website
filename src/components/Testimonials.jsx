import { useEffect, useState } from "react";
import { fetchTestimonials } from "../lib/api";

function Stars({ rating }) {
  return <div className="stars">{"★".repeat(rating) + "☆".repeat(5 - rating)}</div>;
}

function TestimonialCard({ t }) {
  return (
    <figure className="card testimonial-card">
      <Stars rating={t.rating} />
      <blockquote>“{t.review}”</blockquote>
      <figcaption>— {t.name}</figcaption>
    </figure>
  );
}

export default function Testimonials({ version }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchTestimonials();
        if (active) setTestimonials(data);
      } catch (err) {
        console.error("Failed to load testimonials:", err);
        if (active) setError("⚠️ Could not load testimonials. Please try again later.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
    // `version` bumps after a new submission, re-running the fetch
  }, [version]);

  return (
    <section id="testimonials" className="section">
      <div className="container">
        <h2 className="section-title">What My Patients Say</h2>

        {error && <p className="status-msg error">{error}</p>}
        {!loading && !error && testimonials.length === 0 && (
          <p className="status-msg info">
            No testimonials yet — be the first to share your story below!
          </p>
        )}

        <div className="testimonials-grid" aria-live="polite">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
