/**
 * Validates if a string is a valid URL
 * @param url - The URL string to validate
 * @returns true if valid URL, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== "string") {
    return false;
  }

  try {
    // Basic URL pattern check
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    
    // Use URL constructor for stricter validation
    new URL(url.startsWith("http") ? url : `http://${url}`);
    
    return urlPattern.test(url);
  } catch {
    return false;
  }
};

/**
 * Validates profile image URL with more specific checks
 * @param url - The URL string to validate
 * @returns object with isValid flag and optional error message
 */
export const validateProfileImageUrl = (url: string | undefined): { isValid: boolean; error?: string } => {
  if (!url) {
    // URL is optional
    return { isValid: true };
  }

  if (url.length > 500) {
    return { isValid: false, error: "URL must be less than 500 characters" };
  }

  if (!isValidUrl(url)) {
    return { isValid: false, error: "Invalid URL format" };
  }

  // Check if URL is an image URL (optional enhancement)
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  const urlLower = url.toLowerCase();
  const hasImageExtension = imageExtensions.some(ext => urlLower.includes(ext));
  
  // Allow URLs without file extensions (they might be API endpoints or CDN URLs)
  // Just ensure it's a valid URL structure
  return { isValid: true };
};

