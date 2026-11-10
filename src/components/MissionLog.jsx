// Rocket progress bar at the top + "Mission log" pop-ups when you reach each section
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon.jsx";
import { MISSIONS } from "../data.js";

export default function MissionLog() {
  const barRef = useRef(null);
  const [toast, setToast] = useState(null);   // { icon, msg, n }
  const [show, setShow] = useState(false);

  // progress bar follows the scroll position
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      barRef.current.style.width = (max > 0 ? (window.scrollY / max) * 100 : 100) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // a new mission message each time a section is reached for the first time
  useEffect(() => {
    let level = 0, timer;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const [icon, msg] = MISSIONS[Math.min(level, MISSIONS.length - 1)];
      level++;
      setToast({ icon, msg, n: level });
      setShow(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShow(false), 1800);
      io.unobserve(e.target);
    }), { threshold: 0.4 });
    document.querySelectorAll("main section").forEach((s) => io.observe(s));
    return () => { io.disconnect(); clearTimeout(timer); };
  }, []);

  return (
    <>
      <div id="xp" ref={barRef}><Icon name="rocket" /></div>
      <div id="levelup" className={show ? "show" : ""} aria-live="polite">
        {toast && (
          <>
            <Icon name={toast.icon} />
            <div>
              <small>Mission log · {String(toast.n).padStart(2, "0")}</small>
              {toast.msg}
            </div>
          </>
        )}
      </div>
    </>
  );
}
