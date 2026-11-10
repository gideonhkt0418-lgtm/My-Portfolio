// Twinkling starfield, drifting space objects and shooting stars behind the page
import { useEffect, useMemo, useState } from "react";
import { Icon } from "./Icon.jsx";
import { prefersReducedMotion } from "../hooks.js";

const OBJECTS = ["rocket", "planet", "moon", "comet", "satellite", "orbit", "star", "ufo"];
const rand = (min, max) => min + Math.random() * (max - min);

export default function SpaceBackground() {
  const stars = useMemo(() => Array.from({ length: 90 }, () => ({
    size: Math.random() < 0.85 ? 1.5 : 2.5,
    left: rand(0, 100), top: rand(0, 100), dur: rand(2, 6), delay: -rand(0, 6),
  })), []);

  const floaties = useMemo(() => Array.from({ length: 12 }, (_, n) => ({
    icon: OBJECTS[n % OBJECTS.length],
    left: rand(0, 100), size: rand(18, 38), dur: rand(20, 38), delay: -rand(0, 30),
    spin: (Math.random() < 0.5 ? -1 : 1) * rand(90, 270),
  })), []);

  const [shooting, setShooting] = useState([]);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let id = 0;
    const timer = setInterval(() => {
      const s = { id: id++, left: rand(30, 100), top: rand(0, 40) };
      setShooting((list) => [...list, s]);
      setTimeout(() => setShooting((list) => list.filter((x) => x.id !== s.id)), 1200);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="floaties" aria-hidden="true">
      {stars.map((s, i) => (
        <span key={"s" + i} className="star" style={{
          width: s.size, height: s.size, left: s.left + "vw", top: s.top + "vh",
          animationDuration: s.dur + "s", animationDelay: s.delay + "s",
        }} />
      ))}
      {floaties.map((f, i) => (
        <span key={"f" + i} className="floaty" style={{
          left: f.left + "vw", fontSize: f.size, animationDuration: f.dur + "s",
          animationDelay: f.delay + "s", "--spin": f.spin + "deg",
        }}>
          <Icon name={f.icon} />
        </span>
      ))}
      {shooting.map((s) => (
        <span key={s.id} className="shoot" style={{ left: s.left + "vw", top: s.top + "vh" }} />
      ))}
    </div>
  );
}
