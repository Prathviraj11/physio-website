// app.js
// Vercel serves the /api functions at the same origin, so relative URLs
// work both in local dev (`vercel dev`) and in production.
const API_GET = "/api/get-testimonials";
const API_ADD = "/api/add-testimonial";

/* =============================================
   1. STAR RATING PICKER
============================================= */
const ratingPicker = document.getElementById("rating-picker");
const hiddenRating = document.getElementById("rating");
let selectedRating = 0;

ratingPicker.addEventListener("click", (e) => {
  const btn = e.target.closest(".star");
  if (!btn) return;

  selectedRating = Number(btn.dataset.value);
  hiddenRating.value = selectedRating;

  // Light up all stars up to the selected one
  ratingPicker.querySelectorAll(".star").forEach((s) => {
    s.classList.toggle("active", Number(s.dataset.value) <= selectedRating);
  });
});

/* =============================================
   2. FETCH TESTIMONIALS — GET request
============================================= */
async function loadTestimonials() {
  const grid = document.getElementById("testimonials-grid");
  const status = document.getElementById("testimonials-status");

  try {
    const res = await fetch(API_GET);

    // Always check res.ok — fetch() does NOT reject on 4xx/5xx!
    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const testimonials = await res.json();
    grid.innerHTML = ""; // clear any previous error message

    if (testimonials.length === 0) {
      showStatus(status, "info", "No testimonials yet — be the first to share your story below!");
      return;
    }

    status.hidden = true;
    testimonials.forEach((t) => grid.appendChild(renderTestimonial(t)));
  } catch (err) {
    console.error("Failed to load testimonials:", err);
    showStatus(status, "error", "⚠️ Could not load testimonials. Please try again later.");
  }
}

function renderTestimonial(t) {
  const fig = document.createElement("figure");
  fig.className = "card testimonial-card";

  const stars = document.createElement("div");
  stars.className = "stars";
  // Safe: rating was validated 1-5 on the backend
  stars.textContent = "★".repeat(t.rating) + "☆".repeat(5 - t.rating);

  const quote = document.createElement("blockquote");
  quote.textContent = `“${t.review}”`; // textContent = XSS-safe (no HTML parsing)

  const caption = document.createElement("figcaption");
  caption.textContent = `— ${t.name}`;

  fig.append(stars, quote, caption);
  return fig;
}

/* =============================================
   3. SUBMIT TESTIMONIAL — POST request
============================================= */
const form = document.getElementById("testimonial-form");
const formStatus = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop the browser's default form submission

  // --- Client-side validation (UX; the server re-validates!) ---
  const name = document.getElementById("name").value.trim();
  const review = document.getElementById("review").value.trim();

  if (!name || !review || !selectedRating) {
    showStatus(formStatus, "error", "Please fill in your name, a rating, and your review.");
    return;
  }

  // --- Disable the button while the request is in flight ---
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting…";

  try {
    const res = await fetch(API_ADD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rating: selectedRating, review }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Server responded with ${res.status}`);
    }

    // Success path
    form.reset();
    selectedRating = 0;
    hiddenRating.value = "";
    ratingPicker.querySelectorAll(".star").forEach((s) => s.classList.remove("active"));

    showStatus(formStatus, "success", `✅ ${data.message}`);
    loadTestimonials(); // refresh the list with the new entry
  } catch (err) {
    console.error("Failed to submit testimonial:", err);
    showStatus(formStatus, "error", `⚠️ ${err.message}`);
  } finally {
    // Always restore the button, success or failure
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Testimonial";
  }
});

/* =============================================
   4. HELPERS + INIT
============================================= */
function showStatus(el, type, message) {
  el.hidden = false;
  el.className = `status-msg ${type}`;
  el.textContent = message;
}

document.getElementById("year").textContent = new Date().getFullYear();
loadTestimonials();
