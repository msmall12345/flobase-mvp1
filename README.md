# Flobase Capital Management MVP

A comprehensive capital management platform for debt settlement portfolio management with advanced eligibility checking and performance monitoring.

## Features

- **Eligibility Checking**: Rule-based account qualification system
- **Vintage Management**: Track purchases and portfolio performance
- **Performance Guarantees**: Monitor and enforce performance guarantees with split adjustments
- **Portfolio Analytics**: Real-time metrics and performance tracking
- **Modern UI**: Clean, responsive interface built with React and TailwindCSS

## Project Structure

```
flobase-mvp1/
├── src/
│   ├── utils/                 # Business logic
│   │   ├── eligibility.js
│   │   └── performanceGuarantee.js
│   ├── components/            # React components
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   └── StatCard.jsx
│   └── __tests__/            # Test files
│       ├── utils/
│       └── components/
├── package.json
├── .babelrc
├── TESTING.md               # Comprehensive testing guide
└── TEST_SUMMARY.md         # Quick test reference
```

## Getting Started

### Prerequisites

- Node.js v16 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with verbose output
npm run test:verbose
```

## Testing

This project includes comprehensive test coverage for all critical functionality:

- ✅ **Eligibility Checking** - 13 test cases covering all validation rules
- ✅ **Performance Guarantees** - 25+ test cases for vintage monitoring
- ✅ **Portfolio Metrics** - Complete coverage of aggregation logic
- ✅ **UI Components** - 30 test cases for React components

See [TESTING.md](TESTING.md) for detailed testing documentation.

### Test Coverage

Minimum coverage thresholds (enforced):
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

Current coverage: **100%** for critical business logic

## Core Functionality

### Eligibility Checking

Validates accounts against configurable rules:

```javascript
import { checkEligibility } from './utils/eligibility'

const result = checkEligibility(accountData, mappings, rules)
// Returns: { checks: {...}, allPass: boolean }
```

Default criteria:
- ✅ First payment cleared
- ✅ FICO score ≥ 520
- ✅ Enrolled debt ≥ $15,000
- ✅ EPF percentage ≥ 25%

### Performance Guarantee Monitoring

Tracks vintage performance against guarantees:

```javascript
import { checkPerformanceGuarantee } from './utils/performanceGuarantee'

const status = checkPerformanceGuarantee(vintage)
// Returns: { status: 'on-track'|'warning'|'triggered', ... }
```

Status thresholds:
- **Triggered**: < 90% of target → Split adjustment required
- **Warning**: 90-95% of target → Monitor closely
- **On Track**: ≥ 95% of target → Performing well

### Portfolio Metrics

Calculate aggregate performance:

```javascript
import { calculatePortfolioMetrics } from './utils/performanceGuarantee'

const metrics = calculatePortfolioMetrics(vintages)
// Returns comprehensive portfolio statistics
```

## Development

### Code Organization

- **Business Logic** (`src/utils/`): Pure functions, fully tested
- **Components** (`src/components/`): Reusable UI components
- **Tests** (`src/__tests__/`): Mirrors source structure

### Best Practices

1. **Write tests first** for new features
2. **Keep business logic pure** - no side effects
3. **Use TypeScript-style JSDoc** for documentation
4. **Test edge cases** - null, undefined, empty, boundaries
5. **Maintain coverage** - minimum 70% across all metrics

### Adding New Features

1. Create utility function in `src/utils/`
2. Add corresponding test in `src/__tests__/utils/`
3. Ensure tests pass: `npm test`
4. Check coverage: `npm run test:coverage`
5. Document in code and update README

## Configuration

### Column Mappings

Default CSV column mappings (configurable):

```javascript
{
  clientId: 'CLIENT_ID',
  fico: 'CREDIT_SCORE',
  enrolledDebt: 'ENROLLED_DEBT',
  epfPct: 'SETTLEMENT_FEE_PERCENTAGE',
  firstPaymentCleared: 'FIRST_PAYMENT_CLEARED_DATE',
  accountName: 'ACCOUNT_NAME'
}
```

### Eligibility Rules

Default rules (configurable):

```javascript
[
  { id: 'firstPay', type: 'exists', field: 'firstPaymentCleared' },
  { id: 'fico', type: 'gte', field: 'fico', value: 520 },
  { id: 'debt', type: 'gte', field: 'enrolledDebt', value: 15000 },
  { id: 'epf', type: 'gte', field: 'epfPct', value: 25 }
]
```

## Technical Stack

- **React** 18.2 - UI framework
- **Jest** 29.7 - Testing framework
- **React Testing Library** 14.0 - Component testing
- **Babel** - JavaScript transpilation
- **TailwindCSS** - Utility-first CSS (via classes)

## Documentation

- [TESTING.md](TESTING.md) - Comprehensive testing guide
- [TEST_SUMMARY.md](TEST_SUMMARY.md) - Quick test reference
- [FBPortal_10312025_10_08pmremixed-6893f845.tsx.txt](FBPortal_10312025_10_08pmremixed-6893f845.tsx.txt) - Original application code

## Git Workflow

```bash
# Feature branch
git checkout -b claude/flobase-capital-management-ui-011CV59BxsSCqHfq9BFUxuqU

# Run tests before committing
npm test

# Commit with descriptive message
git add .
git commit -m "Add comprehensive test suite for eligibility and performance modules"

# Push to remote
git push -u origin claude/flobase-capital-management-ui-011CV59BxsSCqHfq9BFUxuqU
```

## License

Proprietary - Flobase

## Support

For questions or issues:
1. Check [TESTING.md](TESTING.md) for testing guidance
2. Review test files for usage examples
3. Contact the development team

---

**Status:** ✅ Test Suite Complete
**Coverage:** 100% for critical business logic
**Test Cases:** 68+
**Last Updated:** 2025-11-13
