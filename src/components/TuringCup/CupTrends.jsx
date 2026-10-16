import { useLayoutEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import contestdetails from "../../data/pastContests";
import NumberTicker from "../NumberTicker";
import CupHeading from "./CupHeading";
import { code, display, faint, gold, ink, mint, muted, section, sky, tilt } from "./cupStyles";

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
      perSpot: onsite ? Math.round((registered / Number(onsite)) * 10) / 10 : null
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.year - b.year);

const latest = editions.at(-1);
const firstYear = editions[0].year;
const lastYear = latest.year;

// Three measures of very different size share one axis by each being read
// against the first edition that recorded all three: growth, not raw counts.
// Three hues at most, validated against the white page.
const series = [
  { key: "teams", label: "Teams registered", unit: "teams", color: "#d97706", format: row => number.format(row.teams) },
  {
    key: "colleges",
    label: "Colleges",
    unit: "colleges",
    color: "#2a6fd6",
    format: row => `${number.format(row.colleges)}${row.collegesAtLeast ? "+" : ""}`
  },
  { key: "perSpot", label: "Teams per onsite spot", unit: "per spot", color: "#c2367a", format: row => `${row.perSpot.toFixed(1)}×` }
];
const base = editions.find(row => series.every(s => row[s.key] != null));
const indexOf = (row, key) => (row[key] == null ? null : row[key] / base[key]);
const times = value => `${value < 10 ? value.toFixed(1) : Math.round(value)}×`;

// Growth is read on a doubling scale, so 2× and 4× sit evenly apart
const allIndexes = editions.flatMap(row => series.map(s => indexOf(row, s.key))).filter(v => v != null);
const LOG_MIN = Math.log2(Math.min(...allIndexes) * 0.8);
const LOG_MAX = Math.log2(Math.max(...allIndexes) * 1.2);
const ticks = [0.25, 0.5, 1, 2, 4, 8, 16].filter(t => Math.log2(t) >= LOG_MIN && Math.log2(t) <= LOG_MAX);

const ease = "cubic-bezier(.2,.7,.2,1)";
const dim = (focus, key, low) => (focus && focus !== key ? low : 1);

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
        : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / slope[i - 1] + (dx[i] + 2 * dx[i - 1]) / slope[i]);
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
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

function Tile({ s, row, focused, dimmed, onFocus, onBlur }) {
  const value = row[s.key];
  return (
    <Box
      component="button"
      type="button"
      aria-pressed={focused}
      onPointerEnter={onFocus}
      onPointerLeave={onBlur}
      onFocus={onFocus}
      onBlur={onBlur}
      sx={{
        position: "relative",
        overflow: "hidden",
        textAlign: "left",
        font: "inherit",
        color: ink,
        cursor: "pointer",
        p: { xs: 2, md: 2.5 },
        borderRadius: "20px",
        border: `1px solid ${faint}`,
        bgcolor: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(10px)",
        opacity: dimmed ? 0.4 : 1,
        transition: `opacity 0.3s ease, transform 0.35s ${ease}, box-shadow 0.35s ease, border-color 0.3s ease`,
        // A bead of the line's colour runs along the top edge
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "0 0 auto",
          height: 3,
          background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`,
          backgroundSize: "200% 100%",
          "@keyframes cup-trend-bead": { from: { backgroundPosition: "100% 0" }, to: { backgroundPosition: "-100% 0" } }
        },
        "@media (prefers-reduced-motion: no-preference)": {
          "&::before": { animation: "cup-trend-bead 3.5s linear infinite" }
        },
        "&:hover, &:focus-visible": {
          transform: "translateY(-4px)",
          borderColor: `${s.color}55`,
          boxShadow: `0 24px 40px -24px ${s.color}`
        },
        "&:focus-visible": { outline: `2px solid ${s.color}`, outlineOffset: 3 }
      }}>
      <Typography component="span" sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: "0.9rem", fontWeight: 600, color: muted }}>
        <Box component="span" sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: s.color, boxShadow: `0 0 0 4px ${s.color}22` }} />
        {s.label}
      </Typography>
      <Typography
        key={row.year}
        component="span"
        sx={{
          display: "block",
          mt: 1,
          fontSize: { xs: "2rem", md: "2.6rem" },
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          fontVariantNumeric: "tabular-nums",
          "@keyframes cup-trend-pop": { from: { opacity: 0, transform: "translateY(10px)", filter: "blur(6px)" } },
          "@media (prefers-reduced-motion: no-preference)": { animation: `cup-trend-pop 0.4s ${ease}` }
        }}>
        {value == null ? (
          "—"
        ) : row === latest ? (
          <>
            <NumberTicker value={value} locale="en-IN" duration={2600} />
            {s.key === "perSpot" && "×"}
            {s.key === "colleges" && row.collegesAtLeast && "+"}
          </>
        ) : (
          s.format(row)
        )}
      </Typography>
      <Typography component="span" sx={{ display: "block", mt: 1, fontFamily: code, fontSize: "0.75rem", color: muted }}>
        {value == null ? (
          `not recorded in ${row.year}`
        ) : (
          <>
            {row.year} ·{" "}
            <Box component="span" sx={{ fontWeight: 700, color: ink }}>
              {times(indexOf(row, s.key))}
            </Box>{" "}
            the {base.year} level
          </>
        )}
      </Typography>
    </Box>
  );
}

/**
 * How the Cup has grown, in one chart: teams, colleges and how hard the final
 * is to reach, each traced as growth on the same timeline. The lines draw
 * themselves in behind travelling sparks, then keep pulsing with data; the
 * card leans toward the pointer under a spotlight, and pointing at a year
 * pins every number to that edition while its year looms behind the plot.
 */
export default function CupTrends() {
  const plotRef = useRef(null);
  const width = useWidth(plotRef);
  const [activeYear, setActiveYear] = useState(null);
  const [focus, setFocus] = useState(null);
  const active = editions.find(row => row.year === activeYear);
  const shown = active ?? latest;

  const narrow = width < 600;
  const height = narrow ? 300 : 430;
  const m = { top: 28, right: narrow ? 58 : 168, bottom: 40, left: narrow ? 36 : 52 };
  const xOf = year => m.left + ((year - firstYear) / (lastYear - firstYear)) * (width - m.left - m.right);
  const yOf = value => m.top + (1 - (Math.log2(value) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (height - m.top - m.bottom);
  const baseX = xOf(base.year);
  const lastX = xOf(lastYear);

  const lines = series.map(s => {
    const points = editions
      .filter(row => row[s.key] != null)
      .map(row => ({ year: row.year, x: xOf(row.year), y: yOf(indexOf(row, s.key)) }));
    const solid = points.filter(p => p.year >= base.year);
    const before = points.filter(p => p.year <= base.year);
    return { ...s, points, solid, before, d: smoothPath(solid) };
  });

  // End labels, nudged apart so they never stack on one another
  const gap = narrow ? 18 : 38;
  const ends = lines.map(line => ({ key: line.key, y: line.solid.at(-1).y })).sort((a, b) => a.y - b.y);
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
      const sparks = [...root.querySelectorAll(".tr-spark")];
      const clip = root.querySelector(".tr-clip");
      const lengths = paths.map(path => path.getTotalLength());
      const fullClip = Number(clip.getAttribute("width"));
      const state = { t: 0 };
      const draw = () => {
        paths.forEach((path, i) => {
          path.style.strokeDasharray = `${lengths[i]}`;
          path.style.strokeDashoffset = `${lengths[i] * (1 - state.t)}`;
          const point = path.getPointAtLength(lengths[i] * state.t);
          sparks[i].setAttribute("cx", point.x);
          sparks[i].setAttribute("cy", point.y);
          sparks[i].style.opacity = state.t > 0 && state.t < 1 ? 1 : 0;
        });
        clip.setAttribute("width", baseX + (fullClip - baseX) * state.t);
      };
      draw();
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: "top 85%", once: true } })
        .from(root.querySelectorAll(".tr-grid"), { opacity: 0, x: -20, duration: 0.6, stagger: 0.06, ease: "power2.out" })
        .from(root.querySelectorAll(".tr-before"), { opacity: 0, duration: 0.6 }, "-=0.3")
        .to(state, {
          t: 1,
          duration: 2.6,
          ease: "power2.inOut",
          onUpdate: draw,
          onComplete: () =>
            paths.forEach(path => {
              path.style.strokeDasharray = "";
              path.style.strokeDashoffset = "";
            })
        })
        .from(root.querySelectorAll(".tr-dot"), { scale: 0, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.03, ease: "back.out(3)" }, "-=1.4")
        .from(root.querySelectorAll(".tr-end"), { opacity: 0, x: -14, duration: 0.6, stagger: 0.1, ease: "power3.out" }, "-=0.4")
        .from(root.querySelectorAll(".tr-flow"), { opacity: 0, duration: 0.8 }, "-=0.3");
    });
    return () => mm.revert();
    // Once the plot has a size; later resizes keep what has already played
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width > 0]);

  // The nearest edition to the pointer
  const onPointerMove = event => {
    const box = plotRef.current.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * width;
    const nearest = editions.reduce((best, row) => (Math.abs(xOf(row.year) - x) < Math.abs(xOf(best.year) - x) ? row : best));
    setActiveYear(nearest.year);
  };

  const onKeyDown = event => {
    const index = active ? editions.indexOf(active) : editions.length - 1;
    const next = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: editions.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setActiveYear(editions[Math.min(Math.max(next, 0), editions.length - 1)].year);
  };

  const activeX = active && xOf(active.year);
  const tipLeft = activeX > width * 0.6;
  const leanOn = tilt(3);

  return (
    <Box component="section" aria-labelledby="cup-trends" sx={section}>
      <CupHeading id="cup-trends" title="Every year, a bigger" accent="arena." />

      <Box data-reveal sx={{ mt: { xs: 2, md: 3 }, perspective: "1400px" }}>
        <Box
          {...leanOn}
          onPointerLeave={event => {
            leanOn.onPointerLeave(event);
            setActiveYear(null);
          }}
          sx={{
            position: "relative",
            overflow: "hidden",
            isolation: "isolate",
            px: { xs: 1.5, sm: 3, md: 4 },
            pt: { xs: 3, md: 4 },
            pb: { xs: 2, md: 3 },
            borderRadius: { xs: "24px", md: "32px" },
            border: `1px solid ${faint}`,
            // A spotlight that follows the pointer, over a dot grid
            background: `radial-gradient(420px circle at var(--px, 70%) var(--py, 20%), rgba(242,170,76,0.16), transparent 70%),
              radial-gradient(rgba(15,26,22,0.09) 1px, transparent 1.2px) 0 0 / 24px 24px,
              linear-gradient(180deg, #fff, #fbfaf6)`,
            boxShadow: "0 50px 100px -60px rgba(15,26,22,0.45), inset 0 1px 0 #fff",
            transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
            transition: "transform 0.3s ease-out",
            "& .aura": {
              position: "absolute",
              zIndex: -1,
              width: "40%",
              aspectRatio: "1",
              borderRadius: "50%",
              filter: "blur(90px)",
              opacity: 0.35,
              pointerEvents: "none"
            },
            "& .tr-ping": { transformBox: "fill-box", transformOrigin: "center" },
            "@keyframes cup-trend-drift": {
              "0%": { transform: "rotate(0deg) translateX(20%) rotate(0deg)" },
              "100%": { transform: "rotate(360deg) translateX(20%) rotate(-360deg)" }
            },
            "@keyframes cup-trend-ping": { to: { transform: "scale(3.2)", opacity: 0 } },
            "@keyframes cup-trend-flow": { to: { strokeDashoffset: -240 } },
            "@media (prefers-reduced-motion: no-preference)": {
              "& .aura": { animation: "cup-trend-drift 18s linear infinite" },
              "& .aura:nth-of-type(2)": { animationDirection: "reverse", animationDuration: "24s" },
              "& .tr-ping": { animation: "cup-trend-ping 2.2s cubic-bezier(0,0,.2,1) infinite" },
              "& .tr-flow": { animation: "cup-trend-flow 4s linear infinite" }
            },
            // Data pulses only travel when things are allowed to move
            "@media (prefers-reduced-motion: reduce)": { "& .tr-flow": { display: "none" } }
          }}>
          <Box className="aura" sx={{ left: "-10%", top: "-30%", bgcolor: gold }} />
          <Box className="aura" sx={{ right: "-10%", bottom: "-40%", bgcolor: mint }} />
          <Box className="aura" sx={{ left: "40%", top: "30%", bgcolor: sky, opacity: "0.18 !important" }} />

          {/* The year in view, huge and hollow behind the plot */}
          <Typography
            key={shown.year}
            aria-hidden="true"
            sx={{
              position: "absolute",
              zIndex: -1,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: display,
              fontSize: { xs: "7rem", sm: "11rem", md: "16rem" },
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.06em",
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(15,26,22,0.07)",
              backgroundImage: "linear-gradient(180deg, rgba(242,170,76,0.10), transparent 75%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              pointerEvents: "none",
              userSelect: "none",
              "@keyframes cup-trend-ghost": { from: { opacity: 0, transform: "translate(-50%, -46%) scale(0.96)" } },
              "@media (prefers-reduced-motion: no-preference)": { animation: `cup-trend-ghost 0.5s ${ease}` }
            }}>
            {shown.year}
          </Typography>

          <Box
            ref={plotRef}
            role="group"
            tabIndex={0}
            aria-label={`Growth chart, showing ${shown.year}. Use the arrow keys to change the year.`}
            onPointerMove={onPointerMove}
            onKeyDown={onKeyDown}
            sx={{
              position: "relative",
              height,
              touchAction: "pan-y",
              outline: "none",
              borderRadius: "12px",
              "&:focus-visible": { outline: `2px solid ${gold}`, outlineOffset: 6 }
            }}>
            {width > 0 && (
              <svg width={width} height={height} style={{ display: "block", overflow: "visible" }} aria-hidden="true">
                <defs>
                  {lines.map(line => (
                    <filter key={line.key} id={`tr-glow-${line.key}`} x="-10%" y="-40%" width="120%" height="180%">
                      <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor={line.color} floodOpacity="0.45" />
                    </filter>
                  ))}
                  <filter id="tr-spark" x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur stdDeviation="4" />
                  </filter>
                  <clipPath id="tr-reveal">
                    <rect className="tr-clip" x="0" y="0" width={lastX + 12} height={height} />
                  </clipPath>
                  {lines.map(line => (
                    <linearGradient
                      key={line.key}
                      id={`tr-fill-${line.key}`}
                      gradientUnits="userSpaceOnUse"
                      x1="0"
                      y1={yOf(indexOf(latest, line.key))}
                      x2="0"
                      y2={yOf(1)}>
                      <stop offset="0" stopColor={line.color} stopOpacity="0.22" />
                      <stop offset="1" stopColor={line.color} stopOpacity="0" />
                    </linearGradient>
                  ))}
                  {lines.map(line => (
                    <linearGradient key={line.key} id={`tr-stroke-${line.key}`} gradientUnits="userSpaceOnUse" x1={baseX} x2={lastX} y1="0" y2="0">
                      <stop offset="0" stopColor={line.color} stopOpacity="0.45" />
                      <stop offset="1" stopColor={line.color} />
                    </linearGradient>
                  ))}
                </defs>

                {ticks.map(t => (
                  <g key={t} className="tr-grid">
                    <line
                      x1={m.left}
                      x2={width - m.right + (narrow ? 0 : 20)}
                      y1={yOf(t)}
                      y2={yOf(t)}
                      stroke={t === 1 ? "rgba(15,26,22,0.35)" : "rgba(15,26,22,0.1)"}
                      strokeDasharray={t === 1 ? "none" : "2 6"}
                    />
                    <text x={m.left - 10} y={yOf(t)} dy="0.35em" textAnchor="end" fill={muted} fontFamily={code} fontSize="11">
                      {t}×
                    </text>
                  </g>
                ))}

                {/* The years with no edition on record */}
                {!narrow && (
                  <text
                    className="tr-grid"
                    x={(xOf(firstYear) + baseX) / 2}
                    y={height - m.bottom - 10}
                    textAnchor="middle"
                    fill="rgba(15,26,22,0.4)"
                    fontFamily={code}
                    fontSize="10">
                    no data · 2020–21
                  </text>
                )}

                {activeX != null && (
                  <line x1={activeX} x2={activeX} y1={m.top - 14} y2={height - m.bottom} stroke={ink} strokeOpacity="0.4" strokeDasharray="3 4" />
                )}

                <g clipPath="url(#tr-reveal)">
                  {lines.map(line => (
                    <path
                      key={line.key}
                      d={`${line.d} L${line.solid.at(-1).x},${yOf(1)} L${line.solid[0].x},${yOf(1)} Z`}
                      fill={`url(#tr-fill-${line.key})`}
                      opacity={dim(focus, line.key, 0.1)}
                      style={{ transition: "opacity 0.3s ease", mixBlendMode: "multiply" }}
                    />
                  ))}
                </g>

                {lines.map(line => (
                  <g key={line.key} opacity={dim(focus, line.key, 0.15)} style={{ transition: "opacity 0.3s ease" }}>
                    {line.before.length > 1 && (
                      <path
                        className="tr-before"
                        d={`M${line.before[0].x},${line.before[0].y} L${line.before.at(-1).x},${line.before.at(-1).y}`}
                        fill="none"
                        stroke={line.color}
                        strokeWidth="2"
                        strokeDasharray="3 6"
                        strokeLinecap="round"
                        opacity="0.6"
                      />
                    )}
                    <path
                      className="tr-line"
                      d={line.d}
                      fill="none"
                      stroke={`url(#tr-stroke-${line.key})`}
                      strokeWidth={focus === line.key ? 4.5 : 3.5}
                      strokeLinecap="round"
                      filter={`url(#tr-glow-${line.key})`}
                    />
                    {/* Pulses of data running along the line toward today */}
                    <path
                      className="tr-flow"
                      d={line.d}
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="0.1 59.9"
                      opacity="0.95"
                    />
                  </g>
                ))}

                {lines.map(line =>
                  line.points.map(p => {
                    const on = p.year === active?.year;
                    const isLatest = p.year === lastYear;
                    return (
                      <g key={`${line.key}-${p.year}`} className="tr-dot" opacity={dim(focus, line.key, 0.15)}>
                        {isLatest && <circle className="tr-ping" cx={p.x} cy={p.y} r="6" fill="none" stroke={line.color} strokeWidth="2" />}
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={on ? 7.5 : isLatest ? 6 : 4.5}
                          fill={on || isLatest ? line.color : "#fff"}
                          stroke={on || isLatest ? "#fff" : line.color}
                          strokeWidth={on || isLatest ? 2.5 : 2}
                          style={{ transition: "r 0.2s ease" }}
                        />
                      </g>
                    );
                  })
                )}

                {/* Sparks that ride the tip of each line as it draws */}
                {lines.map(line => (
                  <circle key={line.key} className="tr-spark" r="10" fill={line.color} filter="url(#tr-spark)" opacity="0" cx="-99" cy="-99" />
                ))}

                {lines.map(line => (
                  <g key={line.key} className="tr-end" opacity={dim(focus, line.key, 0.25)}>
                    <text x={lastX + 16} y={endY[line.key]} dy={narrow ? "0.35em" : "-0.15em"} fill={line.color} fontSize={narrow ? 13 : 19} fontWeight="800">
                      {times(indexOf(latest, line.key))}
                    </text>
                    {!narrow && (
                      <text x={lastX + 16} y={endY[line.key]} dy="1.25em" fill={muted} fontFamily={code} fontSize="11">
                        {line.format(latest)} {line.unit}
                      </text>
                    )}
                  </g>
                ))}

                {editions.map(row => (
                  <text
                    key={row.year}
                    x={xOf(row.year)}
                    y={height - m.bottom + 24}
                    textAnchor="middle"
                    fill={row.year === shown.year ? ink : muted}
                    fontFamily={code}
                    fontSize={narrow ? 10 : 12}
                    fontWeight={row.year === shown.year ? 700 : 500}>
                    {narrow ? `'${String(row.year).slice(2)}` : row.year}
                  </text>
                ))}
              </svg>
            )}

            {active && (
              <Box
                aria-hidden="true"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: activeX,
                  transform: tipLeft ? "translateX(calc(-100% - 16px))" : "translateX(16px)",
                  minWidth: 210,
                  p: 1.75,
                  borderRadius: "16px",
                  bgcolor: "rgba(255,255,255,0.8)",
                  border: `1px solid ${faint}`,
                  backdropFilter: "blur(14px)",
                  boxShadow: "0 24px 50px -24px rgba(15,26,22,0.45)",
                  pointerEvents: "none",
                  transition: `left 0.25s ${ease}`
                }}>
                <Typography sx={{ fontFamily: code, fontSize: "0.8rem", fontWeight: 700, color: "#d48a1f" }}>{active.year}</Typography>
                {series.map(s => (
                  <Box key={s.key} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.75, fontSize: "0.85rem", color: ink }}>
                    <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color, flexShrink: 0 }} />
                    <Box component="span" sx={{ color: muted, flex: 1 }}>
                      {s.label}
                    </Box>
                    <Box component="span" sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                      {active[s.key] == null ? "—" : s.format(active)}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Typography sx={{ mt: 1.5, px: { xs: 0.5, md: 1 }, fontSize: "0.78rem", color: muted }}>
            1× is the {base.year} level. {base.year}&apos;s college count was recorded as 50+, so colleges&apos; growth is an upper bound.
            2019 had no college count.
          </Typography>
        </Box>
      </Box>

      <Box component="table" sx={visuallyHidden}>
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
                <td key={s.key}>{row[s.key] == null ? "Not recorded" : `${s.format(row)} (${times(indexOf(row, s.key))} the ${base.year} level)`}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Box>
    </Box>
  );
}
