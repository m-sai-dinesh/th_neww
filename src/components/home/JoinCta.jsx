import { Box, Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import "@fontsource-variable/jetbrains-mono/wght.css";
import { MEMBERSHIP_URL } from "../../data/home";
import { gold } from "../../utils/designTokens";
import Link from "../Link";

// The closing band speaks in code, set apart from the sans of the page
const code =
  '"JetBrains Mono Variable", ui-monospace, Menlo, Consolas, monospace';
const mint = "#5ee3a1";

const calm = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// At most this far, so a button never runs into its neighbour (gap: 16px)
const MAX_PULL = 10;

// The button leans toward a mouse pointer over it; touch and reduced motion
// leave it still. Written to CSS variables, so nothing re-renders.
const magnetic = {
  onPointerMove: event => {
    if (event.pointerType !== "mouse" || calm()) return;
    const button = event.currentTarget;
    const box = button.getBoundingClientRect();
    const pull = (offset, strength) =>
      Math.max(-MAX_PULL, Math.min(MAX_PULL, offset * strength));
    const x = pull(event.clientX - (box.left + box.width / 2), 0.2);
    const y = pull(event.clientY - (box.top + box.height / 2), 0.35);
    button.style.setProperty("--mx", `${x}px`);
    button.style.setProperty("--my", `${y}px`);
  },
  onPointerLeave: event => {
    event.currentTarget.style.setProperty("--mx", "0px");
    event.currentTarget.style.setProperty("--my", "0px");
  }
};

const buttonBase = {
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
  transform: "translate(var(--mx, 0px), var(--my, 0px))",
  transition: "transform 0.25s cubic-bezier(.2,.7,.2,1), box-shadow 0.3s ease",
  "&:hover": {
    transform: "translate(var(--mx, 0px), calc(var(--my, 0px) - 3px))"
  },
  "&:active": {
    transform: "translate(var(--mx, 0px), var(--my, 0px)) scale(0.96)"
  },
  "&:focus-visible": { outline: `3px solid ${gold}`, outlineOffset: 4 },
  "@media (prefers-reduced-motion: reduce)": {
    "&, &:hover, &:active": { transform: "none" },
    "&::before, & .cta-shine, &": { animation: "none !important" }
  }
};

/** "Join the community": a spinning gradient border, a glow and a sheen on hover. */
function JoinButton() {
  return (
    <Box
      component="a"
      href={MEMBERSHIP_URL}
      target="_blank"
      rel="noreferrer"
      {...magnetic}
      sx={{
        ...buttonBase,
        overflow: "hidden",
        pl: 0.75,
        pr: 3,
        py: 0.75,
        color: "#fff",
        animation: "cta-glow 2.6s ease-in-out infinite",
        // the border: a conic gradient spinning behind a 2px inset fill
        "&::before": {
          content: '""',
          position: "absolute",
          zIndex: -2,
          inset: "-150%",
          background: `conic-gradient(from 0deg, ${gold}, ${mint}, #ffffff, ${gold}, ${mint}, ${gold})`,
          animation: "cta-spin 3.2s linear infinite"
        },
        "&::after": {
          content: '""',
          position: "absolute",
          zIndex: -1,
          inset: "2px",
          borderRadius: "inherit",
          background: "linear-gradient(135deg, #0b241c, #0f1a16 60%)"
        },
        "& .cta-shine": {
          position: "absolute",
          zIndex: 0,
          top: 0,
          bottom: 0,
          left: "-60%",
          width: "40%",
          background:
            "linear-gradient(100deg, transparent, rgba(255,255,255,0.28), transparent)",
          transform: "skewX(-20deg)",
          pointerEvents: "none"
        },
        "& .cta-run": {
          transition: "transform 0.35s cubic-bezier(.2,.7,.2,1)"
        },
        "&:hover": {
          ...buttonBase["&:hover"],
          boxShadow: `0 0 0 1px rgba(94,227,161,0.4), 0 18px 48px -8px rgba(94,227,161,0.65)`,
          "& .cta-shine": { animation: "cta-shine 0.9s ease" },
          "& .cta-run": { transform: "rotate(120deg) scale(1.1)" }
        }
      }}>
      <Box className="cta-shine" aria-hidden="true" />
      <Box
        className="cta-run"
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
        Join the community
      </Box>
    </Box>
  );
}

/** "Meet the team": glass that floods white from the left on hover. */
function TeamButton() {
  return (
    <Box
      component={Link}
      to="/team"
      {...magnetic}
      sx={{
        ...buttonBase,
        px: 3,
        py: 1.6,
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.35)",
        backdropFilter: "blur(8px)",
        background:
          "linear-gradient(90deg, #fff 50%, rgba(255,255,255,0.08) 50%) 100% 0 / 202% 100% no-repeat",
        transition: `${buttonBase.transition}, background-position 0.45s cubic-bezier(.2,.7,.2,1), color 0.3s ease, border-color 0.3s ease`,
        "& svg": {
          fontSize: 20,
          transition: "transform 0.35s cubic-bezier(.2,.7,.2,1)"
        },
        "&:hover": {
          ...buttonBase["&:hover"],
          backgroundPosition: "0 0",
          color: "#0b3a2c",
          borderColor: "#fff",
          boxShadow: "0 18px 40px -12px rgba(0,0,0,0.45)",
          "& svg": { transform: "translateX(5px) rotate(-45deg)" }
        }
      }}>
      Meet the team
      <ArrowForwardRoundedIcon />
    </Box>
  );
}

/** Closing call to action, written like a terminal session. */
export default function JoinCta() {
  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2.5, sm: 4, md: 6 },
        pt: { xs: 4, md: 6 },
        pb: { xs: 8, md: 12 }
      }}>
      <Box
        component="section"
        aria-labelledby="home-join"
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: { xs: "24px", md: "32px" },
          px: { xs: 3, sm: 6, md: 10 },
          py: { xs: 7, md: 10 },
          textAlign: "center",
          color: "#fff",
          fontFamily: code,
          background: `radial-gradient(70% 90% at 50% 0%, rgba(127,216,180,0.25), rgba(127,216,180,0) 60%),
            radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1.2px) 0 0 / 22px 22px,
            linear-gradient(160deg, #1b7a5e, #0b3a2c)`,
          "@keyframes cta-spin": { to: { transform: "rotate(1turn)" } },
          "@keyframes cta-shine": { to: { left: "130%" } },
          "@keyframes cta-glow": {
            "0%, 100%": { boxShadow: "0 0 24px -6px rgba(242,170,76,0.45)" },
            "50%": { boxShadow: "0 0 36px -4px rgba(94,227,161,0.6)" }
          },
          "@keyframes cta-caret": { "50%": { opacity: 0 } }
        }}>
        <Typography
          id="home-join"
          component="h2"
          sx={{
            mx: "auto",
            maxWidth: 820,
            fontFamily: code,
            fontSize: { xs: "1.7rem", sm: "2.3rem", md: "3rem" },
            fontWeight: 800,
            lineHeight: 1.18,
            letterSpacing: "-0.04em"
          }}>
          Your first{" "}
          <Box
            component="span"
            sx={{
              // frosted glass: a light tint over a blurred backdrop, a bright
              // top edge, a reflection on the upper half and a soft shadow
              position: "relative",
              display: "inline-block",
              px: "0.35em",
              py: "0.02em",
              borderRadius: "0.3em",
              overflow: "hidden",
              isolation: "isolate",
              color: "#a6ffd4",
              textShadow:
                "0 1px 2px rgba(0,0,0,0.35), 0 0 18px rgba(94,227,161,0.6)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06) 55%, rgba(94,227,161,0.12))",
              backdropFilter: "blur(14px) saturate(180%)",
              WebkitBackdropFilter: "blur(14px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.28)",
              borderTopColor: "rgba(255,255,255,0.55)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(255,255,255,0.08), 0 10px 30px -10px rgba(0,0,0,0.45), 0 0 0 1px rgba(94,227,161,0.15)",
              "&::before": {
                content: '""',
                position: "absolute",
                zIndex: -1,
                inset: "0 0 50% 0",
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.28), rgba(255,255,255,0))",
                pointerEvents: "none"
              },
              "&::after": {
                content: '""',
                position: "absolute",
                zIndex: -1,
                top: "-50%",
                bottom: "-50%",
                left: "18%",
                width: "18%",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.16), rgba(255,255,255,0))",
                transform: "rotate(20deg)",
                pointerEvents: "none"
              }
            }}>
            <Box component="span" aria-hidden="true">
              ✓{" "}
            </Box>
            accepted
          </Box>{" "}
          solution starts here
          <Box
            component="span"
            aria-hidden="true"
            sx={{
              display: "inline-block",
              width: "0.5em",
              height: "0.95em",
              ml: "0.12em",
              verticalAlign: "-0.08em",
              bgcolor: gold,
              "@media (prefers-reduced-motion: no-preference)": {
                animation: "cta-caret 1.1s steps(1) infinite"
              }
            }}
          />
        </Typography>
        <Typography
          sx={{
            mt: 3,
            mx: "auto",
            maxWidth: 560,
            fontFamily: code,
            fontSize: { xs: "0.9rem", md: "1rem" },
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.72)"
          }}>
          Join the members’ group to hear about contests, workshops and sessions
          as soon as they are announced.
        </Typography>
        <Box
          sx={{
            mt: 5,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 2
          }}>
          <JoinButton />
          <TeamButton />
        </Box>
      </Box>
    </Box>
  );
}
