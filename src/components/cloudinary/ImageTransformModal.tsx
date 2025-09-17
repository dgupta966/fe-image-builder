import React, { useState, useEffect } from "react";
import {
  Typography,
  Tabs,
  Tab,
  Tooltip,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
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
import {
  StyledDialog,
  DialogHeader,
  HeaderTitle,
  ContentContainer,
  PresetsSection,
  PresetsContainer,
  MainContent,
  ControlsPanel,
  TabsContainer,
  TabContent,
  PreviewPanel,
  PreviewHeader,
  PreviewContainer,
  PreviewImage,
  TransformationsInfo,
  DialogFooter,
  PrimaryButton,
  SecondaryButton,
  StyledIconButton,
  LoadingPlaceholder,
} from "./ImageTransformModal.styled";

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
  const theme = useTheme();
  const [options, setOptions] = useState<TransformationOptions>({});
  const [transformedUrl, setTransformedUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState(0);
  const [activePreset, setActivePreset] = useState<string | null>(null);

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
    setActivePreset(null);
  };

  const applyPreset = (preset: string) => {
    if (preset === "none") {
      resetTransformations();
      return;
    }

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
      // If clicking the same preset, deselect it
      if (activePreset === preset) {
        setOptions({});
        setActivePreset(null);
      } else {
        // Apply new preset
        setOptions(presetOptions);
        setActivePreset(preset);
      }
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
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      theme={theme}
    >
      <DialogHeader theme={theme}>
        <HeaderTitle theme={theme}>
          <PhotoSizeSelectLarge />
          <Typography>
            Transform Image: {image?.public_id.split("/").pop()}
          </Typography>
        </HeaderTitle>
        <StyledIconButton onClick={onClose} size="small" theme={theme}>
          <Close />
        </StyledIconButton>
      </DialogHeader>

      <ContentContainer theme={theme}>
        {/* Quick Presets */}
        <PresetsSection theme={theme}>
          <Typography variant="h6" gutterBottom>
            Quick Presets
          </Typography>
          <PresetsContainer theme={theme}>
            {[
              { key: "none", label: "None", icon: "❌" },
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
                onClick={() => preset.key === "none" ? resetTransformations() : applyPreset(preset.key)}
                variant={(activePreset === preset.key || (preset.key === "none" && !activePreset)) ? "filled" : "outlined"}
                color={(activePreset === preset.key || (preset.key === "none" && !activePreset)) ? "primary" : "default"}
                sx={{
                  cursor: "pointer",
                  minWidth: "fit-content",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: theme.shadows[2],
                  },
                }}
              />
            ))}
          </PresetsContainer>
        </PresetsSection>

        <MainContent>
          {/* Transformation Controls */}
          <ControlsPanel theme={theme}>
            <TabsContainer theme={theme}>
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
            </TabsContainer>

            <TabContent theme={theme}>
              {activeTab === 0 && (
                <div>
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
                </div>
              )}

              {activeTab === 1 && (
                <div>
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
                </div>
              )}

              {activeTab === 2 && (
                <div>
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
                </div>
              )}

              {activeTab === 3 && (
                <div>
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
                </div>
              )}

              {activeTab === 4 && (
                <div>
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
                </div>
              )}
            </TabContent>
          </ControlsPanel>

          {/* Preview */}
          <PreviewPanel theme={theme}>
            <PreviewHeader theme={theme}>
              <Typography variant="h6">Preview</Typography>
              <Tooltip title="Reset all transformations">
                <StyledIconButton onClick={resetTransformations} color="secondary" theme={theme}>
                  <Refresh />
                </StyledIconButton>
              </Tooltip>
            </PreviewHeader>

            <PreviewContainer theme={theme}>
              {transformedUrl ? (
                <PreviewImage
                  src={transformedUrl}
                  alt="Transformed preview"
                  theme={theme}
                  onError={(e) => {
                    console.error("Image failed to load:", transformedUrl);
                    // Fallback to original image
                    if (image) {
                      e.currentTarget.src = image.secure_url;
                    }
                  }}
                />
              ) : (
                <LoadingPlaceholder theme={theme}>
                  <Typography>Select transformations to see preview</Typography>
                </LoadingPlaceholder>
              )}
            </PreviewContainer>

            {hasTransformations && (
              <TransformationsInfo theme={theme}>
                <Typography variant="body2">
                  <strong>Active Preset:</strong> {activePreset ? activePreset.charAt(0).toUpperCase() + activePreset.slice(1) : 'Custom'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Current transformations: {Object.entries(options)
                    .filter(([, value]) => value !== undefined && value !== "")
                    .map(([key, value]) => `${key}=${value}`)
                    .join(", ")}
                </Typography>
              </TransformationsInfo>
            )}
          </PreviewPanel>
        </MainContent>
      </ContentContainer>

      <DialogFooter theme={theme}>
        <SecondaryButton onClick={onClose} theme={theme}>
          Cancel
        </SecondaryButton>
        <PrimaryButton
          onClick={handleSave}
          startIcon={<Save />}
          disabled={!hasTransformations}
          theme={theme}
        >
          Copy Transformed URL
        </PrimaryButton>
      </DialogFooter>
    </StyledDialog>
  );
};

export default ImageTransformModal;