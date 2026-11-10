import { useInView } from "../hooks.js";

// A page section that fades in when it scrolls into view
export default function Section({ id, className = "", label, title, children }) {
  const [ref, shown] = useInView(0.15);
  return (
    <section id={id} ref={ref} className={`${className} reveal ${shown ? "show" : ""}`}>
      {label && <p className="label">{label}</p>}
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}
