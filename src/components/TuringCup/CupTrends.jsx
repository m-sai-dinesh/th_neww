import { useLayoutEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import contestdetails from "../../data/pastContests";
import NumberTicker from "../NumberTicker";
import CupHeading from "./CupHeading";
import { accent, ink, section, tilt } from "./cupStyles";

gsap.registerPlugin(ScrollTrigger);

const number = new Intl.NumberFormat("en-IN");

// Each edition's numbers, read from its write-up, oldest first. "50+"
// colleges counts as 50 but keeps its "+"; a missing count stays null.
const editions = contestdetails
  .map(({ year, info }) => {
    const read = pattern => pattern.exec(info)?.[1];
    const teams = read(/(\d[\d,]*) teams from/);
    const colleges = read(/from (\d[\d,]*\+?) different colleges/);
    const onsite = read(/(\d+) teams (?:were|have been) invited/);
    if (!teams) return null;
    const registered = Number(teams.replace(/,/g, ""));
    return {
      year: Number(year),
      teams: registered,
      colleges: colleges ? Number.parseInt(colleges, 10) : null,
      collegesAtLeast: colleges?.endsWith("+") ?? false,
      perSpot: onsite
        ? Math.round((registered / Number(onsite)) * 10) / 10
        : null
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.year - b.year);

const latest = editions.at(-1);
const firstYear = editions[0].year;
const lastYear = latest.year;

// Three measures of very different size share one axis by each being read
// against the first edition that recorded all three: growth, not raw counts.
// One hue and its neutrals: the headline measure in full green, the others
// stepping back toward grey, each named at its line's end.
const series = [
  {
    key: "teams",
    label: "Teams registered",
    unit: "teams",
    color: "var(--cup-s1)",
    format: row => number.format(row.teams)
  },
  {
    key: "colleges",
    label: "Colleges",
    unit: "colleges",
    color: "var(--cup-s2)",
    format: row =>
      `${number.format(row.colleges)}${row.collegesAtLeast ? "+" : ""}`
  },
  {
    key: "perSpot",
    label: "Teams per onsite spot",
    unit: "per spot",
    color: "var(--cup-s3)",
    format: row => `${row.perSpot.toFixed(1)}×`
  }
];
const base = editions.find(row => series.every(s => row[s.key] != null));
const indexOf = (row, key) => (row[key] == null ? null : row[key] / base[key]);
const times = value => `${value < 10 ? value.toFixed(1) : Math.round(value)}×`;

// Growth is read on a doubling scale, so 2× and 4× sit evenly apart
const allIndexes = editions
  .flatMap(row => series.map(s => indexOf(row, s.key)))
  .filter(v => v != null);
const LOG_MIN = Math.log2(Math.min(...allIndexes) * 0.8);
const LOG_MAX = Math.log2(Math.max(...allIndexes) * 1.2);
const ticks = [0.25, 0.5, 1, 2, 4, 8, 16].filter(
  t => Math.log2(t) >= LOG_MIN && Math.log2(t) <= LOG_MAX
);

const ease = "cubic-bezier(.2,.7,.2,1)";
// A little past the mark and back, like a spring settling
const spring = "cubic-bezier(.34,1.56,.64,1)";
const sans =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Instrument Sans Variable", system-ui, sans-serif';
const dim = (focus, key, low) => (focus && focus !== key ? low : 1);

// Theme tokens for the panel. The site is light; the dark set is ready for a
// `data-theme="dark"` ancestor.
const light = {
  "--cup-glass": "rgba(255,255,255,0.55)",
  "--cup-hair-from": "rgba(255,255,255,0.95)",
  "--cup-hair-to": "rgba(15,26,22,0.07)",
  "--cup-highlight": "rgba(255,255,255,0.8)",
  "--cup-shadow":
    "0 1px 2px rgba(15,26,22,0.05), 0 8px 24px -12px rgba(15,26,22,0.12), 0 48px 96px -40px rgba(15,26,22,0.22)",
  "--cup-text": ink,
  "--cup-muted": "rgba(15,26,22,0.52)",
  "--cup-grid": "rgba(15,26,22,0.06)",
  "--cup-grid-strong": "rgba(15,26,22,0.16)",
  "--cup-rule": "rgba(15,26,22,0.07)",
  "--cup-surface": "#fff",
  "--cup-tip": "rgba(255,255,255,0.7)",
  "--cup-s1": accent,
  "--cup-s2": "#5c9e86",
  "--cup-s3": "#8d9893",
  "--cup-blob-1": "#cfe5d9",
  "--cup-blob-2": "#ece2cf",
  "--cup-blob-3": "#d6dee7"
};
const dark = {
  "--cup-glass": "rgba(255,255,255,0.1)",
  "--cup-hair-from": "rgba(255,255,255,0.3)",
  "--cup-hair-to": "rgba(255,255,255,0.05)",
  "--cup-highlight": "rgba(255,255,255,0.25)",
  "--cup-shadow":
    "0 1px 2px rgba(0,0,0,0.3), 0 8px 24px -12px rgba(0,0,0,0.45), 0 48px 96px -40px rgba(0,0,0,0.6)",
  "--cup-text": "#eef3f0",
  "--cup-muted": "rgba(238,243,240,0.58)",
  "--cup-grid": "rgba(255,255,255,0.06)",
  "--cup-grid-strong": "rgba(255,255,255,0.18)",
  "--cup-rule": "rgba(255,255,255,0.08)",
  "--cup-surface": "#0f1a16",
  "--cup-tip": "rgba(28,38,34,0.6)",
  "--cup-s1": "#6fe0aa",
  "--cup-s2": "#3f9d7c",
  "--cup-s3": "#93a19b",
  "--cup-blob-1": "#1c4637",
  "--cup-blob-2": "#3a3326",
  "--cup-blob-3": "#212d39"
};

// A whisper of grain, so the soft gradients never band
const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/** A monotone cubic through the points: smooth, never overshooting a value. */
function smoothPath(points) {
  const n = points.length;
  if (n < 2) return "";
  const dx = [];
  const slope = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = points[i + 1].x - points[i].x;
    slope[i] = (points[i + 1].y - points[i].y) / dx[i];
  }
  const tangent = [slope[0]];
  for (let i = 1; i < n - 1; i++) {
    tangent[i] =
      slope[i - 1] * slope[i] <= 0
        ? 0
        : (3 * (dx[i - 1] + dx[i])) /
          ((2 * dx[i] + dx[i - 1]) / slope[i - 1] +
            (dx[i] + 2 * dx[i - 1]) / slope[i]);
  }
  tangent[n - 1] = slope[n - 2];
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${points[i].x + h},${points[i].y + tangent[i] * h} ${points[i + 1].x - h},${points[i + 1].y - tangent[i + 1] * h} ${points[i + 1].x},${points[i + 1].y}`;
  }
  return d;
}

function useWidth(ref) {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width))
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

/** One measure in the header: a quiet label over a big number, which also picks out its line. */
function Stat({ s, row, first, focus, onFocus, onBlur }) {
  const value = row[s.key];
  return (
    <Box
      component="button"
      type="button"
      aria-pressed={focus === s.key}
      onPointerEnter={onFocus}
      onPointerLeave={onBlur}
      onFocus={onFocus}
      onBlur={onBlur}
      sx={{
        display: { xs: "flex", sm: "block" },
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 2,
        minWidth: 0,
        py: { xs: 1.25, sm: 0 },
        px: 0,
        border: 0,
        borderTop: { xs: first ? 0 : "1px solid var(--cup-rule)", sm: 0 },
        bgcolor: "transparent",
        font: "inherit",
        textAlign: "left",
        color: "var(--cup-text)",
        cursor: "pointer",
        opacity: dim(focus, s.key, 0.38),
        transition: `opacity 0.3s ${ease}`,
        "&:focus-visible": {
          outline: "2px solid var(--cup-s1)",
          outlineOffset: 4,
          borderRadius: "8px"
        }
      }}>
      <Box
        component="span"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontSize: "0.8125rem",
          fontWeight: 500,
          color: "var(--cup-muted)",
          whiteSpace: "nowrap"
        }}>
        <Box
          component="span"
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: s.color,
            flexShrink: 0
          }}
        />
        {s.label}
      </Box>
      <Box
        key={row.year}
        component="span"
        sx={{
          display: "block",
          mt: { xs: 0, sm: 1 },
          fontSize: { xs: "1.375rem", sm: "2rem" },
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: "-0.035em",
          fontVariantNumeric: "tabular-nums",
          "@keyframes cup-trend-pop": {
            from: { opacity: 0, transform: "translateY(4px)" }
          },
          "@media (prefers-reduced-motion: no-preference)": {
            animation: `cup-trend-pop 0.35s ${ease}`
          }
        }}>
        {value == null ? (
          "—"
        ) : row === latest ? (
          <>
            <NumberTicker value={value} locale="en-IN" duration={1400} />
            {s.key === "perSpot" && "×"}
            {s.key === "colleges" && row.collegesAtLeast && "+"}
          </>
        ) : (
          s.format(row)
        )}
      </Box>
      <Box
        component="span"
        sx={{
          display: { xs: "none", sm: "block" },
          mt: 1,
          fontSize: "0.75rem",
          color: "var(--cup-muted)",
          fontVariantNumeric: "tabular-nums"
        }}>
        {value == null
          ? "Not recorded"
          : `${times(indexOf(row, s.key))} the ${base.year} level`}
      </Box>
    </Box>
  );
}

/**
 * How the Cup has grown, in one chart: teams, colleges and how hard the final
 * is to reach, each traced as growth on the same timeline. A pane of frosted
 * glass over a slow, soft mesh; the lines draw in once, and pointing at a
 * year springs a crosshair and a glass pill to it while the header numbers
 * follow.
 */
export default function CupTrends() {
  const plotRef = useRef(null);
  const width = useWidth(plotRef);
  const [activeYear, setActiveYear] = useState(null);
  const [focus, setFocus] = useState(null);
  const active = editions.find(row => row.year === activeYear);
  const shown = active ?? latest;

  const narrow = width < 600;
  const height = narrow ? 260 : 360;
  const m = {
    top: 40,
    right: narrow ? 52 : 136,
    bottom: 32,
    left: narrow ? 32 : 40
  };
  const xOf = year =>
    m.left +
    ((year - firstYear) / (lastYear - firstYear)) * (width - m.left - m.right);
  const yOf = value =>
    m.top +
    (1 - (Math.log2(value) - LOG_MIN) / (LOG_MAX - LOG_MIN)) *
      (height - m.top - m.bottom);
  const baseX = xOf(base.year);
  const lastX = xOf(lastYear);

  const lines = series.map(s => {
    const points = editions
      .filter(row => row[s.key] != null)
      .map(row => ({
        year: row.year,
        x: xOf(row.year),
        y: yOf(indexOf(row, s.key))
      }));
    const solid = points.filter(p => p.year >= base.year);
    const before = points.filter(p => p.year <= base.year);
    return { ...s, points, solid, before, d: smoothPath(solid) };
  });

  // End labels, nudged apart so they never stack on one another
  const gap = narrow ? 18 : 36;
  const ends = lines
    .map(line => ({ key: line.key, y: line.solid.at(-1).y }))
    .sort((a, b) => a.y - b.y);
  ends.forEach((end, i) => {
    if (i && end.y - ends[i - 1].y < gap) end.y = ends[i - 1].y + gap;
  });
  const endY = Object.fromEntries(ends.map(end => [end.key, end.y]));

  useLayoutEffect(() => {
    if (!width) return;
    const root = plotRef.current;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const paths = [...root.querySelectorAll(".tr-line")];
      const lengths = paths.map(path => path.getTotalLength());
      paths.forEach((path, i) => {
        path.style.strokeDasharray = `${lengths[i]}`;
        path.style.strokeDashoffset = `${lengths[i]}`;
      });
      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: "top 85%", once: true }
        })
        .from(root.querySelectorAll(".tr-grid"), {
          opacity: 0,
          duration: 0.5,
          stagger: 0.04,
          ease: "power1.out"
        })
        .from(
          root.querySelectorAll(".tr-before"),
          { opacity: 0, duration: 0.4 },
          "-=0.2"
        )
        .to(paths, {
          strokeDashoffset: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power2.out",
          onComplete: () =>
            paths.forEach(path => {
              path.style.strokeDasharray = "";
              path.style.strokeDashoffset = "";
            })
        })
        .from(
          root.querySelectorAll(".tr-area"),
          {
            opacity: 0,
            duration: 0.7,
            ease: "power1.out",
            clearProps: "opacity"
          },
          "-=0.3"
        )
        .from(
          root.querySelectorAll(".tr-dot"),
          { opacity: 0, duration: 0.4, stagger: 0.02, clearProps: "opacity" },
          "<"
        )
        .from(
          root.querySelectorAll(".tr-end"),
          {
            opacity: 0,
            x: -6,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out",
            clearProps: "all"
          },
          "<"
        );
    });
    return () => mm.revert();
    // Once the plot has a size; later resizes keep what has already played
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width > 0]);

  // The nearest edition to the pointer
  const onPointerMove = event => {
    const box = plotRef.current.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * width;
    const nearest = editions.reduce((best, row) =>
      Math.abs(xOf(row.year) - x) < Math.abs(xOf(best.year) - x) ? row : best
    );
    setActiveYear(nearest.year);
  };

  const onKeyDown = event => {
    const index = active ? editions.indexOf(active) : editions.length - 1;
    const next = {
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      Home: 0,
      End: editions.length - 1
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setActiveYear(
      editions[Math.min(Math.max(next, 0), editions.length - 1)].year
    );
  };

  // The crosshair and pill rest on the latest year while hidden, so they spring from there
  const pinX = xOf(shown.year);
  const pinTop = Math.min(
    ...lines.map(
      line => line.points.find(p => p.year === shown.year)?.y ?? Infinity
    )
  );
  const pillX = Math.min(Math.max(pinX, 64), width - 64);
  const specular = tilt(0);

  return (
    <Box component="section" aria-labelledby="cup-trends" sx={section}>
      <CupHeading
        id="cup-trends"
        title="Every year, a bigger"
        accent="arena."
      />

      <Box
        data-reveal
        sx={{
          ...light,
          "[data-theme='dark'] &": dark,
          position: "relative",
          isolation: "isolate",
          mt: { xs: 2, md: 3 }
        }}>
        {/* The mesh the glass refracts: three muted blobs, drifting slowly */}
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: { xs: "0 -8px -24px", md: "0 -48px -56px" },
            zIndex: -1,
            overflow: "hidden",
            pointerEvents: "none",
            // Edges fade out, so the mesh has no outline of its own
            maskImage:
              "radial-gradient(ellipse 50% 50% at 50% 50%, #000 60%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 50% 50% at 50% 50%, #000 60%, transparent 100%)",
            "& span": {
              position: "absolute",
              width: "46%",
              aspectRatio: "1",
              borderRadius: "50%",
              filter: "blur(64px)",
              opacity: 0.9
            },
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              backgroundImage: grain,
              opacity: 0.03
            },
            "@keyframes cup-mesh": {
              "0%": { transform: "translate3d(0,0,0) scale(1)" },
              "50%": { transform: "translate3d(8%,6%,0) scale(1.08)" },
              "100%": { transform: "translate3d(0,0,0) scale(1)" }
            },
            "@media (prefers-reduced-motion: no-preference)": {
              "& span": { animation: "cup-mesh 22s ease-in-out infinite" },
              "& span:nth-of-type(2)": {
                animationDuration: "28s",
                animationDirection: "reverse"
              },
              "& span:nth-of-type(3)": {
                animationDuration: "34s",
                animationDelay: "-12s"
              }
            }
          }}>
          <Box
            component="span"
            sx={{ left: "-6%", top: "-18%", bgcolor: "var(--cup-blob-1)" }}
          />
          <Box
            component="span"
            sx={{ right: "-4%", top: "10%", bgcolor: "var(--cup-blob-2)" }}
          />
          <Box
            component="span"
            sx={{ left: "30%", bottom: "-30%", bgcolor: "var(--cup-blob-3)" }}
          />
        </Box>

        {/* The glass */}
        <Box
          {...specular}
          sx={{
            position: "relative",
            overflow: "hidden",
            px: { xs: 2, sm: 3, md: 4 },
            pt: { xs: 2.5, sm: 3, md: 4 },
            pb: { xs: 2, sm: 3 },
            borderRadius: "24px",
            bgcolor: "var(--cup-glass)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            boxShadow: "inset 0 1px 0 var(--cup-highlight), var(--cup-shadow)",
            fontFamily: sans,
            color: "var(--cup-text)",
            // A gradient hairline, bright along the top and fading down the sides
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              padding: "1px",
              background:
                "linear-gradient(180deg, var(--cup-hair-from), var(--cup-hair-to))",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              pointerEvents: "none"
            },
            // Light catching the pane where the pointer is
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              background:
                "radial-gradient(600px circle at var(--px, 50%) var(--py, 0%), rgba(255,255,255,0.35), transparent 45%)",
              opacity: 0,
              transition: "opacity 0.6s ease",
              pointerEvents: "none"
            },
            "@media (hover: hover)": { "&:hover::after": { opacity: 1 } }
          }}>
          <Typography
            component="p"
            sx={{
              fontFamily: sans,
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--cup-muted)",
              fontVariantNumeric: "tabular-nums"
            }}>
            <Box
              component="span"
              sx={{ color: "var(--cup-text)", fontWeight: 600 }}>
              {shown.year}
            </Box>{" "}
            edition{shown === latest ? " · latest" : ""}
          </Typography>

          <Box
            sx={{
              mt: { xs: 1, sm: 2 },
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, minmax(0, 1fr))"
              },
              columnGap: 3
            }}>
            {series.map((s, i) => (
              <Stat
                key={s.key}
                s={s}
                row={shown}
                first={i === 0}
                focus={focus}
                onFocus={() => setFocus(s.key)}
                onBlur={() => setFocus(null)}
              />
            ))}
          </Box>

          <Box
            ref={plotRef}
            role="group"
            tabIndex={0}
            aria-label={`Growth chart, showing ${shown.year}. Use the arrow keys to change the year.`}
            onPointerMove={onPointerMove}
            onPointerLeave={() => setActiveYear(null)}
            onKeyDown={onKeyDown}
            sx={{
              position: "relative",
              height,
              mt: { xs: 2, sm: 3 },
              touchAction: "pan-y",
              outline: "none",
              borderRadius: "12px",
              "&:focus-visible": {
                outline: "2px solid var(--cup-s1)",
                outlineOffset: 8
              },
              "& .tr-pop": {
                transformBox: "fill-box",
                transformOrigin: "center",
                transition: `transform 0.45s ${spring}, opacity 0.3s ease`
              },
              "& .tr-fade": { transition: `opacity 0.3s ${ease}` },
              "@media (prefers-reduced-motion: reduce)": {
                "& .tr-pop, & .tr-slide": { transition: "none !important" }
              }
            }}>
            {width > 0 && (
              <svg
                width={width}
                height={height}
                style={{ display: "block", overflow: "visible" }}
                aria-hidden="true">
                <defs>
                  {lines.map(line => (
                    <filter
                      key={line.key}
                      id={`tr-glow-${line.key}`}
                      x="-10%"
                      y="-40%"
                      width="120%"
                      height="180%">
                      <feDropShadow
                        dx="0"
                        dy="2"
                        stdDeviation="3"
                        floodOpacity="0.28"
                        style={{ floodColor: line.color }}
                      />
                    </filter>
                  ))}
                  {lines.map(line => (
                    <linearGradient
                      key={line.key}
                      id={`tr-fill-${line.key}`}
                      gradientUnits="userSpaceOnUse"
                      x1="0"
                      y1={yOf(indexOf(latest, line.key))}
                      x2="0"
                      y2={yOf(1)}>
                      <stop
                        offset="0"
                        stopOpacity="0.14"
                        style={{ stopColor: line.color }}
                      />
                      <stop
                        offset="1"
                        stopOpacity="0"
                        style={{ stopColor: line.color }}
                      />
                    </linearGradient>
                  ))}
                  {lines.map(line => (
                    <linearGradient
                      key={line.key}
                      id={`tr-stroke-${line.key}`}
                      gradientUnits="userSpaceOnUse"
                      x1={baseX}
                      x2={lastX}
                      y1="0"
                      y2="0">
                      <stop
                        offset="0"
                        stopOpacity="0.4"
                        style={{ stopColor: line.color }}
                      />
                      <stop offset="1" style={{ stopColor: line.color }} />
                    </linearGradient>
                  ))}
                </defs>

                {ticks.map(t => (
                  <g key={t} className="tr-grid">
                    <line
                      x1={m.left}
                      x2={width - m.right + (narrow ? 0 : 16)}
                      y1={yOf(t)}
                      y2={yOf(t)}
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeDasharray={t === 1 ? "4 6" : "1 6"}
                      style={{
                        stroke:
                          t === 1 ? "var(--cup-grid-strong)" : "var(--cup-grid)"
                      }}
                    />
                    <text
                      x={m.left - 12}
                      y={yOf(t)}
                      dy="0.35em"
                      textAnchor="end"
                      fontSize="11"
                      fontWeight="500"
                      style={{
                        fill: "var(--cup-muted)",
                        fontFamily: sans,
                        fontVariantNumeric: "tabular-nums"
                      }}>
                      {t}×
                    </text>
                  </g>
                ))}

                {/* Crosshair, sprung to the year in view */}
                <g
                  className="tr-slide"
                  style={{
                    transform: `translateX(${pinX}px)`,
                    transition: `transform 0.5s ${spring}`
                  }}>
                  <line
                    className="tr-fade"
                    x1="0"
                    x2="0"
                    y1={m.top - 8}
                    y2={height - m.bottom}
                    strokeWidth="1"
                    style={{
                      stroke: "var(--cup-grid-strong)",
                      opacity: active ? 1 : 0
                    }}
                  />
                </g>

                {lines.map(line => (
                  <path
                    key={line.key}
                    className="tr-area"
                    d={`${line.d} L${line.solid.at(-1).x},${yOf(1)} L${line.solid[0].x},${yOf(1)} Z`}
                    fill={`url(#tr-fill-${line.key})`}
                    opacity={dim(focus, line.key, 0.15)}
                    style={{ transition: `opacity 0.3s ${ease}` }}
                  />
                ))}

                {lines.map(line => (
                  <g
                    key={line.key}
                    opacity={dim(focus, line.key, 0.18)}
                    style={{ transition: `opacity 0.3s ${ease}` }}>
                    {line.before.length > 1 && (
                      <path
                        className="tr-before"
                        d={`M${line.before[0].x},${line.before[0].y} L${line.before.at(-1).x},${line.before.at(-1).y}`}
                        fill="none"
                        strokeWidth="1.5"
                        strokeDasharray="2 5"
                        strokeLinecap="round"
                        style={{ stroke: line.color, opacity: 0.5 }}
                      />
                    )}
                    <path
                      className="tr-line"
                      d={line.d}
                      fill="none"
                      stroke={`url(#tr-stroke-${line.key})`}
                      strokeWidth={focus === line.key ? 2.75 : 2.25}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter={`url(#tr-glow-${line.key})`}
                    />
                  </g>
                ))}

                {lines.map(line =>
                  line.points.map(p => {
                    const on = p.year === active?.year;
                    const isLatest = p.year === lastYear;
                    const quiet = active && !on;
                    return (
                      <g
                        key={`${line.key}-${p.year}`}
                        className="tr-dot"
                        opacity={dim(focus, line.key, 0.18)}>
                        <circle
                          className="tr-pop"
                          cx={p.x}
                          cy={p.y}
                          r="9"
                          style={{
                            fill: line.color,
                            opacity: on ? 0.16 : 0,
                            transform: `scale(${on ? 1 : 0.4})`
                          }}
                        />
                        <circle
                          className="tr-pop"
                          cx={p.x}
                          cy={p.y}
                          r="3.5"
                          strokeWidth="1.75"
                          style={{
                            fill:
                              on || isLatest
                                ? line.color
                                : "var(--cup-surface)",
                            stroke:
                              on || isLatest
                                ? "var(--cup-surface)"
                                : line.color,
                            opacity: quiet ? 0.45 : 1,
                            transform: `scale(${on ? 1.45 : 1})`
                          }}
                        />
                      </g>
                    );
                  })
                )}

                {lines.map(line => (
                  <g
                    key={line.key}
                    className="tr-end"
                    opacity={dim(focus, line.key, 0.25)}
                    style={{ transition: `opacity 0.3s ${ease}` }}>
                    <text
                      x={lastX + 16}
                      y={endY[line.key]}
                      dy={narrow ? "0.35em" : "-0.1em"}
                      fontSize={narrow ? 12 : 15}
                      fontWeight="600"
                      letterSpacing="-0.02em"
                      style={{
                        fill: line.color,
                        fontFamily: sans,
                        fontVariantNumeric: "tabular-nums"
                      }}>
                      {times(indexOf(latest, line.key))}
                    </text>
                    {!narrow && (
                      <text
                        x={lastX + 16}
                        y={endY[line.key]}
                        dy="1.3em"
                        fontSize="11"
                        style={{
                          fill: "var(--cup-muted)",
                          fontFamily: sans,
                          fontVariantNumeric: "tabular-nums"
                        }}>
                        {line.format(latest)} {line.unit}
                      </text>
                    )}
                  </g>
                ))}

                {editions.map(row => (
                  <text
                    key={row.year}
                    x={xOf(row.year)}
                    y={height - m.bottom + 22}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={row.year === shown.year ? 600 : 500}
                    style={{
                      fill:
                        row.year === shown.year
                          ? "var(--cup-text)"
                          : "var(--cup-muted)",
                      fontFamily: sans,
                      fontVariantNumeric: "tabular-nums"
                    }}>
                    {narrow ? `'${String(row.year).slice(2)}` : row.year}
                  </text>
                ))}
              </svg>
            )}

            {/* The glass pill, sprung to the year above its highest point */}
            {width > 0 && (
              <Box
                aria-hidden="true"
                className="tr-slide"
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  pointerEvents: "none",
                  transform: `translate3d(${pillX}px, ${pinTop}px, 0)`,
                  transition: `transform 0.5s ${spring}`
                }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 1,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 999,
                    whiteSpace: "nowrap",
                    transform: `translate(-50%, calc(-100% - 14px)) scale(${active ? 1 : 0.92})`,
                    opacity: active ? 1 : 0,
                    transition: `opacity 0.25s ease, transform 0.4s ${spring}`,
                    bgcolor: "var(--cup-tip)",
                    backdropFilter: "blur(16px) saturate(180%)",
                    WebkitBackdropFilter: "blur(16px) saturate(180%)",
                    boxShadow:
                      "inset 0 1px 0 var(--cup-highlight), 0 0 0 1px var(--cup-rule), 0 8px 20px -8px rgba(15,26,22,0.25)",
                    fontFamily: sans,
                    fontVariantNumeric: "tabular-nums"
                  }}>
                  <Box
                    component="span"
                    sx={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--cup-text)"
                    }}>
                    {shown.year}
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "var(--cup-muted)"
                    }}>
                    {series[0].format(shown)} {series[0].unit}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Hidden in a box: a table ignores its own width and would widen the page */}
      <Box sx={visuallyHidden}>
        <table>
          <caption>Turing Cup by year</caption>
          <thead>
            <tr>
              <th scope="col">Year</th>
              {series.map(s => (
                <th key={s.key} scope="col">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {editions.map(row => (
              <tr key={row.year}>
                <th scope="row">{row.year}</th>
                {series.map(s => (
                  <td key={s.key}>
                    {row[s.key] == null
                      ? "Not recorded"
                      : `${s.format(row)} (${times(indexOf(row, s.key))} the ${base.year} level)`}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
