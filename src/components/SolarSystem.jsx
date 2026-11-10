// The 8 floating planets, with an astronaut hopping between them
import { useEffect, useRef } from "react";
import Section from "./Section.jsx";
import { PLANETS } from "../data.js";
import { prefersReducedMotion } from "../hooks.js";

function Astronaut() {
  return (
    <svg viewBox="0 0 40 44" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="17" width="6" height="12" rx="2" />
      <path d="M13 18h14a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3v-9a2 2 0 0 1 2-2z" />
      <circle cx="20" cy="10" r="8" />
      <path d="M16 9.5a4 3 0 0 1 9 0v1a2.5 2.5 0 0 1-2.5 2.5h-4A2.5 2.5 0 0 1 16 10.5z" fill="currentColor" fillOpacity=".25" />
      <path d="M29 21l5 4M11 22l-3 5" />
      <path d="M16 32v8h-3M24 32v8h3" />
    </svg>
  );
}

export default function SolarSystem() {
  const hopperRef = useRef(null);
  const planetsRef = useRef(null);

  useEffect(() => {
    const hopper = hopperRef.current;
    const art = hopper.querySelector("svg");
    const bodies = [...planetsRef.current.querySelectorAll(".planet")];
    const section = hopper.offsetParent;

    // top-centre of a planet, relative to the section (follows the planet as it bobs)
    const spot = (k) => {
      const s = section.getBoundingClientRect(), r = bodies[k].getBoundingClientRect();
      return { x: r.left + r.width / 2 - s.left, y: r.top - s.top + 2 };
    };
    const place = (x, y, rot) => {
      hopper.style.transform = `translate(${x}px, ${y}px)`;
      art.style.rotate = rot + "deg";
    };

    let cur = 2, dir = 1, phase = "stand", t0 = performance.now(), visible = false, raf = 0; // start on Earth
    const STAND = 550, JUMP = 850;

    if (prefersReducedMotion()) {
      const p = spot(cur); place(p.x, p.y, 0);
      return;
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(section);

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const a = spot(cur);
      if (phase === "stand") {
        place(a.x, a.y, 0);
        art.style.scale = dir < 0 ? "-1 1" : "1 1";
        if (now - t0 > STAND) {
          if (cur + dir < 0 || cur + dir >= bodies.length) dir = -dir; // turn around at the ends
          phase = "jump"; t0 = now;
        }
      } else {
        const b = spot(cur + dir);
        const t = Math.min(1, (now - t0) / JUMP);
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // smooth in-out
        const height = 45 + Math.hypot(b.x - a.x, b.y - a.y) * 0.25;
        place(a.x + (b.x - a.x) * e, a.y + (b.y - a.y) * e - height * 4 * t * (1 - t), 360 * e * dir);
        if (t >= 1) {
          cur += dir; phase = "stand"; t0 = now;
          hopper.classList.remove("squash"); void hopper.offsetWidth; hopper.classList.add("squash");
        }
      }
    }
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  return (
    <Section id="planets" className="solar" label="Solar system" title="Thanks for visiting.">
      <div className="hopper" ref={hopperRef} aria-hidden="true">
        <Astronaut />
      </div>
      <div className="planets" ref={planetsRef}>
        {PLANETS.map((p) => (
          <div className="planet-wrap" key={p}>
            <div className={`planet p-${p.toLowerCase()}`} />
            <span className="planet-name">{p}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
