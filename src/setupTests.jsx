// Jest + React Testing Library setup
// This file runs before every test suite

import '@testing-library/jest-dom';

// Silence console.error noise from intentional bad-prop tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('validateDOMNesting'))
    ) return;
    originalError(...args);
  };
});
afterAll(() => { console.error = originalError; });
