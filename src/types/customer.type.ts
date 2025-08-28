export interface Customer {
    id: string;
    name: string;
    emails: string[];
    phoneNumbers: string[];
    whatsappNumbers: string[];
    websiteUrls: string[];
    companyLogo: string;
    description: string;
    facebookUrls?: string[];
    instagramUrls?: string[];
    youtubeUrls?: string[];
    locationUrls?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface CustomersListResponse {
    customers: Customer[];
    total: number;
    page: number;
    pages: number;
}

export interface CustomerCreateRequest {
    name: string;
    emails: string[];
    phoneNumbers: string[];
    whatsappNumbers: string[];
    websiteUrls: string[];
    companyLogo: string;
    description: string;
    facebookUrls?: string[];
    instagramUrls?: string[];
    youtubeUrls?: string[];
    locationUrls?: string[];
}
export enum CustomerActionType {
    ADD = "ADD_CUSTOMER",
    LIST = "CUSTOMER_LIST",
    EDIT = "EDIT_CUSTOMER"
}

export interface CustomerFormData {
    name: string;
    emails: string[];
    phoneNumbers: string[];
    whatsappNumbers: string[];
    websiteUrls: string[];
    companyLogo: string;
    description: string;
    facebookUrls?: string[];
    instagramUrls?: string[];
    youtubeUrls?: string[];
    locationUrls?: string[];
}