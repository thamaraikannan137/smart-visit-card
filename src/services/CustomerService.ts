import { 
  Customer, 
  ApiResponse, 
  CustomersListResponse, 
  CustomerCreateRequest 
} from '../types/customer.type';
import { apiService } from './api.service';

/**
 * CustomerService
 * 
 * Handles all customer-related API operations:
 * - CRUD operations via REST API
 * - Data validation and transformation
 * - Error handling and response processing
 */
export class CustomerService {

  /**
   * Get all customers with pagination
   */
  async getAll(page: number = 1, limit: number = 50): Promise<CustomersListResponse> {
    try {
      const response: ApiResponse<CustomersListResponse> = await apiService.get(
        '/api/customers', 
        { page, limit }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      throw error;
    }
  }

  /**
   * Get customer by ID
   */
  async getById(id: string): Promise<Customer | null> {
    try {
      const response: ApiResponse<Customer> = await apiService.get(`/api/customers/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message === 'Resource not found') {
        return null;
      }
      console.error('Failed to fetch customer:', error);
      throw error;
    }
  }

  /**
   * Add new customer
   */
  async add(customerData: CustomerCreateRequest): Promise<Customer> {
    try {
      const response: ApiResponse<Customer> = await apiService.post('/api/customers', customerData);
      return response.data;
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw error;
    }
  }

  /**
   * Update existing customer
   */
  async update(id: string, customerData: Partial<CustomerCreateRequest>): Promise<Customer | null> {
    try {
      const response: ApiResponse<Customer> = await apiService.put(`/api/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message === 'Resource not found') {
        return null;
      }
      console.error('Failed to update customer:', error);
      throw error;
    }
  }

  /**
   * Delete customer
   */
  async delete(id: string): Promise<boolean> {
    try {
      await apiService.delete(`/api/customers/${id}`);
      return true;
    } catch (error) {
      if (error instanceof Error && error.message === 'Resource not found') {
        return false;
      }
      console.error('Failed to delete customer:', error);
      throw error;
    }
  }

  /**
   * Search customers
   */
  async search(query: string): Promise<Customer[]> {
    try {
      const response: ApiResponse<Customer[]> = await apiService.get('/api/customers/search', { q: query });
      return response.data;
    } catch (error) {
      console.error('Failed to search customers:', error);
      throw error;
    }
  }

  /**
   * Get customers count
   */
  async getCount(): Promise<number> {
    try {
      const response: ApiResponse<{ count: number }> = await apiService.get('/api/customers/count');
      return response.data.count;
    } catch (error) {
      console.error('Failed to get customers count:', error);
      throw error;
    }
  }



  /**
   * Transform form data to CustomerCreateRequest
   */
  static fromFormData(formData: any): CustomerCreateRequest {
    return {
      name: formData.name || '',
      emails: this.cleanArray(formData.emails),
      phoneNumbers: this.cleanArray(formData.phoneNumbers),
      whatsappNumbers: this.cleanArray(formData.whatsappNumbers),
      websiteUrls: this.cleanArray(formData.websiteUrls),
      companyLogo: formData.companyLogo || '',
      description: formData.description || '',
      facebookUrls: this.cleanArray(formData.facebookUrls),
      instagramUrls: this.cleanArray(formData.instagramUrls),
      youtubeUrls: this.cleanArray(formData.youtubeUrls),
      locationUrls: this.cleanArray(formData.locationUrls)
    };
  }

  /**
   * Clean array by removing empty strings and duplicates
   */
  private static cleanArray(arr: string[] | string | undefined): string[] {
    if (!arr) return [];
    const array = Array.isArray(arr) ? arr : [arr];
    return Array.from(new Set(array.filter(item => item?.trim())));
  }
}

// Singleton instance
export const customerService = new CustomerService();
