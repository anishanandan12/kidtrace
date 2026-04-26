import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const base = process.env.VITE_BASE_PATH ?? "/kidtrace/";
const browserTargets = ["es2020", "chrome107", "edge107", "firefox104", "safari16.4"];

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  build: {
    target: browserTargets,
    cssTarget: browserTargets,
    sourcemap: true,
  },
});
