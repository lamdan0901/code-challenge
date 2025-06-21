/**
 * Problem 1: Three unique implementations for summation to n
 * Input: n - any integer
 * Output: summation from 1 to n (e.g., sum_to_n(5) = 1 + 2 + 3 + 4 + 5 = 15)
 */

/**
 * Solution A: Iterative approach using a for loop
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
var sum_to_n_a = function (n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

/**
 * Solution B: Mathematical formula approach (Gauss formula)
 * Formula: n * (n + 1) / 2
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
var sum_to_n_b = function (n) {
  return (n * (n + 1)) / 2;
};

/**
 * Solution C: Recursive approach
 * Time Complexity: O(n)
 * Space Complexity: O(n) due to call stack
 */
var sum_to_n_c = function (n) {
  if (n <= 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  return n + sum_to_n_c(n - 1);
};

console.log("Testing all three implementations:");
console.log("sum_to_n_a(5):", sum_to_n_a(5)); // Expected: 15
console.log("sum_to_n_b(5):", sum_to_n_b(5)); // Expected: 15

console.log("sum_to_n_a(10):", sum_to_n_a(10)); // Expected: 55
console.log("sum_to_n_b(10):", sum_to_n_b(10)); // Expected: 55

console.log("sum_to_n_a(0):", sum_to_n_a(0)); // Expected: 0
console.log("sum_to_n_b(0):", sum_to_n_b(0)); // Expected: 0
