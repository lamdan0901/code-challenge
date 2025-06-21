// Formatting utility functions
import { createBigNumber, toBigInt } from "./bignumber.js";

/**
 * Format amount with appropriate precision using BigNumber
 * @param {*} amount - Amount to format
 * @returns {string} - Formatted amount string
 */
export function formatAmount(amount) {
  if (!amount) return "";

  try {
    const bigNum = createBigNumber(amount);

    if (!bigNum.isFinite()) return "";

    // Check if we need BigInt for very large integers
    const bigIntValue = toBigInt(bigNum);
    if (bigIntValue !== null) {
      return bigIntValue.toString();
    }

    // Format with appropriate precision - use more decimals for smaller amounts
    const absValue = bigNum.abs();
    let decimalPlaces;

    if (absValue.isGreaterThanOrEqualTo(1)) {
      decimalPlaces = 6;
    } else if (absValue.isGreaterThanOrEqualTo(0.01)) {
      decimalPlaces = 8;
    } else {
      decimalPlaces = 12;
    }

    return bigNum.toFixed(decimalPlaces).replace(/\.?0+$/, "");
  } catch (error) {
    console.error("Format amount error:", error);
    return "";
  }
}

/**
 * Format price with appropriate precision for USD display
 * @param {*} price - Price to format
 * @returns {string} - Formatted price string
 */
export function formatPrice(price) {
  if (!price) return "0";

  try {
    const bigNum = createBigNumber(price);

    if (!bigNum.isFinite()) return "0";

    // Check if we need BigInt for very large integers
    const bigIntValue = toBigInt(bigNum);
    if (bigIntValue !== null) {
      return bigIntValue.toString();
    }

    // For USD prices, typically show 2-6 decimal places depending on value
    const absValue = bigNum.abs();
    let decimalPlaces;

    if (absValue.isGreaterThanOrEqualTo(1)) {
      decimalPlaces = 2;
    } else if (absValue.isGreaterThanOrEqualTo(0.01)) {
      decimalPlaces = 4;
    } else {
      decimalPlaces = 8;
    }

    return bigNum.toFixed(decimalPlaces).replace(/\.?0+$/, "");
  } catch (error) {
    console.error("Format price error:", error);
    return "0";
  }
}
