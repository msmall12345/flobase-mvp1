# Flobase Capital Management - Testing Guide

## Overview

This document provides comprehensive information about the testing setup and practices for the Flobase Capital Management MVP application.

## Test Coverage

The testing suite covers:

1. **Eligibility Checking Logic** - Business rules for account qualification
2. **Performance Guarantee Calculations** - Vintage age and cash collection tracking
3. **Portfolio Metrics** - Aggregated performance calculations
4. **UI Components** - React component rendering and behavior

## Setup

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

This will install all required dependencies including:
- Jest (test framework)
- React Testing Library (component testing)
- @testing-library/jest-dom (custom matchers)

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (recommended for development)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run tests with verbose output
```bash
npm run test:verbose
```

## Test Structure

```
src/
├── utils/                          # Business logic
│   ├── eligibility.js             # Eligibility checking functions
│   └── performanceGuarantee.js    # Performance calculations
├── components/                     # React components
│   ├── Card.jsx
│   ├── Badge.jsx
│   └── StatCard.jsx
└── __tests__/                      # Test files
    ├── utils/
    │   ├── eligibility.test.js
    │   └── performanceGuarantee.test.js
    └── components/
        ├── Card.test.jsx
        ├── Badge.test.jsx
        └── StatCard.test.jsx
```

## Critical Test Suites

### 1. Eligibility Tests (`eligibility.test.js`)

Tests the account eligibility checking logic:

- ✅ All criteria passing
- ✅ Individual criteria failing (FICO, debt, EPF, first payment)
- ✅ Exact threshold values
- ✅ Missing/null values handling
- ✅ Disabled rules
- ✅ Custom column mappings
- ✅ Multiple validation rules

**Key Functions:**
- `checkEligibility()` - Evaluates account against rules
- `validateMappings()` - Ensures column mappings are valid
- `countEligibility()` - Aggregates eligible/ineligible counts

### 2. Performance Guarantee Tests (`performanceGuarantee.test.js`)

Tests the performance monitoring and guarantee checking:

- ✅ Vintage age calculation (0-18+ months)
- ✅ Cumulative cash collection retrieval
- ✅ Performance guarantee status (on-track, warning, triggered)
- ✅ Pre/post hurdle phase identification
- ✅ Threshold calculations (90%, 95%, 100%)
- ✅ Portfolio-level metrics aggregation

**Key Functions:**
- `calculateVintageAge()` - Computes months since purchase
- `getCumulativeCashCollection()` - Gets current cash collection %
- `checkPerformanceGuarantee()` - Evaluates guarantee status
- `calculatePortfolioMetrics()` - Aggregates portfolio-wide stats

### 3. Component Tests

Tests React component rendering and behavior:

**StatCard** (`StatCard.test.jsx`)
- ✅ Label and value rendering
- ✅ Optional sublabel and trend
- ✅ Color variants (blue, green, yellow, gray)
- ✅ Positive/negative trend indicators

**Badge** (`Badge.test.jsx`)
- ✅ Text rendering
- ✅ Variant styles (default, success, danger, warning, info)
- ✅ Children handling

**Card** (`Card.test.jsx`)
- ✅ Children rendering
- ✅ Custom className
- ✅ Hoverable behavior
- ✅ Props forwarding

## Code Coverage Thresholds

The project enforces minimum code coverage:

- **Branches:** 70%
- **Functions:** 70%
- **Lines:** 70%
- **Statements:** 70%

Run `npm run test:coverage` to see detailed coverage reports.

## Testing Best Practices

### 1. Unit Tests
- Test business logic in isolation
- Use descriptive test names
- Test edge cases and boundary conditions
- Mock external dependencies

### 2. Integration Tests
- Test component interactions
- Verify props are passed correctly
- Test user interactions with @testing-library/user-event

### 3. Test Organization
- Group related tests with `describe` blocks
- Use `beforeEach` and `afterEach` for setup/teardown
- Keep tests focused and independent

### 4. Mocking
```javascript
// Mock dates for consistent testing
beforeEach(() => {
  jest.useFakeTimers()
  jest.setSystemTime(new Date('2025-11-13T00:00:00.000Z'))
})

afterEach(() => {
  jest.useRealTimers()
})
```

## Example Test Patterns

### Testing Business Logic
```javascript
it('should pass all checks for a fully eligible account', () => {
  const row = {
    CLIENT_ID: 'CLT-10001',
    CREDIT_SCORE: 650,
    ENROLLED_DEBT: 25000,
    SETTLEMENT_FEE_PERCENTAGE: 28,
    FIRST_PAYMENT_CLEARED_DATE: '2025-09-15'
  }

  const result = checkEligibility(row, mappings, rules)

  expect(result.allPass).toBe(true)
  expect(result.checks.fico).toBe(true)
})
```

### Testing React Components
```javascript
it('should render label and value', () => {
  render(<StatCard label="Total Revenue" value="$1,000,000" />)

  expect(screen.getByTestId('stat-label')).toHaveTextContent('Total Revenue')
  expect(screen.getByTestId('stat-value')).toHaveTextContent('$1,000,000')
})
```

## Test Data

### Sample Account Data
```javascript
{
  CLIENT_ID: 'CLT-10001',
  ACCOUNT_NAME: 'Test Account',
  CREDIT_SCORE: 650,
  ENROLLED_DEBT: 25000,
  SETTLEMENT_FEE_PERCENTAGE: 28,
  FIRST_PAYMENT_CLEARED_DATE: '2025-09-15'
}
```

### Sample Vintage Data
```javascript
{
  purchaseDate: '2025-05-13',
  purchasePrice: 1000000,
  totalEnrolledDebt: 14285714,
  terms: { hurdle: 125, pre: 75, post: 50 },
  performanceGuarantees: [
    { period: 6, target: 21.2 },
    { period: 9, target: 37.7 },
    { period: 12, target: 50.1 }
  ],
  performance: {
    cashCollections: [2.5, 5.2, 8.1, 11.0, 14.0, 17.0],
    settlements: [1.5, 3.0, 5.0, 8.0, 12.0, 16.0],
    cancellations: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
  }
}
```

## Performance Guarantee Status Thresholds

- **Triggered:** < 90% of target (Split adjustment required)
- **Warning:** 90-95% of target (Monitor closely)
- **On Track:** ≥ 95% of target (Performing well)

Example for 21.2% target at 6 months:
- Triggered: < 19.08%
- Warning: 19.08% - 20.14%
- On Track: ≥ 20.14%

## Continuous Integration

Tests should be run:
- Before committing code
- In CI/CD pipeline
- Before deploying to production

## Debugging Tests

### Debug specific test
```bash
npm test -- --testNamePattern="should calculate age correctly"
```

### Debug with Node inspector
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### View detailed error messages
```bash
npm run test:verbose
```

## Adding New Tests

### 1. Create test file
Place test files in `__tests__` directory matching the source structure:
```
src/utils/myUtil.js → src/__tests__/utils/myUtil.test.js
```

### 2. Import dependencies
```javascript
import { myFunction } from '../../utils/myUtil'
```

### 3. Write descriptive tests
```javascript
describe('MyUtil', () => {
  describe('myFunction', () => {
    it('should handle valid input', () => {
      // Test implementation
    })

    it('should throw error for invalid input', () => {
      // Test implementation
    })
  })
})
```

## Common Issues and Solutions

### Issue: Tests timing out
**Solution:** Increase timeout or check for infinite loops
```javascript
jest.setTimeout(10000) // 10 seconds
```

### Issue: Mock not working
**Solution:** Clear mocks between tests
```javascript
afterEach(() => {
  jest.clearAllMocks()
})
```

### Issue: Component not rendering
**Solution:** Check for missing imports or incorrect test setup

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## Contact

For questions about testing or to report issues, please contact the development team.

---

**Last Updated:** 2025-11-13
