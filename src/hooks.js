// Custom React hooks: small reusable pieces of behaviour
import { useEffect, useRef, useState } from "react";

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Safe localStorage helpers (storage can be blocked in private windows)
export function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
}
export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// Types out each phrase, deletes it, then moves to the next one
export function useTypewriter(phrases) {
  const [text, setText] = useState("");
  useEffect(() => {
    let p = 0, i = 0, deleting = false, timer;
    function tick() {
      const word = phrases[p];
      setText(word.slice(0, i));
      if (!deleting && i < word.length) i++;
      else if (deleting && i > 0) i--;
      else if (!deleting) { deleting = true; timer = setTimeout(tick, 1500); return; }
      else { deleting = false; p = (p + 1) % phrases.length; }
      timer = setTimeout(tick, deleting ? 40 : 85);
    }
    tick();
    return () => clearTimeout(timer);
  }, [phrases]);
  return text;
}

// Light / dark mode, remembering the choice
export function useTheme() {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || null);
  const [systemDark, setSystemDark] = useState(media.matches);

  useEffect(() => {
    const onChange = (e) => setSystemDark(e.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const isDark = theme ? theme === "dark" : systemDark;
  const toggle = () => {
    const next = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
    setTheme(next);
  };
  return [isDark, toggle];
}

// Becomes true (once) when the element scrolls into view
export function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}
