import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

function syncAppHeight() {
  const height = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty("--app-height", `${Math.round(height)}px`);
}

syncAppHeight();
window.addEventListener("resize", syncAppHeight);
window.addEventListener("orientationchange", syncAppHeight);
window.visualViewport?.addEventListener("resize", syncAppHeight);
window.visualViewport?.addEventListener("scroll", syncAppHeight);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
