import { useId } from "react";
import { SvgIcon } from "@mui/material";

// Full-colour brand icons. GitHub uses currentColor so it stays visible on dark backgrounds.

export function GitHubColorIcon(props) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </SvgIcon>
  );
}

export function YouTubeColorIcon(props) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <rect x="0.5" y="4" width="23" height="16" rx="4.5" fill="#FF0000" />
      <path d="M9.6 8.4v7.2l6.2-3.6z" fill="#FFFFFF" />
    </SvgIcon>
  );
}

export function InstagramColorIcon(props) {
  const id = useId();
  const radial = `${id}-ig-radial`;
  const linear = `${id}-ig-linear`;
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <defs>
        <radialGradient id={radial} cx="0.27" cy="1.08" r="1.3">
          <stop offset="0" stopColor="#FFDD55" />
          <stop offset="0.1" stopColor="#FFDD55" />
          <stop offset="0.5" stopColor="#FF543E" />
          <stop offset="1" stopColor="#C837AB" />
        </radialGradient>
        <linearGradient id={linear} x1="0" y1="0" x2="0.6" y2="0.6">
          <stop offset="0" stopColor="#3771C8" />
          <stop offset="0.5" stopColor="#6600FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill={`url(#${radial})`} />
      <rect width="24" height="24" rx="6" fill={`url(#${linear})`} />
      <rect x="5.25" y="5.25" width="13.5" height="13.5" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
      <circle cx="16.1" cy="7.9" r="1" fill="#FFFFFF" />
    </SvgIcon>
  );
}

export function LinkedInColorIcon(props) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <circle cx="6.9" cy="6.7" r="1.8" fill="#FFFFFF" />
      <rect x="5.3" y="9.6" width="3.2" height="9.4" fill="#FFFFFF" />
      <path
        d="M10.9 9.6h3.05v1.3h.05c.43-.8 1.47-1.6 3-1.6 3.2 0 3.8 2.1 3.8 4.85V19h-3.2v-4.4c0-1.05-.02-2.4-1.46-2.4-1.47 0-1.7 1.14-1.7 2.32V19h-3.54z"
        fill="#FFFFFF"
      />
    </SvgIcon>
  );
}

export function LocationColorIcon(props) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path d="M12 1.5c-4.14 0-7.5 3.3-7.5 7.38 0 5.54 7.5 13.62 7.5 13.62s7.5-8.08 7.5-13.62C19.5 4.8 16.14 1.5 12 1.5z" fill="#EA4335" />
      <circle cx="12" cy="8.9" r="2.7" fill="#A50E0E" />
    </SvgIcon>
  );
}

export function CodeforcesColorIcon(props) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path
        d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.673 21 0 20.328 0 19.5V9c0-.828.673-1.5 1.5-1.5h3z"
        fill="#FFD43B"
      />
      <path
        d="M13.5 3c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.827 0-1.5-.672-1.5-1.5v-15c0-.828.673-1.5 1.5-1.5h3z"
        fill="#1F8ACB"
      />
      <path
        d="M22.5 10.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z"
        fill="#B81D13"
      />
    </SvgIcon>
  );
}

export function CodeforcesIcon(props) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path
        d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.673 21 0 20.328 0 19.5V9c0-.828.673-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.827 0-1.5-.672-1.5-1.5v-15c0-.828.673-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}
