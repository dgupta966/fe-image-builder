import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { CloudinaryResource } from "../../services/cloudinary/cloudinaryService";

interface ThumbnailsPanelProps {
  image: CloudinaryResource;
}

const ThumbnailsPanel: React.FC<ThumbnailsPanelProps> = ({ image }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: "0 0 260px",
        maxWidth: 260,
        minWidth: 200,
        height: "calc(100vh - 240px)",
        overflow: "hidden",
        bgcolor:
          theme.palette.mode === "dark" ? "#0b1115" : "#fafafa",
        borderLeft: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Thumbnails
        </Typography>
        <Button size="small">Add</Button>
      </Box>
      <Box
        sx={{
          overflow: "auto",
          p: 2,
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 12,
        }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <Box
            key={i}
            sx={{
              width: "100%",
              height: 120,
              borderRadius: 1,
              overflow: "hidden",
              bgcolor:
                theme.palette.mode === "dark" ? "#071018" : "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={image.secure_url}
              alt={`thumb-${i}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ThumbnailsPanel;