# Quick Start Guide - Flobase Capital Management

## 🚀 Get Started in 3 Steps

### 1. Clone and Install
```bash
git clone https://github.com/msmall12345/flobase-mvp1.git
cd flobase-mvp1
git checkout claude/flobase-capital-management-ui-011CV59BxsSCqHfq9BFUxuqU

npm install
```

### 2. Run the Application
```bash
npm run dev
```

**The app will open automatically at:** http://localhost:3000

### 3. (Optional) Run Tests
```bash
npm test
```

---

## 🎯 What's Available

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run all tests (87 tests) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |

---

## 📱 Application Features

### Module 1: Eligibility & Purchase
- **Partner Selection** - Choose debt settlement company
- **File Upload** - CSV/Excel portfolio files
- **Eligibility Checking** - Automated account qualification
  - FICO score ≥ 520
  - Enrolled debt ≥ $15,000
  - EPF % ≥ 25%
  - First payment cleared
- **Review & Purchase** - Execute vintage purchases

### Module 2: Performance Monitoring
- **Portfolio Dashboard** - Aggregate metrics across all vintages
- **DSC Performance** - Partner-level analytics
- **Vintage Details** - Individual vintage performance
- **Performance Guarantees** - Automated monitoring with split adjustments
  - Status: On-track / Warning / Triggered
  - Thresholds: 90% (trigger), 95% (warning)
  - Automated split adjustment buttons

---

## 🏗️ Architecture

```
Application Stack:
├── React 18.3        (UI framework)
├── Vite 7.2          (Build tool & dev server)
├── TailwindCSS       (Styling via CDN)
├── Jest 29.7         (Testing framework)
└── Tested Utilities  (Business logic)
```

### File Structure
```
flobase-mvp1/
├── src/
│   ├── App.jsx                      # Main application
│   ├── main.jsx                     # React entry point
│   ├── utils/                       # Business logic (tested)
│   │   ├── eligibility.js          # Account qualification
│   │   └── performanceGuarantee.js # Performance calculations
│   ├── components/                  # UI components (tested)
│   │   ├── Badge.jsx
│   │   ├── Card.jsx
│   │   └── StatCard.jsx
│   └── __tests__/                   # Test suite (87 tests)
├── index.html                       # HTML entry
├── vite.config.js                   # Vite configuration
└── package.json                     # Dependencies & scripts
```

---

## ✅ Verification

After installation, verify everything works:

```bash
# 1. Install dependencies
npm install
# ✅ Should complete without errors

# 2. Run tests
npm test
# ✅ Should show: 87 tests passing

# 3. Start dev server
npm run dev
# ✅ Should open http://localhost:3000

# 4. Build for production
npm run build
# ✅ Should create dist/ folder (199KB bundle)
```

---

## 🎨 Using the Application

### Add a New Partner
1. Click "Add Partner" on the partner selection screen
2. Enter partner details:
   - Name and code
   - Hurdle percentage (default: 125%)
   - Pre/post hurdle splits (e.g., 75% / 50%)
   - Advance rate percentage
   - Performance guarantee periods and targets

### Process Portfolio Purchase
1. Select a partner
2. Upload CSV/Excel file (or use sample data)
3. Review eligibility criteria
4. Run eligibility check
5. Review results (eligible vs ineligible accounts)
6. Set purchase price and chargeback reduction
7. Execute purchase

### Monitor Performance
1. Navigate to "Performance Monitoring"
2. View portfolio-level metrics
3. Click partner to see DSC details
4. Click vintage to see performance curves
5. Watch for performance guarantee triggers
6. Adjust splits when triggered

---

## 🧪 Business Logic Examples

### Check Account Eligibility
```javascript
import { checkEligibility, DEFAULT_MAPPINGS, DEFAULT_RULES } from './src/utils/eligibility'

const account = {
  CLIENT_ID: 'CLT-10001',
  CREDIT_SCORE: 650,
  ENROLLED_DEBT: 25000,
  SETTLEMENT_FEE_PERCENTAGE: 28,
  FIRST_PAYMENT_CLEARED_DATE: '2025-09-15'
}

const result = checkEligibility(account, DEFAULT_MAPPINGS, DEFAULT_RULES)
console.log(result.allPass) // true
```

### Check Performance Guarantee
```javascript
import { checkPerformanceGuarantee } from './src/utils/performanceGuarantee'

const vintage = {
  purchaseDate: '2025-05-13',
  purchasePrice: 1000000,
  terms: { hurdle: 125, pre: 75, post: 50 },
  performanceGuarantees: [{ period: 6, target: 21.2 }],
  performance: { cashCollections: [2.5, 5.2, 8.1, 11.0, 14.0, 17.0] }
}

const status = checkPerformanceGuarantee(vintage)
console.log(status.status) // 'triggered', 'warning', or 'on-track'
```

### Calculate Portfolio Metrics
```javascript
import { calculatePortfolioMetrics } from './src/utils/performanceGuarantee'

const vintages = [...] // Array of vintage objects

const metrics = calculatePortfolioMetrics(vintages)
console.log(metrics.totalCapitalDeployed)
console.log(metrics.totalCashCollected)
console.log(metrics.weightedAvgAdvance)
```

---

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Change port in vite.config.js or:
npm run dev -- --port 3001
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json dist
npm install
```

### Tests failing
```bash
# Clear Jest cache
npm test -- --clearCache
npm test
```

### Build errors
```bash
# Check for syntax errors
npm run build
# View detailed errors
```

---

## 📊 Test Coverage

```
Coverage Summary:
├── Statements: 100%
├── Branches:   89.33%
├── Functions:  100%
└── Lines:      100%

Test Suites: 5 passed
Tests:       87 passed
```

Run `npm run test:coverage` to see detailed coverage report.

---

## 🎓 Key Concepts

### Performance Guarantees
- **Target:** Expected cumulative cash collection at measurement period
- **Minimum (90%):** Below this triggers split adjustment
- **Reset (95%):** Warning zone between 90-95%
- **Measurement Periods:** Typically 6, 9, 12, 18 months

### Split Adjustments
- **Pre-hurdle:** Before reaching 125% of purchase price
- **Post-hurdle:** After crossing 125% threshold
- Example: 75% pre-hurdle → 50% post-hurdle

### Vintage Data
- **Purchase Date:** When vintage was acquired
- **Enrolled Debt:** Total debt at purchase
- **Purchase Price:** Actual amount paid (% of enrolled)
- **Performance Arrays:** Cumulative percentages by month

---

## 📚 Additional Documentation

- **`README.md`** - Project overview
- **`TESTING.md`** - Comprehensive testing guide
- **`DEPLOYMENT.md`** - Detailed deployment instructions
- **`CODE_REVIEW.md`** - Technical code review
- **`IMPROVEMENTS_SUMMARY.md`** - Enhancements and fixes

---

## 🚢 Deployment Ready

The application is production-ready:

✅ Critical bug fixed (portfolio calculations)
✅ 87 tests passing (100% statement coverage)
✅ Clean build (199KB gzipped to 58KB)
✅ Integrated tested business logic
✅ Modern React 18 + Vite setup

To deploy to production:
```bash
npm run build
# Upload dist/ folder to hosting service
```

---

## 🆘 Need Help?

1. **Check documentation** - See docs listed above
2. **Run tests** - `npm test` to verify setup
3. **Check console** - Browser DevTools for runtime errors
4. **Review commit history** - See what changed
5. **Contact team** - For additional support

---

**Ready to go!** Start with `npm run dev` 🚀

Last updated: 2025-11-13
