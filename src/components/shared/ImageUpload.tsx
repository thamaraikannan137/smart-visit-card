import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Alert,
  CircularProgress,
  IconButton,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Link as LinkIcon,
  Delete as DeleteIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { imageService } from '../../services/ImageService';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value = '',
  onChange,
  label = 'Company Logo',
  helperText = 'Upload an image or provide a URL',
  error = false,
  errorMessage
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [urlInput, setUrlInput] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setUploadError(null);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    setUrlInput(newUrl);
    onChange(newUrl);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = imageService.validateImageFile(file);
    if (!validation.isValid) {
      setUploadError(validation.error || 'Invalid file');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const response = await imageService.uploadImage(file);
      const imageUrl = imageService.getImageUrl(response.data.filename);
      onChange(imageUrl);
      setUrlInput(imageUrl);
    } catch (error: any) {
      setUploadError(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayError = error ? errorMessage : uploadError;

  return (
    <Box>
      <Typography variant="h6" className="mb-4 text-gray-800 font-medium">
        {label}
      </Typography>

      {/* Image Preview */}
      {(value || urlInput) && (
        <Box className="mb-4 text-center">
          <Paper elevation={2} className="inline-block p-4 relative">
            <Avatar
              src={value || urlInput}
              className="w-24 h-24 mx-auto"
              sx={{ width: 96, height: 96 }}
            >
              <ImageIcon sx={{ fontSize: '2rem' }} />
            </Avatar>
            <IconButton
              onClick={handleClearImage}
              className="absolute top-1 right-1"
              size="small"
              sx={{
                backgroundColor: 'error.main',
                color: 'white',
                '&:hover': { backgroundColor: 'error.dark' }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Paper>
        </Box>
      )}

      {/* Tab Selection */}
      <Paper elevation={1} className="mb-4">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none'
            }
          }}
        >
          <Tab
            icon={<UploadIcon />}
            label="Upload File"
            iconPosition="start"
          />
          <Tab
            icon={<LinkIcon />}
            label="Use URL"
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <Button
            variant="outlined"
            fullWidth
            onClick={handleUploadClick}
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
            sx={{
              height: 56,
              borderStyle: 'dashed',
              borderWidth: 2,
              '&:hover': {
                borderStyle: 'dashed',
                borderWidth: 2
              }
            }}
          >
            {uploading ? 'Uploading...' : 'Choose Image File'}
          </Button>
          
          <Typography variant="caption" className="text-gray-500 mt-2 block text-center">
            Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
          </Typography>
        </Box>
      )}

      {activeTab === 1 && (
        <TextField
          fullWidth
          label="Image URL"
          value={urlInput}
          onChange={handleUrlChange}
          placeholder="https://example.com/logo.png"
          type="url"
          variant="outlined"
        />
      )}

      {/* Error Display */}
      {displayError && (
        <Alert severity="error" className="mt-2">
          {displayError}
        </Alert>
      )}

      {/* Helper Text */}
      {helperText && !displayError && (
        <Typography variant="caption" className="text-gray-500 mt-2 block">
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUpload;
