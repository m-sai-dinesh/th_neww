import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { accent, code, gold, ink, mint } from "./cupStyles";

const SECRET = "submit";

/**
 * Type "submit" anywhere on the page (outside a form field) and the judge
 * answers: a green verdict pops up from the bottom with a burst of colour.
 */
export default function CupEasterEgg() {
  // `count` re-keys the burst so it plays again; `visible` slides it in and out
  const [egg, setEgg] = useState({ count: 0, visible: false });

  useEffect(() => {
    let typed = "";
    let timer;
    const onKey = event => {
      if (event.target.closest?.("input, textarea, [contenteditable]")) return;
      if (event.key.length !== 1) return;
      typed = (typed + event.key.toLowerCase()).slice(-SECRET.length);
      if (typed === SECRET) {
        typed = "";
        setEgg(({ count }) => ({ count: count + 1, visible: true }));
        clearTimeout(timer);
        timer = setTimeout(() => setEgg(({ count }) => ({ count, visible: false })), 2800);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, []);

  return (
    <Box
      role="status"
      sx={{
        position: "fixed",
        zIndex: 1400,
        left: "50%",
        bottom: 28,
        transform: egg.visible ? "translate(-50%, 0) scale(1)" : "translate(-50%, 140%) scale(0.8)",
        opacity: egg.visible ? 1 : 0,
        transition: "transform 0.5s cubic-bezier(.3,1.6,.5,1), opacity 0.3s ease",
        pointerEvents: "none"
      }}>
      {egg.count > 0 && (
        <Box
          key={egg.count}
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2.5,
            py: 1.5,
            borderRadius: "16px",
            bgcolor: ink,
            color: "#fff",
            fontFamily: code,
            fontSize: "0.95rem",
            fontWeight: 700,
            whiteSpace: "nowrap",
            boxShadow: `0 0 0 2px ${mint}, 0 24px 60px -12px ${accent}`,
            "@keyframes cup-egg": {
              from: { transform: "rotate(var(--a)) translateY(0)", opacity: 1 },
              to: { transform: "rotate(var(--a)) translateY(-90px)", opacity: 0 }
            }
          }}>
          {Array.from({ length: 16 }, (_, i) => (
            <Box
              key={i}
              component="span"
              aria-hidden="true"
              style={{ "--a": `${i * 22.5}deg` }}
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: [gold, mint, "#60a5fa", "#f472b6"][i % 4],
                animation: "cup-egg 0.9s cubic-bezier(.1,.7,.3,1) both",
                "@media (prefers-reduced-motion: reduce)": { display: "none" }
              }}
            />
          ))}
          <Box component="span" sx={{ color: mint }}>
            ✓ Accepted
          </Box>
          <Box component="span" sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
            0.01s · 256 MB · see you at the Cup
          </Box>
        </Box>
      )}
    </Box>
  );
}
