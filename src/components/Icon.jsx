// All the line icons, drawn once and reused with <Icon name="..." />

export function Icon({ name, className = "" }) {
  return (
    <svg className={`i ${className}`} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="i-gamepad" viewBox="0 0 24 24">
        <path d="M7 6h10a5 5 0 0 1 4.9 6l-.9 4.4a2.8 2.8 0 0 1-4.9 1.2L14.5 16h-5l-1.6 1.6A2.8 2.8 0 0 1 3 16.4L2.1 12A5 5 0 0 1 7 6z" />
        <path d="M7 10v3M5.5 11.5h3" />
        <circle cx="16" cy="10.5" r=".6" />
        <circle cx="17.5" cy="12.5" r=".6" />
      </symbol>
      <symbol id="i-book" viewBox="0 0 24 24">
        <path d="M2.5 5.5C4.5 4.2 7.5 4 12 5.8v14c-4.5-1.8-7.5-1.6-9.5-.3z" />
        <path d="M21.5 5.5c-2-1.3-5-1.5-9.5.3v14c4.5-1.8 7.5-1.6 9.5-.3z" />
      </symbol>
      <symbol id="i-bulb" viewBox="0 0 24 24">
        <path d="M9 18h6M10 21h4" />
        <path d="M12 3a6 6 0 0 0-3.8 10.6c.6.5.8 1.3.8 2.1V16h6v-.3c0-.8.3-1.6.8-2.1A6 6 0 0 0 12 3z" />
      </symbol>
      <symbol id="i-star" viewBox="0 0 24 24">
        <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6l-5.4 2.9 1.2-6-4.5-4.2 6.1-.7z" />
      </symbol>
      <symbol id="i-sparkle" viewBox="0 0 24 24">
        <path fill="currentColor" stroke="none" d="M12 1c.6 5.5 3.4 8.4 9 9-5.6.6-8.4 3.4-9 9-.6-5.6-3.4-8.4-9-9 5.6-.6 8.4-3.5 9-9z" />
      </symbol>
      <symbol id="i-rocket" viewBox="0 0 24 24">
        <path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2z" />
        <path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5" />
      </symbol>
      <symbol id="i-planet" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5.5" />
        <path d="M7.2 9.6C3.6 11 1.6 12.8 2.2 14c.9 1.9 7.2.9 13.2-2.3s9.8-6.6 8.4-8.3c-.7-.9-3.2-.5-6.3.8" />
      </symbol>
      <symbol id="i-moon" viewBox="0 0 24 24">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
      </symbol>
      <symbol id="i-sun" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </symbol>
      <symbol id="i-satellite" viewBox="0 0 24 24">
        <path d="M13 7 9 3 5 7l4 4" />
        <path d="m17 11 4 4-4 4-4-4" />
        <path d="m8 12 4 4 6-6-4-4z" />
        <path d="m16 8 3-3" />
        <path d="M9 21a6 6 0 0 0-6-6" />
      </symbol>
      <symbol id="i-comet" viewBox="0 0 24 24">
        <circle cx="17" cy="7" r="3" />
        <path d="M14.6 9.4 4 20M13.2 6.6 7 12.8M17.4 10.8 11.2 17" />
      </symbol>
      <symbol id="i-ufo" viewBox="0 0 24 24">
        <path d="M7.5 11a4.5 4.5 0 0 1 9 0" />
        <ellipse cx="12" cy="13" rx="10" ry="3.5" />
        <path d="M8 19l1-2.6M16 19l-1-2.6M12 20v-3.5" />
      </symbol>
      <symbol id="i-signal" viewBox="0 0 24 24">
        <path d="M5 19a10 10 0 0 1 0-14M19 5a10 10 0 0 1 0 14M8.5 15.5a5 5 0 0 1 0-7M15.5 8.5a5 5 0 0 1 0 7" />
        <circle cx="12" cy="12" r="1.2" />
      </symbol>
      <symbol id="i-orbit" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="9" strokeDasharray="2 3" />
        <circle cx="19.5" cy="7" r="1.3" />
      </symbol>
      <symbol id="i-cake" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M3 15c2 0 2 1.5 4.5 1.5S9.5 15 12 15s2 1.5 4.5 1.5S19 15 21 15M12 11V7" />
        <path d="M12 3.5c.8.9.8 1.8 0 2.5-.8-.7-.8-1.6 0-2.5z" />
      </symbol>
    </svg>
  );
}
