// api/get-testimonials.js
// Vercel serverless function — GET /api/get-testimonials
// Returns all testimonials from Supabase, newest first.

import { createClient } from "@supabase/supabase-js";

// Use the SERVICE_ROLE key (full DB access). Keep it a secret:
// set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY as Environment
// Variables in Vercel (and in .env.local for local runs).
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, name, rating, review, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error("get-testimonials error:", err);
    res.status(500).json({ error: "Failed to fetch testimonials." });
  }
}
