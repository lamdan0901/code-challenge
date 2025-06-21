/**
 * Component Loader Utility
 * Handles loading and injecting HTML components
 */

class ComponentLoader {
  constructor() {
    this.componentCache = new Map();
  }

  /**
   * Load an HTML component from a file
   * @param {string} componentPath - Path to the component file
   * @returns {Promise<string>} - The HTML content
   */
  async loadComponent(componentPath) {
    if (this.componentCache.has(componentPath)) {
      return this.componentCache.get(componentPath);
    }

    try {
      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${componentPath}`);
      }

      const html = await response.text();
      this.componentCache.set(componentPath, html);
      return html;
    } catch (error) {
      console.error("Error loading component:", error);
      throw error;
    }
  }

  /**
   * Process template placeholders in HTML
   * @param {string} html - HTML content with placeholders
   * @param {Object} replacements - Object containing placeholder replacements
   * @returns {string} - Processed HTML
   */
  processTemplate(html, replacements = {}) {
    let processedHtml = html;

    for (const [placeholder, value] of Object.entries(replacements)) {
      const regex = new RegExp(`{{${placeholder}}}`, "g");
      processedHtml = processedHtml.replace(regex, value);
    }

    return processedHtml;
  }

  /**
   * Inject a component into a target element
   * @param {string} targetSelector - CSS selector for the target element
   * @param {string} componentPath - Path to the component file
   * @param {Object} templateData - Data for template processing
   * @returns {Promise<void>}
   */
  async injectComponent(targetSelector, componentPath, templateData = {}) {
    const targetElement = document.querySelector(targetSelector);
    if (!targetElement) {
      throw new Error(`Target element not found: ${targetSelector}`);
    }

    const html = await this.loadComponent(componentPath);
    const processedHtml = this.processTemplate(html, templateData);

    targetElement.insertAdjacentHTML("beforeend", processedHtml);
  }

  /**
   * Replace content of a target element with a component
   * @param {string} targetSelector - CSS selector for the target element
   * @param {string} componentPath - Path to the component file
   * @param {Object} templateData - Data for template processing
   * @returns {Promise<void>}
   */
  async replaceComponent(targetSelector, componentPath, templateData = {}) {
    const targetElement = document.querySelector(targetSelector);
    if (!targetElement) {
      throw new Error(`Target element not found: ${targetSelector}`);
    }

    const html = await this.loadComponent(componentPath);
    const processedHtml = this.processTemplate(html, templateData);

    targetElement.innerHTML = processedHtml;
  }

  /**
   * Load multiple components in parallel
   * @param {Array} components - Array of component configurations
   * @returns {Promise<void>}
   */
  async loadComponents(components) {
    const promises = components.map(async (config) => {
      const { target, component, templateData, replace = false } = config;

      if (replace) {
        await this.replaceComponent(target, component, templateData);
      } else {
        await this.injectComponent(target, component, templateData);
      }
    });

    await Promise.all(promises);
  }
}

// Export the component loader
export default ComponentLoader;
