import React from 'react';
import { Container, Box, AppBar, Toolbar, Typography } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

/**
 * Responsive Layout component following Single Responsibility Principle
 * Responsible only for providing consistent, responsive layout structure
 */
const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = "SmartLink Customer Management",
  maxWidth = "xl"
}) => {
  return (
    <Box className="min-h-screen bg-gray-50">
      {/* Responsive AppBar */}
      <AppBar position="static" elevation={0} className="bg-white shadow-sm">
        <Container maxWidth={maxWidth}>
          <Toolbar className="px-2 sm:px-4">
            <Typography 
              variant="h6" 
              component="h1" 
              className="text-gray-800 font-semibold text-lg sm:text-xl md:text-2xl truncate"
            >
              {title}
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Responsive Content Container */}
      <Container 
        maxWidth={maxWidth} 
        className="py-4 sm:py-6 md:py-8 px-2 sm:px-4"
      >
        <Box className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default Layout;
