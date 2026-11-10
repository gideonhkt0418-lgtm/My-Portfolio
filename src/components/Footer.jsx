import { Icon } from "./Icon.jsx";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="track" aria-hidden="true">
          <div className="walker"><Icon name="ufo" /></div>
        </div>
        Designed &amp; built by Gideon Hau · © {new Date().getFullYear()}
      </div>
    </footer>
  );
}
