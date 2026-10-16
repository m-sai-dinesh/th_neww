import { Box, Typography } from "@mui/material";
import { edition, editionPhase, nextRound } from "../../data/turingCup";
import CupButton from "./CupButton";
import {
  accent,
  calm,
  display,
  gold,
  ink,
  mint,
  rose,
  serif,
  sky,
  sweepText
} from "./cupStyles";

const WORD = ["TURING", "CUP"];
// Where each word starts in the letter wave
const WORD_OFFSETS = WORD.map((_, w) =>
  WORD.slice(0, w).reduce((sum, word) => sum + word.length, 0)
);

// The aura: soft colour fields drifting forever under the grid, and a
// spinning ring of every Cup colour behind the title
const AURAS = [
  { width: "42vw", height: "42vw", left: "-10%", top: "-20%", bgcolor: accent, motion: "cup-drift-a 22s ease-in-out infinite" },
  { width: "36vw", height: "36vw", right: "-8%", top: "5%", bgcolor: gold, motion: "cup-drift-b 18s ease-in-out infinite" },
  { width: "30vw", height: "30vw", left: "30%", bottom: "-25%", bgcolor: sky, motion: "cup-drift-a 26s ease-in-out -9s infinite reverse" },
  { width: "22vw", height: "22vw", right: "18%", bottom: "-10%", bgcolor: rose, opacity: 0.3, motion: "cup-drift-b 20s ease-in-out -11s infinite" },
  {
    left: "50%",
    top: "50%",
    width: { xs: "120vw", md: "62vw" },
    height: { xs: "120vw", md: "62vw" },
    transform: "translate(-50%, -50%)",
    opacity: 0.32,
    filter: "blur(90px)",
    background: `conic-gradient(from 0deg, ${accent}, ${gold}, ${mint}, ${sky}, ${rose}, ${accent})`,
    motion: "cup-spin 14s linear infinite"
  }
];

/**
 * One letter of the wordmark. Its weight swells and ebbs in a wave that runs
 * through the word forever; an invisible copy at the heaviest weight holds the
 * width, so the word never jitters.
 */
function Letter({ char, index }) {
  return (
    <Box
      component="span"
      aria-hidden="true"
      sx={{
        display: "inline-grid",
        "& > span": { gridArea: "1 / 1", textAlign: "center" },
        "@media (prefers-reduced-motion: no-preference)": {
          animation: `cup-rise 1.1s cubic-bezier(.2,.8,.2,1) ${0.15 + index * 0.06}s both`
        }
      }}>
      <Box component="span" sx={{ visibility: "hidden", fontWeight: 900 }}>
        {char}
      </Box>
      <Box
        component="span"
        sx={{
          ...sweepText,
          fontWeight: 800,
          "@media (prefers-reduced-motion: no-preference)": {
            animation: `cup-sweep 6s linear infinite, cup-weight 3.4s ease-in-out ${index * 0.14}s infinite`
          }
        }}>
        {char}
      </Box>
    </Box>
  );
}

/**
 * The opening: a light page with an aura that never stops moving, a
 * wordmark that breathes, and a call to action that follows where the
 * edition stands.
 */
export default function CupHero() {
  const phase = editionPhase();
  const upcoming = nextRound();

  const onPointerMove = event => {
    if (calm()) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--cx", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--cy", `${event.clientY - box.top}px`);
  };

  return (
    <Box sx={{ px: { xs: 1, md: 2 } }}>
      <Box
        component="section"
        aria-labelledby="cup-title"
        onPointerMove={onPointerMove}
        sx={{
          position: "relative",
          overflow: "hidden",
          isolation: "isolate",
          borderRadius: { xs: "24px", md: "36px" },
          mt: { xs: 1, md: 2 },
          minHeight: { md: "calc(100vh - 110px)" },
          display: "grid",
          placeItems: "center",
          background: `radial-gradient(rgba(15,26,22,0.13) 1px, transparent 1.2px) 0 0 / 22px 22px, #fbfcfb`,
          "@keyframes cup-rise": {
            from: { opacity: 0, transform: "translateY(60%) rotateX(-80deg)", filter: "blur(10px)" },
            to: { opacity: 1, transform: "none", filter: "blur(0)" }
          },
          "@keyframes cup-weight": {
            "0%, 100%": { fontWeight: 800 },
            "50%": { fontWeight: 300 }
          },
          "@keyframes cup-drift-a": {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "33%": { transform: "translate(18vw, 10vh) scale(1.25)" },
            "66%": { transform: "translate(-6vw, 22vh) scale(0.85)" }
          },
          "@keyframes cup-drift-b": {
            "0%, 100%": { transform: "translate(0, 0) scale(1.1)" },
            "50%": { transform: "translate(-22vw, -12vh) scale(0.8)" }
          },
          "@keyframes cup-spin": { to: { transform: "translate(-50%, -50%) rotate(1turn)" } },
          "@keyframes cup-ping": {
            "0%": { transform: "scale(1)", opacity: 0.7 },
            "100%": { transform: "scale(2.6)", opacity: 0 }
          },
          // A gold light that follows the pointer
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: -1,
            pointerEvents: "none",
            background:
              "radial-gradient(380px circle at var(--cx, 50%) var(--cy, 40%), rgba(242,170,76,0.28), transparent 65%)",
            transition: "background 0.1s linear"
          }
        }}>
        {AURAS.map(({ motion, ...blob }, i) => (
          <Box
            key={i}
            aria-hidden="true"
            sx={{
              position: "absolute",
              zIndex: -1,
              borderRadius: "50%",
              filter: "blur(70px)",
              opacity: 0.5,
              pointerEvents: "none",
              ...blob,
              "@media (prefers-reduced-motion: no-preference)": {
                animation: motion
              }
            }}
          />
        ))}
        {/* the grid fades out toward the bottom, as on the home hero */}
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: -1,
            background: "linear-gradient(to bottom, rgba(251,252,251,0) 60%, rgba(251,252,251,0.9) 100%)"
          }}
        />


        <Box
          sx={{
            position: "relative",
            textAlign: "center",
            px: { xs: 2, sm: 4 },
            py: { xs: 9, md: 12 },
            perspective: "800px",
            // A soft halo of the page colour, so the words stay crisp over
            // the aura
            "&::before": {
              content: '""',
              position: "absolute",
              zIndex: -1,
              inset: { xs: "10% -10%", md: "18% 4%" },
              borderRadius: "50%",
              background: "radial-gradient(closest-side, rgba(251,252,251,0.92), rgba(251,252,251,0.75) 55%, rgba(251,252,251,0))",
              pointerEvents: "none"
            }
          }}>
          <Typography
            id="cup-title"
            component="h1"
            aria-label="Turing Cup"
            sx={{
              fontFamily: display,
              fontSize: { xs: "15vw", sm: "11vw", md: "min(8.6vw, 8rem)" },
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              color: ink,
              filter: "drop-shadow(0 18px 30px rgba(15,26,22,0.12))"
            }}>
            {WORD.map((word, w) => (
              <Box
                key={word}
                component="span"
                sx={{ display: { xs: "block", md: "inline" }, whiteSpace: "nowrap", mx: { md: "0.12em" } }}>
                {[...word].map((char, i) => (
                  <Letter key={i} char={char} index={WORD_OFFSETS[w] + i} />
                ))}
              </Box>
            ))}
          </Typography>

          <Typography
            sx={{
              mt: { xs: 2.5, md: 3.5 },
              fontSize: { xs: "1.6rem", sm: "2.2rem", md: "2.6rem" },
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: ink
            }}>
            One team, one{" "}
            <Box
              component="span"
              sx={{ fontFamily: serif, fontStyle: "italic", fontWeight: 500, color: "#d48a1f" }}>
              dream.
            </Box>
          </Typography>


          <Box
            sx={{
              mt: 4.5,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2
            }}>
            {phase === "registration" ? (
              <CupButton href={edition.registrationUrl}>Register now</CupButton>
            ) : (
              <CupButton href="#champions">Meet the champions</CupButton>
            )}
            {upcoming && (
              <CupButton variant="ghost" href="#clock">
                {`${upcoming.title.split(" · ")[0]} countdown`}
              </CupButton>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
