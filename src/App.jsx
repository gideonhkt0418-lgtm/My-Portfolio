// The whole website: every section is its own component in /components
import { useEffect, useState } from "react";
import { Icon, IconSprite } from "./components/Icon.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import { About, Interests, Facts, Goals, Contact } from "./components/Sections.jsx";
import SolarSystem from "./components/SolarSystem.jsx";
import SpaceBackground from "./components/SpaceBackground.jsx";
import MissionLog from "./components/MissionLog.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [stars, setStars] = useState(0);
  const [pops, setPops] = useState([]);   // "+1 star" pop-ups where you clicked

  // Click anywhere (except buttons, links and the game) to collect a star
  useEffect(() => {
    let id = 0, count = 0;
    const onClick = (e) => {
      if (e.target.closest("button, a, input, .game")) return;
      count++;
      setStars(count);
      const pop = { id: id++, x: e.clientX, y: e.clientY, n: count };
      setPops((list) => [...list, pop]);
      setTimeout(() => setPops((list) => list.filter((p) => p.id !== pop.id)), 900);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <IconSprite />
      <MissionLog />
      <SpaceBackground />
      <Navbar stars={stars} />

      <main className="wrap">
        <Hero />
        <About />
        <Interests />
        <Facts />
        <Goals />
        <Contact />
        <SolarSystem />
      </main>

      <Footer />

      {pops.map((p) => (
        <span key={p.id} className="pop" style={{ left: p.x, top: p.y }}>
          {p.n % 10 === 0
            ? <><Icon name="sparkle" /> Supernova ×{p.n / 10}</>
            : <>+1 <Icon name="star" /></>}
        </span>
      ))}
    </>
  );
}
