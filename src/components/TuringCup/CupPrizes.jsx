import { Box, Typography } from "@mui/material";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import { edition } from "../../data/turingCup";
import NumberTicker from "../NumberTicker";
import CupHeading from "./CupHeading";
import { accent, display, faint, gold, ink, muted, section, sky, sweepText, tilt } from "./cupStyles";

const perks = [
  { Icon: EmojiEventsRoundedIcon, color: gold, title: "Cash for the top teams", text: "The prize pool is split across the top finishers of the onsite final." },
  { Icon: CardGiftcardRoundedIcon, color: accent, title: "Goodies for every finalist", text: "Every team that makes it to campus goes home with swag, and lunch is on us." },
  { Icon: HotelRoundedIcon, color: sky, title: "A place to stay", text: "Teams from colleges outside Hyderabad get accommodation for the onsite round." }
];

/** The prize pool as one huge, shimmering number, and what else finalists get. */
export default function CupPrizes() {
  return (
    <Box component="section" aria-labelledby="cup-prizes" sx={section}>
      <CupHeading id="cup-prizes" kicker="echo $PRIZE_POOL" title="What's" accent="at stake." />
      <Typography
        data-reveal
        sx={{
          fontFamily: display,
          fontSize: { xs: "18vw", md: "min(13vw, 11rem)" },
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: "-0.05em",
          filter: "drop-shadow(0 24px 40px rgba(242,170,76,0.35))"
        }}>
        <Box component="span" sx={sweepText}>
          ₹<NumberTicker value={edition.prizePool} locale="en-IN" duration={2400} />
        </Box>
      </Typography>
      <Typography sx={{ mt: 1, mb: { xs: 5, md: 7 }, fontSize: "1.05rem", color: muted }}>
        Prize pool for {edition.name}.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 3
        }}>
        {perks.map(({ Icon, color, title, text }) => (
          <Box key={title} data-reveal sx={{ perspective: "900px" }}>
            <Box
              {...tilt(12)}
              sx={{
                height: "100%",
                p: 3.5,
                borderRadius: "24px",
                bgcolor: "#fff",
                border: `1px solid ${faint}`,
                transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
                transition: "transform 0.25s ease-out, box-shadow 0.3s ease",
                background: `radial-gradient(240px circle at var(--px, 50%) var(--py, 0%), ${color}22, transparent 70%), #fff`,
                "&:hover": { boxShadow: `0 30px 60px -30px ${color}` }
              }}>
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 56,
                  height: 56,
                  borderRadius: "16px",
                  color: "#fff",
                  bgcolor: color,
                  boxShadow: `0 14px 28px -12px ${color}`
                }}>
                <Icon />
              </Box>
              <Typography component="h3" sx={{ mt: 2.5, fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em", color: ink }}>
                {title}
              </Typography>
              <Typography sx={{ mt: 1, lineHeight: 1.6, color: muted }}>{text}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
