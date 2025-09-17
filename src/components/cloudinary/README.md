# Cloudinary Image Transformation Components

This folder contains React components for transforming images on the fly using Cloudinary's URL-based transformation parameters.

## Components

### ImageTransformer
The main component that combines all transformation controls and displays the transformed image with the generated URL.

**Props:**
- `publicId`: The Cloudinary public ID of the image to transform
- `onUrlChange`: Optional callback function called when the transformation URL changes

### Individual Control Components

#### ResizeControls
Controls for setting image width and height.

#### CropControls
Controls for cropping mode and gravity settings.

#### FormatControls
Controls for output format (JPEG, PNG, WebP, etc.).

#### QualityControls
Controls for image quality and compression settings.

#### EffectControls
Controls for applying visual effects (blur, grayscale, sepia, etc.).

#### AdvancedControls
Advanced controls for radius, angle, opacity, DPR, background, and color settings.

## Usage

```tsx
import { ImageTransformer } from './components/cloudinary';

function MyComponent() {
  return (
    <ImageTransformer
      publicId="my-image-public-id"
      onUrlChange={(url) => console.log('Transformed URL:', url)}
    />
  );
}
```

## Transformation Features

- **Resize**: Set custom width and height
- **Crop**: Choose from fill, crop, fit, scale, and thumbnail modes
- **Format**: Convert to auto, JPEG, PNG, WebP, AVIF, or GIF
- **Quality**: Auto quality, custom quality levels, or eco/good/best presets
- **Effects**: Blur, grayscale, sepia, brightness, contrast, saturation, hue, vignette, pixelate
- **Advanced**: Corner radius, rotation angle, opacity, device pixel ratio, background color, text color

## Generated URLs

All transformations are applied via Cloudinary's URL parameters. The component generates URLs in the format:
```
https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}
```

Transformations are comma-separated and include parameters like:
- `w_300` (width)
- `h_200` (height)
- `c_fill` (crop mode)
- `f_auto` (format)
- `q_auto` (quality)
- `e_blur` (effect)