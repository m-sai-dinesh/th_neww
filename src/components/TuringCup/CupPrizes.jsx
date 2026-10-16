import { Box, Typography } from "@mui/material";
import { edition } from "../../data/turingCup";
import NumberTicker from "../NumberTicker";
import CupHeading from "./CupHeading";
import { display, muted, section, sweepText } from "./cupStyles";

/** The prize pool as one huge, shimmering number. */
export default function CupPrizes() {
  return (
    <Box component="section" aria-labelledby="cup-prizes" sx={section}>
      <CupHeading id="cup-prizes" title="What's" accent="at stake." />
      <Typography
        data-reveal
        sx={{
          fontFamily: display,
          fontSize: { xs: "clamp(2.5rem, 12vw, 4.5rem)", sm: "11vw", md: "min(9.5vw, 8rem)" },
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: "-0.04em",
          filter: "drop-shadow(0 24px 40px rgba(242,170,76,0.35))",
          maxWidth: "100%"
        }}>
        {/* background-clip: text only paints inside the box, and the tight
            tracking pulls the box in past the last digit's ink: pad it back */}
        <Box component="span" sx={{ ...sweepText, display: "inline-block", pr: "0.18em" }}>
          ₹<NumberTicker value={edition.prizePool} locale="en-IN" duration={2400} />
        </Box>
      </Typography>
      <Typography sx={{ mt: 1, fontSize: "1.05rem", color: muted }}>
        Prize pool for {edition.name}.
      </Typography>
    </Box>
  );
}
