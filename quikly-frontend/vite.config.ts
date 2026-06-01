import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/shorten": "http://localhost:3000",
      "/stats": "http://localhost:3000",
      "/api": "http://localhost:3000",
      "/health": "http://localhost:3000",
    },
  },
});
