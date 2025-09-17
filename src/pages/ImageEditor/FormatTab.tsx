import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface FormatTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const FormatTab: React.FC<FormatTabProps> = ({ options, updateOption }) => {
  return (
    <div>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Format</InputLabel>
        <Select
          value={options.format || ""}
          onChange={(e) =>
            updateOption("format", e.target.value || undefined)
          }
        >
          <MenuItem value="">Original</MenuItem>
          <MenuItem value="jpg">JPEG</MenuItem>
          <MenuItem value="png">PNG</MenuItem>
          <MenuItem value="webp">WebP</MenuItem>
          <MenuItem value="avif">AVIF</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default FormatTab;