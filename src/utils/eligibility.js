/**
 * Eligibility checking utilities for portfolio management
 */

export const DEFAULT_MAPPINGS = {
  firstPaymentCleared: 'FIRST_PAYMENT_CLEARED_DATE',
  fico: 'CREDIT_SCORE',
  enrolledDebt: 'ENROLLED_DEBT',
  epfPct: 'SETTLEMENT_FEE_PERCENTAGE',
  clientId: 'CLIENT_ID',
  accountName: 'ACCOUNT_NAME',
}

export const DEFAULT_RULES = [
  { id: 'firstPay', label: 'First payment cleared', field: 'firstPaymentCleared', type: 'exists', enabled: true },
  { id: 'fico', label: 'FICO ≥', field: 'fico', type: 'gte', value: 520, enabled: true, editable: true },
  { id: 'debt', label: 'Enrolled debt ≥', field: 'enrolledDebt', type: 'gte', value: 15000, enabled: true, editable: true },
  { id: 'epf', label: 'EPF % ≥', field: 'epfPct', type: 'gte', value: 25, enabled: true, editable: true },
]

/**
 * Check if an account row meets all eligibility criteria
 * @param {Object} row - Account data row
 * @param {Object} mappings - Column name mappings
 * @param {Array} rules - Eligibility rules to apply
 * @returns {Object} - { checks: Object, allPass: boolean }
 */
export function checkEligibility(row, mappings, rules) {
  const results = {}

  for (const rule of rules) {
    if (!rule.enabled) continue

    const colName = mappings[rule.field]
    const value = row[colName]

    if (rule.type === 'exists') {
      results[rule.id] = !!value && value !== ''
    } else if (rule.type === 'gte') {
      results[rule.id] = (value || 0) >= rule.value
    } else if (rule.type === 'lte') {
      results[rule.id] = (value || 0) <= rule.value
    }
  }

  const allPass = Object.values(results).every(v => v === true)
  return { checks: results, allPass }
}

/**
 * Validate mappings configuration
 * @param {Object} mappings - Column mappings to validate
 * @returns {boolean} - True if valid
 */
export function validateMappings(mappings) {
  const requiredFields = ['clientId', 'fico', 'enrolledDebt', 'epfPct', 'firstPaymentCleared']
  return requiredFields.every(field => mappings[field] && mappings[field].trim() !== '')
}

/**
 * Count eligible vs ineligible accounts
 * @param {Array} results - Array of eligibility results
 * @returns {Object} - { eligible: number, ineligible: number, total: number }
 */
export function countEligibility(results) {
  const eligible = results.filter(r => r.allPass).length
  const ineligible = results.length - eligible
  return { eligible, ineligible, total: results.length }
}
