import { Box, Typography } from "@mui/material";
import sponsorImages from "../../data/sponsorImages";
import { edition } from "../../data/turingCup";
import Image from "../Image";
import CupHeading from "./CupHeading";
import { code, faint, gold, ink, mint, muted, section } from "./cupStyles";

/**
 * Sponsors as cards with everything on show (no hover-only backs, which a
 * phone never sees). The logo comes into full colour and a light follows
 * the pointer round the rim.
 */
export default function CupSponsors() {
  const onPointerMove = event => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--px", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--py", `${event.clientY - box.top}px`);
  };

  return (
    <Box component="section" aria-labelledby="cup-sponsors" sx={section}>
      <CupHeading
        id="cup-sponsors"
        kicker="import { sponsors } from './backers'"
        title="Powered"
        accent="by."
        intro={`The partners behind ${edition.name}.`}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: `repeat(${Math.min(edition.sponsors.length, 3)}, 1fr)` },
          gap: 3
        }}>
        {edition.sponsors.map(sponsor => (
          <Box
            key={sponsor.name}
            data-reveal
            component="a"
            href={sponsor.link}
            target="_blank"
            rel="noopener noreferrer"
            onPointerMove={onPointerMove}
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              p: 3,
              borderRadius: "24px",
              bgcolor: "#fff",
              border: `1px solid ${faint}`,
              color: "inherit",
              textDecoration: "none",
              overflow: "hidden",
              isolation: "isolate",
              transition: "transform 0.3s cubic-bezier(.2,.7,.2,1), box-shadow 0.3s ease",
              // the rim light
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                zIndex: -1,
                borderRadius: "inherit",
                padding: "2px",
                background: `radial-gradient(220px circle at var(--px, 50%) var(--py, 0px), ${gold}, ${mint} 40%, transparent 70%)`,
                WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                opacity: 0,
                transition: "opacity 0.3s ease"
              },
              "& .logo": {
                filter: "grayscale(1) contrast(1.1)",
                opacity: 0.75,
                transition: "filter 0.4s ease, opacity 0.4s ease, transform 0.5s cubic-bezier(.2,.7,.2,1)"
              },
              "&:hover, &:focus-visible": {
                transform: "translateY(-6px)",
                boxShadow: "0 30px 60px -30px rgba(15,26,22,0.45)",
                "&::before": { opacity: 1 },
                "& .logo": { filter: "none", opacity: 1, transform: "scale(1.06)" },
                "& .go": { transform: "translateX(4px)" }
              },
              "&:focus-visible": { outline: `3px solid ${gold}`, outlineOffset: 3 }
            }}>
            <Box className="logo" sx={{ height: 120, display: "grid", placeItems: "center", mb: 2.5 }}>
              {sponsorImages[sponsor.image] && (
                <Image
                  image={sponsorImages[sponsor.image]}
                  alt=""
                  style={{ width: 120, height: 120 }}
                  imgStyle={{ objectFit: "contain" }}
                />
              )}
            </Box>
            <Typography component="h3" sx={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.02em", color: ink }}>
              {sponsor.name}
            </Typography>
            <Typography sx={{ mt: 1, flex: 1, fontSize: "0.95rem", lineHeight: 1.6, color: muted }}>
              {sponsor.details}
            </Typography>
            <Typography component="span" sx={{ mt: 2, fontFamily: code, fontSize: "0.85rem", fontWeight: 700, color: "primary.main" }}>
              Visit{" "}
              <Box component="span" className="go" sx={{ display: "inline-block", transition: "transform 0.3s ease" }}>
                →
              </Box>
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
