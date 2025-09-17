import React from "react";
import { Box, Typography } from "@mui/material";
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
        height: "100%",
        overflow: "hidden",
        bgcolor: theme.palette.mode === "dark" ? "#0b1115" : "#fafafa",
        borderLeft: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        "@media (max-width: 1200px)": {
          flex: "0 0 200px",
          maxWidth: 200,
          minWidth: 150,
          height: "300px",
        },
        "@media (max-width: 768px)": {
          display: "none",
        },
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
        {[1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: "100%",
              height: 120,
              borderRadius: 1,
              overflow: "hidden",
              bgcolor: theme.palette.mode === "dark" ? "#071018" : "#fff",
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
