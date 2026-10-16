import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import CodeIcon from "@mui/icons-material/Code";
import { CodeforcesColorIcon } from "./BrandIcons";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Skeleton,
  Typography
} from "@mui/material";
import { TEAM_PHOTO_SIZE } from "../data/teamImages";
import Image from "./Image";

const iconStyle = {
  transition: "background 0.2s ease-in-out, transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)"
  }
};

export default function TeamCard({
  name,
  img,
  hasImg,
  description,
  twitter,
  github,
  linkedin,
  website,
  cpprofile
}) {
  const profiles = [
    { href: twitter, Icon: XIcon, sx: iconStyle },
    { href: github, Icon: GitHubIcon, sx: { ...iconStyle, color: "#262626" } },
    {
      href: linkedin,
      Icon: LinkedInIcon,
      sx: { ...iconStyle, color: "#0A66C2" }
    },
    {
      href: website,
      Icon: LanguageIcon,
      sx: { ...iconStyle, color: "#595959" }
    },
    {
      href: cpprofile,
      Icon: cpprofile?.includes("codeforces") ? CodeforcesColorIcon : CodeIcon,
      sx: { ...iconStyle, color: "#262626" }
    }
  ];

  return (
    <Card
      sx={{
        maxWidth: 360,
        borderRadius: 3,
        boxShadow: 3,
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: 6
        }
      }}>
      {hasImg && (
        <Box
          sx={{
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            overflow: "hidden"
          }}>
          {img ? (
            <Image alt={name} image={img} />
          ) : (
            // same box as the photo, so the card doesn't resize when it loads
            <Skeleton
              variant="rectangular"
              animation="wave"
              aria-label={`Loading photo of ${name}`}
              sx={{
                width: "100%",
                maxWidth: TEAM_PHOTO_SIZE.width,
                height: "auto",
                aspectRatio: `${TEAM_PHOTO_SIZE.width} / ${TEAM_PHOTO_SIZE.height}`
              }}
            />
          )}
        </Box>
      )}
      <CardContent sx={{ textAlign: "center" }}>
        <Typography gutterBottom variant="h6" component="div" fontWeight={600}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <Box display="flex" justifyContent="center" gap={1} pb={2}>
        {profiles.map(
          ({ href, Icon, sx }, index) =>
            href && (
              <IconButton
                key={index}
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                sx={sx}>
                <Icon />
              </IconButton>
            )
        )}
      </Box>
    </Card>
  );
}
