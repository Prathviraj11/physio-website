import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In `npm run dev`, Vite serves the frontend on :5173 and proxies any
// /api/* request to the Express API server (local-dev.js on :3000).
// In production, Vercel serves the /api functions on the same origin,
// so the proxy is never used there.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
