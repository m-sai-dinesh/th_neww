import { useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import contestdetails from "../../data/pastContests";
import winnersImages from "../../data/winnersImages";
import Image from "../Image";
import CupHeading from "./CupHeading";
import { accent, code, display, faint, gold, ink, mint, muted, section, serif, sweep, tilt } from "./cupStyles";

const MEDALS = {
  first: { rank: 1, metal: gold, deep: "#c27a12", height: { xs: 150, md: 210 } },
  second: { rank: 2, metal: "#b9c3cc", deep: "#7d8995", height: { xs: 115, md: 160 } },
  third: { rank: 3, metal: "#d59262", deep: "#9c5a2c", height: { xs: 90, md: 125 } }
};
// Podium order, left to right
const PODIUM = ["second", "first", "third"];

const members = winner => [winner.mem1, winner.mem2, winner.mem3].filter(Boolean);

// Confetti pieces flying out of the winner's step, spread evenly round a circle
const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  angle: (i / 28) * 360 + (i % 3) * 7,
  distance: 110 + (i % 5) * 28,
  color: [gold, accent, mint, "#60a5fa", "#f472b6"][i % 5],
  delay: (i % 4) * 0.04
}));

function Confetti() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "absolute",
        left: "50%",
        top: 30,
        width: 0,
        height: 0,
        pointerEvents: "none",
        "@media (prefers-reduced-motion: reduce)": { display: "none" },
        "@keyframes cup-confetti": {
          "0%": { transform: "rotate(var(--a)) translateY(0) rotate(0)", opacity: 1 },
          "100%": {
            transform: "rotate(var(--a)) translateY(calc(var(--d) * -1)) rotate(540deg)",
            opacity: 0
          }
        }
      }}>
      {CONFETTI.map(({ angle, distance, color, delay }, i) => (
        <Box
          key={i}
          component="span"
          style={{ "--a": `${angle}deg`, "--d": `${distance}px` }}
          sx={{
            position: "absolute",
            width: i % 2 ? 8 : 6,
            height: i % 2 ? 4 : 10,
            borderRadius: "2px",
            bgcolor: color,
            opacity: 0,
            animation: `cup-confetti 1.3s cubic-bezier(.1,.7,.3,1) ${delay}s both`
          }}
        />
      ))}
    </Box>
  );
}

function Step({ place, winner, index }) {
  const medal = MEDALS[place];
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        textAlign: "center",
        "@keyframes cup-step": {
          from: { transform: "translateY(40px)", opacity: 0 },
          to: { transform: "none", opacity: 1 }
        },
        "@media (prefers-reduced-motion: no-preference)": {
          animation: `cup-step 0.8s cubic-bezier(.2,.9,.2,1.2) ${0.12 * index}s both`
        }
      }}>
      <Typography
        component="p"
        sx={{
          fontSize: { xs: "0.85rem", md: "1.05rem" },
          fontWeight: 700,
          lineHeight: 1.25,
          letterSpacing: "-0.01em",
          color: ink,
          overflowWrap: "anywhere"
        }}>
        {members(winner).join(" & ")}
      </Typography>
      <Typography
        component="p"
        sx={{
          mt: 0.5,
          mb: 1.5,
          px: 0.5,
          fontFamily: serif,
          fontStyle: "italic",
          fontSize: { xs: "0.75rem", md: "0.9rem" },
          lineHeight: 1.3,
          color: muted
        }}>
        {winner.college}
      </Typography>
      <Box
        sx={{
          position: "relative",
          height: medal.height,
          borderRadius: "14px 14px 0 0",
          display: "grid",
          placeItems: "start center",
          pt: 1.5,
          overflow: "hidden",
          background: `linear-gradient(160deg, ${medal.metal}, ${medal.deep})`,
          boxShadow: `inset 0 2px 0 rgba(255,255,255,0.5), 0 24px 40px -24px ${medal.deep}`
        }}>
        <Typography
          component="span"
          sx={{
            fontFamily: display,
            fontSize: { xs: "2.4rem", md: "3.6rem" },
            fontWeight: 900,
            lineHeight: 1,
            color: "rgba(255,255,255,0.92)",
            textShadow: `0 4px 16px ${medal.deep}`
          }}>
          {medal.rank}
        </Typography>
      </Box>
    </Box>
  );
}

function Edition({ item }) {
  const image = item.image !== "NA" ? winnersImages[item.image.split(".")[0]] : null;
  const rest = Object.entries(item.winners).filter(([place]) => !MEDALS[place]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: image ? "1.1fr 1fr" : "1fr" },
        gap: { xs: 5, md: 7 },
        alignItems: "start"
      }}>
      <Box>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            gap: { xs: 1, md: 1.5 },
            maxWidth: 620,
            mx: image ? 0 : "auto",
            borderBottom: `2px solid ${ink}`
          }}>
          {PODIUM.filter(place => item.winners[place]).map((place, i) => (
            <Step key={place} place={place} winner={item.winners[place]} index={i} />
          ))}
          <Box sx={{ position: "absolute", left: 0, right: 0, top: 0 }}>
            <Confetti />
          </Box>
        </Box>

        {rest.length > 0 && (
          <Box component="ol" start={4} sx={{ listStyle: "none", m: 0, mt: 3, p: 0, maxWidth: 620 }}>
            {rest.map(([place, winner], i) => (
              <Box
                component="li"
                key={place}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr",
                  gap: 1.5,
                  py: 1.25,
                  borderTop: i ? `1px solid ${faint}` : 0
                }}>
                <Box sx={{ fontFamily: code, fontWeight: 700, color: muted }}>#{4 + i}</Box>
                <Box>
                  <Box sx={{ fontWeight: 600, color: ink }}>{members(winner).join(" & ")}</Box>
                  <Box sx={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.9rem", color: muted }}>
                    {winner.college}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box>
        {image && (
          <Box sx={{ perspective: "1200px" }}>
            <Box
              {...tilt(6)}
              sx={{
                position: "relative",
                borderRadius: "22px",
                overflow: "hidden",
                transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
                transition: "transform 0.25s ease-out",
                boxShadow: "0 40px 80px -40px rgba(15,26,22,0.6)",
                // a gradient frame that keeps flowing round the photo
                p: "3px",
                backgroundImage: sweep,
                backgroundSize: "300% 300%",
                "@keyframes cup-frame": { to: { backgroundPosition: "300% 0" } },
                "@media (prefers-reduced-motion: no-preference)": {
                  animation: "cup-frame 8s linear infinite"
                },
                "& .image": { display: "block", borderRadius: "19px", overflow: "hidden" }
              }}>
              <Image image={image} alt={`Turing Cup ${item.year} winners`} />
            </Box>
          </Box>
        )}
        <Typography sx={{ mt: 3, fontSize: "0.98rem", lineHeight: 1.7, color: muted }}>
          {item.info}
        </Typography>
        {item.report !== "NA" && (
          <Box
            component="a"
            href={item.report}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "inline-block",
              mt: 2,
              fontFamily: code,
              fontSize: "0.88rem",
              fontWeight: 700,
              color: ink,
              textDecoration: "underline",
              textDecorationColor: gold,
              textDecorationThickness: "2px",
              textUnderlineOffset: "5px",
              "&:hover": { color: accent }
            }}>
            Read the {item.year} report ↗
          </Box>
        )}
      </Box>
    </Box>
  );
}

/** Every edition's podium, one year at a time, newest first. */
export default function CupChampions() {
  const [year, setYear] = useState(contestdetails[0].year);
  const tabs = useRef([]);
  const item = contestdetails.find(entry => entry.year === year);

  const onKeyDown = (event, index) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (index + step + contestdetails.length) % contestdetails.length;
    setYear(contestdetails[next].year);
    tabs.current[next]?.focus();
  };

  return (
    <Box component="section" id="champions" aria-labelledby="cup-champions" sx={{ ...section, scrollMarginTop: 100 }}>
      <CupHeading
        id="cup-champions"
        title="Hall of"
        accent="champions."
        intro="Every edition's podium. Pick a year."
      />

      <Box
        role="tablist"
        aria-label="Edition"
        data-reveal
        sx={{
          display: "inline-flex",
          flexWrap: "wrap",
          gap: 0.75,
          p: 0.75,
          mb: { xs: 5, md: 7 },
          borderRadius: "999px",
          bgcolor: "rgba(15,26,22,0.05)",
          border: `1px solid ${faint}`
        }}>
        {contestdetails.map((entry, index) => {
          const selected = entry.year === year;
          return (
            <Box
              key={entry.year}
              ref={el => (tabs.current[index] = el)}
              component="button"
              type="button"
              role="tab"
              id={`cup-tab-${entry.year}`}
              aria-selected={selected}
              aria-controls="cup-edition"
              tabIndex={selected ? 0 : -1}
              onClick={() => setYear(entry.year)}
              onKeyDown={event => onKeyDown(event, index)}
              sx={{
                px: { xs: 1.75, md: 2.25 },
                py: 1,
                border: 0,
                borderRadius: "999px",
                fontFamily: code,
                fontSize: { xs: "0.85rem", md: "0.95rem" },
                fontWeight: 700,
                cursor: "pointer",
                color: selected ? "#fff" : ink,
                background: selected ? `linear-gradient(135deg, ${accent}, #0b3a2c)` : "transparent",
                boxShadow: selected ? `0 10px 24px -10px ${accent}, inset 0 1px 0 rgba(255,255,255,0.3)` : "none",
                transition: "background 0.3s ease, color 0.3s ease, transform 0.2s ease",
                "&:hover": { transform: "translateY(-2px)", bgcolor: selected ? undefined : "#fff" },
                "&:focus-visible": { outline: `3px solid ${gold}`, outlineOffset: 2 }
              }}>
              {entry.year}
            </Box>
          );
        })}
      </Box>

      {/* keyed on the year, so the podium rises and the confetti flies again */}
      <Box key={year} role="tabpanel" id="cup-edition" aria-labelledby={`cup-tab-${year}`}>
        <Edition item={item} />
      </Box>
    </Box>
  );
}
