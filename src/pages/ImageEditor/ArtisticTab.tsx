import React from "react";
import { FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Typography } from "@mui/material";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface ArtisticTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const ArtisticTab: React.FC<ArtisticTabProps> = ({ options, updateOption }) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Artistic Effects
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Cartoon Effect</InputLabel>
        <Select
          value={options.cartoonify || ""}
          onChange={(e) =>
            updateOption("cartoonify", e.target.value || undefined)
          }
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="bw">Black & White Cartoon</MenuItem>
          <MenuItem value="color">Color Cartoon</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Oil Paint</InputLabel>
        <Select
          value={options.oil_paint || ""}
          onChange={(e) =>
            updateOption(
              "oil_paint",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="30">Light</MenuItem>
          <MenuItem value="50">Medium</MenuItem>
          <MenuItem value="80">Heavy</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Pixelate</InputLabel>
        <Select
          value={options.pixelate || ""}
          onChange={(e) =>
            updateOption(
              "pixelate",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="3">Small Pixels</MenuItem>
          <MenuItem value="10">Medium Pixels</MenuItem>
          <MenuItem value="20">Large Pixels</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={options.sketch || false}
            onChange={(e) =>
              updateOption("sketch", e.target.checked)
            }
          />
        }
        label="Sketch Effect"
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={options.negate || false}
            onChange={(e) =>
              updateOption("negate", e.target.checked)
            }
          />
        }
        label="Negative Effect"
      />
    </div>
  );
};

export default ArtisticTab;