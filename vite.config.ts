import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  plugins: [
    glsl(),
    react(),
    checker({
      typescript: true,
    }),
  ],
});
