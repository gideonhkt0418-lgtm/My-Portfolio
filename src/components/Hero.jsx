import { Icon } from "./Icon.jsx";
import AsteroidRun from "./AsteroidRun.jsx";
import { useTypewriter } from "../hooks.js";
import { BADGES, PHRASES } from "../data.js";

export default function Hero() {
  const typed = useTypewriter(PHRASES);

  return (
    <header className="hero">
      <div>
        <p className="hello">Howdy! I'm</p>
        <h1><span className="grad">Gideon Hau</span></h1>
        <p className="tagline">
          <span>{typed}</span>
          <span className="cursor">&nbsp;</span>
        </p>
        <div className="badges">
          {BADGES.map((b) => (
            <span className="badge" key={b.label}>
              <Icon name={b.icon} />
              {b.label}
            </span>
          ))}
        </div>
      </div>

      <AsteroidRun />
    </header>
  );
}
