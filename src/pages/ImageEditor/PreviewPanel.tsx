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
        height: "calc(100vh - 87px)",
        overflow: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
      }}
    >
      <Box
        sx={{
          flex: 1,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "transparent",
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
              overflow: "hidden",
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
        ) : (
          <LoadingPlaceholder theme={theme}>
            <Typography>Select transformations to see preview</Typography>
          </LoadingPlaceholder>
        )}
      </Box>
    </StyledPreviewPanel>
  );
};

export default PreviewPanel;
