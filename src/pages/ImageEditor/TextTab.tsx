import React from "react";
import { TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface TextTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const TextTab: React.FC<TextTabProps> = ({ options, updateOption }) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Text Overlay
      </Typography>

      <TextField
        fullWidth
        label="Text"
        value={options.text || ""}
        onChange={(e) =>
          updateOption("text", e.target.value || undefined)
        }
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Font Family</InputLabel>
        <Select
          value={options.text_font_family || ""}
          onChange={(e) =>
            updateOption(
              "text_font_family",
              e.target.value || undefined
            )
          }
        >
          <MenuItem value="Arial">Arial</MenuItem>
          <MenuItem value="Helvetica">Helvetica</MenuItem>
          <MenuItem value="Times New Roman">
            Times New Roman
          </MenuItem>
          <MenuItem value="Courier New">Courier New</MenuItem>
          <MenuItem value="Impact">Impact</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Font Size"
        type="number"
        value={options.text_font_size || ""}
        onChange={(e) =>
          updateOption(
            "text_font_size",
            e.target.value ? Number(e.target.value) : undefined
          )
        }
        inputProps={{ min: 10, max: 200 }}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Text Color (Hex)"
        value={options.text_color || ""}
        onChange={(e) =>
          updateOption("text_color", e.target.value || undefined)
        }
        placeholder="#000000"
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Position</InputLabel>
        <Select
          value={options.text_position || ""}
          onChange={(e) =>
            updateOption(
              "text_position",
              e.target.value || undefined
            )
          }
        >
          <MenuItem value="north_west">Top Left</MenuItem>
          <MenuItem value="north">Top Center</MenuItem>
          <MenuItem value="north_east">Top Right</MenuItem>
          <MenuItem value="west">Middle Left</MenuItem>
          <MenuItem value="center">Center</MenuItem>
          <MenuItem value="east">Middle Right</MenuItem>
          <MenuItem value="south_west">Bottom Left</MenuItem>
          <MenuItem value="south">Bottom Center</MenuItem>
          <MenuItem value="south_east">Bottom Right</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default TextTab;