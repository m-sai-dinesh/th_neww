import { Box } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { code, gold, ink, magnetic, mint } from "./cupStyles";

const base = {
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  gap: 1.25,
  borderRadius: "999px",
  fontFamily: code,
  fontSize: { xs: "0.95rem", sm: "1rem" },
  fontWeight: 700,
  letterSpacing: "-0.01em",
  textDecoration: "none",
  isolation: "isolate",
  cursor: "pointer",
  transform: "translate(var(--mx, 0px), var(--my, 0px))",
  transition: "transform 0.25s cubic-bezier(.2,.7,.2,1), box-shadow 0.3s ease, background-position 0.45s cubic-bezier(.2,.7,.2,1), color 0.3s ease",
  "&:hover": {
    transform: "translate(var(--mx, 0px), calc(var(--my, 0px) - 3px))"
  },
  "&:active": {
    transform: "translate(var(--mx, 0px), var(--my, 0px)) scale(0.96)"
  },
  "&:focus-visible": { outline: `3px solid ${gold}`, outlineOffset: 4 },
  "@keyframes cupbtn-spin": { to: { transform: "rotate(1turn)" } },
  "@keyframes cupbtn-shine": { to: { left: "130%" } },
  "@keyframes cupbtn-glow": {
    "0%, 100%": { boxShadow: "0 10px 30px -10px rgba(242,170,76,0.7)" },
    "50%": { boxShadow: "0 14px 40px -8px rgba(94,227,161,0.75)" }
  },
  "@media (prefers-reduced-motion: reduce)": {
    "&, &:hover, &:active": { transform: "none", animation: "none" },
    "&::before, & .shine": { animation: "none !important" }
  }
};

const primary = {
  ...base,
  overflow: "hidden",
  pl: 0.75,
  pr: 3,
  py: 0.75,
  color: "#fff",
  animation: "cupbtn-glow 2.6s ease-in-out infinite",
  // The border: a gradient spinning behind a 2px inset fill
  "&::before": {
    content: '""',
    position: "absolute",
    zIndex: -2,
    inset: "-150%",
    background: `conic-gradient(from 0deg, ${gold}, ${mint}, #ffffff, ${gold}, ${mint}, ${gold})`,
    animation: "cupbtn-spin 3.2s linear infinite"
  },
  "&::after": {
    content: '""',
    position: "absolute",
    zIndex: -1,
    inset: "2px",
    borderRadius: "inherit",
    background: "linear-gradient(135deg, #16654F, #0b241c 70%)"
  },
  "& .shine": {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "-60%",
    width: "40%",
    background:
      "linear-gradient(100deg, transparent, rgba(255,255,255,0.35), transparent)",
    transform: "skewX(-20deg)",
    pointerEvents: "none"
  },
  "& .run": { transition: "transform 0.35s cubic-bezier(.2,.7,.2,1)" },
  "&:hover": {
    ...base["&:hover"],
    boxShadow: "0 0 0 1px rgba(94,227,161,0.4), 0 18px 48px -8px rgba(94,227,161,0.65)",
    "& .shine": { animation: "cupbtn-shine 0.9s ease" },
    "& .run": { transform: "rotate(120deg) scale(1.1)" }
  }
};

// Glass that floods ink from the left on hover
const ghost = {
  ...base,
  px: 3,
  py: 1.6,
  color: ink,
  border: "1px solid rgba(15,26,22,0.18)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  background: `linear-gradient(90deg, ${ink} 50%, rgba(255,255,255,0.65) 50%) 100% 0 / 202% 100% no-repeat`,
  "& svg": { fontSize: 20, transition: "transform 0.35s cubic-bezier(.2,.7,.2,1)" },
  "&:hover": {
    ...base["&:hover"],
    backgroundPosition: "0 0",
    color: "#fff",
    boxShadow: "0 18px 40px -14px rgba(15,26,22,0.5)",
    "& svg": { transform: "translateX(5px) rotate(-45deg)" }
  }
};

/**
 * The page's call-to-action button: a spinning gold-and-mint border with a
 * glow and a sheen, or a glass "ghost" that floods ink. Both lean toward the
 * pointer. Links that leave the page open in a new tab.
 */
export default function CupButton({ href, variant = "primary", children, sx }) {
  const external = /^https?:/.test(href);
  return (
    <Box
      component="a"
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      {...magnetic}
      sx={{ ...(variant === "ghost" ? ghost : primary), ...sx }}>
      {variant === "ghost" ? (
        <>
          {children}
          <ArrowForwardRoundedIcon />
        </>
      ) : (
        <>
          <Box className="shine" aria-hidden="true" />
          <Box
            className="run"
            component="span"
            aria-hidden="true"
            sx={{
              position: "relative",
              display: "grid",
              placeItems: "center",
              width: 38,
              height: 38,
              borderRadius: "50%",
              bgcolor: mint,
              color: "#06281d"
            }}>
            <PlayArrowRoundedIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box component="span" sx={{ position: "relative" }}>
            {children}
          </Box>
        </>
      )}
    </Box>
  );
}
