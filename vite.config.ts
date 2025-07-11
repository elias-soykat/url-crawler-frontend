import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: ".",
  build: {
    outDir: "dist",
    target: "esnext",
  },
  server: {
    port: 5173,
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
