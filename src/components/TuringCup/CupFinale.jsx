import { useLayoutEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CupButton from "./CupButton";
import CupTapes from "./CupTapes";
import { gold, mint, quirky, stadium } from "./cupStyles";

gsap.registerPlugin(ScrollTrigger);

/**
 * The closing band: the name, the motto, the crossing tapes and a way to the
 * champions, on green glass with a drifting aura and the name sliding past.
 */
export default function CupFinale() {
  const ref = useRef(null);

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
    // Wider than the page column, as an opening band
    <Box sx={{ maxWidth: 1440, mx: "auto", px: { xs: 1, sm: 2, md: 3 }, pt: { xs: 1, md: 2 }, pb: { xs: 2, md: 3 } }}>
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
          py: { xs: 7, md: 9 },
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
            fontFamily: stadium,
            fontSize: { xs: "40vw", md: "22rem" },
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
          component="h1"
          sx={{
            fontFamily: stadium,
            fontSize: { xs: "4.4rem", sm: "6.5rem", md: "9rem" },
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: "0.01em",
            backgroundImage: `linear-gradient(100deg, #fff 0%, #b8f5d6 30%, ${mint} 50%, #b8f5d6 70%, #fff 100%)`,
            backgroundSize: "250% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.3))",
            "@keyframes cup-finale-sweep": { to: { backgroundPosition: "-250% 0" } },
            "@media (prefers-reduced-motion: no-preference)": {
              animation: "cup-finale-sweep 6s linear infinite"
            }
          }}>
          TURING CUP
        </Typography>
        <Typography
          sx={{
            mt: { xs: 1.5, md: 2 },
            fontFamily: quirky,
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.4rem" },
            fontWeight: 600,
            fontVariationSettings: '"opsz" 48',
            lineHeight: 1.1,
            letterSpacing: "-0.035em"
          }}>
          One team, one{" "}
          <Box component="span" sx={{ fontWeight: 800, color: "#ffd58f" }}>
            dream.
          </Box>
        </Typography>

        {/* the tapes run edge to edge, past the band's padding; their tilted
            ends reach past this row, so only the band itself clips them */}
        <CupTapes onGreen sx={{ mx: { xs: -3, sm: -6, md: -10 }, py: { xs: 4, md: 6 }, overflow: "visible" }} />

        <CupButton href="#champions">Meet the champions</CupButton>
      </Box>
    </Box>
  );
}
