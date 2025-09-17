import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Crop,
  PhotoSizeSelectLarge,
  FormatColorFill,
  BlurOn,
  Settings,
  Save,
  Close,
  Refresh,
} from "@mui/icons-material";
import {
  buildTransformationUrl,
  type TransformationOptions,
  type CloudinaryResource,
} from "../../services/cloudinary/cloudinaryService";

interface ImageTransformModalProps {
  open: boolean;
  image: CloudinaryResource | null;
  onClose: () => void;
  onSave: (transformedUrl: string) => void;
}

const ImageTransformModal: React.FC<ImageTransformModalProps> = ({
  open,
  image,
  onClose,
  onSave,
}) => {
  const [options, setOptions] = useState<TransformationOptions>({});
  const [transformedUrl, setTransformedUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (image && open) {
      console.log("Building URL for image:", image.public_id, "with options:", options);
      try {
        const url = buildTransformationUrl(image.public_id, options);
        console.log("Generated URL:", url);
        setTransformedUrl(url);
      } catch (error) {
        console.error("Error building transformation URL:", error);
        // Fallback to original image URL
        setTransformedUrl(image.secure_url);
      }
    }
  }, [image, options, open]);

  const updateOption = <K extends keyof TransformationOptions>(
    key: K,
    value: TransformationOptions[K]
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const resetTransformations = () => {
    setOptions({});
  };

  const applyPreset = (preset: string) => {

    const presets: Record<string, TransformationOptions> = {
      thumbnail: { width: 150, height: 150, crop: "thumb" },
      square: { width: 500, height: 500, crop: "crop", gravity: "center" },
      mobile: { width: 375, height: 667, crop: "fit" },
      web: { width: 1200, height: 800, crop: "fit" },
      blur: { effect: "blur:500" },
      grayscale: { effect: "grayscale" },
      sepia: { effect: "sepia" },
      brightness: { effect: "brightness:30" },
      contrast: { effect: "contrast:50" },
      saturation: { effect: "saturation:50" },
    };

    const presetOptions = presets[preset];

    if (presetOptions) {
      setOptions(presetOptions);
    } else {
      console.error("Preset not found:", preset);
    }
  };

  const handleSave = () => {
    if (!image || !transformedUrl) return;
    onSave(transformedUrl);
    onClose();
  };

  const hasTransformations = Object.keys(options).length > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: "80vh" }
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <PhotoSizeSelectLarge />
        Transform Image: {image?.public_id.split("/").pop()}
        <Box sx={{ flex: 1 }} />
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {/* Quick Presets */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Presets
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {[
                { key: "thumbnail", label: "Thumbnail", icon: "📏" },
                { key: "square", label: "Square", icon: "⬜" },
                { key: "mobile", label: "Mobile", icon: "📱" },
                { key: "web", label: "Web", icon: "💻" },
                { key: "blur", label: "Blur", icon: "🌫️" },
                { key: "grayscale", label: "B&W", icon: "⚫" },
                { key: "sepia", label: "Sepia", icon: "🟤" },
                { key: "brightness", label: "Bright", icon: "☀️" },
                { key: "contrast", label: "Contrast", icon: "🔆" },
                { key: "saturation", label: "Vivid", icon: "🌈" },
              ].map((preset) => (
                <Chip
                  key={preset.key}
                  label={`${preset.icon} ${preset.label}`}
                  onClick={() => applyPreset(preset.key)}
                  variant="outlined"
                  sx={{ cursor: "pointer" }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 3 }}>
            {/* Transformation Controls */}
            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: 2 }}>
                <Tabs
                  value={activeTab}
                  onChange={(_, newValue) => setActiveTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab icon={<Crop />} label="Crop" />
                  <Tab icon={<PhotoSizeSelectLarge />} label="Resize" />
                  <Tab icon={<FormatColorFill />} label="Format" />
                  <Tab icon={<BlurOn />} label="Effects" />
                  <Tab icon={<Settings />} label="Advanced" />
                </Tabs>

                <Box sx={{ mt: 2 }}>
                  {activeTab === 0 && (
                    <Box>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Crop Mode</InputLabel>
                        <Select
                          value={options.crop || ""}
                          onChange={(e) => updateOption("crop", e.target.value || undefined)}
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
                    </Box>
                  )}

                  {activeTab === 1 && (
                    <Box>
                      <TextField
                        fullWidth
                        label="Width"
                        type="number"
                        value={options.width || ""}
                        onChange={(e) => updateOption("width", e.target.value ? Number(e.target.value) : undefined)}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Height"
                        type="number"
                        value={options.height || ""}
                        onChange={(e) => updateOption("height", e.target.value ? Number(e.target.value) : undefined)}
                        sx={{ mb: 2 }}
                      />
                    </Box>
                  )}

                  {activeTab === 2 && (
                    <Box>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Format</InputLabel>
                        <Select
                          value={options.format || ""}
                          onChange={(e) => updateOption("format", e.target.value || undefined)}
                        >
                          <MenuItem value="">Original</MenuItem>
                          <MenuItem value="jpg">JPEG</MenuItem>
                          <MenuItem value="png">PNG</MenuItem>
                          <MenuItem value="webp">WebP</MenuItem>
                          <MenuItem value="avif">AVIF</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  )}

                  {activeTab === 3 && (
                    <Box>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Effect</InputLabel>
                        <Select
                          value={options.effect || ""}
                          onChange={(e) => updateOption("effect", e.target.value || undefined)}
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
                    </Box>
                  )}

                  {activeTab === 4 && (
                    <Box>
                      <TextField
                        fullWidth
                        label="Quality (1-100)"
                        type="number"
                        value={options.quality || ""}
                        onChange={(e) => updateOption("quality", e.target.value ? Number(e.target.value) : undefined)}
                        inputProps={{ min: 1, max: 100 }}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Angle (degrees)"
                        type="number"
                        value={options.angle || ""}
                        onChange={(e) => updateOption("angle", e.target.value ? Number(e.target.value) : undefined)}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Border Radius"
                        type="number"
                        value={options.radius || ""}
                        onChange={(e) => updateOption("radius", e.target.value ? Number(e.target.value) : undefined)}
                        sx={{ mb: 2 }}
                      />
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>

            {/* Preview */}
            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: 2, height: "100%" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">Preview</Typography>
                  <Box>
                    <Tooltip title="Reset all transformations">
                      <IconButton onClick={resetTransformations} color="secondary">
                        <Refresh />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 400,
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  {transformedUrl ? (
                    <img
                      src={transformedUrl}
                      alt="Transformed preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 400,
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        console.error("Image failed to load:", transformedUrl);
                        // Fallback to original image
                        if (image) {
                          e.currentTarget.src = image.secure_url;
                        }
                      }}
                    />
                  ) : (
                    <Typography color="text.secondary">
                      Select transformations to see preview
                    </Typography>
                  )}
                </Box>

                {hasTransformations && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Current transformations: {Object.entries(options)
                        .filter(([, value]) => value !== undefined && value !== "")
                        .map(([key, value]) => `${key}=${value}`)
                        .join(", ")}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<Save />}
          disabled={!hasTransformations}
        >
          Copy Transformed URL
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageTransformModal;