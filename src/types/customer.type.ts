export interface Customer {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    whatsappNumber: string;
    websiteUrl: string;
    companyLogo: string;
    description: string;
}
//  facebook_link: string,
//     instagram_link: string,
//     youtube_link: string,
//     location_link: string,
export enum CustomerActionType {
    ADD = "ADD_CUSTOMER",
    LIST = "CUSTOMER_LIST",
    EDIT = "EDIT_CUSTOMER"
}

export interface CustomerFormData {
    name: string;
    email: string;
    phoneNumber: string;
    whatsappNumber: string;
    websiteUrl: string;
    companyLogo: string;
    description: string;
}