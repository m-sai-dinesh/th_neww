import { Box, Typography } from "@mui/material";
import { contactLinks, faqs } from "../../data/turingCupFaqs";
import CupHeading from "./CupHeading";
import { code, gold, ink, muted, section } from "./cupStyles";

const PX = "6px";

/**
 * An 8-bit frame: solid top and bottom edges, side edges pushed out by their
 * own width so every corner is a notch, the way a pixel-art box is drawn.
 */
const pixelFrame = (color = ink) => ({
  position: "relative",
  borderTop: `${PX} solid ${color}`,
  borderBottom: `${PX} solid ${color}`,
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    mx: `-${PX}`,
    borderLeft: `${PX} solid ${color}`,
    borderRight: `${PX} solid ${color}`,
    borderColor: "inherit",
    pointerEvents: "none"
  }
});

function Question({ item }) {
  return (
    <Box
      data-reveal
      sx={{
        ...pixelFrame(),
        borderColor: ink,
        bgcolor: "#fff",
        p: { xs: 2.25, md: 3 },
        transition: "border-color 0.15s steps(2), transform 0.15s steps(2)",
        "&:hover": { borderColor: gold, transform: "translateY(-4px)" }
      }}>
      <Typography
        component="h3"
        sx={{ mb: 1, fontSize: { xs: "1.05rem", md: "1.15rem" }, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.35, color: ink }}>
        {item.question.trim()}
      </Typography>
      <Typography sx={{ lineHeight: 1.65, color: muted }}>
        {item.answer}
      </Typography>
    </Box>
  );
}

/** Every question answered at once, in pixel cards, then the ways to reach us. */
export default function CupFaqs() {
  return (
    <Box component="section" aria-labelledby="cup-faqs" sx={section}>
      <Box sx={{ maxWidth: 900, mx: "auto", px: "6px" }}>
        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <CupHeading id="cup-faqs" title="Questions," accent="answered." center />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, columnGap: 3, rowGap: 2.5 }}>
          {faqs.map(item => (
            <Question key={item.question} item={item} />
          ))}
        </Box>

        <Box data-reveal sx={{ mt: { xs: 5, md: 6 }, textAlign: "center" }}>
          <Typography sx={{ mb: 2.5, color: muted }}>
            Still stuck? Reach the team:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3 }}>
            {contactLinks.map(({ label, href, target, hoverColor, Icon }) => (
              <Box
                key={href}
                component="a"
                href={href}
                {...(target && { target, rel: "noopener noreferrer" })}
                sx={{
                  ...pixelFrame(),
                  borderColor: ink,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.25,
                  px: 2,
                  py: 1.25,
                  bgcolor: "#fff",
                  fontFamily: code,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: ink,
                  textDecoration: "none",
                  transition: "background-color 0.15s steps(2), color 0.15s steps(2), border-color 0.15s steps(2)",
                  "& svg": { fontSize: 18 },
                  "&:hover": { bgcolor: hoverColor, borderColor: hoverColor, color: "#fff" },
                  "&:focus-visible": { outline: `3px solid ${gold}`, outlineOffset: 6 }
                }}>
                <Icon />
                {label}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
