import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./", // NECESSARIO per GitHub Pages !!!
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // RIMOSSO componentTagger (Lovable) perché non serve più e crea conflitti
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
