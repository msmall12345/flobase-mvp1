/**
 * Performance guarantee monitoring and calculations
 */

/**
 * Calculate the age of a vintage in months from purchase date to now
 * @param {string} purchaseDate - ISO date string
 * @returns {number} - Age in months
 */
export function calculateVintageAge(purchaseDate) {
  const purchase = new Date(purchaseDate)
  const now = new Date()
  const months = (now.getFullYear() - purchase.getFullYear()) * 12 + (now.getMonth() - purchase.getMonth())
  return Math.max(0, months)
}

/**
 * Get cumulative cash collection percentage for a vintage
 * @param {Object} vintage - Vintage object with performance data
 * @returns {number} - Cumulative cash collection percentage
 */
export function getCumulativeCashCollection(vintage) {
  if (!vintage.performance?.cashCollections) return 0
  const vintageAge = calculateVintageAge(vintage.purchaseDate)
  if (vintageAge === 0) return 0

  // cashCollections array contains cumulative percentages
  const idx = Math.min(vintageAge - 1, vintage.performance.cashCollections.length - 1)
  return idx >= 0 ? vintage.performance.cashCollections[idx] : 0
}

/**
 * Check performance guarantee status for a vintage
 * @param {Object} vintage - Vintage object with performance guarantees and data
 * @returns {Object} - Status object with detailed information
 */
export function checkPerformanceGuarantee(vintage) {
  if (!vintage.performanceGuarantees || vintage.performanceGuarantees.length === 0) {
    return { status: 'no-guarantee', message: 'No performance guarantee defined' }
  }

  const vintageAge = calculateVintageAge(vintage.purchaseDate)
  const cumulativeCash = getCumulativeCashCollection(vintage)

  // Check if we're at a measurement period
  const guarantee = vintage.performanceGuarantees.find(g => g.period === vintageAge)

  if (!guarantee) {
    // Not at a measurement period - use closest prior period for display
    const priorGuarantees = vintage.performanceGuarantees.filter(g => g.period < vintageAge)
    if (priorGuarantees.length === 0) {
      return { status: 'pending', message: 'Before first measurement period', vintageAge, cumulativeCash }
    }
    const closestPrior = priorGuarantees[priorGuarantees.length - 1]
    return {
      status: 'between-periods',
      message: `Between measurement periods (last: M${closestPrior.period})`,
      vintageAge,
      cumulativeCash,
      nextPeriod: vintage.performanceGuarantees.find(g => g.period > vintageAge)
    }
  }

  const target = guarantee.target
  const min = target * 0.90  // 90% threshold
  const reset = target * 0.95  // 95% threshold

  // Determine current phase (pre or post hurdle)
  const hurdleAmount = vintage.purchasePrice * (vintage.terms.hurdle / 100)
  const totalCashCollected = (cumulativeCash / 100) * vintage.purchasePrice
  const currentPhase = totalCashCollected >= hurdleAmount ? 'post' : 'pre'

  // Check thresholds
  if (cumulativeCash < min) {
    return {
      status: 'triggered',
      message: 'Below 90% threshold - Split adjustment triggered',
      vintageAge,
      cumulativeCash,
      target,
      min,
      reset,
      currentPhase,
      delta: cumulativeCash - min
    }
  } else if (cumulativeCash < reset) {
    return {
      status: 'warning',
      message: 'Below 95% threshold - Warning zone',
      vintageAge,
      cumulativeCash,
      target,
      min,
      reset,
      currentPhase,
      delta: cumulativeCash - reset
    }
  } else {
    return {
      status: 'on-track',
      message: 'On track - Above 95% threshold',
      vintageAge,
      cumulativeCash,
      target,
      min,
      reset,
      currentPhase,
      delta: cumulativeCash - target
    }
  }
}

/**
 * Calculate portfolio-level metrics
 * @param {Array} vintages - Array of vintage objects
 * @returns {Object} - Aggregated metrics
 */
export function calculatePortfolioMetrics(vintages) {
  const totalCapitalDeployed = vintages.reduce((sum, v) => sum + v.purchasePrice, 0)
  const totalEnrolledDebt = vintages.reduce((sum, v) => sum + v.totalEnrolledDebt, 0)

  // Calculate total cash collected (Flobase's share based on splits)
  const totalCashCollected = vintages.reduce((sum, v) => {
    if (!v.performance?.cashCollections) return sum
    const vintageAge = calculateVintageAge(v.purchaseDate)
    const cumulativeCashPct = v.performance.cashCollections
      .slice(0, Math.min(vintageAge, v.performance.cashCollections.length))
      .reduce((acc, val) => acc + val, 0)
    const totalCash = (cumulativeCashPct / 100) * v.purchasePrice

    // Determine current phase
    const hurdleAmount = v.purchasePrice * (v.terms.hurdle / 100)
    const currentPhase = totalCash >= hurdleAmount ? 'post' : 'pre'
    const currentSplit = v.terms[currentPhase]

    // Flobase's share
    const flobaseShare = totalCash * (currentSplit / 100)
    return sum + flobaseShare
  }, 0)

  // Calculate cancelled and settled amounts
  let totalCancelledDebt = 0
  let totalSettledDebt = 0

  vintages.forEach(v => {
    if (!v.performance) return
    const vintageAge = calculateVintageAge(v.purchaseDate)

    if (v.performance.cancellations) {
      const cumulativeCancelPct = v.performance.cancellations
        .slice(0, Math.min(vintageAge, v.performance.cancellations.length))
        .reduce((acc, val) => acc + val, 0)
      totalCancelledDebt += (cumulativeCancelPct / 100) * v.totalEnrolledDebt
    }

    if (v.performance.settlements) {
      const cumulativeSettlePct = v.performance.settlements
        .slice(0, Math.min(vintageAge, v.performance.settlements.length))
        .reduce((acc, val) => acc + val, 0)
      totalSettledDebt += (cumulativeSettlePct / 100) * v.totalEnrolledDebt
    }
  })

  const totalActiveDebt = totalEnrolledDebt - totalCancelledDebt - totalSettledDebt
  const weightedAvgAdvance = totalEnrolledDebt > 0 ? (totalCapitalDeployed / totalEnrolledDebt) * 100 : 0

  return {
    totalCapitalDeployed,
    totalEnrolledDebt,
    totalCashCollected,
    totalActiveDebt,
    totalCancelledDebt,
    totalSettledDebt,
    weightedAvgAdvance,
    vintageCount: vintages.length
  }
}
