// api/add-testimonial.js
// Vercel serverless function — POST /api/add-testimonial
// Body: { name: string, rating: number (1-5), review: string }

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { name, rating, review } = req.body ?? {};

  // --- Validate (always validate client input!) ---
  if (typeof name !== "string" || typeof review !== "string" || !name.trim() || !review.trim()) {
    return res.status(400).json({
      error: "'name' and 'review' are required non-empty strings.",
    });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({
      error: "'rating' must be an integer between 1 and 5.",
    });
  }

  try {
    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        name: name.trim().slice(0, 100),
        rating,
        review: review.trim().slice(0, 2000),
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      id: data.id,
      message: "Thank you! Your testimonial has been submitted.",
    });
  } catch (err) {
    console.error("add-testimonial error:", err);
    res.status(500).json({ error: "Failed to save your testimonial." });
  }
}
