import axios, { AxiosInstance, AxiosResponse } from 'axios';

/**
 * API Service for handling HTTP requests to the backend
 */
export class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        console.error('Response error:', error.response?.data || error.message);
        
        // Handle common errors
        if (error.response?.status === 404) {
          throw new Error('Resource not found');
        } else if (error.response?.status === 400) {
          throw new Error(error.response.data?.message || 'Bad request');
        } else if (error.response?.status === 409) {
          throw new Error(error.response.data?.message || 'Resource already exists');
        } else if (error.response?.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (error.code === 'ECONNREFUSED') {
          throw new Error('Unable to connect to server. Please check if the backend is running.');
        }
        
        throw new Error(error.response?.data?.message || error.message || 'An unexpected error occurred');
      }
    );
  }

  /**
   * GET request
   */
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.api.get(url, { params });
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post(url, data);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put(url, data);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete(url);
    return response.data;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<any> {
    return this.get('/health');
  }
}

// Export singleton instance
export const apiService = new ApiService();
