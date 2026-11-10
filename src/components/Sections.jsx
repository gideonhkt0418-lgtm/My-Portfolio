// The simple content sections: About, Interests, Facts, Goals, Contact
import Section from "./Section.jsx";
import { Icon } from "./Icon.jsx";
import { CONTACT, FACTS, GOALS, INTERESTS } from "../data.js";

export function About() {
  return (
    <Section id="about" className="about" label="About" title="A bit about me">
      <p>
        I'm <strong>Gideon Hau</strong>, a <strong>14-year-old</strong> student. Most of my free time goes
        into two things: <strong>gaming</strong> and <strong>studying</strong>. They have more in common than
        people think. Both reward patience, practice and the drive to keep improving.
      </p>
      <p>
        This site is where I share what I'm interested in, what I'm working on and where I'm heading.
        Thanks for visiting.
      </p>
    </Section>
  );
}

export function Interests() {
  return (
    <Section id="interests" label="Interests" title="What I spend my time on">
      <div className="grid">
        {INTERESTS.map((it) => (
          <div className="card" key={it.title}>
            <Icon name={it.icon} className="icon" />
            <h3>{it.title}</h3>
            <p>{it.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Facts() {
  return (
    <Section id="facts" label="Quick facts" title="In brief">
      <ul className="facts">
        {FACTS.map((fact, i) => (
          <li key={i}>
            <b>{String(i + 1).padStart(2, "0")}</b>
            {fact}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Goals() {
  return (
    <Section id="goals" label="Goals" title="What I'm working towards">
      <div className="goals">
        {GOALS.map((g) => (
          <div className="goal" key={g.label}>
            <div className="goal-top">{g.label} <span>{g.pct}%</span></div>
            <div className="bar"><div style={{ "--w": g.pct + "%" }} /></div>
          </div>
        ))}
      </div>
    </Section>
  );
}

const notAdded = (e) => { e.preventDefault(); alert("This contact hasn't been added yet."); };

export function Contact() {
  const links = [
    {
      cls: "wa", label: "WhatsApp", external: true,
      href: CONTACT.whatsapp && "https://wa.me/" + CONTACT.whatsapp.replace(/\D/g, ""),
      icon: (
        <>
          <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" />
          <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z" fill="currentColor" strokeWidth="1" />
        </>
      ),
    },
    {
      cls: "mail", label: "Email",
      href: CONTACT.email && "mailto:" + CONTACT.email,
      icon: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>),
    },
    {
      cls: "ig", label: "Instagram", external: true,
      href: CONTACT.instagram && "https://instagram.com/" + CONTACT.instagram.replace(/^@/, ""),
      icon: (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </>
      ),
    },
  ];

  return (
    <Section id="contact" className="contact" label="Contact" title="Get in touch">
      <p className="sub">Feel free to reach out on any of these.</p>
      <div className="contacts">
        {links.map((l) => (
          <a
            key={l.cls}
            className={`cbtn ${l.cls}`}
            href={l.href || "#"}
            onClick={l.href ? undefined : notAdded}
            {...(l.external ? { target: "_blank", rel: "noopener" } : {})}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                 strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {l.icon}
            </svg>
            {l.label}
          </a>
        ))}
      </div>
    </Section>
  );
}
