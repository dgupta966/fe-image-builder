const cloudName =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your-cloud-name";
const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || "your-api-key";
const apiSecret =
  import.meta.env.VITE_CLOUDINARY_API_SECRET || "your-api-secret";

export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

export interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

export interface CloudinaryResourcesResponse {
  resources: CloudinaryResource[];
  next_cursor?: string;
  total_count: number;
}

export interface UploadResult {
  success: boolean;
  data?: CloudinaryImage;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export interface EditResult {
  success: boolean;
  data?: CloudinaryResource;
  error?: string;
}

export const uploadImage = async (file: File): Promise<UploadResult> => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error("File size must be less than 10MB");
    }

    if (!cloudName) {
      throw new Error("Cloudinary cloud name not configured");
    }

    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!uploadPreset) {
      throw new Error("Upload preset not configured");
    }

    // ✅ Prepare form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    console.log("Uploading to Cloudinary...", {
      cloudName,
      uploadPreset,
      file: { name: file.name, size: file.size, type: file.type },
    });

    // ✅ Send upload request
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Upload successful ✅", data);

    return {
      success: true,
      data: {
        public_id: data.public_id,
        secure_url: data.secure_url,
        url: data.url,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
        created_at: data.created_at,
      },
    };
  } catch (error) {
    console.error("Upload error:", error);

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Unknown upload error" };
  }
};

export const deleteImage = async (publicId: string): Promise<DeleteResult> => {
  try {
    console.log("Attempting to delete image:", publicId);

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await generateSignature(
      `public_id=${publicId}&timestamp=${timestamp}`,
      apiSecret
    );

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("signature", signature);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());

    console.log("Delete request data:", {
      public_id: publicId,
      api_key: apiKey,
      timestamp: timestamp,
      signature: signature.substring(0, 10) + "...", // Don't log full signature
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        body: formData, // Use FormData instead of JSON
      }
    );

    console.log("Delete response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Delete failed:", response.status, errorText);
      throw new Error(`Delete failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Delete successful:", data);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
};

const generateSignature = async (
  params: string,
  apiSecret: string
): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(params + apiSecret);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export const editImage = async (
  publicId: string,
  newName?: string
): Promise<EditResult> => {
  try {
    if (newName) {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/rename`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from_public_id: publicId,
            to_public_id: newName,
            api_key: apiKey,
            api_secret: apiSecret,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Edit failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: {
          public_id: data.public_id,
          secure_url: data.secure_url,
          url: data.url,
          width: data.width,
          height: data.height,
          format: data.format,
          bytes: data.bytes,
          created_at: data.created_at,
        },
      };
    }

    return {
      success: false,
      error: "No changes specified",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Edit failed",
    };
  }
};

// Get list of images
export const getImages = async (): Promise<CloudinaryResource[]> => {
  try {
    if (!cloudName) {
      throw new Error("Cloudinary cloud name not configured");
    }

    if (!apiKey) {
      throw new Error("Cloudinary API key not configured");
    }

    if (!apiSecret) {
      throw new Error("Cloudinary API secret not configured");
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`,
      {
        method: "GET",
        headers: {
          "Authorization": `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Response:", response.status, errorText);
      throw new Error(`Failed to fetch images: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.resources && Array.isArray(data.resources)) {
      return data.resources.map((resource: CloudinaryResource) => ({
        public_id: resource.public_id,
        secure_url: resource.secure_url,
        url: resource.url,
        width: resource.width,
        height: resource.height,
        format: resource.format,
        bytes: resource.bytes,
        created_at: resource.created_at,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};

// Save image locally (download)
export const saveImage = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate optimized URL
export const getOptimizedUrl = (
  publicId: string,
  width?: number,
  height?: number
) => {
  let transformations = "";

  if (width) {
    transformations += `w_${width}`;
  }
  if (height) {
    transformations += transformations ? `,h_${height}` : `h_${height}`;
  }

  if (transformations) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
};

export interface TransformationOptions {
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  format?: string;
  quality?: string | number;
  effect?: string;
  radius?: number;
  angle?: number;
  opacity?: number;
  background?: string;
  color?: string;
  dpr?: number;
}

export const buildTransformationUrl = (
  publicId: string,
  options: TransformationOptions
): string => {
  const transformations: string[] = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.gravity) transformations.push(`g_${options.gravity}`);
  if (options.format) transformations.push(`f_${options.format}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.effect) transformations.push(`e_${options.effect}`);
  if (options.radius !== undefined) transformations.push(`r_${options.radius}`);
  if (options.angle) transformations.push(`a_${options.angle}`);
  if (options.opacity !== undefined) transformations.push(`o_${options.opacity}`);
  if (options.background) transformations.push(`b_${options.background}`);
  if (options.color) transformations.push(`co_${options.color}`);
  if (options.dpr) transformations.push(`dpr_${options.dpr}`);

  const transformationString = transformations.join(",");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`;
};
