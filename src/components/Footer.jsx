import { useEffect, useId, useRef } from "react";
import { Box, Typography } from "@mui/material";
import socialMediaItemsDefault, {
  socialMediaItems as socialMediaItemsNamed
} from "../data/socialMediaItems";
import Link from "./Link";
import { LocationColorIcon } from "./BrandIcons.jsx";

const socialMediaList = socialMediaItemsDefault || socialMediaItemsNamed || [];

// Dock magnification: tiles within RADIUS px of the cursor grow up to MAGNIFY×
const TILE = 44;
const MAGNIFY = 1.6;
const RADIUS = 150;
// Only where there is a real hover pointer and motion is welcome
const MAGNIFIES =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

const easeSpring = "cubic-bezier(0.32, 0.72, 0, 1)";

const palette = {
  ink: "#1d1d1f",
  muted: "rgba(29, 29, 31, 0.56)",
  accent: "#16654F",
  aura: "radial-gradient(40% 70% at 18% 60%, rgba(22, 101, 79, 0.22), transparent 70%), radial-gradient(35% 80% at 82% 40%, rgba(96, 165, 250, 0.22), transparent 70%), radial-gradient(30% 60% at 55% 90%, rgba(244, 114, 182, 0.12), transparent 70%)",
  panelBg:
    "linear-gradient(135deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.38) 45%, rgba(236, 246, 255, 0.48) 100%)",
  panelBorder: "rgba(255, 255, 255, 0.85)",
  panelShadow:
    "0 30px 60px -24px rgba(15, 23, 42, 0.18), 0 8px 24px -12px rgba(15, 23, 42, 0.08), inset 0 1.5px 1px rgba(255, 255, 255, 1), inset 0 -1px 1px rgba(255, 255, 255, 0.5)",
  sheen: "rgba(255, 255, 255, 0.7)",
  trayBg:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.25) 100%)",
  trayBorder: "rgba(255, 255, 255, 0.9)",
  trayShadow:
    "0 12px 30px -10px rgba(15, 23, 42, 0.2), inset 0 1px 1px rgba(255, 255, 255, 1), inset 0 -1px 1px rgba(15, 23, 42, 0.04)",
  tileBg:
    "linear-gradient(160deg, rgba(255, 255, 255, 0.98) 0%, rgba(244, 245, 247, 0.92) 100%)",
  tileShadow:
    "0 6px 14px -6px rgba(15, 23, 42, 0.28), 0 1px 2px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1)",
  icon: "#181717",
  label: "rgba(29, 29, 31, 0.82)",
  labelInk: "#ffffff"
};

function DockTile({ label, palette, children, ...props }) {
  return (
    <Box
      data-tile
      aria-label={label}
      {...props}
      sx={{
        // --m is the magnification, written by the dock on pointer move
        "--m": 1,
        position: "relative",
        flex: "none",
        display: "grid",
        placeItems: "center",
        width: `calc(${TILE}px * var(--m))`,
        height: `calc(${TILE}px * var(--m))`,
        borderRadius: "27%",
        background: palette.tileBg,
        boxShadow: palette.tileShadow,
        color: palette.icon,
        textDecoration: "none",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        transition: `width 0.18s ${easeSpring}, height 0.18s ${easeSpring}, transform 0.25s ${easeSpring}, box-shadow 0.25s ease`,
        // Glossy top-half reflection, like a glass app icon
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 52%)",
          opacity: 0.6,
          pointerEvents: "none"
        },
        "& svg": {
          width: "54%",
          height: "54%",
          filter: "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.12))"
        },
        "&:active": { transform: "scale(0.92)" },
        "&:focus-visible": {
          boxShadow: `${palette.tileShadow}, 0 0 0 3px ${palette.accent}`
        },
        // macOS-style name label above the tile
        "& .dock-label": {
          position: "absolute",
          bottom: "calc(100% + 12px)",
          left: "50%",
          px: 1.25,
          py: 0.5,
          borderRadius: "8px",
          bgcolor: palette.label,
          color: palette.labelInk,
          fontSize: "0.75rem",
          fontWeight: 500,
          letterSpacing: "-0.005em",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 8px 20px -6px rgba(0, 0, 0, 0.35)",
          opacity: 0,
          transform: "translate(-50%, 6px) scale(0.92)",
          transformOrigin: "bottom center",
          transition: `opacity 0.18s ease, transform 0.3s ${easeSpring}`
        },
        "&:hover .dock-label, &:focus-visible .dock-label": {
          opacity: 1,
          transform: "translate(-50%, 0) scale(1)"
        }
      }}>
      {children}
      <span className="dock-label" aria-hidden="true">
        {label}
      </span>
    </Box>
  );
}

/**
 * A rock pigeon flying toward the email address with a sealed envelope in
 * its beak, its dotted flight path trailing behind. Decorative only.
 */
function MailBird({ palette }) {
  const id = useId();
  const g = name => `${id}-${name}`;
  const url = name => `url(#${g(name)})`;

  return (
    <Box
      component="svg"
      viewBox="0 -16 300 136"
      aria-hidden="true"
      sx={{
        flex: "none",
        width: { xs: 150, md: 168 },
        height: "auto",
        overflow: "visible",
        // Stacked on phones: fly in from the left so the envelope lands
        // just above the address instead of over empty space
        transform: { xs: "translateX(-64px)", sm: "none" },
        "& *": { transformBox: "view-box" },
        "& .trail": { animation: "mailbird-trail 1.6s linear infinite" },
        "& .bird": { animation: "mailbird-bob 2.8s ease-in-out infinite" },
        // The wing beats up and down about the shoulder, and the body rises a
        // little on each downstroke; both share one beat so they stay in step
        "& .wing": {
          transformOrigin: "214px 67px",
          animation: "mailbird-flap 1s infinite"
        },
        "& .lift": { animation: "mailbird-lift 1s ease-in-out infinite" },
        "& .envelope": {
          transformOrigin: "262px 58px",
          animation: "mailbird-sway 2.8s ease-in-out infinite"
        },
        "@keyframes mailbird-trail": { to: { strokeDashoffset: 22 } },
        "@keyframes mailbird-bob": {
          "0%, 100%": { transform: "translateY(3px)" },
          "50%": { transform: "translateY(-4px)" }
        },
        // Raised above the back -> mirrored below the belly, foreshortening a
        // little as it sweeps toward the viewer. The downstroke is the power
        // stroke, so it takes 40% of the beat and the recovery the rest.
        "@keyframes mailbird-flap": {
          "0%, 100%": {
            transform: "scale(1, 1)",
            animationTimingFunction: "cubic-bezier(0.55, 0, 0.35, 1)"
          },
          "40%": {
            transform: "scale(0.9, -0.78)",
            animationTimingFunction: "cubic-bezier(0.4, 0, 0.5, 1)"
          }
        },
        "@keyframes mailbird-lift": {
          "0%, 100%": { transform: "translateY(0)" },
          "45%": { transform: "translateY(-2.5px)" }
        },
        "@keyframes mailbird-sway": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(4deg)" }
        },
        "@media (prefers-reduced-motion: reduce)": {
          "& *": { animation: "none !important" }
        }
      }}>
      <defs>
        <linearGradient id={g("body")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a3cfa8" />
          <stop offset="0.55" stopColor="#6fa982" />
          <stop offset="1" stopColor="#3f7c5c" />
        </linearGradient>
        <radialGradient id={g("head")} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#86ba92" />
          <stop offset="1" stopColor="#3d7a57" />
        </radialGradient>
        {/* Golden sheen on the neck and breast */}
        <linearGradient id={g("neck")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e0d272" />
          <stop offset="0.5" stopColor="#c4cf62" />
          <stop offset="1" stopColor="#8fb85a" />
        </linearGradient>
        {/* One wing: pale coverts at the shoulder darkening into the flight feathers */}
        <linearGradient
          id={g("wing")}
          gradientUnits="userSpaceOnUse"
          x1="226"
          y1="64"
          x2="184"
          y2="2">
          <stop offset="0" stopColor="#a8d0a9" />
          <stop offset="0.38" stopColor="#7fb48a" />
          <stop offset="0.62" stopColor="#3f7a5d" />
          <stop offset="1" stopColor="#1d3b31" />
        </linearGradient>
        {/* Tail with a dark terminal band */}
        <linearGradient id={g("tail")} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#76ad86" />
          <stop offset="0.75" stopColor="#5f9a73" />
          <stop offset="0.76" stopColor="#1f3d31" />
          <stop offset="1" stopColor="#17302a" />
        </linearGradient>
      </defs>

      {/* Dotted flight path: zero-length dashes with round caps are dots */}
      <path
        className="trail"
        d="M8 100 C 30 118, 54 114, 70 92 S 102 46, 126 60 S 148 80, 158 74"
        fill="none"
        stroke={palette.muted}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="0 11"
      />

      <g className="bird">
        <g className="lift">
          <path
            d="M186 70 C 176 66, 164 62, 152 60 Q 145 73, 151 88 C 164 86, 176 83, 186 80 Z"
            fill={url("tail")}
          />
          <path
            d="M186 72 L 152 66 M186 75 L 150 74 M186 78 L 152 82"
            stroke="#2f5c46"
            strokeOpacity="0.35"
            strokeWidth="0.8"
          />

          <path
            d="M238 50 C 226 52, 212 60, 198 64 C 192 66, 188 68, 184 70 L 185 80 C 198 87, 222 91, 240 87 C 252 84, 259 75, 257 64 C 256 58, 248 52, 238 50 Z"
            fill={url("body")}
          />
          {/* Feet tucked up in flight */}
          <path
            d="M214 88 l -7 5 M218 89 l -6 6"
            stroke="#e0806c"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M236 60 C 244 62, 252 66, 256 72 C 252 80, 244 82, 236 78 C 232 72, 232 64, 236 60 Z"
            fill={url("neck")}
            opacity="0.85"
          />

          <circle cx="247" cy="55" r="11.5" fill={url("head")} />
          <circle cx="250.5" cy="52.5" r="3" fill="#e9862b" />
          <circle cx="250.8" cy="52.5" r="1.5" fill="#111" />
          <circle cx="251.4" cy="51.8" r="0.5" fill="#fff" />

          {/* Sealed envelope, held at one corner in the beak */}
          <g className="envelope">
            <g transform="rotate(10 262 58)">
              <rect
                x="259"
                y="57"
                width="29"
                height="20"
                rx="2.2"
                fill="#fff"
                stroke="#1d1d1f"
                strokeOpacity="0.4"
                strokeWidth="1.1"
              />
              <path
                d="M260 58.3 L 273.5 68 L 287 58.3"
                fill="none"
                stroke="#1d1d1f"
                strokeOpacity="0.4"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
              {/* Wax seal */}
              <circle cx="273.5" cy="67.2" r="2.9" fill="#c8372d" />
            </g>
          </g>

          {/* Beak and its pale cere */}
          <path
            d="M256 53.5 C 260 54, 264 56, 267 58.5 C 263 59.5, 259 60, 256 59.5 Z"
            fill="#d9a441"
          />
          <path
            d="M255.5 53.2 C 257 52, 259.5 52.3, 260.5 54 C 259 54.8, 257 54.8, 255.5 53.2 Z"
            fill="#f3e6c4"
          />

          <g className="wing">
            {/* The whole wing as one shape, its feather tips scalloped along the trailing edge */}
            <path
              d="M228 66 C 231 50, 224 34, 212 24 C 206 16, 198 6, 188 -2 Q 189 6, 192 10 Q 184 8, 182 12 Q 186 18, 193 21 Q 183 21, 180 25 Q 187 30, 195 32 Q 185 33, 182 37 Q 189 41, 197 43 Q 188 45, 186 49 Q 192 52, 199 53 Q 192 56, 191 60 Q 196 64, 201 68 C 210 71, 220 70, 228 66 Z"
              fill={url("wing")}
              stroke="#1d3b31"
              strokeOpacity="0.3"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />
            {/* Feather separations, running from inside the wing out to each notch */}
            <path
              d="M206 26 L 192 10 M205 32 L 193 21 M206 38 L 195 32 M208 46 L 197 43 M209 55 L 199 53 M210 63 L 201 60"
              fill="none"
              stroke="#173128"
              strokeOpacity="0.35"
              strokeWidth="0.7"
              strokeLinecap="round"
            />
            {/* Light catching the leading edge */}
            <path
              d="M226 64 C 227 52, 221 40, 212 32"
              fill="none"
              stroke="#fff"
              strokeOpacity="0.35"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* The yellow wing bars of a green pigeon */}
            <path
              d="M210 37 Q 207.5 50, 212 63"
              fill="none"
              stroke="#e6d36e"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M205 40 Q 203 52, 206.5 65"
              fill="none"
              stroke="#e6d36e"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </g>
      </g>
    </Box>
  );
}

export default function Footer() {
  const panelRef = useRef(null);
  const dockRef = useRef(null);
  const frame = useRef(null);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // Cursor-following specular light on the glass, plus dock magnification.
  // Both are written straight to CSS variables, so nothing re-renders.
  const handlePointerMove = event => {
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const panel = panelRef.current;
      const box = panel.getBoundingClientRect();
      panel.style.setProperty("--mx", `${clientX - box.left}px`);
      panel.style.setProperty("--my", `${clientY - box.top}px`);
      panel.style.setProperty("--lit", "1");

      if (!window.matchMedia(MAGNIFIES).matches) return;
      const dock = dockRef.current.getBoundingClientRect();
      const near = clientY > dock.top - 60 && clientY < dock.bottom + 30;
      for (const tile of dockRef.current.querySelectorAll("[data-tile]")) {
        const rect = tile.getBoundingClientRect();
        const distance = Math.abs(clientX - (rect.left + rect.width / 2));
        const falloff =
          near && distance < RADIUS
            ? (Math.cos((Math.PI * distance) / RADIUS) + 1) / 2
            : 0;
        tile.style.setProperty("--m", (1 + (MAGNIFY - 1) * falloff).toFixed(3));
      }
    });
  };

  const handlePointerLeave = () => {
    cancelAnimationFrame(frame.current);
    panelRef.current.style.setProperty("--lit", "0");
    for (const tile of dockRef.current.querySelectorAll("[data-tile]")) {
      tile.style.setProperty("--m", "1");
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        isolation: "isolate",
        px: { xs: 1, sm: 2 },
        pt: { xs: 6, md: 8 },
        pb: { xs: 2, md: 3 },
        // Soft colour field behind the glass, so it has something to refract
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "10% 4% 0",
          zIndex: -1,
          background: palette.aura,
          filter: "blur(40px)",
          pointerEvents: "none"
        }
      }}>
      <Box
        ref={panelRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        sx={{
          "--mx": "50%",
          "--my": "0px",
          "--lit": 0,
          position: "relative",
          maxWidth: 1240,
          mx: "auto",
          px: { xs: 3, md: 5 },
          py: { xs: 3, md: 3.5 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: { xs: 3, md: 2 },
          textAlign: { xs: "center", md: "left" },
          borderRadius: { xs: "28px", md: "36px" },
          border: `1px solid ${palette.panelBorder}`,
          background: palette.panelBg,
          backdropFilter: "blur(30px) saturate(200%)",
          WebkitBackdropFilter: "blur(30px) saturate(200%)",
          boxShadow: palette.panelShadow,
          // Specular light that follows the cursor across the glass
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: `radial-gradient(420px circle at var(--mx) var(--my), ${palette.sheen}, transparent 60%)`,
            opacity: "var(--lit)",
            transition: "opacity 0.5s ease",
            pointerEvents: "none"
          },
          // Liquid highlight along the top edge
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "8%",
            right: "8%",
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${palette.panelBorder}, transparent)`,
            pointerEvents: "none"
          }
        }}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: { xs: 0, sm: 1 }
          }}>
          <MailBird palette={palette} />
          <Typography
            component="p"
            sx={{
              position: "relative",
              m: 0,
              color: palette.muted,
              fontSize: "0.95rem",
              fontWeight: 500,
              letterSpacing: "-0.01em"
            }}>
            Mail us at{" "}
            <Box
              component="a"
              href="mailto:turinghut@vnrvjiet.in"
              sx={{
                position: "relative",
                color: palette.ink,
                fontWeight: 600,
                textDecoration: "none",
                backgroundImage: `linear-gradient(${palette.accent}, ${palette.accent})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "0 100%",
                backgroundSize: "100% 1px",
                paddingBottom: "2px",
                transition: `color 0.25s ease, background-size 0.45s ${easeSpring}`,
                "&:hover, &:focus-visible": {
                  color: palette.accent,
                  backgroundSize: "100% 2px"
                },
                "&:focus-visible": {
                  outline: `2px solid ${palette.accent}`,
                  outlineOffset: "4px",
                  borderRadius: "4px"
                }
              }}>
              turinghut@vnrvjiet.in
            </Box>
          </Typography>
        </Box>

        {/* The dock: tiles grow upward out of the tray */}
        <Box
          ref={dockRef}
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            gap: 1,
            height: TILE + 16,
            px: 1,
            pb: 1,
            boxSizing: "border-box",
            borderRadius: "22px",
            border: `1px solid ${palette.trayBorder}`,
            background: palette.trayBg,
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow: palette.trayShadow
          }}>
          {socialMediaList.map(({ name, Icon, link }) => (
            <DockTile
              key={name}
              label={name}
              palette={palette}
              component="a"
              href={link}
              target="_blank"
              rel="noreferrer">
              <Icon />
            </DockTile>
          ))}

          <DockTile
            label="Contact Us"
            palette={palette}
            component={Link}
            to="/contact">
            <LocationColorIcon />
          </DockTile>
        </Box>
      </Box>
    </Box>
  );
}
