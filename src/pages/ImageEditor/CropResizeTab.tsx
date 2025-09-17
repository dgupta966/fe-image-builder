import React from "react";
import { TextField, FormControl, InputLabel, Select, MenuItem, Box, IconButton, Divider, Tooltip } from "@mui/material";
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical } from "lucide-react";
import type { TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface CropResizeTabProps {
  options: TransformationOptions;
  updateOption: <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => void;
}

const CropResizeTab: React.FC<CropResizeTabProps> = ({ options, updateOption }) => {
  const [selectedAspectRatio, setSelectedAspectRatio] = React.useState("");

  React.useEffect(() => {
    // Sync selectedAspectRatio with options.aspectRatio
    if (options.aspectRatio) {
      setSelectedAspectRatio(options.aspectRatio);
    } else {
      setSelectedAspectRatio("");
    }
  }, [options.aspectRatio]);

  const aspectRatios = [
    { value: "", label: "Custom" },
    { value: "1:1", label: "Square (1:1)" },
    { value: "4:3", label: "Landscape (4:3)" },
    { value: "3:2", label: "Landscape (3:2)" },
    { value: "16:9", label: "Landscape (16:9)" },
    { value: "5:4", label: "Landscape (5:4)" },
    { value: "3:4", label: "Portrait (3:4)" },
    { value: "2:3", label: "Portrait (2:3)" },
    { value: "9:16", label: "Portrait (9:16)" },
    { value: "4:5", label: "Portrait (4:5)" },
  ];

  const handleAspectRatioChange = (aspectRatio: string) => {
    setSelectedAspectRatio(aspectRatio);
    
    if (aspectRatio === "") {
      // Custom - remove aspect ratio
      updateOption("aspectRatio", undefined);
      updateOption("crop", undefined);
    } else {
      // Set aspect ratio and crop mode
      updateOption("aspectRatio", aspectRatio);
      updateOption("crop", "crop");
    }
  };

  const handleRotate = (degrees: number) => {
    const currentAngle = options.angle || 0;
    const newAngle = (currentAngle + degrees) % 360;
    updateOption("angle", newAngle === 0 ? undefined : newAngle);
  };

  const handleFlip = (direction: "horizontal" | "vertical") => {
    if (direction === "horizontal") {
      updateOption("flip", !options.flip);
    } else {
      updateOption("flop", !options.flop);
    }
  };

  return (
    <div>
      <Divider sx={{ mb: 3 }} />

      {/* Resize Controls */}
      <TextField
        fullWidth
        label="Width"
        type="number"
        value={options.width || ""}
        onChange={(e) =>
          updateOption(
            "width",
            e.target.value ? Number(e.target.value) : undefined
          )
        }
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Height"
        type="number"
        value={options.height || ""}
        onChange={(e) =>
          updateOption(
            "height",
            e.target.value ? Number(e.target.value) : undefined
          )
        }
        sx={{ mb: 2 }}
      />

      {/* Crop Controls */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Aspect Ratio</InputLabel>
        <Select
          value={selectedAspectRatio}
          onChange={(e) => handleAspectRatioChange(e.target.value)}
        >
          {aspectRatios.map((ratio) => (
            <MenuItem key={ratio.value} value={ratio.value}>
              {ratio.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Gravity</InputLabel>
        <Select
          value={options.gravity || ""}
          onChange={(e) => updateOption("gravity", e.target.value || undefined)}
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

      <Box sx={{ mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Tooltip title="Rotate Left (-90°)">
            <IconButton
              onClick={() => handleRotate(-90)}
              size="small"
              sx={{
                bgcolor:
                  options.angle &&
                  (options.angle % 360 === 270 || options.angle % 360 === -90)
                    ? "primary.main"
                    : "transparent",
                color:
                  options.angle &&
                  (options.angle % 360 === 270 || options.angle % 360 === -90)
                    ? "white"
                    : "inherit",
                "&:hover": { bgcolor: "primary.main", color: "white" },
              }}
            >
              <RotateCcw size={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Rotate Right (+90°)">
            <IconButton
              onClick={() => handleRotate(90)}
              size="small"
              sx={{
                bgcolor:
                  options.angle &&
                  (options.angle % 360 === 90 || options.angle % 360 === -270)
                    ? "primary.main"
                    : "transparent",
                color:
                  options.angle &&
                  (options.angle % 360 === 90 || options.angle % 360 === -270)
                    ? "white"
                    : "inherit",
                "&:hover": { bgcolor: "primary.main", color: "white" },
              }}
            >
              <RotateCw size={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Flip Horizontal">
            <IconButton
              onClick={() => handleFlip("horizontal")}
              size="small"
              sx={{
                bgcolor: options.flip ? "primary.main" : "transparent",
                color: options.flip ? "white" : "inherit",
                "&:hover": { bgcolor: "primary.main", color: "white" },
              }}
            >
              <FlipHorizontal size={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Flip Vertical">
            <IconButton
              onClick={() => handleFlip("vertical")}
              size="small"
              sx={{
                bgcolor: options.flop ? "primary.main" : "transparent",
                color: options.flop ? "white" : "inherit",
                "&:hover": { bgcolor: "primary.main", color: "white" },
              }}
            >
              <FlipVertical size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </div>
  );
};

export default CropResizeTab;