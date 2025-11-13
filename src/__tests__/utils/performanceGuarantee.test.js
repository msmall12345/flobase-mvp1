import {
  calculateVintageAge,
  getCumulativeCashCollection,
  checkPerformanceGuarantee,
  calculatePortfolioMetrics
} from '../../utils/performanceGuarantee'

// Mock current date to 2025-11-13
const MOCK_NOW = new Date('2025-11-13T00:00:00.000Z')

describe('Performance Guarantee Utils', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(MOCK_NOW)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('calculateVintageAge', () => {
    it('should calculate age correctly for vintage purchased 6 months ago', () => {
      const purchaseDate = '2025-05-13' // Exactly 6 months ago
      const age = calculateVintageAge(purchaseDate)
      expect(age).toBe(6)
    })

    it('should calculate age correctly for vintage purchased 12 months ago', () => {
      const purchaseDate = '2024-11-13' // Exactly 12 months ago
      const age = calculateVintageAge(purchaseDate)
      expect(age).toBe(12)
    })

    it('should calculate age correctly for vintage purchased this month', () => {
      const purchaseDate = '2025-11-01' // Same month
      const age = calculateVintageAge(purchaseDate)
      expect(age).toBe(0)
    })

    it('should calculate age correctly for vintage purchased 1 month ago', () => {
      const purchaseDate = '2025-10-13' // 1 month ago
      const age = calculateVintageAge(purchaseDate)
      expect(age).toBe(1)
    })

    it('should handle year boundary correctly', () => {
      const purchaseDate = '2024-12-13' // 11 months ago
      const age = calculateVintageAge(purchaseDate)
      expect(age).toBe(11)
    })

    it('should return 0 for future dates', () => {
      const purchaseDate = '2025-12-13' // Future date
      const age = calculateVintageAge(purchaseDate)
      expect(age).toBe(0) // Math.max(0, months) ensures non-negative
    })

    it('should calculate age for vintage purchased 18 months ago', () => {
      const purchaseDate = '2024-05-13' // 18 months ago
      const age = calculateVintageAge(purchaseDate)
      expect(age).toBe(18)
    })
  })

  describe('getCumulativeCashCollection', () => {
    it('should return cumulative cash at vintage age', () => {
      const vintage = {
        purchaseDate: '2025-05-13', // 6 months ago
        performance: {
          cashCollections: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
        }
      }

      const cash = getCumulativeCashCollection(vintage)
      expect(cash).toBe(30) // Month 6 value
    })

    it('should return 0 for vintage with no performance data', () => {
      const vintage = {
        purchaseDate: '2025-05-13',
        performance: null
      }

      const cash = getCumulativeCashCollection(vintage)
      expect(cash).toBe(0)
    })

    it('should return 0 for vintage with age 0', () => {
      const vintage = {
        purchaseDate: '2025-11-13', // Today
        performance: {
          cashCollections: [5, 10, 15, 20, 25, 30]
        }
      }

      const cash = getCumulativeCashCollection(vintage)
      expect(cash).toBe(0)
    })

    it('should handle vintage older than data array', () => {
      const vintage = {
        purchaseDate: '2024-05-13', // 18 months ago
        performance: {
          cashCollections: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60] // Only 12 months
        }
      }

      const cash = getCumulativeCashCollection(vintage)
      expect(cash).toBe(60) // Last available value
    })

    it('should return 0 for empty cashCollections array', () => {
      const vintage = {
        purchaseDate: '2025-05-13',
        performance: {
          cashCollections: []
        }
      }

      const cash = getCumulativeCashCollection(vintage)
      expect(cash).toBe(0)
    })

    it('should return correct value for 1 month old vintage', () => {
      const vintage = {
        purchaseDate: '2025-10-13', // 1 month ago
        performance: {
          cashCollections: [8.5, 15.2, 22.1]
        }
      }

      const cash = getCumulativeCashCollection(vintage)
      expect(cash).toBe(8.5)
    })
  })

  describe('checkPerformanceGuarantee', () => {
    const baseVintage = {
      purchaseDate: '2025-05-13', // 6 months old
      purchasePrice: 1000000,
      terms: {
        hurdle: 125,
        pre: 75,
        post: 50
      },
      performance: {
        cashCollections: [2.5, 5.2, 8.1, 11.0, 14.0, 17.0, 20.0, 23.5, 27.0, 30.5, 34.0, 37.5]
      }
    }

    it('should return no-guarantee status when guarantees are missing', () => {
      const vintage = {
        ...baseVintage,
        performanceGuarantees: []
      }

      const status = checkPerformanceGuarantee(vintage)

      expect(status.status).toBe('no-guarantee')
      expect(status.message).toBe('No performance guarantee defined')
    })

    it('should return pending status before first measurement period', () => {
      const vintage = {
        ...baseVintage,
        purchaseDate: '2025-08-13', // 3 months old
        performanceGuarantees: [
          { period: 6, target: 21.2 },
          { period: 12, target: 50.1 }
        ]
      }

      const status = checkPerformanceGuarantee(vintage)

      expect(status.status).toBe('pending')
      expect(status.message).toBe('Before first measurement period')
      expect(status.vintageAge).toBe(3)
    })

    it('should return on-track status when above 95% threshold', () => {
      const vintage = {
        ...baseVintage,
        performance: {
          cashCollections: [2.5, 5.2, 8.1, 11.0, 14.0, 21.5] // 21.5% at month 6 (target 21.2%)
        },
        performanceGuarantees: [
          { period: 6, target: 21.2 }
        ]
      }

      const status = checkPerformanceGuarantee(vintage)

      expect(status.status).toBe('on-track')
      expect(status.message).toBe('On track - Above 95% threshold')
      expect(status.target).toBe(21.2)
      expect(status.min).toBeCloseTo(19.08) // 90% of 21.2
      expect(status.reset).toBeCloseTo(20.14) // 95% of 21.2
      expect(status.cumulativeCash).toBe(21.5)
      expect(status.delta).toBeCloseTo(0.3) // 21.5 - 21.2
    })

    it('should return warning status when between 90% and 95% threshold', () => {
      const vintage = {
        ...baseVintage,
        performance: {
          cashCollections: [2.5, 5.2, 8.1, 11.0, 14.0, 19.5] // 19.5% at month 6
        },
        performanceGuarantees: [
          { period: 6, target: 21.2 }
        ]
      }

      const status = checkPerformanceGuarantee(vintage)

      expect(status.status).toBe('warning')
      expect(status.message).toBe('Below 95% threshold - Warning zone')
      expect(status.cumulativeCash).toBe(19.5)
      expect(status.delta).toBeCloseTo(-0.64) // 19.5 - 20.14
    })

    it('should return triggered status when below 90% threshold', () => {
      const vintage = {
        ...baseVintage,
        performance: {
          cashCollections: [2.5, 5.2, 8.1, 11.0, 14.0, 17.0] // 17% at month 6
        },
        performanceGuarantees: [
          { period: 6, target: 21.2 }
        ]
      }

      const status = checkPerformanceGuarantee(vintage)

      expect(status.status).toBe('triggered')
      expect(status.message).toBe('Below 90% threshold - Split adjustment triggered')
      expect(status.cumulativeCash).toBe(17.0)
      expect(status.min).toBeCloseTo(19.08)
      expect(status.delta).toBeCloseTo(-2.08) // 17.0 - 19.08
    })

    it('should identify pre-hurdle phase correctly', () => {
      const vintage = {
        ...baseVintage,
        performance: {
          cashCollections: [2.5, 5.2, 8.1, 11.0, 14.0, 17.0] // Total cash = 17% of $1M = $170k
        },
        performanceGuarantees: [
          { period: 6, target: 21.2 }
        ]
      }

      const status = checkPerformanceGuarantee(vintage)

      // Hurdle is 125% of $1M = $1.25M, cash collected = $170k < hurdle
      expect(status.currentPhase).toBe('pre')
    })

    it('should identify post-hurdle phase correctly', () => {
      const vintage = {
        ...baseVintage,
        purchasePrice: 100000, // Lower purchase price
        performance: {
          cashCollections: [30, 60, 90, 120, 140, 150] // 150% of purchase price
        },
        performanceGuarantees: [
          { period: 6, target: 150 }
        ]
      }

      const status = checkPerformanceGuarantee(vintage)

      // Hurdle is 125% of $100k = $125k, cash = 150% of $100k = $150k > hurdle
      expect(status.currentPhase).toBe('post')
    })

    it('should handle between-periods status', () => {
      const vintage = {
        ...baseVintage,
        purchaseDate: '2025-04-13', // 7 months old
        performanceGuarantees: [
          { period: 6, target: 21.2 },
          { period: 9, target: 37.7 }
        ]
      }

      const status = checkPerformanceGuarantee(vintage)

      expect(status.status).toBe('between-periods')
      expect(status.message).toContain('Between measurement periods')
      expect(status.vintageAge).toBe(7)
      expect(status.nextPeriod).toEqual({ period: 9, target: 37.7 })
    })

    it('should handle exact threshold boundaries', () => {
      const vintage = {
        ...baseVintage,
        performance: {
          cashCollections: [2.5, 5.2, 8.1, 11.0, 14.0, 19.08] // Exactly at 90% threshold
        },
        performanceGuarantees: [
          { period: 6, target: 21.2 }
        ]
      }

      const status = checkPerformanceGuarantee(vintage)

      // At exactly 90%, should be warning (not triggered)
      expect(status.status).toBe('warning')
    })

    it('should handle multiple guarantee periods', () => {
      const vintage12Month = {
        ...baseVintage,
        purchaseDate: '2024-11-13', // 12 months old
        performance: {
          cashCollections: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 52, 54]
        },
        performanceGuarantees: [
          { period: 6, target: 21.2 },
          { period: 9, target: 37.7 },
          { period: 12, target: 50.1 }
        ]
      }

      const status = checkPerformanceGuarantee(vintage12Month)

      expect(status.vintageAge).toBe(12)
      expect(status.target).toBe(50.1)
      expect(status.cumulativeCash).toBe(54)
      expect(status.status).toBe('on-track')
    })
  })

  describe('calculatePortfolioMetrics', () => {
    const mockVintages = [
      {
        purchaseDate: '2025-05-13',
        purchasePrice: 1000000,
        totalEnrolledDebt: 14285714,
        accountCount: 100,
        terms: { hurdle: 125, pre: 75, post: 50 },
        performance: {
          cashCollections: [2.5, 5.2, 8.1, 11.0, 14.0, 17.0],
          settlements: [1.5, 3.0, 5.0, 8.0, 12.0, 16.0],
          cancellations: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
        }
      },
      {
        purchaseDate: '2025-02-13',
        purchasePrice: 500000,
        totalEnrolledDebt: 7142857,
        accountCount: 50,
        terms: { hurdle: 125, pre: 75, post: 50 },
        performance: {
          cashCollections: [3.0, 6.0, 9.0, 12.0, 15.0, 18.0, 21.0, 24.0, 27.0],
          settlements: [2.0, 4.0, 6.0, 9.0, 13.0, 17.0, 21.0, 25.0, 29.0],
          cancellations: [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]
        }
      }
    ]

    it('should calculate total capital deployed correctly', () => {
      const metrics = calculatePortfolioMetrics(mockVintages)
      expect(metrics.totalCapitalDeployed).toBe(1500000)
    })

    it('should calculate total enrolled debt correctly', () => {
      const metrics = calculatePortfolioMetrics(mockVintages)
      expect(metrics.totalEnrolledDebt).toBe(21428571)
    })

    it('should calculate weighted average advance rate correctly', () => {
      const metrics = calculatePortfolioMetrics(mockVintages)
      // (1500000 / 21428571) * 100 = ~7%
      expect(metrics.weightedAvgAdvance).toBeCloseTo(7.0, 1)
    })

    it('should calculate vintage count correctly', () => {
      const metrics = calculatePortfolioMetrics(mockVintages)
      expect(metrics.vintageCount).toBe(2)
    })

    it('should calculate total cash collected with splits correctly', () => {
      const metrics = calculatePortfolioMetrics(mockVintages)

      // Vintage 1: 6 months old
      // Cash collections array contains cumulative values: [2.5, 5.2, 8.1, 11.0, 14.0, 17.0]
      // At month 6, cashCollections[5] = 17.0% (NOT sum of all values)
      // Total cash = 17.0% of $1M = $170k
      // Hurdle = 125% of $1M = $1.25M, $170k < $1.25M, so pre-hurdle (75% split)
      // Flobase share = $170k * 0.75 = $127.5k

      // Vintage 2: 9 months old
      // cashCollections[8] = 27.0% at month 9
      // Total cash = 27.0% of $500k = $135k
      // Hurdle = 125% of $500k = $625k, $135k < $625k, so pre-hurdle (75% split)
      // Flobase share = $135k * 0.75 = $101.25k

      // Total = $127.5k + $101.25k = $228.75k
      expect(metrics.totalCashCollected).toBeCloseTo(228750, 0)
    })

    it('should calculate cancelled debt correctly', () => {
      const metrics = calculatePortfolioMetrics(mockVintages)

      // Vintage 1: 6 months, cancellations[5] = 3.0% of $14,285,714 = $428,571.42
      // Vintage 2: 9 months, cancellations[8] = 5.0% of $7,142,857 = $357,142.85
      // Total = $785,714.27
      expect(metrics.totalCancelledDebt).toBeCloseTo(785714, -1) // Within $5
    })

    it('should calculate settled debt correctly', () => {
      const metrics = calculatePortfolioMetrics(mockVintages)

      // Vintage 1: 6 months, settlements[5] = 16.0% of $14,285,714 = $2,285,714.24
      // Vintage 2: 9 months, settlements[8] = 29.0% of $7,142,857 = $2,071,428.53
      // Total = $4,357,142.77
      expect(metrics.totalSettledDebt).toBeCloseTo(4357143, -1) // Within $5
    })

    it('should calculate active debt correctly', () => {
      const metrics = calculatePortfolioMetrics(mockVintages)

      // Active = Enrolled - Cancelled - Settled
      const expectedActive = metrics.totalEnrolledDebt - metrics.totalCancelledDebt - metrics.totalSettledDebt
      expect(metrics.totalActiveDebt).toBeCloseTo(expectedActive, 0)
    })

    it('should handle empty vintages array', () => {
      const metrics = calculatePortfolioMetrics([])

      expect(metrics.totalCapitalDeployed).toBe(0)
      expect(metrics.totalEnrolledDebt).toBe(0)
      expect(metrics.totalCashCollected).toBe(0)
      expect(metrics.totalActiveDebt).toBe(0)
      expect(metrics.weightedAvgAdvance).toBe(0)
      expect(metrics.vintageCount).toBe(0)
    })

    it('should handle vintages without performance data', () => {
      const vintagesNoPerf = [
        {
          purchaseDate: '2025-05-13',
          purchasePrice: 1000000,
          totalEnrolledDebt: 14285714,
          terms: { hurdle: 125, pre: 75, post: 50 },
          performance: null
        }
      ]

      const metrics = calculatePortfolioMetrics(vintagesNoPerf)

      expect(metrics.totalCapitalDeployed).toBe(1000000)
      expect(metrics.totalCashCollected).toBe(0)
      expect(metrics.totalCancelledDebt).toBe(0)
      expect(metrics.totalSettledDebt).toBe(0)
    })

    it('should handle post-hurdle vintages correctly', () => {
      const postHurdleVintages = [
        {
          purchaseDate: '2025-05-13',
          purchasePrice: 100000,
          totalEnrolledDebt: 1428571,
          terms: { hurdle: 125, pre: 75, post: 50 },
          performance: {
            cashCollections: [30, 60, 90, 120, 140, 150], // Cumulative percentages
            settlements: [],
            cancellations: []
          }
        }
      ]

      const metrics = calculatePortfolioMetrics(postHurdleVintages)

      // 6 months old, cashCollections[5] = 150%
      // Total cash = 150% of $150k = $150k
      // Hurdle = 125% of $100k = $125k, $150k > $125k so post-hurdle (50% split)
      // Flobase share = $150k * 0.50 = $75k
      expect(metrics.totalCashCollected).toBeCloseTo(75000, 0)
    })

    it('should throw error when vintages is not an array', () => {
      expect(() => calculatePortfolioMetrics(null)).toThrow('vintages must be an array')
      expect(() => calculatePortfolioMetrics(undefined)).toThrow('vintages must be an array')
      expect(() => calculatePortfolioMetrics('not-an-array')).toThrow('vintages must be an array')
      expect(() => calculatePortfolioMetrics({})).toThrow('vintages must be an array')
    })
  })
})
