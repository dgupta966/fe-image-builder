import React from "react";
import { FormControl, InputLabel, Select, MenuItem, TextField, Typography } from "@mui/material";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface FiltersTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const FiltersTab: React.FC<FiltersTabProps> = ({ options, updateOption }) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Filters
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Sharpen</InputLabel>
        <Select
          value={options.sharpen || ""}
          onChange={(e) =>
            updateOption(
              "sharpen",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="50">Light</MenuItem>
          <MenuItem value="100">Medium</MenuItem>
          <MenuItem value="200">Strong</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Vignette</InputLabel>
        <Select
          value={options.vignette || ""}
          onChange={(e) =>
            updateOption("vignette", e.target.value || undefined)
          }
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="30">Light</MenuItem>
          <MenuItem value="50">Medium</MenuItem>
          <MenuItem value="80">Strong</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Hue Rotate (degrees)"
        type="number"
        value={options.hue || ""}
        onChange={(e) =>
          updateOption(
            "hue",
            e.target.value ? Number(e.target.value) : undefined
          )
        }
        inputProps={{ min: -180, max: 180 }}
        sx={{ mb: 2 }}
      />
    </div>
  );
};

export default FiltersTab;