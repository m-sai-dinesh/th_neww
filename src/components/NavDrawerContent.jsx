import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Stack
} from "@mui/material";
import Link from "./Link";
import NavLabel from "./NavLabel";
import logo from "../assets/images/image.svg";

export default function NavDrawerContent({ items, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        color: "#1d1d1f",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2.5
      }}>
      <Stack direction="row" spacing={1} sx={{ px: 1, pt: 1, pb: 2.5 }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: "#FF5F56",
            boxShadow:
              "inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 2px rgba(0, 0, 0, 0.15)"
          }}
        />
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: "#FFBD2E",
            boxShadow:
              "inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 2px rgba(0, 0, 0, 0.15)"
          }}
        />
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: "#27C93F",
            boxShadow:
              "inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 2px rgba(0, 0, 0, 0.15)"
          }}
        />
      </Stack>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 1,
          pb: 2
        }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 245, 250, 0.75) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            boxShadow: "0 3px 10px rgba(0, 0, 0, 0.06), inset 0 1px 0 #ffffff"
          }}>
          <Box
            component="img"
            src={logo}
            alt="Turing Hut"
            sx={{ width: 22, height: 22, borderRadius: "50%" }}
          />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: "-0.02em"
          }}>
          Turing Hut
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(0, 0, 0, 0.08)",
          mb: 1.5
        }}
      />

      <List sx={{ px: 0, py: 0.5 }}>
        {items.map(({ text, Icon, path }) => (
          <Link key={text} to={path} style={{ textDecoration: "none" }}>
            {({ isActive }) => (
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  sx={{
                    borderRadius: "10px",
                    px: 2,
                    py: 1,
                    color: isActive ? "#000000" : "#2c2c2e",
                    bgcolor: isActive
                      ? "rgba(255, 255, 255, 0.9)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(0, 0, 0, 0.06)"
                      : "1px solid transparent",
                    boxShadow: isActive
                      ? "0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1)"
                      : "none",
                    transition: "all 0.2s cubic-bezier(0.25, 1, 0.5, 1)",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.65)",
                      transform: "translateX(2px)"
                    }
                  }}>
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive ? "#16654F" : "rgba(0, 0, 0, 0.55)"
                    }}>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<NavLabel text={text} active={isActive} />}
                    primaryTypographyProps={{ fontSize: "0.85rem" }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </Link>
        ))}
      </List>
    </Box>
  );
}
