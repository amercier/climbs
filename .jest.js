const stripAnsi = require('strip-ansi');

/**
 * Jest custom matchers.
 * Warning: `jest-extended` must not included before.
 * @see {@link https://facebook.github.io/jest/docs/en/expect.html#expectextendmatchers}
 */
expect.extend({
  ansiStripped(actual, expected) {
    const pass = stripAnsi(actual) === expected;
    const message = pass
      ? () => `expected ${actual} to be ${expected} without colors`
      : () => `expected ${actual} not to be ${expected} without colors`;
    return { message, pass };
  },
});

if (process.env.JEST_TIMEOUT) {
  jest.setTimeout(parseInt(process.env.JEST_TIMEOUT, 10));
}

require('jest-chain');
require('jest-extended');
