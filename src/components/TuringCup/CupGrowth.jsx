import { useLayoutEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import contestdetails from "../../data/pastContests";
import NumberTicker from "../NumberTicker";
import CupHeading from "./CupHeading";
import { accent, code, faint, gold, ink, mint, muted, section } from "./cupStyles";

gsap.registerPlugin(ScrollTrigger);

const number = new Intl.NumberFormat("en-IN");

// Teams per edition from each edition's write-up, oldest first. Colleges are
// kept as written ("50+"), and left out where the write-up has no count.
const rows = contestdetails
  .map(({ year, info }) => {
    const teams = /(\d[\d,]*) teams/.exec(info);
    const colleges = /from (\d[\d,]*\+?) different colleges/.exec(info);
    return (
      teams && {
        year: Number(year),
        teams: Number(teams[1].replace(/,/g, "")),
        colleges: colleges?.[1] ?? null
      }
    );
  })
  .filter(Boolean)
  .sort((a, b) => a.year - b.year);
const first = rows[0];
const latest = rows.at(-1);
const peak = Math.max(...rows.map(row => row.teams));
const growth = Math.round((latest.teams / first.teams) * 10) / 10;

// The latest bar: gold and mint flowing up the column, seamless as it loops
const flow = `linear-gradient(0deg, ${gold}, #f59e0b 25%, ${mint} 50%, #f59e0b 75%, ${gold})`;

function Bar({ row, isLatest }) {
  const height = `${(row.teams / peak) * 100}%`;
  return (
    <Box
      tabIndex={0}
      role="img"
      aria-label={`${row.year}: ${number.format(row.teams)} teams${row.colleges ? ` from ${row.colleges} colleges` : ""}`}
      sx={{
        position: "relative",
        flex: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        outline: "none",
        cursor: "default",
        "&:hover .tip, &:focus-visible .tip": {
          opacity: 1,
          transform: "translate(-50%, 0)"
        },
        "&:hover .bar, &:focus-visible .bar": { filter: "brightness(1.08) saturate(1.2)" },
        "&:focus-visible .bar": { outline: `2px solid ${ink}`, outlineOffset: 3 }
      }}>
      {isLatest && (
        <Typography
          component="span"
          aria-hidden="true"
          sx={{
            mb: 1,
            fontFamily: code,
            fontSize: { xs: "0.85rem", md: "1rem" },
            fontWeight: 700,
            color: ink
          }}>
          <NumberTicker value={row.teams} duration={2200} />
        </Typography>
      )}
      <Box
        className="bar"
        sx={{
          width: "100%",
          maxWidth: 88,
          height,
          // 4px rounded data end, square on the baseline
          borderRadius: "4px 4px 0 0",
          transformOrigin: "bottom",
          transition: "filter 0.2s ease",
          ...(isLatest
            ? {
                backgroundImage: flow,
                backgroundSize: "100% 200%",
                boxShadow: `0 0 0 2px #fff, 0 20px 50px -12px ${gold}`,
                "@keyframes cup-bar": { to: { backgroundPosition: "0 -200%" } },
                "@media (prefers-reduced-motion: no-preference)": {
                  animation: "cup-bar 5s linear infinite"
                }
              }
            : { bgcolor: accent })
        }}
      />
      <Box
        className="tip"
        aria-hidden="true"
        sx={{
          position: "absolute",
          left: "50%",
          bottom: `calc(${height} + 14px)`,
          transform: "translate(-50%, 6px)",
          opacity: 0,
          zIndex: 2,
          px: 1.5,
          py: 1,
          borderRadius: "10px",
          bgcolor: ink,
          color: "#fff",
          fontFamily: code,
          fontSize: "0.78rem",
          lineHeight: 1.5,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          boxShadow: "0 12px 30px -10px rgba(15,26,22,0.5)",
          transition: "opacity 0.2s ease, transform 0.2s ease"
        }}>
        <Box component="span" sx={{ color: gold, fontWeight: 700 }}>
          {row.year}
        </Box>
        <br />
        {number.format(row.teams)} teams
        {row.colleges && (
          <>
            <br />
            {row.colleges} colleges
          </>
        )}
      </Box>
    </Box>
  );
}

function Stat({ value, suffix, label, decimals }) {
  return (
    <Box data-reveal sx={{ py: 2.5, borderTop: `1px solid ${faint}` }}>
      <Typography
        component="div"
        sx={{
          fontSize: { xs: "2.4rem", md: "3.2rem" },
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: ink
        }}>
        <NumberTicker
          value={value}
          format={decimals ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : undefined}
        />
        {suffix}
      </Typography>
      <Typography sx={{ mt: 0.75, fontSize: "0.95rem", color: muted }}>{label}</Typography>
    </Box>
  );
}

/** Registrations per edition, rising out of the floor as they come into view. */
export default function CupGrowth() {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(chartRef.current.querySelectorAll(".bar"), {
        scaleY: 0,
        duration: 1.4,
        ease: "elastic.out(1, 0.6)",
        stagger: 0.12,
        scrollTrigger: { trigger: chartRef.current, start: "top 75%", once: true }
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <Box component="section" aria-labelledby="cup-growth" sx={section}>
      <CupHeading
        id="cup-growth"
        kicker={`registrations --since ${first.year}`}
        title="Every year, a bigger"
        accent="arena."
        intro={`From ${number.format(first.teams)} teams in ${first.year} to ${number.format(latest.teams)} in ${latest.year}. Hover a bar for the year.`}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 280px" },
          gap: { xs: 4, md: 8 },
          alignItems: "end"
        }}>
        <Box data-reveal>
          <Box
            ref={chartRef}
            sx={{
              height: { xs: 240, md: 340 },
              display: "flex",
              alignItems: "flex-end",
              gap: { xs: 1, sm: 2, md: 3 },
              borderBottom: `1px solid ${ink}`
            }}>
            {rows.map(row => (
              <Bar key={row.year} row={row} isLatest={row === latest} />
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: { xs: 1, sm: 2, md: 3 }, mt: 1.25 }}>
            {rows.map(row => (
              <Typography
                key={row.year}
                aria-hidden="true"
                sx={{
                  flex: 1,
                  textAlign: "center",
                  fontFamily: code,
                  fontSize: { xs: "0.72rem", md: "0.85rem" },
                  fontWeight: row === latest ? 700 : 500,
                  color: row === latest ? ink : muted
                }}>
                {row.year}
              </Typography>
            ))}
          </Box>
          <Box component="table" sx={visuallyHidden}>
            <caption>Turing Cup registrations by year</caption>
            <thead>
              <tr>
                <th scope="col">Year</th>
                <th scope="col">Teams</th>
                <th scope="col">Colleges</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.year}>
                  <th scope="row">{row.year}</th>
                  <td>{row.teams}</td>
                  <td>{row.colleges ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </Box>
        </Box>
        <Box>
          <Stat value={latest.teams} label={`teams registered in ${latest.year}`} />
          <Stat value={Number.parseInt(latest.colleges, 10)} label={`colleges in the running in ${latest.year}`} />
          <Stat value={growth} suffix="×" decimals label={`growth since ${first.year}`} />
        </Box>
      </Box>
    </Box>
  );
}
