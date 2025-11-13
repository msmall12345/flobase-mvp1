# Deployment & Local Development Guide

## Current Project Structure

The project currently has:
- ✅ **Business logic utilities** (`src/utils/`) - Fully functional and tested
- ✅ **Test suite** (87 tests) - Ready to run
- ✅ **React components** (extracted for testing)
- 📄 **Full application code** in `FBPortal_10312025_10_08pmremixed-6893f845.tsx.txt`

**Note:** The main React application needs to be extracted from the `.txt` file to run the full UI.

---

## 🚀 Quick Start - Run Tests Locally

### Prerequisites
- Node.js v16+ ([Download here](https://nodejs.org/))
- npm (comes with Node.js)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/msmall12345/flobase-mvp1.git
cd flobase-mvp1
```

2. **Checkout the feature branch**
```bash
git checkout claude/flobase-capital-management-ui-011CV59BxsSCqHfq9BFUxuqU
```

3. **Install dependencies**
```bash
npm install
```

This will install:
- Jest (testing framework)
- React Testing Library
- Babel (JavaScript transpiler)
- All required development dependencies

---

## 🧪 Running Tests

### Run all tests
```bash
npm test
```

Expected output:
```
PASS src/__tests__/utils/eligibility.test.js
PASS src/__tests__/utils/performanceGuarantee.test.js
PASS src/__tests__/components/Badge.test.jsx
PASS src/__tests__/components/Card.test.jsx
PASS src/__tests__/components/StatCard.test.jsx

Test Suites: 5 passed, 5 total
Tests:       87 passed, 87 total
```

### Run tests in watch mode (recommended for development)
```bash
npm run test:watch
```

This will:
- Watch for file changes
- Re-run tests automatically
- Show only changed tests

### Run tests with coverage report
```bash
npm run test:coverage
```

This generates:
- Coverage statistics
- HTML coverage report in `coverage/` directory
- Line-by-line coverage details

### Run specific test file
```bash
npm test -- eligibility.test.js
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="performance"
```

---

## 🎨 Running the Full UI Application

The full React application code is in `FBPortal_10312025_10_08pmremixed-6893f845.tsx.txt`. Here's how to set it up:

### Option 1: Quick Setup with Vite (Recommended)

1. **Extract the application code**
```bash
# Create app file
mkdir -p src
cp FBPortal_10312025_10_08pmremixed-6893f845.tsx.txt src/App.jsx
```

2. **Install Vite and React**
```bash
npm install vite @vitejs/plugin-react react react-dom
```

3. **Create Vite config** (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

4. **Create entry point** (`index.html`)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Flobase Capital Management</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

5. **Create main entry** (`src/main.jsx`)
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

6. **Update package.json scripts**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

7. **Start development server**
```bash
npm run dev
```

8. **Open in browser**
```
http://localhost:5173
```

### Option 2: Create React App

```bash
# Create new React app
npx create-react-app flobase-ui
cd flobase-ui

# Copy the application code
cp ../FBPortal_10312025_10_08pmremixed-6893f845.tsx.txt src/App.js

# Install TailwindCSS
npm install -D tailwindcss
npx tailwindcss init

# Start development server
npm start
```

---

## 📁 Project Structure

```
flobase-mvp1/
├── src/
│   ├── utils/                           # Business logic (tested)
│   │   ├── eligibility.js              # Eligibility checking
│   │   └── performanceGuarantee.js     # Performance calculations
│   ├── components/                      # React components (tested)
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   └── StatCard.jsx
│   ├── __tests__/                       # Test files
│   │   ├── utils/
│   │   │   ├── eligibility.test.js
│   │   │   └── performanceGuarantee.test.js
│   │   └── components/
│   │       ├── Card.test.jsx
│   │       ├── Badge.test.jsx
│   │       └── StatCard.test.jsx
│   └── setupTests.js                    # Jest configuration
├── package.json                         # Dependencies and scripts
├── .babelrc                            # Babel configuration
├── .gitignore
├── README.md
├── TESTING.md                          # Testing documentation
├── CODE_REVIEW.md                      # Code review findings
├── IMPROVEMENTS_SUMMARY.md             # Summary of improvements
└── FBPortal_10312025_10_08pmremixed-6893f845.tsx.txt  # Full app code
```

---

## 🔧 Using Business Logic in Your Code

The utilities are ready to import and use:

### Example: Check Account Eligibility

```javascript
import { checkEligibility, DEFAULT_MAPPINGS, DEFAULT_RULES } from './src/utils/eligibility'

const accountData = {
  CLIENT_ID: 'CLT-10001',
  CREDIT_SCORE: 650,
  ENROLLED_DEBT: 25000,
  SETTLEMENT_FEE_PERCENTAGE: 28,
  FIRST_PAYMENT_CLEARED_DATE: '2025-09-15'
}

const result = checkEligibility(accountData, DEFAULT_MAPPINGS, DEFAULT_RULES)

console.log(result.allPass)  // true
console.log(result.checks)   // { firstPay: true, fico: true, debt: true, epf: true }
```

### Example: Check Performance Guarantee

```javascript
import { checkPerformanceGuarantee } from './src/utils/performanceGuarantee'

const vintage = {
  purchaseDate: '2025-05-13',
  purchasePrice: 1000000,
  terms: { hurdle: 125, pre: 75, post: 50 },
  performanceGuarantees: [{ period: 6, target: 21.2 }],
  performance: {
    cashCollections: [2.5, 5.2, 8.1, 11.0, 14.0, 17.0]
  }
}

const status = checkPerformanceGuarantee(vintage)

console.log(status.status)    // 'triggered', 'warning', or 'on-track'
console.log(status.message)   // Detailed status message
```

### Example: Calculate Portfolio Metrics

```javascript
import { calculatePortfolioMetrics } from './src/utils/performanceGuarantee'

const vintages = [
  {
    purchaseDate: '2025-05-13',
    purchasePrice: 1000000,
    totalEnrolledDebt: 14285714,
    terms: { hurdle: 125, pre: 75, post: 50 },
    performance: { cashCollections: [...], settlements: [...], cancellations: [...] }
  }
]

const metrics = calculatePortfolioMetrics(vintages)

console.log(metrics.totalCapitalDeployed)  // Total invested
console.log(metrics.totalCashCollected)    // Total returned (Flobase share)
console.log(metrics.weightedAvgAdvance)    // Average advance rate
```

---

## 🐛 Troubleshooting

### Tests won't run
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### "Cannot find module" errors
```bash
# Ensure you're in the project root
pwd
# Should show: .../flobase-mvp1

# Check if node_modules exists
ls node_modules
```

### Babel errors
```bash
# Verify .babelrc exists
cat .babelrc

# Should show:
# {
#   "presets": [
#     ["@babel/preset-env", { "targets": { "node": "current" } }],
#     ["@babel/preset-react", { "runtime": "automatic" }]
#   ]
# }
```

### Port already in use (for UI)
```bash
# Vite default port is 5173, change it:
npm run dev -- --port 3000
```

---

## 🌐 Environment Variables

If you need environment-specific configuration:

1. **Create `.env` file**
```bash
# .env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

2. **Access in code**
```javascript
const apiUrl = process.env.REACT_APP_API_URL
```

---

## 📦 Building for Production

### Build test suite (not typically needed)
```bash
npm run test:coverage
# Coverage report generated in coverage/
```

### Build React app (when UI is set up)
```bash
npm run build
# Creates optimized production build in dist/ or build/
```

### Preview production build
```bash
npm run preview
# Serves production build locally
```

---

## 🔄 Development Workflow

### 1. Make changes to code
Edit files in `src/utils/` or `src/components/`

### 2. Run tests in watch mode
```bash
npm run test:watch
```

Tests automatically re-run when you save files

### 3. Check coverage
```bash
npm run test:coverage
```

Ensure coverage stays above 70% threshold

### 4. Commit changes
```bash
git add .
git commit -m "Description of changes"
git push
```

---

## 📚 Additional Resources

- **Testing Guide:** See `TESTING.md` for detailed testing documentation
- **Code Review:** See `CODE_REVIEW.md` for improvement recommendations
- **API Documentation:** Functions are documented with JSDoc in source files
- **Jest Docs:** https://jestjs.io/
- **React Testing Library:** https://testing-library.com/react

---

## 🆘 Getting Help

### Check test output
```bash
npm test -- --verbose
# Shows detailed test execution
```

### Check specific test
```bash
npm test -- --testNamePattern="should calculate total cash"
# Runs only matching tests
```

### Generate coverage HTML
```bash
npm run test:coverage
# Open coverage/lcov-report/index.html in browser
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] `npm install` completes without errors
- [ ] `npm test` shows 87 passing tests
- [ ] `npm run test:coverage` shows 100% statement coverage
- [ ] No TypeErrors or module not found errors
- [ ] All files in `src/` directory

---

## 🚀 Quick Commands Reference

```bash
# Install
npm install

# Test commands
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage

# UI commands (after setup)
npm run dev                # Start dev server
npm run build              # Build for production
npm run preview            # Preview production build

# Utility commands
npm test -- --verbose      # Verbose test output
npm test -- eligibility    # Run specific test file
```

---

**Ready to go!** Start with `npm install && npm test` to verify everything works. 🎉

For the full UI, follow the "Running the Full UI Application" section above.
