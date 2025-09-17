import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  PreviewPanel as StyledPreviewPanel,
  PreviewHeader,
  PreviewContainer,
  PreviewImage,
  TransformationsInfo,
  LoadingPlaceholder,
  StyledIconButton,
} from "../../components/cloudinary/ImageTransformModal.styled";
import { Save, Refresh, Settings } from "@mui/icons-material";
import type { CloudinaryResource, TransformationOptions } from "../../services/cloudinary/cloudinaryService";

interface PreviewPanelProps {
  image: CloudinaryResource;
  transformedUrl: string;
  options: TransformationOptions;
  activePreset: string | null;
  hasTransformations: boolean;
  onSave: () => void;
  onReset: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  image,
  transformedUrl,
  options,
  activePreset,
  hasTransformations,
  onSave,
  onReset,
}) => {
  const theme = useTheme();

  return (
    <StyledPreviewPanel
      theme={theme}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        position: "relative",
        bgcolor: theme.palette.mode === "dark" ? "#000" : "#000",
      }}
    >
      {/* overlay action buttons top-right */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 30,
          display: "flex",
          gap: 1,
        }}
      >
        <StyledIconButton theme={theme} onClick={onSave} color="primary">
          <Save />
        </StyledIconButton>
        <StyledIconButton theme={theme} onClick={onReset}>
          <Refresh />
        </StyledIconButton>
        <StyledIconButton theme={theme}>
          <Settings />
        </StyledIconButton>
      </Box>

      <PreviewHeader theme={theme} sx={{ px: 2 }}>
        <Typography variant="h6" sx={{ color: "#fff" }}>
          Preview
        </Typography>
      </PreviewHeader>

      <PreviewContainer
        theme={theme}
        sx={{
          bgcolor: "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {transformedUrl ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#000",
            }}
          >
            {/* letterbox wrapper */}
            <Box
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PreviewImage
                src={transformedUrl}
                alt="Transformed preview"
                theme={theme}
                onError={(e) => {
                  console.error("Image failed to load:", transformedUrl);
                  if (image) {
                    e.currentTarget.src = image.secure_url;
                  }
                }}
                style={{ backgroundColor: "#000" }}
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
              ? activePreset.charAt(0).toUpperCase() + activePreset.slice(1)
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
    </StyledPreviewPanel>
  );
};

export default PreviewPanel;