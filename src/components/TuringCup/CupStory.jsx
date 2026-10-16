import { useLayoutEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ink, section, serif } from "./cupStyles";
import CupHeading from "./CupHeading";

gsap.registerPlugin(ScrollTrigger);

// Words wrapped in *stars* are set in gold serif italic
const STORY =
  "The annual *national* flagship contest of Turing Hut, the programming club of VNR VJIET. Students from colleges across India clear an online qualifier and earn a trip to campus for the *onsite* final, racing the clock for cash prizes and the Cup.";

const words = STORY.split(" ").map(word => {
  const star = /^\*(.+)\*([.,]?)$/.exec(word);
  return star ? { text: star[1], tail: star[2], gold: true } : { text: word };
});

/**
 * What the Cup is, in one paragraph that lights up word by word as it is
 * scrolled through. With reduced motion it is simply all lit.
 */
export default function CupStory() {
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        textRef.current.querySelectorAll(".word"),
        { opacity: 0.12, y: 6 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            end: "bottom 45%",
            scrub: 0.6
          }
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <Box component="section" aria-labelledby="cup-about" sx={section}>
      <CupHeading id="cup-about" title="What is the" accent="Cup?" />
      <Typography
        ref={textRef}
        sx={{
          maxWidth: 980,
          fontSize: { xs: "1.6rem", sm: "2.1rem", md: "2.85rem" },
          fontWeight: 600,
          lineHeight: 1.22,
          letterSpacing: "-0.03em",
          color: ink
        }}>
        {words.map((word, i) => (
          <span key={i}>
            <Box
              component="span"
              className="word"
              sx={{
                display: "inline-block",
                ...(word.gold && {
                  fontFamily: serif,
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#d48a1f"
                })
              }}>
              {word.text}
              {word.tail}
            </Box>{" "}
          </span>
        ))}
      </Typography>
    </Box>
  );
}
