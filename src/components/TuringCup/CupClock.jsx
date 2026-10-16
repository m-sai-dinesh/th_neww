import { Box, Typography } from "@mui/material";
import useCountdown from "../../hooks/useCountdown";
import { edition } from "../../data/turingCup";
import { code, gold, ink, mint, muted, section, sweepText } from "./cupStyles";

/** One digit on a split-flap board: a new value flips down into place. */
function Flap({ digit }) {
  return (
    <Box
      sx={{
        position: "relative",
        width: { xs: 38, sm: 54, md: 72 },
        height: { xs: 56, sm: 78, md: 104 },
        borderRadius: { xs: "10px", md: "14px" },
        bgcolor: ink,
        color: "#fff",
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        perspective: "300px",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 18px 30px -16px rgba(15,26,22,0.7)",
        // the hinge across the middle
        "&::after": {
          content: '""',
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: "1px",
          bgcolor: "rgba(0,0,0,0.6)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.08)"
        }
      }}>
      <Box
        key={digit}
        component="span"
        sx={{
          fontFamily: code,
          fontSize: { xs: "2rem", sm: "2.9rem", md: "4rem" },
          fontWeight: 700,
          lineHeight: 1,
          transformOrigin: "50% 0",
          "@keyframes cup-flap": {
            from: { transform: "rotateX(-90deg)", opacity: 0.2 },
            to: { transform: "rotateX(0)", opacity: 1 }
          },
          "@media (prefers-reduced-motion: no-preference)": {
            animation: "cup-flap 0.45s cubic-bezier(.3,1.4,.5,1)"
          }
        }}>
        {digit}
      </Box>
    </Box>
  );
}

function Unit({ value, label }) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Box sx={{ display: "flex", gap: { xs: 0.5, md: 0.75 } }}>
        {[...value].map((digit, i) => (
          <Flap key={i} digit={digit} />
        ))}
      </Box>
      <Typography
        sx={{
          mt: 1.25,
          fontFamily: code,
          fontSize: { xs: "0.68rem", md: "0.8rem" },
          fontWeight: 600,
          letterSpacing: "0.12em",
          color: muted
        }}>
        {label}
      </Typography>
    </Box>
  );
}

const Colon = () => (
  <Typography
    aria-hidden="true"
    sx={{
      fontFamily: code,
      fontSize: { xs: "1.8rem", md: "3.4rem" },
      fontWeight: 700,
      color: gold,
      pb: { xs: 3.5, md: 4.5 },
      "@keyframes cup-tick": { "50%": { opacity: 0.2 } },
      "@media (prefers-reduced-motion: no-preference)": {
        animation: "cup-tick 1s steps(1) infinite"
      }
    }}>
    :
  </Typography>
);

/** A split-flap board counting down to the next round. */
export default function CupClock({ round }) {
  const { days, hours, minutes, seconds } = useCountdown(Date.parse(round.start));
  const units = [
    [days, "DAYS"],
    [hours, "HRS"],
    [minutes, "MIN"],
    [seconds, "SEC"]
  ];

  return (
    <Box component="section" id="clock" aria-labelledby="cup-clock" sx={{ ...section, scrollMarginTop: 100, textAlign: "center" }}>
      <Typography
        component="p"
        sx={{ fontFamily: code, fontSize: "0.85rem", fontWeight: 600, color: "primary.main" }}>
        <Box component="span" sx={{ color: mint }}>●</Box> contest clock
      </Typography>
      <Typography
        id="cup-clock"
        component="h2"
        sx={{
          mt: 1,
          mb: { xs: 4, md: 5 },
          fontSize: { xs: "1.9rem", md: "2.8rem" },
          fontWeight: 700,
          letterSpacing: "-0.035em",
          color: ink
        }}>
        <Box component="span" sx={sweepText}>
          {round.title.split(" · ")[0]}
        </Box>{" "}
        of {edition.short} starts in
      </Typography>
      <Box
        role="timer"
        aria-label={`${days} days, ${hours} hours, ${minutes} minutes`}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: { xs: 0.75, sm: 1.5, md: 2 }
        }}>
        {units.map(([value, label], i) => (
          <Box key={label} sx={{ display: "contents" }}>
            {i > 0 && <Colon />}
            <Unit value={value} label={label} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
