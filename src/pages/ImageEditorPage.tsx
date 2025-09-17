import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Typography,
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
  Box,
  Button,
  IconButton,
} from "@mui/material";
import {
  Crop,
  PhotoSizeSelectLarge,
  FormatColorFill,
  BlurOn,
  Settings,
  Save,
  ArrowBack,
  Refresh,
  Filter,
  Tune,
  TextFields,
  Palette,
  Compress,
  Star,
} from "@mui/icons-material";
import {
  buildTransformationUrl,
  type TransformationOptions,
  type CloudinaryResource,
} from "../services/cloudinary/cloudinaryService";
import {
  ContentContainer,
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
  StyledIconButton,
  LoadingPlaceholder,
} from ".././components/cloudinary/ImageTransformModal.styled";

const ImageEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();

  const [options, setOptions] = useState<TransformationOptions>({});
  const [transformedUrl, setTransformedUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState(0);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const tabLabels = ["Presets", "Crop", "Resize", "Format", "Effects", "Filters", "Adjust", "Text", "Artistic", "Optimize", "Advanced"];
  const [image, setImage] = useState<CloudinaryResource | null>(null);
  const [loading, setLoading] = useState(true);

  // Get image data from URL parameters
  useEffect(() => {
    const publicId = searchParams.get("publicId");
    const secureUrl = searchParams.get("secureUrl");
    const format = searchParams.get("format") || "jpg";
    const width = parseInt(searchParams.get("width") || "0");
    const height = parseInt(searchParams.get("height") || "0");
    const bytes = parseInt(searchParams.get("bytes") || "0");

    if (publicId && secureUrl) {
      setImage({
        public_id: publicId,
        secure_url: secureUrl,
        url: secureUrl.replace("/upload/", "/upload/fl_lossy/"),
        format,
        width,
        height,
        bytes,
        created_at: new Date().toISOString(),
      });
    }
    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    if (image && options) {
      console.log(
        "Building URL for image:",
        image.public_id,
        "with options:",
        options
      );
      try {
        const url = buildTransformationUrl(image.public_id, options);
        console.log("Generated URL:", url);
        setTransformedUrl(url);
      } catch (error) {
        console.error("Error building transformation URL:", error);
        setTransformedUrl(image.secure_url);
      }
    }
  }, [image, options]);

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
      if (activePreset === preset) {
        setOptions({});
        setActivePreset(null);
      } else {
        setOptions(presetOptions);
        setActivePreset(preset);
      }
    } else {
      console.error("Preset not found:", preset);
    }
  };

  const handleSave = () => {
    if (!image || !transformedUrl) return;
    navigator.clipboard.writeText(transformedUrl);
    // Navigate back to cloudinary page
    navigate("/cloudinary");
  };

  const handleBack = () => {
    navigate("/cloudinary");
  };

  const hasTransformations = Object.keys(options).length > 0;

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Loading image editor...</Typography>
      </Box>
    );
  }

  if (!image) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Image not found</Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Back to Cloudinary
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{ minHeight: "100vh", width: "100%", bgcolor: "background.default" }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={handleBack} color="primary">
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" component="h1">
            Image Editor
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {image.public_id.split("/").pop()}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            startIcon={<Refresh />}
            onClick={resetTransformations}
            variant="outlined"
          >
            Reset
          </Button>
          <Button
            startIcon={<Save />}
            onClick={handleSave}
            variant="contained"
            disabled={!hasTransformations}
          >
            Copy URL
          </Button>
        </Box>
      </Box>

      <ContentContainer theme={theme}>


        <MainContent>
          {/* Left: Transformation Controls (fixed) with vertical icon rail */}
          <ControlsPanel
            theme={theme}
            sx={{
              flex: '0 0 320px',
              maxWidth: 320,
              minWidth: 240,
              height: 'calc(100vh - 240px)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              p: 0,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}><Typography variant="h6">Edit Tools</Typography></Box>
            <Box sx={{ display: 'flex', height: '100%' }}>
              {/* Narrow icon rail */}
              <Box sx={{ width: 72, bgcolor: theme.palette.background.default, display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, gap: 1, borderRight: '1px solid', borderColor: 'divider' }}>
                <Tooltip title="Presets">
                  <StyledIconButton onClick={() => setActiveTab(0)} theme={theme} sx={{ bgcolor: activeTab === 0 ? theme.palette.primary.main : 'transparent', color: activeTab === 0 ? 'white' : 'inherit' }}>
                    <Star />
                  </StyledIconButton>
                </Tooltip>
                <Tooltip title="Crop">
                  <StyledIconButton onClick={() => setActiveTab(1)} theme={theme} sx={{ bgcolor: activeTab === 1 ? theme.palette.primary.main : 'transparent', color: activeTab === 1 ? 'white' : 'inherit' }}>
                    <Crop />
                  </StyledIconButton>
                </Tooltip>
                <Tooltip title="Resize">
                  <StyledIconButton onClick={() => setActiveTab(2)} theme={theme} sx={{ bgcolor: activeTab === 2 ? theme.palette.primary.main : 'transparent', color: activeTab === 2 ? 'white' : 'inherit' }}>
                    <PhotoSizeSelectLarge />
                  </StyledIconButton>
                </Tooltip>
                <Tooltip title="Format">
                  <StyledIconButton onClick={() => setActiveTab(3)} theme={theme} sx={{ bgcolor: activeTab === 3 ? theme.palette.primary.main : 'transparent', color: activeTab === 3 ? 'white' : 'inherit' }}>
                    <FormatColorFill />
                  </StyledIconButton>
                </Tooltip>
                <Tooltip title="Effects">
                  <StyledIconButton onClick={() => setActiveTab(4)} theme={theme} sx={{ bgcolor: activeTab === 4 ? theme.palette.primary.main : 'transparent', color: activeTab === 4 ? 'white' : 'inherit' }}>
                    <BlurOn />
                  </StyledIconButton>
                </Tooltip>
                <Tooltip title="Filters">
                  <StyledIconButton onClick={() => setActiveTab(5)} theme={theme} sx={{ bgcolor: activeTab === 5 ? theme.palette.primary.main : 'transparent', color: activeTab === 5 ? 'white' : 'inherit' }}>
                    <Filter />
                  </StyledIconButton>
                </Tooltip>
                <Tooltip title="Adjust">
                  <StyledIconButton onClick={() => setActiveTab(6)} theme={theme} sx={{ bgcolor: activeTab === 6 ? theme.palette.primary.main : 'transparent', color: activeTab === 6 ? 'white' : 'inherit' }}>
                    <Tune />
                  </StyledIconButton>
                </Tooltip>
                <Tooltip title="Text">
                  <StyledIconButton onClick={() => setActiveTab(7)} theme={theme} sx={{ bgcolor: activeTab === 7 ? theme.palette.primary.main : 'transparent', color: activeTab === 7 ? 'white' : 'inherit' }}>
                    <TextFields />
                  </StyledIconButton>
                </Tooltip>
                <Tooltip title="Artistic">
                  <StyledIconButton onClick={() => setActiveTab(8)} theme={theme} sx={{ bgcolor: activeTab === 8 ? theme.palette.primary.main : 'transparent', color: activeTab === 8 ? 'white' : 'inherit' }}>
                    <Palette />
                  </StyledIconButton>
                </Tooltip>
                <Tooltip title="Optimize">
                  <StyledIconButton onClick={() => setActiveTab(9)} theme={theme} sx={{ bgcolor: activeTab === 9 ? theme.palette.primary.main : 'transparent', color: activeTab === 9 ? 'white' : 'inherit' }}>
                    <Compress />
                  </StyledIconButton>
                </Tooltip>
                <Tooltip title="Advanced">
                  <StyledIconButton onClick={() => setActiveTab(10)} theme={theme} sx={{ bgcolor: activeTab === 10 ? theme.palette.primary.main : 'transparent', color: activeTab === 10 ? 'white' : 'inherit' }}>
                    <Settings />
                  </StyledIconButton>
                </Tooltip>
                <Box sx={{ flex: 1 }} />
                <Tooltip title="Reset">
                  <StyledIconButton onClick={resetTransformations} theme={theme}>
                    <Refresh />
                  </StyledIconButton>
                </Tooltip>
              </Box>

              {/* Tools area (scrollable) */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>{/* keep existing controls inside */}
            <TabsContainer theme={theme}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>{tabLabels[activeTab]}</Typography>
            </TabsContainer>

            <TabContent theme={theme}>
              {activeTab === 0 && (
                <div>
                  <Typography variant="h6" gutterBottom>Presets</Typography>
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
                        onClick={
                          preset.key === "none"
                            ? resetTransformations
                            : () => applyPreset(preset.key)
                        }
                        variant={
                          activePreset === preset.key ||
                          (preset.key === "none" && !activePreset)
                            ? "filled"
                            : "outlined"
                        }
                        color={
                          activePreset === preset.key ||
                          (preset.key === "none" && !activePreset)
                            ? "primary"
                            : "default"
                        }
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
                </div>
              )}

              {activeTab === 1 && (
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
              )}

              {activeTab === 2 && (
                <div>
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
                </div>
              )}

              {activeTab === 3 && (
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
              )}

              {activeTab === 4 && (
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
              )}

              {activeTab === 5 && (
                <div>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Filters
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Sharpen</InputLabel>
                    <Select
                      value={options.sharpen || ""}
                      onChange={(e) =>
                        updateOption(
                          "sharpen",
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
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
                      onChange={(e) =>
                        updateOption("vignette", e.target.value || undefined)
                      }
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
                    onChange={(e) =>
                      updateOption(
                        "hue",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    inputProps={{ min: -180, max: 180 }}
                    sx={{ mb: 2 }}
                  />
                </div>
              )}

              {activeTab === 6 && (
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
              )}

              {activeTab === 7 && (
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
              )}

              {activeTab === 8 && (
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
              )}

              {activeTab === 9 && (
                <div>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Optimization
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={options.auto_optimize || false}
                        onChange={(e) =>
                          updateOption("auto_optimize", e.target.checked)
                        }
                      />
                    }
                    label="Auto Optimize"
                    sx={{ mb: 2 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={options.auto_format || false}
                        onChange={(e) =>
                          updateOption("auto_format", e.target.checked)
                        }
                      />
                    }
                    label="Auto Format"
                    sx={{ mb: 2 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={options.progressive || false}
                        onChange={(e) =>
                          updateOption("progressive", e.target.checked)
                        }
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
                    onChange={(e) =>
                      updateOption(
                        "dpr",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    inputProps={{ min: 0.5, max: 3, step: 0.1 }}
                    sx={{ mb: 2 }}
                  />
                </div>
              )}

              {activeTab === 10 && (
                <div>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Advanced Settings
                  </Typography>

                  <TextField
                    fullWidth
                    label="Quality (1-100)"
                    type="number"
                    value={options.quality || ""}
                    onChange={(e) =>
                      updateOption(
                        "quality",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    inputProps={{ min: 1, max: 100 }}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Angle (degrees)"
                    type="number"
                    value={options.angle || ""}
                    onChange={(e) =>
                      updateOption(
                        "angle",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Border Radius"
                    type="number"
                    value={options.radius || ""}
                    onChange={(e) =>
                      updateOption(
                        "radius",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Opacity (0-100)"
                    type="number"
                    value={options.opacity || ""}
                    onChange={(e) =>
                      updateOption(
                        "opacity",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    inputProps={{ min: 0, max: 100 }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Background Color (Hex)"
                    value={options.background || ""}
                    onChange={(e) =>
                      updateOption("background", e.target.value || undefined)
                    }
                    placeholder="#ffffff"
                    sx={{ mb: 2 }}
                  />
                </div>
              )}
            </TabContent>
              </Box>
            </Box>
          </ControlsPanel>

          {/* Center: Canvas / Preview (flexible) */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, height: 'calc(100vh - 240px)', overflow: 'hidden' }}>
            <PreviewPanel theme={theme} sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', bgcolor: theme.palette.mode === 'dark' ? '#000' : '#000' }}>
            {/* overlay action buttons top-right */}
            <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 30, display: 'flex', gap: 1 }}>
              <StyledIconButton theme={theme} onClick={handleSave} color="primary">
                <Save />
              </StyledIconButton>
              <StyledIconButton theme={theme} onClick={resetTransformations}>
                <Refresh />
              </StyledIconButton>
              <StyledIconButton theme={theme}>
                <Settings />
              </StyledIconButton>
            </Box>

            <PreviewHeader theme={theme} sx={{ px: 2 }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>Preview</Typography>
            </PreviewHeader>

            <PreviewContainer theme={theme} sx={{ bgcolor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {transformedUrl ? (
                <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#000' }}>
                  {/* letterbox wrapper */}
                  <Box sx={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <PreviewImage
                      src={transformedUrl}
                      alt="Transformed preview"
                      theme={theme}
                      onError={(e) => {
                        console.error('Image failed to load:', transformedUrl);
                        if (image) {
                          e.currentTarget.src = image.secure_url;
                        }
                      }}
                      style={{ backgroundColor: '#000' }}
                    />
                  </Box>
                </Box>
              ) : (
                <LoadingPlaceholder theme={theme}>
                  <Typography>Select transformations to see preview</Typography>
                </LoadingPlaceholder>
              )}
            </PreviewContainer>

            {hasTransformations && (
              <TransformationsInfo theme={theme}>
                <Typography variant="body2">
                  <strong>Active Preset:</strong>{" "}
                  {activePreset
                    ? activePreset.charAt(0).toUpperCase() +
                      activePreset.slice(1)
                    : "Custom"}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Current transformations:{" "}
                  {Object.entries(options)
                    .filter(([, value]) => value !== undefined && value !== "")
                    .map(([key, value]) => `${key}=${value}`)
                    .join(", ")}
                </Typography>
              </TransformationsInfo>
            )}
            </PreviewPanel>
          </Box>

          {/* Right: Thumbnails / Additional tools (fixed filmstrip) */}
          <Box sx={{ flex: '0 0 260px', maxWidth: 260, minWidth: 200, height: 'calc(100vh - 240px)', overflow: 'hidden', bgcolor: theme.palette.mode === 'dark' ? '#0b1115' : '#fafafa', borderLeft: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Thumbnails</Typography>
              <Button size="small">Add</Button>
            </Box>
            <Box sx={{ overflow: 'auto', p: 2, display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Box key={i} sx={{ width: '100%', height: 120, borderRadius: 1, overflow: 'hidden', bgcolor: theme.palette.mode === 'dark' ? '#071018' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={image.secure_url} alt={`thumb-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              ))}
            </Box>
          </Box>
        </MainContent>
      </ContentContainer>
    </Box>
  );
};

export default ImageEditorPage;
