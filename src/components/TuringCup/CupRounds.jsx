import { Box, Typography } from "@mui/material";
import { edition, roundStatus } from "../../data/turingCup";
import CupHeading from "./CupHeading";
import { accent, code, display, faint, gold, ink, muted, section, sky, tilt } from "./cupStyles";

// ICPC-style balloon colours, one per problem
const BALLOONS = [accent, gold, sky];

const VERDICT = {
  done: { label: "✓ Accepted", color: "#0f7a4f", bg: "rgba(22,101,79,0.1)" },
  live: { label: "● Running", color: "#dc2626", bg: "rgba(220,38,38,0.1)" },
  upcoming: { label: "◌ Pending", color: muted, bg: "rgba(15,26,22,0.06)" }
};

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Kolkata"
});

// "2026-02-28T20:30:00+05:30" -> date "2026-02-28", time "20:30" (IST)
const istParts = iso => ({ date: iso.slice(0, 10), time: iso.slice(11, 16) });

// The calendar library is large, so it loads on the first click
async function addToCalendar(round, button) {
  const start = istParts(round.start);
  const end = istParts(round.end);
  const { atcb_action } = await import("add-to-calendar-button");
  atcb_action(
    {
      name: `${edition.name} · ${round.title}`,
      description: "Check your mail for the contest links.",
      startDate: start.date,
      startTime: start.time,
      endDate: end.date,
      endTime: end.time,
      timeZone: "Asia/Kolkata",
      options: ["Google", "Apple", "Outlook.com"]
    },
    button
  );
}

function RoundCard({ round, index }) {
  const status = roundStatus(round);
  const verdict = VERDICT[status];
  const balloon = BALLOONS[index % BALLOONS.length];
  const when = round.start
    ? dateFormat.format(new Date(round.start))
    : `Closes ${dateFormat.format(new Date(round.end))}`;

  return (
    <Box data-reveal sx={{ perspective: "1000px" }}>
      <Box
        component="article"
        {...tilt(10)}
        sx={{
          position: "relative",
          height: "100%",
          p: { xs: 3, md: 3.5 },
          borderRadius: "24px",
          bgcolor: "#fff",
          border: `1px solid ${faint}`,
          boxShadow: "0 24px 50px -30px rgba(15,26,22,0.35)",
          overflow: "hidden",
          transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
          transformStyle: "preserve-3d",
          transition: "transform 0.25s ease-out, box-shadow 0.3s ease",
          "&:hover": { boxShadow: `0 40px 70px -30px ${balloon}` },
          // A glare that follows the pointer, and a gradient rim that lights up
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            padding: "2px",
            background: `radial-gradient(260px circle at var(--px, 50%) var(--py, 0%), ${balloon}, transparent 70%)`,
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none"
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "radial-gradient(300px circle at var(--px, 50%) var(--py, 0%), rgba(255,255,255,0.7), transparent 60%)",
            mixBlendMode: "soft-light",
            opacity: 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none"
          },
          "&:hover::before, &:hover::after": { opacity: 1 }
        }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          {/* the balloon */}
          <Box
            aria-hidden="true"
            sx={{
              position: "relative",
              display: "grid",
              placeItems: "center",
              width: 60,
              height: 68,
              borderRadius: "50% 50% 46% 46%",
              background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.65), transparent 40%), ${balloon}`,
              color: "#fff",
              fontFamily: display,
              fontSize: "1.6rem",
              fontWeight: 800,
              boxShadow: `inset -6px -8px 14px rgba(0,0,0,0.18), 0 14px 24px -10px ${balloon}`,
              transform: "translateZ(40px)",
              "@keyframes cup-bob": {
                "0%, 100%": { transform: "translateZ(40px) translateY(0) rotate(-4deg)" },
                "50%": { transform: "translateZ(40px) translateY(-6px) rotate(4deg)" }
              },
              "@media (prefers-reduced-motion: no-preference)": {
                animation: `cup-bob ${3 + index * 0.4}s ease-in-out infinite`
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -14,
                left: "50%",
                width: "1px",
                height: 14,
                bgcolor: "rgba(15,26,22,0.3)"
              }
            }}>
            {round.letter}
          </Box>
          <Box
            sx={{
              px: 1.25,
              py: 0.5,
              borderRadius: "8px",
              fontFamily: code,
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: verdict.color,
              bgcolor: verdict.bg,
              "@keyframes cup-blink": { "50%": { opacity: 0.4 } },
              ...(status === "live" && {
                "@media (prefers-reduced-motion: no-preference)": {
                  animation: "cup-blink 1s ease-in-out infinite"
                }
              })
            }}>
            {verdict.label}
          </Box>
        </Box>

        <Typography
          component="h3"
          sx={{
            mt: 3,
            fontSize: { xs: "1.35rem", md: "1.5rem" },
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: ink,
            transform: "translateZ(24px)"
          }}>
          <Box component="span" sx={{ fontFamily: code, color: muted, fontWeight: 600, mr: 1 }}>
            {round.letter}.
          </Box>
          {round.title}
        </Typography>
        <Typography sx={{ mt: 0.75, fontFamily: code, fontSize: "0.82rem", color: muted }}>
          {when} IST
        </Typography>

        <Box component="dl" sx={{ m: 0, mt: 2.5 }}>
          {round.details.map(([term, value]) => (
            <Box
              key={term}
              sx={{
                display: "grid",
                gridTemplateColumns: "92px 1fr",
                gap: 1.5,
                py: 1,
                borderTop: `1px dashed ${faint}`
              }}>
              <Box component="dt" sx={{ fontFamily: code, fontSize: "0.75rem", color: muted, textTransform: "uppercase", pt: "2px" }}>
                {term}
              </Box>
              <Box component="dd" sx={{ m: 0, fontSize: "0.95rem", color: ink }}>
                {value}
              </Box>
            </Box>
          ))}
        </Box>

        {status === "upcoming" && round.start && (
          <Box
            component="button"
            type="button"
            onClick={event => addToCalendar(round, event.currentTarget)}
            sx={{
              mt: 2.5,
              px: 2,
              py: 1,
              border: `1px solid ${ink}`,
              borderRadius: "999px",
              bgcolor: "transparent",
              fontFamily: code,
              fontSize: "0.82rem",
              fontWeight: 700,
              color: ink,
              cursor: "pointer",
              transition: "background-color 0.2s ease, color 0.2s ease",
              "&:hover": { bgcolor: ink, color: "#fff" },
              "&:focus-visible": { outline: `3px solid ${gold}`, outlineOffset: 3 }
            }}>
            + Add to calendar
          </Box>
        )}
      </Box>
    </Box>
  );
}

/** The edition's rounds, set as a contest problem set with live verdicts. */
export default function CupRounds() {
  return (
    <Box component="section" id="rounds" aria-labelledby="cup-rounds" sx={{ ...section, scrollMarginTop: 100 }}>
      <CupHeading
        id="cup-rounds"
        kicker={`cat ${edition.short.toLowerCase()}/problemset.md`}
        title="How it"
        accent="runs."
        intro="Three problems stand between you and the Cup. Verdicts update on their own as the dates pass."
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: { xs: 3, md: 3.5 }
        }}>
        {edition.rounds.map((round, index) => (
          <RoundCard key={round.letter} round={round} index={index} />
        ))}
      </Box>
    </Box>
  );
}
