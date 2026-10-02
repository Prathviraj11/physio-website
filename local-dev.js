// local-dev.js
// A tiny local dev server (runs the SAME /api handler files as Vercel).
// Lets you test the full frontend -> API -> Supabase flow at localhost:3000
// without needing a Vercel login. For production, Vercel serves the same
// /api files natively — this file is purely for local development.
//
//   Run:  npm run dev   (or:  node local-dev.js)

import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Load .env.local (the same file Vercel dev uses) ---
const envFile = path.join(__dirname, ".env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) {
      process.env[m[1]] = m[2];
    }
  }
}

// --- Sanity-check the Supabase config up front ---
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("\n✖  Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local\n   Fill both in, then re-run `npm run dev`.\n");
  process.exit(1);
}

// --- Import the real serverless handlers ---
const getTestimonials = (await import("./api/get-testimonials.js")).default;
const addTestimonial = (await import("./api/add-testimonial.js")).default;

const app = express();
app.use(express.json()); // parse JSON request bodies (needed by the POST route)

// --- Serve the static frontend (index.html, style.css, app.js) ---
app.use(express.static(__dirname));

// --- Mount the API routes (identical to how Vercel maps /api/*) ---
app.get("/api/get-testimonials", getTestimonials);
app.post("/api/add-testimonial", addTestimonial);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✔  Local dev server running:  http://localhost:${PORT}`);
  console.log(`   API:  http://localhost:${PORT}/api/get-testimonials\n`);
});
