import { apiService } from './api.service';

export interface ImageUploadResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    url: string;
  };
}

export interface ImageInfo {
  filename: string;
  size: number;
  created: string;
  modified: string;
  url: string;
}

/**
 * ImageService
 * 
 * Handles image upload, serving, and management operations
 */
export class ImageService {
  /**
   * Upload an image file
   */
  async uploadImage(file: File): Promise<ImageUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/images/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const result: ImageUploadResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }

  /**
   * Get image info
   */
  async getImageInfo(filename: string): Promise<ImageInfo> {
    try {
      const response: any = await apiService.get(`/api/images/${filename}/info`);
      return response.data;
    } catch (error) {
      console.error('Failed to get image info:', error);
      throw error;
    }
  }

  /**
   * Delete an image
   */
  async deleteImage(filename: string): Promise<boolean> {
    try {
      await apiService.delete(`/api/images/${filename}`);
      return true;
    } catch (error) {
      console.error('Failed to delete image:', error);
      throw error;
    }
  }

  /**
   * Get image URL
   */
  getImageUrl(filename: string): string {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return `${baseUrl}/api/images/${filename}`;
  }

  /**
   * Extract filename from URL
   */
  extractFilenameFromUrl(url: string): string | null {
    const match = url.match(/\/api\/images\/(.+)$/);
    return match ? match[1] : null;
  }

  /**
   * Validate image file
   */
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Only image files are allowed (JPEG, PNG, GIF, WebP)'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Image size must be less than 5MB'
      };
    }

    return { isValid: true };
  }
}

// Singleton instance
export const imageService = new ImageService();
