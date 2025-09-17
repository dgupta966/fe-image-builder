import React from "react";
import { Typography, Box, Button, IconButton } from "@mui/material";
import { ArrowBack, Refresh, Save } from "@mui/icons-material";

interface HeaderProps {
  imageName: string;
  hasTransformations: boolean;
  onBack: () => void;
  onReset: () => void;
  onSave: () => void;
}

const Header: React.FC<HeaderProps> = ({
  imageName,
  hasTransformations,
  onBack,
  onReset,
  onSave,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 3,
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={onBack} color="primary">
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" component="h1">
          Image Editor
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {imageName}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          startIcon={<Refresh />}
          onClick={onReset}
          variant="outlined"
        >
          Reset
        </Button>
        <Button
          startIcon={<Save />}
          onClick={onSave}
          variant="contained"
          disabled={!hasTransformations}
        >
          Copy URL
        </Button>
      </Box>
    </Box>
  );
};

export default Header;