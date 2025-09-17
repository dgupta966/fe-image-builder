import React from "react";
import { Typography, Slider } from "@mui/material";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface AdjustTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const AdjustTab: React.FC<AdjustTabProps> = ({ options, updateOption }) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Color Adjustments
      </Typography>

      <Typography gutterBottom>Brightness</Typography>
      <Slider
        value={options.brightness || 0}
        onChange={(_, value) =>
          updateOption("brightness", value as number)
        }
        min={-100}
        max={100}
        step={1}
        valueLabelDisplay="auto"
        sx={{ mb: 3 }}
      />

      <Typography gutterBottom>Contrast</Typography>
      <Slider
        value={options.contrast || 0}
        onChange={(_, value) =>
          updateOption("contrast", value as number)
        }
        min={-100}
        max={100}
        step={1}
        valueLabelDisplay="auto"
        sx={{ mb: 3 }}
      />

      <Typography gutterBottom>Saturation</Typography>
      <Slider
        value={options.saturation || 0}
        onChange={(_, value) =>
          updateOption("saturation", value as number)
        }
        min={-100}
        max={100}
        step={1}
        valueLabelDisplay="auto"
        sx={{ mb: 3 }}
      />

      <Typography gutterBottom>Exposure</Typography>
      <Slider
        value={options.exposure || 0}
        onChange={(_, value) =>
          updateOption("exposure", value as number)
        }
        min={-100}
        max={100}
        step={1}
        valueLabelDisplay="auto"
        sx={{ mb: 3 }}
      />

      <Typography gutterBottom>Gamma</Typography>
      <Slider
        value={options.gamma || 0}
        onChange={(_, value) =>
          updateOption("gamma", value as number)
        }
        min={-50}
        max={50}
        step={1}
        valueLabelDisplay="auto"
        sx={{ mb: 2 }}
      />
    </div>
  );
};

export default AdjustTab;