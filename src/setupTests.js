// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Date for consistent testing
global.Date.now = jest.fn(() => new Date('2025-11-13T00:00:00.000Z').getTime())
