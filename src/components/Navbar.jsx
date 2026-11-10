import { Icon } from "./Icon.jsx";
import { useTheme } from "../hooks.js";

const LINKS = [
  ["#about", "About"],
  ["#interests", "Interests"],
  ["#facts", "Facts"],
  ["#goals", "Goals"],
  ["#contact", "Contact"],
];

export default function Navbar({ stars }) {
  const [isDark, toggleTheme] = useTheme();

  return (
    <nav>
      <div className="wrap">
        <a href="#" className="logo">My Portfolio<span>.</span></a>
        <div className="links">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
          {/* key={stars} re-creates the counter on every star, replaying the bump animation */}
          <span id="coins" key={stars} className={stars ? "bump" : ""} title="Click anywhere to collect stars">
            <Icon name="star" />
            <span>{stars}</span>
          </span>
          <button id="theme" onClick={toggleTheme} aria-label="Toggle dark mode">
            <Icon name={isDark ? "sun" : "moon"} />
          </button>
        </div>
      </div>
    </nav>
  );
}
