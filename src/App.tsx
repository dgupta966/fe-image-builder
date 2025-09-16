import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { useState } from 'react';

import { AuthProvider } from './contexts/AuthContext.tsx';
import ThemeContextProvider from './contexts/ThemeProvider.tsx';
import Header from './components/Header.tsx';
import Sidebar from './components/Sidebar.tsx';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import ImageOptimizerPage from './pages/ImageOptimizerPage.tsx';
import GoogleDrivePage from './pages/GoogleDrivePage.tsx';
import ThumbnailCreatorPage from './pages/ThumbnailCreatorPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import { useAuth } from './contexts/useAuth';

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';

  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileOpen(false);
  };

  if (isHomePage || isLoginPage || !isAuthenticated) {
    // Home page, login page, or unauthenticated users - layout without sidebar and header
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/optimizer" element={<ImageOptimizerPage />} />
          <Route path="/google-drive" element={<GoogleDrivePage />} />
          <Route path="/thumbnail-creator" element={<ThumbnailCreatorPage />} />
        </Routes>
      </Box>
    );
  }

  // Authenticated app pages layout with sidebar and header
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileMenuClose}
        onMobileToggle={handleMobileMenuToggle}
      />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          width: { xs: '100%', md: 'auto' }, // Full width on mobile, auto on desktop
        }}
      >
        <Header onMobileMenuToggle={handleMobileMenuToggle} />
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/optimizer" element={<ImageOptimizerPage />} />
            <Route path="/google-drive" element={<GoogleDrivePage />} />
            <Route path="/thumbnail-creator" element={<ThumbnailCreatorPage />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;
