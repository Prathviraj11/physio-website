// src/lib/api.js
// Thin wrapper over the Vercel /api endpoints. Using relative URLs means
// this works unchanged in Vite dev (proxied to localhost:3000) and in
// production (served from the same origin on Vercel).

const API_GET = "/api/get-testimonials";
const API_ADD = "/api/add-testimonial";

export async function fetchTestimonials() {
  const res = await fetch(API_GET);
  if (!res.ok) throw new Error(`Server responded with ${res.status}`);
  return res.json();
}

export async function submitTestimonial({ name, rating, review }) {
  const res = await fetch(API_ADD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, rating, review }),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    /* body may be empty on some errors */
  }

  if (!res.ok) throw new Error(data.error || `Server responded with ${res.status}`);
  return data;
}
