import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Snackbar, Alert } from "@mui/material";
import {
  deleteImage,
  editImage,
  saveImage,
  getImages,
  type CloudinaryResource,
  type DeleteResult,
  type EditResult,
} from "../services/cloudinary/cloudinaryService";
import UploadSection from "../components/cloudinary/UploadSection";
import ImageGrid from "../components/cloudinary/ImageGrid";
import EditImageDialog from "../components/cloudinary/EditImageDialog";

const CloudinaryPage: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<CloudinaryResource[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<CloudinaryResource | null>(
    null
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newImageName, setNewImageName] = useState("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const loadImages = async () => {
      setIsLoadingImages(true);
      try {
        const fetchedImages = await getImages();
        setImages(fetchedImages);
      } catch (error) {
        console.error("Failed to load images:", error);
        setSnackbar({
          open: true,
          message: "Failed to load images from Cloudinary",
          severity: "error",
        });
      } finally {
        setIsLoadingImages(false);
      }
    };

    loadImages();
  }, []);

  const handleDelete = async (image: CloudinaryResource) => {
    const result: DeleteResult = await deleteImage(image.public_id);

    if (result.success) {
      setImages((prev) =>
        prev.filter((img) => img.public_id !== image.public_id)
      );
      setSnackbar({
        open: true,
        message: "Image deleted successfully",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: result.error || "Delete failed",
        severity: "error",
      });
    }
  };

  const handleEdit = (image: CloudinaryResource) => {
    setSelectedImage(image);
    setNewImageName(image.public_id.split("/").pop() || "");
    setEditDialogOpen(true);
  };

  const handleEditConfirm = async () => {
    if (!selectedImage || !newImageName.trim()) return;

    const result: EditResult = await editImage(
      selectedImage.public_id,
      newImageName
    );

    if (result.success && result.data) {
      setImages((prev) =>
        prev.map((img) =>
          img.public_id === selectedImage.public_id ? result.data! : img
        )
      );
      setSnackbar({
        open: true,
        message: "Image renamed successfully",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: result.error || "Edit failed",
        severity: "error",
      });
    }

    setEditDialogOpen(false);
    setSelectedImage(null);
    setNewImageName("");
  };

  const handleSave = (image: CloudinaryResource) => {
    const filename = `${image.public_id.split("/").pop()}.${image.format}`;
    saveImage(image.secure_url, filename);
    setSnackbar({
      open: true,
      message: "Image download started",
      severity: "success",
    });
  };

  const handleTransform = (image: CloudinaryResource) => {
    // Navigate to image editor page with image data as URL parameters
    const params = new URLSearchParams({
      publicId: image.public_id,
      secureUrl: image.secure_url,
      format: image.format,
      width: image.width.toString(),
      height: image.height.toString(),
      bytes: image.bytes.toString(),
    });
    navigate(`/image-editor?${params.toString()}`);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setSnackbar({
      open: true,
      message: "URL copied to clipboard",
      severity: "success",
    });
  };

  const handleUploadStart = () => setIsUploading(true);
  const handleUploadProgress = (progress: number) =>
    setUploadProgress(progress);
  const handleUploadComplete = (successfulUploads: CloudinaryResource[]) => {
    setImages((prev) => [...prev, ...successfulUploads]);
    setSnackbar({
      open: true,
      message: `Successfully uploaded ${successfulUploads.length} image(s)`,
      severity: "success",
    });
  };
  const handleUploadError = (message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: "error",
    });
  };
  const handleImagesRefresh = (refreshedImages: CloudinaryResource[]) => {
    setImages(refreshedImages);
    setIsLoadingImages(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cloudinary Image Manager
      </Typography>

      <UploadSection
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        onUploadStart={handleUploadStart}
        onUploadProgress={handleUploadProgress}
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
        onImagesRefresh={handleImagesRefresh}
      />

      <ImageGrid
        images={images}
        isLoadingImages={isLoadingImages}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSave={handleSave}
        onTransform={handleTransform}
        onCopyUrl={handleCopyUrl}
      />

      <EditImageDialog
        open={editDialogOpen}
        newName={newImageName}
        onClose={() => setEditDialogOpen(false)}
        onNameChange={setNewImageName}
        onConfirm={handleEditConfirm}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CloudinaryPage;
