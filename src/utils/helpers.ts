/**
 * Generates a unique ID for new customers
 * @returns string - Unique identifier
 */
export const generateCustomerId = (): string => {
  return `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validates email format
 * @param email - Email to validate
 * @returns boolean - True if valid email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format (basic validation)
 * @param phone - Phone number to validate
 * @returns boolean - True if valid phone format
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

/**
 * Validates URL format
 * @param url - URL to validate
 * @returns boolean - True if valid URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Truncates text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns string - Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
