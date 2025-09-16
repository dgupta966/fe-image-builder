# Thumbly - AI-Powered Image Optimization Platform

Thumbly is a modern React application built with TypeScript and Material-UI that provides powerful image optimization and AI-powered thumbnail creation capabilities with seamless Google Drive integration.

## Features

### 🖼️ Image Optimization
- **Smart Compression**: Optimize images for maximum quality and performance
- **Format Conversion**: Convert between JPEG, PNG, and WebP formats
- **Batch Processing**: Handle multiple images simultaneously
- **Custom Settings**: Fine-tune quality, resolution, and output formats

### ✨ AI-Powered Thumbnail Creation
- **Google Gemini Integration**: Leverage Google's AI for intelligent thumbnail design
- **Category-Specific Designs**: Specialized templates for different content types
- **Style Customization**: Choose from modern, classic, bold, or minimal styles
- **Color Customization**: Personalize thumbnails with custom color schemes

### 🔗 Google Drive Integration
- **OAuth2 Authentication**: Secure Google account integration
- **Drive File Access**: Browse and select images directly from Google Drive
- **Auto-Save**: Save optimized images and thumbnails back to Drive
- **Permission Management**: User-controlled access to Drive files

### 🎨 Modern UI/UX
- **Material-UI Design**: Clean, responsive interface
- **Dark/Light Themes**: Customizable appearance
- **Intuitive Navigation**: Easy-to-use dashboard and tools
- **Real-time Progress**: Visual feedback for processing tasks

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **UI Framework**: Material-UI (MUI) 7
- **Routing**: React Router DOM 7
- **Authentication**: Google OAuth2
- **APIs**: 
  - Google Drive API
  - Google Gemini AI API
  - Google Cloud Storage

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Cloud Project with enabled APIs:
  - Google Drive API
  - Google Identity API
  - Google Gemini API

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thumbly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Fill in your Google API credentials:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   VITE_GOOGLE_DRIVE_API_KEY=your-google-drive-api-key
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Google Cloud Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable required APIs:
   - Google Drive API
   - Google Identity API
   - Google Generative AI API (Gemini)

### 2. Create OAuth2 Credentials
1. Go to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Set application type to "Web application"
4. Add authorized origins: `http://localhost:5173` (development)
5. Copy the Client ID to your `.env` file

### 3. API Keys
1. Create API key for Google Drive API
2. Create API key for Gemini API
3. Restrict keys to your domain/IP for security

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   └── ...
├── pages/              # Main application pages
│   ├── HomePage.tsx    # Landing page
│   ├── LoginPage.tsx   # Authentication page
│   ├── DashboardPage.tsx # User dashboard
│   ├── ImageOptimizerPage.tsx # Image optimization tool
│   └── ThumbnailCreatorPage.tsx # AI thumbnail creator
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   ├── AuthContextProvider.ts
│   └── useAuth.ts      # Auth hook
├── services/           # External API integrations
│   └── googleServices.ts # Google APIs wrapper
├── types/              # TypeScript type definitions
│   ├── index.ts        # Main types
│   └── global.d.ts     # Global type declarations
└── App.tsx             # Main application component
```

## Usage

### Image Optimization
1. **Login** with your Google account
2. **Navigate** to the Image Optimizer
3. **Upload files** or connect Google Drive
4. **Adjust settings** (quality, format, dimensions)
5. **Process images** and download/save results

### Thumbnail Creation
1. **Access** the Thumbnail Creator from the dashboard
2. **Enter details** (title, description, category)
3. **Customize style** and colors
4. **Generate thumbnails** using AI
5. **Download or save** to Google Drive

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Material-UI for consistent styling
- Proper error handling and loading states

## Next Steps

To complete the implementation, you'll need to:

1. **Set up Google Cloud APIs**:
   - Create a Google Cloud project
   - Enable Google Drive API, Identity API, and Gemini API
   - Create OAuth2 credentials and API keys
   - Add credentials to `.env` file

2. **Implement Image Processing**:
   - Add actual image optimization logic
   - Integrate with image processing libraries
   - Connect to Google Gemini API for thumbnail generation

3. **Enhance Google Drive Integration**:
   - Complete the Google Drive file picker
   - Implement file upload/download functionality
   - Add permission management

4. **Add Error Handling**:
   - Implement comprehensive error boundaries
   - Add retry mechanisms for API calls
   - Improve user feedback for errors

## Security Considerations

- API keys should be restricted and never exposed
- OAuth2 tokens are stored securely in localStorage
- File uploads are validated on the client side
- All API calls include proper error handling

## License

This project is licensed under the MIT License.

---

**Thumbly** - Transforming your images with the power of AI and modern web technology.
