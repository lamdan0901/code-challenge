// BigNumber utility functions for precise calculations
import { BigNumber } from "../config/bignumber.js";

/**
 * Helper method for creating BigNumber instances safely
 * @param {*} value - Value to convert to BigNumber
 * @returns {BigNumber} - BigNumber instance
 */
export function createBigNumber(value) {
  if (BigNumber.isBigNumber(value)) {
    return value;
  }

  try {
    // Handle BigInt values
    if (typeof value === "bigint") {
      return new BigNumber(value.toString());
    }

    return new BigNumber(value);
  } catch (error) {
    console.error("Error creating BigNumber:", error, "Value:", value);
    return new BigNumber(0);
  }
}

/**
 * Helper method for converting BigNumber to BigInt for very large integers
 * @param {BigNumber} bigNumber - BigNumber to convert
 * @returns {BigInt|null} - BigInt value or null if conversion not needed
 */
export function toBigInt(bigNumber) {
  try {
    if (!BigNumber.isBigNumber(bigNumber)) {
      bigNumber = createBigNumber(bigNumber);
    }

    // Only convert to BigInt if it's a whole number and large enough to warrant it
    if (
      bigNumber.isInteger() &&
      bigNumber.abs().isGreaterThan(Number.MAX_SAFE_INTEGER)
    ) {
      return BigInt(bigNumber.toFixed(0));
    }

    return null; // Return null if BigInt conversion is not needed
  } catch (error) {
    console.error("Error converting to BigInt:", error);
    return null;
  }
}

/**
 * Validate amount input using BigNumber for precision
 * @param {string} value - Value to validate
 * @returns {boolean} - Whether the value is valid
 */
export function isValidAmount(value) {
  if (!value || value === "") return false;

  try {
    const bigNum = createBigNumber(value);
    return bigNum.isFinite() && bigNum.isGreaterThanOrEqualTo(0);
  } catch (error) {
    return false;
  }
}
