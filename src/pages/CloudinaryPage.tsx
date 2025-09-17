import React, { useState, useRef, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  LinearProgress,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  Edit,
  Download,
  Image,
  Transform,
} from "@mui/icons-material";
import {
  uploadImage,
  deleteImage,
  editImage,
  saveImage,
  getImages,
  getOptimizedUrl,
  type CloudinaryResource,
  type UploadResult,
  type DeleteResult,
  type EditResult,
} from "../services/cloudinary/cloudinaryService";
import { ImageTransformer } from "../components/cloudinary";

const CloudinaryPage: React.FC = () => {
  const [images, setImages] = useState<CloudinaryResource[]>([]);
  const [isUploading, setIsUploading] = useState(false);
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
  const [activeTab, setActiveTab] = useState(0);
  const [transformImage, setTransformImage] = useState<CloudinaryResource | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadImages = async () => {
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
      }
    };

    loadImages();
  }, []);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const uploadPromises = Array.from(files).map(async (file, index) => {
      try {
        console.log(
          `Starting upload for file ${index + 1}/${files.length}:`,
          file.name
        );
        const result: UploadResult = await uploadImage(file);
        console.log(`Upload result for ${file.name}:`, result);

        // Update progress
        setUploadProgress(((index + 1) / files.length) * 100);

        return result;
      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);
        return {
          success: false,
          error: `Failed to upload ${file.name}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        } as UploadResult;
      }
    });

    try {
      console.log("Waiting for all uploads to complete...");
      const results = await Promise.allSettled(uploadPromises);
      console.log("All uploads completed:", results);

      const successfulUploads: CloudinaryResource[] = [];
      const failedUploads: string[] = [];

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          if (result.value.success && result.value.data) {
            successfulUploads.push(result.value.data);
          } else {
            failedUploads.push(
              result.value.error || `Upload ${index + 1} failed`
            );
          }
        } else {
          failedUploads.push(`Upload ${index + 1} failed: ${result.reason}`);
        }
      });

      setImages((prev) => [...prev, ...successfulUploads]);

      if (successfulUploads.length > 0) {
        try {
          const allImages = await getImages();
          setImages(allImages);
        } catch (error) {
          console.error("Failed to refresh images after upload:", error);
          setImages((prev) => [...prev, ...successfulUploads]);
        }

        setSnackbar({
          open: true,
          message: `Successfully uploaded ${successfulUploads.length} image(s)`,
          severity: "success",
        });
      }

      if (failedUploads.length > 0) {
        console.error("Failed uploads:", failedUploads);
        setSnackbar({
          open: true,
          message: `Failed to upload ${failedUploads.length} image(s). Check console for details.`,
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Unexpected error during upload process:", error);
      setSnackbar({
        open: true,
        message: "Unexpected error during upload process",
        severity: "error",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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
    setTransformImage(image);
    setActiveTab(1);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cloudinary Image Manager
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Image Management" />
          <Tab label="Image Transformation" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={handleUploadClick}
              disabled={isUploading}
              sx={{ mr: 2 }}
            >
              Upload Images
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
          </Box>

          {isUploading && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                Uploading... {Math.round(uploadProgress)}%
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {images.map((image) => (
              <Box
                key={image.public_id}
                sx={{ width: { xs: "100%", sm: "48%", md: "31%", lg: "23%" } }}
              >
                <Card
                  sx={{ height: "100%", display: "flex", flexDirection: "column" }}
                >
                  <Box
                    sx={{
                      height: 200,
                      backgroundImage: `url(${getOptimizedUrl(
                        image.public_id,
                        300,
                        200
                      )})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: 1,
                      mx: 2,
                      mt: 2,
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" noWrap title={image.public_id}>
                      {image.public_id.split("/").pop()}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={`${image.width}x${image.height}`}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip label={formatFileSize(image.bytes)} size="small" />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(image.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      size="small"
                      onClick={() => handleTransform(image)}
                      title="Transform"
                    >
                      <Transform />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(image)}
                      title="Edit"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleSave(image)}
                      title="Download"
                    >
                      <Download />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(image)}
                      title="Delete"
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>

          {images.length === 0 && !isUploading && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 300,
                textAlign: "center",
              }}
            >
              <Image sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No images uploaded yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click "Upload Images" to get started
              </Typography>
            </Box>
          )}
        </>
      )}

      {activeTab === 1 && (
        <Box>
          {transformImage ? (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Button onClick={() => setActiveTab(0)} variant="outlined">
                  Back to Images
                </Button>
                <Typography variant="h6" sx={{ ml: 2, display: "inline" }}>
                  Transforming: {transformImage.public_id.split("/").pop()}
                </Typography>
              </Box>
              <ImageTransformer
                publicId={transformImage.public_id}
                onUrlChange={(url) => {
                  console.log("Transformed URL:", url);
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 300,
                textAlign: "center",
              }}
            >
              <Transform sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No image selected for transformation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Go back to Image Management and click the transform icon on an image
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Rename Image</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Name"
            fullWidth
            variant="outlined"
            value={newImageName}
            onChange={(e) => setNewImageName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleEditConfirm();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditConfirm} variant="contained">
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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
