import "@fontsource-variable/unbounded/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import { accent, faint, gold, ink, muted, serif } from "../../utils/designTokens";

export { accent, faint, gold, ink, muted, serif };

// The Turing Cup page speaks the site's language (Instrument Sans on white,
// green accent) and adds the Cup's own: gold, a wide display face for the
// big moments and monospace for anything a judge would print
export const display =
  '"Unbounded Variable", "Instrument Sans Variable", system-ui, sans-serif';
export const code =
  '"JetBrains Mono Variable", ui-monospace, Menlo, Consolas, monospace';
export const mint = "#5ee3a1";
export const sky = "#60a5fa";
export const rose = "#f472b6";

// Green into gold into mint: the Cup's signature sweep
export const sweep = `linear-gradient(100deg, ${accent} 0%, #1f9a74 22%, ${gold} 48%, #f59e0b 62%, ${mint} 82%, ${accent} 100%)`;

/** Text filled with the sweep, sliding forever (still with reduced motion). */
export const sweepText = {
  backgroundImage: sweep,
  backgroundSize: "250% 100%",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  "@keyframes cup-sweep": { to: { backgroundPosition: "-250% 0" } },
  "@media (prefers-reduced-motion: no-preference)": {
    animation: "cup-sweep 6s linear infinite"
  }
};

/** The page column every section sits in, as on the home page. */
export const column = {
  maxWidth: 1200,
  mx: "auto",
  px: { xs: 2.5, sm: 4, md: 6 }
};

export const section = {
  ...column,
  py: { xs: 7, md: 11 }
};

export const calm = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

// At most this far, so a button never runs into its neighbour
const MAX_PULL = 10;

/**
 * Spread onto an element to make it lean toward a mouse pointer over it.
 * Written to CSS variables (--mx, --my), so nothing re-renders.
 */
export const magnetic = {
  onPointerMove: event => {
    if (event.pointerType !== "mouse" || calm()) return;
    const el = event.currentTarget;
    const box = el.getBoundingClientRect();
    const pull = (offset, strength) =>
      Math.max(-MAX_PULL, Math.min(MAX_PULL, offset * strength));
    el.style.setProperty(
      "--mx",
      `${pull(event.clientX - (box.left + box.width / 2), 0.2)}px`
    );
    el.style.setProperty(
      "--my",
      `${pull(event.clientY - (box.top + box.height / 2), 0.35)}px`
    );
  },
  onPointerLeave: event => {
    event.currentTarget.style.setProperty("--mx", "0px");
    event.currentTarget.style.setProperty("--my", "0px");
  }
};

/**
 * Spread onto a card to track the pointer as --px / --py (0–100%) and tilt it
 * a few degrees toward the pointer through --rx / --ry.
 */
export const tilt = (max = 8) => ({
  onPointerMove: event => {
    const el = event.currentTarget;
    const box = el.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    el.style.setProperty("--px", `${x * 100}%`);
    el.style.setProperty("--py", `${y * 100}%`);
    if (event.pointerType !== "mouse" || calm()) return;
    el.style.setProperty("--rx", `${(0.5 - y) * max}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * max}deg`);
  },
  onPointerLeave: event => {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  }
});
