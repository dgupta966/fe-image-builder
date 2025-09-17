import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface CropTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const CropTab: React.FC<CropTabProps> = ({ options, updateOption }) => {
  return (
    <div>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Crop Mode</InputLabel>
        <Select
          value={options.crop || ""}
          onChange={(e) =>
            updateOption("crop", e.target.value || undefined)
          }
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="fill">Fill</MenuItem>
          <MenuItem value="crop">Crop</MenuItem>
          <MenuItem value="fit">Fit</MenuItem>
          <MenuItem value="scale">Scale</MenuItem>
          <MenuItem value="thumb">Thumbnail</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Gravity</InputLabel>
        <Select
          value={options.gravity || ""}
          onChange={(e) =>
            updateOption("gravity", e.target.value || undefined)
          }
        >
          <MenuItem value="">Auto</MenuItem>
          <MenuItem value="face">Face</MenuItem>
          <MenuItem value="center">Center</MenuItem>
          <MenuItem value="north">North</MenuItem>
          <MenuItem value="south">South</MenuItem>
          <MenuItem value="east">East</MenuItem>
          <MenuItem value="west">West</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default CropTab;