import React from "react";
import { Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PresetsContainer } from "../../components/cloudinary/ImageTransformModal.styled";

interface PresetsTabProps {
  activePreset: string | null;
  onApplyPreset: (preset: string) => void;
  onReset: () => void;
}

const PresetsTab: React.FC<PresetsTabProps> = ({
  activePreset,
  onApplyPreset,
  onReset,
}) => {
  const theme = useTheme();

  const presets = [
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
  ];

  return (
    <div>
      <PresetsContainer theme={theme}>
        {presets.map((preset) => (
          <Chip
            key={preset.key}
            label={`${preset.icon} ${preset.label}`}
            onClick={
              preset.key === "none"
                ? onReset
                : () => onApplyPreset(preset.key)
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
  );
};

export default PresetsTab;