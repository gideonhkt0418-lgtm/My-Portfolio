import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

// Apply the saved light/dark choice before the page draws (prevents a flash)
try {
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.dataset.theme = saved;
} catch {}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
