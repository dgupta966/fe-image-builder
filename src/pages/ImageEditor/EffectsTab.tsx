import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface EffectsTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const EffectsTab: React.FC<EffectsTabProps> = ({ options, updateOption }) => {
  return (
    <div>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Effect</InputLabel>
        <Select
          value={options.effect || ""}
          onChange={(e) =>
            updateOption("effect", e.target.value || undefined)
          }
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="blur:500">Light Blur</MenuItem>
          <MenuItem value="blur:1000">Medium Blur</MenuItem>
          <MenuItem value="blur:2000">Heavy Blur</MenuItem>
          <MenuItem value="grayscale">Grayscale</MenuItem>
          <MenuItem value="sepia">Sepia</MenuItem>
          <MenuItem value="brightness:50">Brighten</MenuItem>
          <MenuItem value="brightness:-50">Darken</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default EffectsTab;