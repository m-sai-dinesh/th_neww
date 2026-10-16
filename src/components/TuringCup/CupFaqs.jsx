import { useId, useState } from "react";
import { Box, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { contactLinks, faqs } from "../../data/turingCupFaqs";
import CupHeading from "./CupHeading";
import { code, faint, gold, ink, magnetic, muted, section } from "./cupStyles";

function Question({ item, index, open, onToggle }) {
  const id = useId();
  return (
    <Box
      data-reveal
      sx={{
        borderTop: `1px solid ${faint}`,
        "&:last-of-type": { borderBottom: `1px solid ${faint}` }
      }}>
      <Box
        component="button"
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: { xs: "40px 1fr 32px", md: "64px 1fr 40px" },
          alignItems: "center",
          gap: 1,
          py: { xs: 2.25, md: 2.75 },
          px: 0,
          border: 0,
          bgcolor: "transparent",
          textAlign: "left",
          font: "inherit",
          color: ink,
          cursor: "pointer",
          "& .num": { transition: "color 0.3s ease" },
          "& .q": { transition: "transform 0.35s cubic-bezier(.2,.7,.2,1)" },
          "&:hover .q": { transform: "translateX(8px)" },
          "&:hover .num": { color: gold },
          "&:focus-visible": { outline: `3px solid ${gold}`, outlineOffset: 4, borderRadius: "8px" }
        }}>
        <Box className="num" component="span" sx={{ fontFamily: code, fontSize: "0.85rem", fontWeight: 700, color: open ? gold : muted }}>
          {String(index + 1).padStart(2, "0")}
        </Box>
        <Box className="q" component="span" sx={{ fontSize: { xs: "1.05rem", md: "1.3rem" }, fontWeight: 600, letterSpacing: "-0.02em" }}>
          {item.question}
        </Box>
        <Box
          component="span"
          aria-hidden="true"
          sx={{
            display: "grid",
            placeItems: "center",
            width: { xs: 32, md: 40 },
            height: { xs: 32, md: 40 },
            borderRadius: "50%",
            color: open ? "#fff" : ink,
            bgcolor: open ? ink : "transparent",
            border: `1px solid ${open ? ink : faint}`,
            transform: open ? "rotate(135deg)" : "none",
            transition: "transform 0.4s cubic-bezier(.3,1.5,.5,1), background-color 0.3s ease, color 0.3s ease"
          }}>
          <AddRoundedIcon fontSize="small" />
        </Box>
      </Box>
      {/* grid rows from 0fr to 1fr: a smooth open to the answer's own height */}
      <Box
        id={id}
        role="region"
        sx={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.45s cubic-bezier(.2,.7,.2,1)"
        }}>
        <Box sx={{ overflow: "hidden" }}>
          <Typography
            sx={{
              pl: { xs: "48px", md: "72px" },
              pr: { xs: 1, md: 7 },
              pb: 3,
              fontSize: "1.02rem",
              lineHeight: 1.7,
              color: muted,
              opacity: open ? 1 : 0,
              transform: open ? "none" : "translateY(-8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease"
            }}>
            {item.answer}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

/** Questions that open smoothly in place, then the ways to reach us. */
export default function CupFaqs() {
  const [open, setOpen] = useState(0);

  return (
    <Box component="section" aria-labelledby="cup-faqs" sx={section}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "340px 1fr" }, gap: { xs: 2, md: 8 } }}>
        <Box>
          <CupHeading id="cup-faqs" kicker="man turing-cup" title="Questions," accent="answered." />
          <Box data-reveal>
            <Typography sx={{ mb: 2, color: muted }}>Still stuck? Reach the team:</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25 }}>
              {contactLinks.map(({ label, href, target, hoverColor, Icon }) => (
                <Box
                  key={href}
                  component="a"
                  href={href}
                  {...(target && { target, rel: "noopener noreferrer" })}
                  {...magnetic}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1.1,
                    borderRadius: "999px",
                    border: `1px solid ${faint}`,
                    bgcolor: "#fff",
                    fontFamily: code,
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: ink,
                    textDecoration: "none",
                    transform: "translate(var(--mx, 0px), var(--my, 0px))",
                    transition: "transform 0.25s cubic-bezier(.2,.7,.2,1), background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease",
                    "& svg": { fontSize: 18 },
                    "&:hover": { bgcolor: hoverColor, borderColor: hoverColor, color: "#fff" },
                    "&:focus-visible": { outline: `3px solid ${gold}`, outlineOffset: 3 }
                  }}>
                  <Icon />
                  {label}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box>
          {faqs.map((item, index) => (
            <Question
              key={item.question}
              item={item}
              index={index}
              open={open === index}
              onToggle={() => setOpen(open === index ? -1 : index)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
