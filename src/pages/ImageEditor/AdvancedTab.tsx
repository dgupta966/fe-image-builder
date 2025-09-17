import React from "react";
import { TextField, Typography } from "@mui/material";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface AdvancedTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const AdvancedTab: React.FC<AdvancedTabProps> = ({ options, updateOption }) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Advanced Settings
      </Typography>

      <TextField
        fullWidth
        label="Quality (1-100)"
        type="number"
        value={options.quality || ""}
        onChange={(e) =>
          updateOption(
            "quality",
            e.target.value ? Number(e.target.value) : undefined
          )
        }
        inputProps={{ min: 1, max: 100 }}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Angle (degrees)"
        type="number"
        value={options.angle || ""}
        onChange={(e) =>
          updateOption(
            "angle",
            e.target.value ? Number(e.target.value) : undefined
          )
        }
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Border Radius"
        type="number"
        value={options.radius || ""}
        onChange={(e) =>
          updateOption(
            "radius",
            e.target.value ? Number(e.target.value) : undefined
          )
        }
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Opacity (0-100)"
        type="number"
        value={options.opacity || ""}
        onChange={(e) =>
          updateOption(
            "opacity",
            e.target.value ? Number(e.target.value) : undefined
          )
        }
        inputProps={{ min: 0, max: 100 }}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Background Color (Hex)"
        value={options.background || ""}
        onChange={(e) =>
          updateOption("background", e.target.value || undefined)
        }
        placeholder="#ffffff"
        sx={{ mb: 2 }}
      />
    </div>
  );
};

export default AdvancedTab;