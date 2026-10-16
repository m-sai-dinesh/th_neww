import { Box } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { latestTuringCup } from "../../data/home";
import contestdetails from "../../data/pastContests";
import { edition } from "../../data/turingCup";
import { accent, code, display, gold, ink } from "./cupStyles";

const number = new Intl.NumberFormat("en-IN");

const facts = [
  `${number.format(latestTuringCup.participants)} participants`,
  `${number.format(latestTuringCup.colleges)} colleges`,
  `${contestdetails.length} editions`,
  edition.prizePool && `₹${number.format(edition.prizePool)} prize pool`,
  "1 onsite final"
].filter(Boolean);

const shout = ["One team", "One dream", "Turing Cup", edition.short];

/**
 * One tape: its content twice in a row, sliding by exactly one copy so the
 * loop never shows a seam. Hovering stops it; with reduced motion it stands.
 */
function Tape({ items, reverse, tilt, sx, itemSx, separator = "" }) {
  const run = (
    <Box
      component="span"
      sx={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
      {[...items, ...items].map((item, i) => (
        <Box
          key={i}
          component="span"
          sx={{ display: "inline-flex", alignItems: "center", ...itemSx(i) }}>
          {item}
          <Box component="span" sx={{ mx: { xs: 2, md: 3.5 }, opacity: 0.85 }}>
            {separator}
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "relative",
        width: "110%",
        ml: "-5%",
        py: { xs: 1.5, md: 2 },
        overflow: "hidden",
        transform: `rotate(${tilt}deg)`,
        boxShadow: "0 20px 40px -20px rgba(15,26,22,0.45)",
        "&:hover .track": { animationPlayState: "paused" },
        ...sx
      }}>
      <Box
        className="track"
        sx={{
          display: "flex",
          width: "max-content",
          whiteSpace: "nowrap",
          "@keyframes cup-tape": { to: { transform: "translateX(-50%)" } },
          "@media (prefers-reduced-motion: no-preference)": {
            animation: `cup-tape 28s linear infinite${reverse ? " reverse" : ""}`
          }
        }}>
        {run}
        {run}
      </Box>
    </Box>
  );
}

/**
 * Two tapes crossing over each other: what the Cup is, and its numbers.
 * `onGreen` sets the top tape in white, for use on the green closing band.
 */
export default function CupTapes({ onGreen, sx }) {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        py: { xs: 8, md: 13 },
        display: "grid",
        "& > *": { gridArea: "1 / 1" },
        ...sx
      }}>
      <Box sx={visuallyHidden}>{facts.join(", ")}</Box>
      <Tape
        items={shout}
        tilt={-6}
        sx={{
          zIndex: 1,
          color: onGreen ? accent : "#fff",
          background: onGreen
            ? "#fff"
            : `linear-gradient(90deg, ${accent}, #0b3a2c 50%, ${accent})`,
          ...(onGreen && { boxShadow: "0 20px 40px -16px rgba(0,0,0,0.5)" })
        }}
        itemSx={i => ({
          fontFamily: display,
          fontSize: { xs: "1.6rem", md: "2.6rem" },
          fontWeight: 800,
          letterSpacing: "-0.03em",
          textTransform: "uppercase",
          // every other word is only an outline
          ...(i % 2 && {
            color: "transparent",
            WebkitTextStroke: `1.5px ${onGreen ? accent : "#fff"}`
          })
        })}
      />
      <Tape
        items={facts}
        tilt={5}
        reverse
        sx={{ color: ink, bgcolor: gold, alignSelf: "center" }}
        itemSx={() => ({
          fontFamily: code,
          fontSize: { xs: "1rem", md: "1.35rem" },
          fontWeight: 700,
          textTransform: "uppercase"
        })}
      />
    </Box>
  );
}
