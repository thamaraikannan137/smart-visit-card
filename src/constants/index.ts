export const FORM_FIELDS = {
    NAME: 'name',
    EMAILS: 'emails',
    PHONE_NUMBERS: 'phoneNumbers',
    WHATSAPP_NUMBERS: 'whatsappNumbers',
    WEBSITE_URLS: 'websiteUrls',
    COMPANY_LOGO: 'companyLogo',
    DESCRIPTION: 'description',
    FACEBOOK_URLS: 'facebookUrls',
    INSTAGRAM_URLS: 'instagramUrls',
    YOUTUBE_URLS: 'youtubeUrls',
    LOCATION_URLS: 'locationUrls'
} as const;

export const FORM_LABELS = {
    NAME: 'Customer Name',
    EMAILS: 'Email Addresses',
    PHONE_NUMBERS: 'Phone Numbers',
    WHATSAPP_NUMBERS: 'WhatsApp Numbers',
    WEBSITE_URLS: 'Website URLs',
    COMPANY_LOGO: 'Company Logo',
    DESCRIPTION: 'Description',
    FACEBOOK_URLS: 'Facebook URLs',
    INSTAGRAM_URLS: 'Instagram URLs',
    YOUTUBE_URLS: 'YouTube URLs',
    LOCATION_URLS: 'Location URLs'
} as const;

export const BUTTON_LABELS = {
    BACK: 'Back',
    SUBMIT: 'Submit',
    ADD_CUSTOMER: 'Add Customer',
    EDIT: 'Edit',
    DELETE: 'Delete',
    VIEW: 'View',
    CLOSE: '×'
} as const;

export const TITLES = {
    ADD_CUSTOMER: 'Add Customer',
    EDIT_CUSTOMER: 'Edit Customer',
    CUSTOMER_LIST: 'Customer List',
    CUSTOMER_TABLE: 'Customer Table',
    CUSTOMER_DETAILS: 'Customer Details'
} as const;

export const DETAIL_LABELS = {
    NAME: 'Name:',
    EMAIL: 'Email',
    PHONE: 'Phone',
    WHATSAPP: 'WhatsApp',
    WEBSITE: 'Website',
    COMPANY_LOGO: 'Company Logo:',
    DESCRIPTION: 'Description:',
    FACEBOOK: 'Facebook',
    INSTAGRAM: 'Instagram',
    YOUTUBE: 'YouTube',
    LOCATION: 'Location'
} as const;

export const MESSAGES = {
    LOADING: 'Loading customer details...',
    PAGE_NOT_FOUND: 'Page not found',
    LOAD_ERROR: 'Failed to load customer details',
    NOT_PROVIDED: 'Not provided',
    NO_LOGO: 'No logo provided',
    ERROR_TITLE: 'Error'
} as const;
