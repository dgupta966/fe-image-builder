import React from "react";
import { FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface OptimizeTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const OptimizeTab: React.FC<OptimizeTabProps> = ({ options, updateOption }) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Optimization
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={options.auto_optimize || false}
            onChange={(e) =>
              updateOption("auto_optimize", e.target.checked)
            }
          />
        }
        label="Auto Optimize"
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={options.auto_format || false}
            onChange={(e) =>
              updateOption("auto_format", e.target.checked)
            }
          />
        }
        label="Auto Format"
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={options.progressive || false}
            onChange={(e) =>
              updateOption("progressive", e.target.checked)
            }
          />
        }
        label="Progressive JPEG"
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Device Pixel Ratio"
        type="number"
        value={options.dpr || ""}
        onChange={(e) =>
          updateOption(
            "dpr",
            e.target.value ? Number(e.target.value) : undefined
          )
        }
        inputProps={{ min: 0.5, max: 3, step: 0.1 }}
        sx={{ mb: 2 }}
      />
    </div>
  );
};

export default OptimizeTab;