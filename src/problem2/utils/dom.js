// DOM utility functions

/**
 * Debounce utility function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Show error message in a temporary toast
 * @param {string} message - Error message to display
 */
export function showGlobalError(message) {
  // Create a temporary error display
  const errorDiv = document.createElement("div");
  errorDiv.className = "global-error";
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--error-gradient);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    z-index: 1001;
    box-shadow: var(--shadow-card);
  `;
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);

  setTimeout(() => {
    if (document.body.contains(errorDiv)) {
      document.body.removeChild(errorDiv);
    }
  }, 5000);
}
