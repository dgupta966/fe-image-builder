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
  Slider,
  Switch,
  FormControlLabel,
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
  Filter,
  Tune,
  TextFields,
  Palette,
  Compress,
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

      // New advanced presets
      vintage: { effect: "sepia", contrast: 20, brightness: -10 },
      dramatic: { contrast: 80, brightness: -20, saturation: 30 },
      warm: { brightness: 20, saturation: 40, hue: 15 },
      cool: { brightness: -10, saturation: 20, hue: -15 },
      high_contrast: { contrast: 100, brightness: 10 },
      soft_glow: { blur: 2, brightness: 15, saturation: 10 },
      cartoon: { cartoonify: "color" },
      sketch: { sketch: true },
      pixel_art: { pixelate: 10 },
      oil_painting: { oil_paint: 50 },
      vignette_soft: { vignette: "30" },
      vignette_strong: { vignette: "80" },
      sharpen_light: { sharpen: 50 },
      sharpen_strong: { sharpen: 200 },
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

        {/* Advanced Presets */}
        <PresetsSection theme={theme}>
          <Typography variant="h6" gutterBottom>
            Advanced Presets
          </Typography>
          <PresetsContainer theme={theme}>
            {[
              { key: "vintage", label: "Vintage", icon: "📜" },
              { key: "dramatic", label: "Dramatic", icon: "🎭" },
              { key: "warm", label: "Warm", icon: "🌅" },
              { key: "cool", label: "Cool", icon: "❄️" },
              { key: "high_contrast", label: "High Contrast", icon: "⚡" },
              { key: "soft_glow", label: "Soft Glow", icon: "✨" },
              { key: "cartoon", label: "Cartoon", icon: "🎨" },
              { key: "sketch", label: "Sketch", icon: "✏️" },
              { key: "pixel_art", label: "Pixel Art", icon: "🎮" },
              { key: "oil_painting", label: "Oil Paint", icon: "🎭" },
              { key: "vignette_soft", label: "Soft Vignette", icon: "🌑" },
              { key: "vignette_strong", label: "Strong Vignette", icon: "🌚" },
              { key: "sharpen_light", label: "Light Sharpen", icon: "🔍" },
              { key: "sharpen_strong", label: "Strong Sharpen", icon: "🔎" },
            ].map((preset) => (
              <Chip
                key={preset.key}
                label={`${preset.icon} ${preset.label}`}
                onClick={() => applyPreset(preset.key)}
                variant={activePreset === preset.key ? "filled" : "outlined"}
                color={activePreset === preset.key ? "primary" : "default"}
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
                <Tab icon={<Filter />} label="Filters" />
                <Tab icon={<Tune />} label="Adjust" />
                <Tab icon={<TextFields />} label="Text" />
                <Tab icon={<Palette />} label="Artistic" />
                <Tab icon={<Compress />} label="Optimize" />
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
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Filters
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Sharpen</InputLabel>
                    <Select
                      value={options.sharpen || ""}
                      onChange={(e) => updateOption("sharpen", e.target.value ? Number(e.target.value) : undefined)}
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
                      onChange={(e) => updateOption("vignette", e.target.value || undefined)}
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
                    onChange={(e) => updateOption("hue", e.target.value ? Number(e.target.value) : undefined)}
                    inputProps={{ min: -180, max: 180 }}
                    sx={{ mb: 2 }}
                  />
                </div>
              )}

              {activeTab === 5 && (
                <div>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Color Adjustments
                  </Typography>

                  <Typography gutterBottom>Brightness</Typography>
                  <Slider
                    value={options.brightness || 0}
                    onChange={(_, value) => updateOption("brightness", value as number)}
                    min={-100}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    sx={{ mb: 3 }}
                  />

                  <Typography gutterBottom>Contrast</Typography>
                  <Slider
                    value={options.contrast || 0}
                    onChange={(_, value) => updateOption("contrast", value as number)}
                    min={-100}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    sx={{ mb: 3 }}
                  />

                  <Typography gutterBottom>Saturation</Typography>
                  <Slider
                    value={options.saturation || 0}
                    onChange={(_, value) => updateOption("saturation", value as number)}
                    min={-100}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    sx={{ mb: 3 }}
                  />

                  <Typography gutterBottom>Exposure</Typography>
                  <Slider
                    value={options.exposure || 0}
                    onChange={(_, value) => updateOption("exposure", value as number)}
                    min={-100}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    sx={{ mb: 3 }}
                  />

                  <Typography gutterBottom>Gamma</Typography>
                  <Slider
                    value={options.gamma || 0}
                    onChange={(_, value) => updateOption("gamma", value as number)}
                    min={-50}
                    max={50}
                    step={1}
                    valueLabelDisplay="auto"
                    sx={{ mb: 2 }}
                  />
                </div>
              )}

              {activeTab === 6 && (
                <div>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Text Overlay
                  </Typography>

                  <TextField
                    fullWidth
                    label="Text"
                    value={options.text || ""}
                    onChange={(e) => updateOption("text", e.target.value || undefined)}
                    sx={{ mb: 2 }}
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Font Family</InputLabel>
                    <Select
                      value={options.text_font_family || ""}
                      onChange={(e) => updateOption("text_font_family", e.target.value || undefined)}
                    >
                      <MenuItem value="Arial">Arial</MenuItem>
                      <MenuItem value="Helvetica">Helvetica</MenuItem>
                      <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                      <MenuItem value="Courier New">Courier New</MenuItem>
                      <MenuItem value="Impact">Impact</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Font Size"
                    type="number"
                    value={options.text_font_size || ""}
                    onChange={(e) => updateOption("text_font_size", e.target.value ? Number(e.target.value) : undefined)}
                    inputProps={{ min: 10, max: 200 }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Text Color (Hex)"
                    value={options.text_color || ""}
                    onChange={(e) => updateOption("text_color", e.target.value || undefined)}
                    placeholder="#000000"
                    sx={{ mb: 2 }}
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Position</InputLabel>
                    <Select
                      value={options.text_position || ""}
                      onChange={(e) => updateOption("text_position", e.target.value || undefined)}
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
              )}

              {activeTab === 7 && (
                <div>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Artistic Effects
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Cartoon Effect</InputLabel>
                    <Select
                      value={options.cartoonify || ""}
                      onChange={(e) => updateOption("cartoonify", e.target.value || undefined)}
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
                      onChange={(e) => updateOption("oil_paint", e.target.value ? Number(e.target.value) : undefined)}
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
                      onChange={(e) => updateOption("pixelate", e.target.value ? Number(e.target.value) : undefined)}
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
                        onChange={(e) => updateOption("sketch", e.target.checked)}
                      />
                    }
                    label="Sketch Effect"
                    sx={{ mb: 2 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={options.negate || false}
                        onChange={(e) => updateOption("negate", e.target.checked)}
                      />
                    }
                    label="Negative Effect"
                  />
                </div>
              )}

              {activeTab === 8 && (
                <div>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Optimization
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={options.auto_optimize || false}
                        onChange={(e) => updateOption("auto_optimize", e.target.checked)}
                      />
                    }
                    label="Auto Optimize"
                    sx={{ mb: 2 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={options.auto_format || false}
                        onChange={(e) => updateOption("auto_format", e.target.checked)}
                      />
                    }
                    label="Auto Format"
                    sx={{ mb: 2 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={options.progressive || false}
                        onChange={(e) => updateOption("progressive", e.target.checked)}
                      />
                    }
                    label="Progressive JPEG"
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Device Pixel Ratio"
                    type="number"
                    value={options.dpr || ""}
                    onChange={(e) => updateOption("dpr", e.target.value ? Number(e.target.value) : undefined)}
                    inputProps={{ min: 0.5, max: 3, step: 0.1 }}
                    sx={{ mb: 2 }}
                  />
                </div>
              )}

              {activeTab === 9 && (
                <div>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Advanced Settings
                  </Typography>

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

                  <TextField
                    fullWidth
                    label="Opacity (0-100)"
                    type="number"
                    value={options.opacity || ""}
                    onChange={(e) => updateOption("opacity", e.target.value ? Number(e.target.value) : undefined)}
                    inputProps={{ min: 0, max: 100 }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Background Color (Hex)"
                    value={options.background || ""}
                    onChange={(e) => updateOption("background", e.target.value || undefined)}
                    placeholder="#ffffff"
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