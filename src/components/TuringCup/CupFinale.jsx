import { useLayoutEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MEMBERSHIP_URL } from "../../data/home";
import { edition, editionPhase } from "../../data/turingCup";
import CupButton from "./CupButton";
import { code, column, display, gold, mint, serif } from "./cupStyles";

gsap.registerPlugin(ScrollTrigger);

const COPY = {
  registration: {
    title: "Your name belongs on",
    accent: "the podium.",
    text: `Registration for ${edition.name} is open. Round 1 is free.`,
    cta: { href: edition.registrationUrl, label: "Register now" }
  },
  other: {
    title: "The next Cup is",
    accent: "loading…",
    text: "Join the members' group and hear the moment registrations open.",
    cta: { href: MEMBERSHIP_URL, label: "Get notified" }
  }
};

/** The closing band: green glass, drifting aura and the name sliding past. */
export default function CupFinale() {
  const ref = useRef(null);
  const copy = editionPhase() === "registration" ? COPY.registration : COPY.other;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        ref.current.querySelector(".ghost"),
        { xPercent: 10 },
        {
          xPercent: -30,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true }
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <Box sx={{ ...column, pt: { xs: 4, md: 6 }, pb: { xs: 8, md: 12 } }}>
      <Box
        ref={ref}
        component="section"
        aria-labelledby="cup-finale"
        data-reveal
        sx={{
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
          borderRadius: { xs: "24px", md: "36px" },
          px: { xs: 3, sm: 6, md: 10 },
          py: { xs: 8, md: 12 },
          textAlign: "center",
          color: "#fff",
          background: `radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1.2px) 0 0 / 22px 22px,
            linear-gradient(160deg, #1b7a5e, #0b3a2c)`,
          "@keyframes cup-orbit": {
            "0%": { transform: "rotate(0deg) translateX(22%) rotate(0deg)" },
            "100%": { transform: "rotate(360deg) translateX(22%) rotate(-360deg)" }
          },
          "& .blob": {
            position: "absolute",
            zIndex: -1,
            width: "55%",
            aspectRatio: "1",
            borderRadius: "50%",
            filter: "blur(80px)",
            opacity: 0.55,
            pointerEvents: "none"
          },
          "@media (prefers-reduced-motion: no-preference)": {
            "& .blob": { animation: "cup-orbit 16s linear infinite" },
            "& .blob + .blob": { animationDirection: "reverse", animationDuration: "21s" }
          }
        }}>
        <Box className="blob" sx={{ left: "-10%", top: "-30%", bgcolor: gold }} />
        <Box className="blob" sx={{ right: "-15%", bottom: "-40%", bgcolor: mint }} />
        <Typography
          className="ghost"
          aria-hidden="true"
          sx={{
            position: "absolute",
            zIndex: -1,
            left: 0,
            bottom: "-0.18em",
            fontFamily: display,
            fontSize: { xs: "30vw", md: "16rem" },
            fontWeight: 900,
            lineHeight: 1,
            whiteSpace: "nowrap",
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.18)",
            pointerEvents: "none"
          }}>
          TURING CUP TURING CUP
        </Typography>

        <Typography
          id="cup-finale"
          component="h2"
          sx={{
            mx: "auto",
            maxWidth: 820,
            fontSize: { xs: "2rem", sm: "2.8rem", md: "3.6rem" },
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.04em"
          }}>
          {copy.title}{" "}
          <Box component="span" sx={{ fontFamily: serif, fontStyle: "italic", fontWeight: 500, color: "#ffd58f" }}>
            {copy.accent}
          </Box>
        </Typography>
        <Typography sx={{ mt: 2.5, mx: "auto", maxWidth: 520, fontFamily: code, fontSize: { xs: "0.9rem", md: "1rem" }, lineHeight: 1.7, color: "rgba(255,255,255,0.75)" }}>
          {copy.text}
        </Typography>
        <Box sx={{ mt: 5 }}>
          <CupButton href={copy.cta.href}>{copy.cta.label}</CupButton>
        </Box>
      </Box>
    </Box>
  );
}
