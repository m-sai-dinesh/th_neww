import { Box, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import XIcon from "@mui/icons-material/X";
import { TEAM_PHOTO_SIZE } from "../../data/teamImages";
import { accent, faint, ink, mono, muted } from "../../utils/designTokens";
import Image from "../Image";
import { CodeforcesColorIcon } from "../BrandIcons";

// Contest platforms, read from `cpprofile`
const CONTEST_PLATFORMS = [
  {
    host: "codeforces.com",
    short: "CF",
    name: "Codeforces",
    pattern: /\/profile\/([^/?#]+)/,
    Icon: CodeforcesColorIcon
  },
  {
    host: "codechef.com",
    short: "CC",
    name: "CodeChef",
    pattern: /\/users\/([^/?#]+)/
  },
  {
    host: "leetcode.com",
    short: "LC",
    name: "LeetCode",
    pattern: /\/(?:u\/)?([^/?#]+)\/?$/
  },
  {
    host: "atcoder.jp",
    short: "AC",
    name: "AtCoder",
    pattern: /\/users\/([^/?#]+)/
  }
];

// LinkedIn adds a random id to many profile slugs:
// "gautham-mallipeddi-80b2b4214" -> "gautham-mallipeddi" ("ksk-17" stays)
const cleanSlug = slug => slug.replace(/-(?=[a-z0-9]*\d)[a-z0-9]{5,}$/i, "");

// Where a handle can come from when there is no contest profile, in order
const SOCIAL_PLATFORMS = [
  {
    field: "github",
    host: "github.com",
    short: "GH",
    name: "GitHub",
    pattern: /^\/([^/?#]+)/
  },
  {
    field: "twitter",
    host: ["twitter.com", "x.com"],
    short: "X",
    name: "X",
    pattern: /^\/([^/?#]+)/
  },
  {
    field: "linkedin",
    host: "linkedin.com",
    short: "IN",
    name: "LinkedIn",
    pattern: /\/in\/([^/?#]+)/,
    clean: cleanSlug
  }
];

function parseHandle(url, platforms) {
  try {
    const { hostname, pathname } = new URL(url);
    const platform = platforms.find(({ host }) =>
      [host].flat().some(h => hostname.endsWith(h))
    );
    const raw = platform?.pattern.exec(pathname)?.[1];
    if (!platform || !raw) return null;
    const handle = decodeURIComponent(raw);
    return { ...platform, handle: platform.clean?.(handle) ?? handle };
  } catch {
    return null;
  }
}

/**
 * The handle a card shows: the contest profile if there is one (the club's
 * own currency), else GitHub, X or LinkedIn. `contest` tells them apart.
 */
function handleOf(member) {
  if (member.cpprofile) {
    const contest = parseHandle(member.cpprofile, CONTEST_PLATFORMS) ?? {
      short: "CP",
      name: "Competitive programming profile",
      handle: "profile"
    };
    return { ...contest, field: "cpprofile", contest: true };
  }
  for (const platform of SOCIAL_PLATFORMS) {
    const url = member[platform.field];
    const parsed = url && parseHandle(url, [platform]);
    if (parsed) return { ...parsed, contest: false };
  }
  return null;
}

const initialsOf = name =>
  name
    .replace(/^(mr|mrs|ms|dr)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join("");

const photoRatio = `${TEAM_PHOTO_SIZE.width} / ${TEAM_PHOTO_SIZE.height}`;

function Photo({ name, img, hasImg }) {
  if (img) {
    return (
      <Image
        alt={name}
        image={img}
        className="student-photo"
        style={{ display: "block", width: "100%" }}
      />
    );
  }
  if (hasImg) {
    return (
      <Box
        role="img"
        aria-label={`Loading photo of ${name}`}
        sx={{
          aspectRatio: photoRatio,
          background:
            "linear-gradient(110deg, #e9eeec 30%, #f5f8f7 50%, #e9eeec 70%) 0 0 / 300% 100%",
          "@media (prefers-reduced-motion: no-preference)": {
            animation: "student-shimmer 1.4s linear infinite"
          }
        }}
      />
    );
  }
  return (
    <Box
      aria-hidden="true"
      sx={{
        aspectRatio: photoRatio,
        display: "grid",
        placeItems: "center",
        background: `radial-gradient(90% 80% at 30% 20%, #2a8a6c, ${accent} 45%, #0b3a2c)`,
        color: "rgba(255,255,255,0.92)",
        fontSize: "3.5rem",
        fontWeight: 700,
        letterSpacing: "-0.04em"
      }}>
      {initialsOf(name)}
    </Box>
  );
}

function IconLink({ href, label, children }) {
  return (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      sx={{
        display: "grid",
        placeItems: "center",
        width: 34,
        height: 34,
        borderRadius: "10px",
        color: muted,
        border: `1px solid ${faint}`,
        transition:
          "color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease",
        "& svg": { fontSize: 18 },
        "&:hover": { color: "#fff", bgcolor: accent, borderColor: accent },
        "&:focus-visible": { outline: `2px solid ${accent}`, outlineOffset: 2 }
      }}>
      {children}
    </Box>
  );
}

/**
 * A student coordinator: photo with name and role over it, a handle (contest
 * profile first, else a social one) and their other profiles. `featured` cards (leads) set the name larger.
 */
export default function StudentCard({
  member,
  img,
  hasImg,
  featured = false,
  index = 0
}) {
  const { name, designation, linkedin, github, website, twitter } = member;
  const handle = handleOf(member);
  // the profile behind the handle chip gets no second, icon link
  const socials = [
    {
      field: "linkedin",
      href: linkedin,
      label: "LinkedIn",
      Icon: LinkedInIcon
    },
    { field: "github", href: github, label: "GitHub", Icon: GitHubIcon },
    {
      field: "website",
      href: website,
      label: "Website",
      Icon: LanguageRoundedIcon
    },
    { field: "twitter", href: twitter, label: "X", Icon: XIcon }
  ].filter(({ field, href }) => href && field !== handle?.field);
  const hasFooter = handle || socials.length > 0;

  return (
    <Box
      component="article"
      aria-label={`${name}, ${designation}`}
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "20px",
        overflow: "hidden",
        bgcolor: "#fff",
        border: `1px solid ${faint}`,
        boxShadow: "0 1px 2px rgba(15,26,22,0.04)",
        transition:
          "transform 0.3s cubic-bezier(.2,.7,.2,1), box-shadow 0.3s ease",
        // the photo spans the card, whatever the card's width
        "& .student-photo .image-sizer": { width: "100%", height: "auto" },
        "& .student-photo img": {
          transition:
            "transform 0.8s cubic-bezier(.2,.7,.2,1), opacity 0.25s linear"
        },
        "&:hover, &:focus-within": {
          transform: "translateY(-4px)",
          boxShadow: "0 28px 50px -28px rgba(15,26,22,0.45)",
          "& .student-photo img": { transform: "scale(1.04)" }
        },
        "@media (prefers-reduced-motion: no-preference)": {
          animation: "student-in 0.5s cubic-bezier(.2,.7,.2,1) both",
          animationDelay: `${Math.min(index, 12) * 40}ms`
        },
        "@media (prefers-reduced-motion: reduce)": {
          "&, & .student-photo img": { transition: "none" },
          "&:hover, &:focus-within": { transform: "none" }
        }
      }}>
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <Photo name={name} img={img} hasImg={hasImg} />
        <Box
          sx={{
            position: "absolute",
            inset: "auto 0 0 0",
            px: { xs: 1.5, sm: 2 },
            pt: 6,
            pb: { xs: 1.5, sm: 1.75 },
            background:
              "linear-gradient(to top, rgba(10,20,16,0.88) 15%, rgba(10,20,16,0.5) 55%, rgba(10,20,16,0))",
            color: "#fff"
          }}>
          <Typography
            component="h4"
            sx={{
              fontSize: featured
                ? { xs: "1.1rem", sm: "1.3rem" }
                : { xs: "0.95rem", sm: "1.05rem" },
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              textShadow: "0 1px 2px rgba(0,0,0,0.35)"
            }}>
            {name}
          </Typography>
          <Typography
            sx={{
              mt: 0.25,
              fontSize: { xs: "0.75rem", sm: "0.8rem" },
              color: "rgba(255,255,255,0.78)"
            }}>
            {designation}
          </Typography>
        </Box>
      </Box>

      {hasFooter && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            // icons drop to their own row before they squeeze the handle
            flexWrap: "wrap",
            gap: 1,
            px: { xs: 1.25, sm: 1.5 },
            py: 1.25,
            mt: "auto"
          }}>
          {handle ? (
            <Box
              component="a"
              href={member[handle.field]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on ${handle.name}`}
              title={`${handle.name}: ${handle.handle}`}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                flex: "0 1 auto",
                minWidth: 88,
                maxWidth: "100%",
                borderRadius: "8px",
                overflow: "hidden",
                fontFamily: mono,
                fontSize: "0.72rem",
                textDecoration: "none",
                border: `1px solid ${handle.contest ? "rgba(22,101,79,0.25)" : faint}`,
                transition: "border-color 0.2s ease",
                "&:hover": { borderColor: handle.contest ? accent : ink },
                "&:focus-visible": {
                  outline: `2px solid ${accent}`,
                  outlineOffset: 2
                }
              }}>
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  px: handle.Icon ? 0.6 : 0.75,
                  py: 0.5,
                  bgcolor: handle.Icon
                    ? "rgba(22,101,79,0.08)"
                    : handle.contest
                      ? accent
                      : ink,
                  color: "#fff",
                  fontWeight: 700,
                  lineHeight: 1,
                  borderRight: handle.Icon
                    ? `1px solid ${handle.contest ? "rgba(22,101,79,0.18)" : faint}`
                    : "none"
                }}>
                {handle.Icon ? (
                  <handle.Icon
                    sx={{
                      fontSize: "0.95rem",
                      display: "block"
                    }}
                  />
                ) : (
                  handle.short
                )}
              </Box>
              <Box
                component="span"
                sx={{
                  px: 0.75,
                  py: 0.5,
                  color: ink,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}>
                {handle.handle}
              </Box>
            </Box>
          ) : (
            <span />
          )}
          {socials.length > 0 && (
            <Box sx={{ display: "flex", flexShrink: 0, gap: 0.75, ml: "auto" }}>
              {socials.map(({ href, label, Icon }) => (
                <IconLink key={label} href={href} label={`${name} on ${label}`}>
                  <Icon />
                </IconLink>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
