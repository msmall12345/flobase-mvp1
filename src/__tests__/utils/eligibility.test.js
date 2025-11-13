import {
  checkEligibility,
  validateMappings,
  countEligibility,
  DEFAULT_MAPPINGS,
  DEFAULT_RULES
} from '../../utils/eligibility'

describe('Eligibility Utils', () => {
  describe('checkEligibility', () => {
    const mappings = DEFAULT_MAPPINGS
    const rules = DEFAULT_RULES

    it('should pass all checks for a fully eligible account', () => {
      const row = {
        CLIENT_ID: 'CLT-10001',
        ACCOUNT_NAME: 'Test Account',
        CREDIT_SCORE: 650,
        ENROLLED_DEBT: 25000,
        SETTLEMENT_FEE_PERCENTAGE: 28,
        FIRST_PAYMENT_CLEARED_DATE: '2025-09-15'
      }

      const result = checkEligibility(row, mappings, rules)

      expect(result.allPass).toBe(true)
      expect(result.checks.firstPay).toBe(true)
      expect(result.checks.fico).toBe(true)
      expect(result.checks.debt).toBe(true)
      expect(result.checks.epf).toBe(true)
    })

    it('should fail when FICO is below threshold', () => {
      const row = {
        CLIENT_ID: 'CLT-10002',
        ACCOUNT_NAME: 'Test Account',
        CREDIT_SCORE: 500, // Below 520 threshold
        ENROLLED_DEBT: 25000,
        SETTLEMENT_FEE_PERCENTAGE: 28,
        FIRST_PAYMENT_CLEARED_DATE: '2025-09-15'
      }

      const result = checkEligibility(row, mappings, rules)

      expect(result.allPass).toBe(false)
      expect(result.checks.fico).toBe(false)
      expect(result.checks.debt).toBe(true)
      expect(result.checks.epf).toBe(true)
      expect(result.checks.firstPay).toBe(true)
    })

    it('should fail when enrolled debt is below threshold', () => {
      const row = {
        CLIENT_ID: 'CLT-10003',
        ACCOUNT_NAME: 'Test Account',
        CREDIT_SCORE: 650,
        ENROLLED_DEBT: 10000, // Below 15000 threshold
        SETTLEMENT_FEE_PERCENTAGE: 28,
        FIRST_PAYMENT_CLEARED_DATE: '2025-09-15'
      }

      const result = checkEligibility(row, mappings, rules)

      expect(result.allPass).toBe(false)
      expect(result.checks.debt).toBe(false)
      expect(result.checks.fico).toBe(true)
      expect(result.checks.epf).toBe(true)
      expect(result.checks.firstPay).toBe(true)
    })

    it('should fail when EPF percentage is below threshold', () => {
      const row = {
        CLIENT_ID: 'CLT-10004',
        ACCOUNT_NAME: 'Test Account',
        CREDIT_SCORE: 650,
        ENROLLED_DEBT: 25000,
        SETTLEMENT_FEE_PERCENTAGE: 20, // Below 25 threshold
        FIRST_PAYMENT_CLEARED_DATE: '2025-09-15'
      }

      const result = checkEligibility(row, mappings, rules)

      expect(result.allPass).toBe(false)
      expect(result.checks.epf).toBe(false)
      expect(result.checks.fico).toBe(true)
      expect(result.checks.debt).toBe(true)
      expect(result.checks.firstPay).toBe(true)
    })

    it('should fail when first payment is not cleared', () => {
      const row = {
        CLIENT_ID: 'CLT-10005',
        ACCOUNT_NAME: 'Test Account',
        CREDIT_SCORE: 650,
        ENROLLED_DEBT: 25000,
        SETTLEMENT_FEE_PERCENTAGE: 28,
        FIRST_PAYMENT_CLEARED_DATE: null // No first payment
      }

      const result = checkEligibility(row, mappings, rules)

      expect(result.allPass).toBe(false)
      expect(result.checks.firstPay).toBe(false)
      expect(result.checks.fico).toBe(true)
      expect(result.checks.debt).toBe(true)
      expect(result.checks.epf).toBe(true)
    })

    it('should fail when first payment is empty string', () => {
      const row = {
        CLIENT_ID: 'CLT-10006',
        ACCOUNT_NAME: 'Test Account',
        CREDIT_SCORE: 650,
        ENROLLED_DEBT: 25000,
        SETTLEMENT_FEE_PERCENTAGE: 28,
        FIRST_PAYMENT_CLEARED_DATE: '' // Empty string
      }

      const result = checkEligibility(row, mappings, rules)

      expect(result.allPass).toBe(false)
      expect(result.checks.firstPay).toBe(false)
    })

    it('should handle exact threshold values correctly', () => {
      const row = {
        CLIENT_ID: 'CLT-10007',
        ACCOUNT_NAME: 'Test Account',
        CREDIT_SCORE: 520, // Exactly at threshold
        ENROLLED_DEBT: 15000, // Exactly at threshold
        SETTLEMENT_FEE_PERCENTAGE: 25, // Exactly at threshold
        FIRST_PAYMENT_CLEARED_DATE: '2025-09-15'
      }

      const result = checkEligibility(row, mappings, rules)

      expect(result.allPass).toBe(true)
      expect(result.checks.fico).toBe(true)
      expect(result.checks.debt).toBe(true)
      expect(result.checks.epf).toBe(true)
    })

    it('should handle missing numeric values as 0', () => {
      const row = {
        CLIENT_ID: 'CLT-10008',
        ACCOUNT_NAME: 'Test Account',
        CREDIT_SCORE: null,
        ENROLLED_DEBT: undefined,
        SETTLEMENT_FEE_PERCENTAGE: null,
        FIRST_PAYMENT_CLEARED_DATE: '2025-09-15'
      }

      const result = checkEligibility(row, mappings, rules)

      expect(result.allPass).toBe(false)
      expect(result.checks.fico).toBe(false)
      expect(result.checks.debt).toBe(false)
      expect(result.checks.epf).toBe(false)
      expect(result.checks.firstPay).toBe(true)
    })

    it('should skip disabled rules', () => {
      const row = {
        CLIENT_ID: 'CLT-10009',
        ACCOUNT_NAME: 'Test Account',
        CREDIT_SCORE: 400, // Would fail if enabled
        ENROLLED_DEBT: 5000, // Would fail if enabled
        SETTLEMENT_FEE_PERCENTAGE: 10, // Would fail if enabled
        FIRST_PAYMENT_CLEARED_DATE: '2025-09-15'
      }

      const rulesWithDisabled = rules.map(r => ({ ...r, enabled: false }))

      const result = checkEligibility(row, mappings, rulesWithDisabled)

      expect(result.allPass).toBe(true)
      expect(Object.keys(result.checks)).toHaveLength(0)
    })

    it('should handle custom mappings', () => {
      const customMappings = {
        firstPaymentCleared: 'CUSTOM_FIRST_PAY',
        fico: 'CUSTOM_FICO',
        enrolledDebt: 'CUSTOM_DEBT',
        epfPct: 'CUSTOM_EPF',
        clientId: 'CUSTOM_CLIENT',
        accountName: 'CUSTOM_ACCOUNT'
      }

      const row = {
        CUSTOM_CLIENT: 'CLT-10010',
        CUSTOM_ACCOUNT: 'Test Account',
        CUSTOM_FICO: 650,
        CUSTOM_DEBT: 25000,
        CUSTOM_EPF: 28,
        CUSTOM_FIRST_PAY: '2025-09-15'
      }

      const result = checkEligibility(row, customMappings, rules)

      expect(result.allPass).toBe(true)
    })

    it('should handle lte rule type', () => {
      const customRules = [
        { id: 'maxDebt', field: 'enrolledDebt', type: 'lte', value: 50000, enabled: true }
      ]

      const rowPass = {
        ENROLLED_DEBT: 40000
      }

      const rowFail = {
        ENROLLED_DEBT: 60000
      }

      const resultPass = checkEligibility(rowPass, mappings, customRules)
      const resultFail = checkEligibility(rowFail, mappings, customRules)

      expect(resultPass.allPass).toBe(true)
      expect(resultFail.allPass).toBe(false)
    })

    it('should fail when multiple criteria are not met', () => {
      const row = {
        CLIENT_ID: 'CLT-10011',
        ACCOUNT_NAME: 'Test Account',
        CREDIT_SCORE: 400, // Fail
        ENROLLED_DEBT: 5000, // Fail
        SETTLEMENT_FEE_PERCENTAGE: 10, // Fail
        FIRST_PAYMENT_CLEARED_DATE: null // Fail
      }

      const result = checkEligibility(row, mappings, rules)

      expect(result.allPass).toBe(false)
      expect(result.checks.fico).toBe(false)
      expect(result.checks.debt).toBe(false)
      expect(result.checks.epf).toBe(false)
      expect(result.checks.firstPay).toBe(false)
    })
  })

  describe('validateMappings', () => {
    it('should validate correct mappings', () => {
      const validMappings = {
        clientId: 'CLIENT_ID',
        fico: 'CREDIT_SCORE',
        enrolledDebt: 'ENROLLED_DEBT',
        epfPct: 'SETTLEMENT_FEE_PERCENTAGE',
        firstPaymentCleared: 'FIRST_PAYMENT_CLEARED_DATE'
      }

      expect(validateMappings(validMappings)).toBe(true)
    })

    it('should reject mappings with missing fields', () => {
      const invalidMappings = {
        clientId: 'CLIENT_ID',
        fico: 'CREDIT_SCORE'
        // Missing other required fields
      }

      expect(validateMappings(invalidMappings)).toBe(false)
    })

    it('should reject mappings with empty string values', () => {
      const invalidMappings = {
        clientId: 'CLIENT_ID',
        fico: '',
        enrolledDebt: 'ENROLLED_DEBT',
        epfPct: 'SETTLEMENT_FEE_PERCENTAGE',
        firstPaymentCleared: 'FIRST_PAYMENT_CLEARED_DATE'
      }

      expect(validateMappings(invalidMappings)).toBe(false)
    })

    it('should reject mappings with whitespace-only values', () => {
      const invalidMappings = {
        clientId: 'CLIENT_ID',
        fico: '   ',
        enrolledDebt: 'ENROLLED_DEBT',
        epfPct: 'SETTLEMENT_FEE_PERCENTAGE',
        firstPaymentCleared: 'FIRST_PAYMENT_CLEARED_DATE'
      }

      expect(validateMappings(invalidMappings)).toBe(false)
    })
  })

  describe('countEligibility', () => {
    it('should count eligible and ineligible accounts correctly', () => {
      const results = [
        { allPass: true },
        { allPass: true },
        { allPass: false },
        { allPass: true },
        { allPass: false },
        { allPass: false }
      ]

      const counts = countEligibility(results)

      expect(counts.eligible).toBe(3)
      expect(counts.ineligible).toBe(3)
      expect(counts.total).toBe(6)
    })

    it('should handle all eligible accounts', () => {
      const results = [
        { allPass: true },
        { allPass: true },
        { allPass: true }
      ]

      const counts = countEligibility(results)

      expect(counts.eligible).toBe(3)
      expect(counts.ineligible).toBe(0)
      expect(counts.total).toBe(3)
    })

    it('should handle all ineligible accounts', () => {
      const results = [
        { allPass: false },
        { allPass: false },
        { allPass: false }
      ]

      const counts = countEligibility(results)

      expect(counts.eligible).toBe(0)
      expect(counts.ineligible).toBe(3)
      expect(counts.total).toBe(3)
    })

    it('should handle empty results array', () => {
      const results = []

      const counts = countEligibility(results)

      expect(counts.eligible).toBe(0)
      expect(counts.ineligible).toBe(0)
      expect(counts.total).toBe(0)
    })
  })
})
