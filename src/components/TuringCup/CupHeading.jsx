import { Box, Typography } from "@mui/material";
import { code, gold, ink, muted, serif } from "./cupStyles";

/**
 * A section opener in the home page's pattern: a kicker, then the title, then
 * an optional intro. The kicker reads like a line of code with a blinking
 * caret, and `accent` sets one word of the title in gold serif italic, or in
 * gold `font` when the title is given a face of its own.
 */
export default function CupHeading({ id, kicker, title, accent, intro, center, font }) {
  return (
    <Box
      data-reveal
      sx={{
        maxWidth: center ? 760 : 680,
        mx: center ? "auto" : 0,
        textAlign: center ? "center" : "left",
        mb: { xs: 2, md: 3 }
      }}>
      {kicker ? (
        <Typography
          component="p"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            fontFamily: code,
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: "primary.main",
            "@keyframes cup-caret": { "50%": { opacity: 0 } }
          }}>
          <Box component="span" aria-hidden="true" sx={{ color: gold }}>
            {">"}
          </Box>
          {kicker}
          <Box
            component="span"
            aria-hidden="true"
            sx={{
              width: "0.55em",
              height: "1.05em",
              bgcolor: gold,
              "@media (prefers-reduced-motion: no-preference)": {
                animation: "cup-caret 1.1s steps(1) infinite"
              }
            }}
          />
        </Typography>
      ) : null}
      <Typography
        id={id}
        component="h2"
        sx={{
          mt: kicker ? 1.25 : 0,
          fontSize: { xs: "2.1rem", md: "3rem" },
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: "-0.035em",
          color: ink,
          ...(font && { fontFamily: font, fontWeight: 800, fontVariationSettings: '"opsz" 96', letterSpacing: "-0.045em" })
        }}>
        {title}
        {accent && (
          <>
            {" "}
            <Box
              component="span"
              sx={{
                fontFamily: font ?? serif,
                fontStyle: font ? "normal" : "italic",
                fontWeight: font ? 800 : 500,
                letterSpacing: font ? "-0.045em" : "-0.02em",
                color: "#d48a1f"
              }}>
              {accent}
            </Box>
          </>
        )}
      </Typography>
      {intro && (
        <Typography
          sx={{
            mt: 1.75,
            fontSize: { xs: "1rem", md: "1.1rem" },
            lineHeight: 1.65,
            color: muted
          }}>
          {intro}
        </Typography>
      )}
    </Box>
  );
}
