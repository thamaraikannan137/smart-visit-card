import React from 'react';
import { Typography, Box, Button, Stack } from '@mui/material';
import { ArrowBack, Add } from '@mui/icons-material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onAdd?: () => void;
  addButtonText?: string;
  showBackButton?: boolean;
  showAddButton?: boolean;
}

/**
 * Responsive PageHeader component following Single Responsibility Principle
 * Responsible only for rendering page headers with consistent styling
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onAdd,
  addButtonText = "Add New",
  showBackButton = false,
  showAddButton = false,
}) => {
  return (
    <Box className="mb-6 md:mb-8">
      {/* Mobile: Stack vertically, Desktop: Flex row */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        className="mb-4"
      >
        {/* Title Section */}
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body1" 
              className="text-gray-600 text-sm md:text-base"
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1} className="w-full sm:w-auto">
          {showBackButton && onBack && (
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={onBack}
              className="flex-1 sm:flex-none"
              size="medium"
            >
              <span className="hidden sm:inline">Back</span>
            </Button>
          )}
          
          {showAddButton && onAdd && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAdd}
              className="flex-1 sm:flex-none"
              size="medium"
            >
              <span className="hidden sm:inline">{addButtonText}</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default PageHeader;
