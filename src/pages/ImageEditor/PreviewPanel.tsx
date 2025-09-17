import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  PreviewPanel as StyledPreviewPanel,
  PreviewImage,
  //   TransformationsInfo,
  LoadingPlaceholder,
} from "../../components/cloudinary/ImageTransformModal.styled";
import type {
  CloudinaryResource,
  TransformationOptions,
} from "../../services/cloudinary/cloudinaryService";

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
  //   options,
  //   activePreset,
  //   hasTransformations,
  //   onSave,
  //   onReset,
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
        bgcolor: "transparent",
      }}
    >
      <Box>
        {transformedUrl ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "transparent",
            }}
          >
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
                style={{ backgroundColor: "transparent" }}
              />
            </Box>
          </Box>
        ) : (
          <LoadingPlaceholder theme={theme}>
            <Typography>Select transformations to see preview</Typography>
          </LoadingPlaceholder>
        )}
      </Box>

      {/* {hasTransformations && (
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
      )} */}
    </StyledPreviewPanel>
  );
};

export default PreviewPanel;
