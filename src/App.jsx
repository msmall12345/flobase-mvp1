import React, { useMemo, useState } from 'react'

// Import tested utility functions
import {
  checkEligibility,
  DEFAULT_MAPPINGS,
  DEFAULT_RULES
} from './utils/eligibility'

import {
  calculateVintageAge,
  getCumulativeCashCollection,
  checkPerformanceGuarantee,
  calculatePortfolioMetrics
} from './utils/performanceGuarantee'

// Enhanced UI Components with modern styling
function Button({ children, variant = 'primary', size = 'md', loading, disabled, ...props }) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  return (
    <button 
      className={`${variants[variant]} ${sizes[size]} rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      )}
      {children}
    </button>
  )
}

function Card({ children, className = '', hoverable, ...props }) {
  return (
    <div 
      className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm overflow-hidden ${hoverable ? 'transition-all duration-200 hover:shadow-md hover:border-gray-300' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700'
  }
  
  return (
    <span className={`${variants[variant]} px-2.5 py-0.5 rounded-full text-xs font-semibold`}>
      {children}
    </span>
  )
}

function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }
  return (
    <div className="flex items-center justify-center p-8">
      <svg className={`animate-spin ${sizes[size]} text-blue-600`} viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
    </div>
  )
}

function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-12 px-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {action}
    </div>
  )
}

function StatCard({ label, value, sublabel, trend, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    gray: 'bg-gray-50 border-gray-200'
  }
  
  return (
    <Card className={colors[color]}>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mb-1 break-words">{value}</p>
        {sublabel && <p className="text-xs text-gray-500 truncate">{sublabel}</p>}
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        </div>
      )}
    </Card>
  )
}

function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-4">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-gray-400">/</span>}
          <button
            onClick={item.onClick}
            className={`${i === items.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  )
}

const Currency = ({ value }) => <span>${value?.toLocaleString() || '0'}</span>

// Demo data
const demoPartners = [
  { 
    id:'cordoba', 
    name:'Cordoba Law Group', 
    code:'CLG', 
    terms:{ hurdle:125, pre:75, post:50 },
    advanceRate: 7.0,
    chargeBackPolicy: 'Full Duration',
    performanceGuarantees: [
      { period: 6, target: 21.2 },
      { period: 9, target: 37.7 },
      { period: 12, target: 50.1 },
      { period: 18, target: 66.8 }
    ]
  },
  { 
    id:'accs', 
    name:'ACCS', 
    code:'ACCS', 
    terms:{ hurdle:125, pre:75, post:50 },
    advanceRate: 6.5,
    chargeBackPolicy: '90 Days',
    performanceGuarantees: [
      { period: 6, target: 20.0 },
      { period: 9, target: 35.0 },
      { period: 12, target: 48.0 },
      { period: 18, target: 64.0 }
    ]
  }
]

// Mock data loader for demo vintages
function loadMockVintages() {
  const mockVintages = []
  const months = [
    {month: 'APR', year: 2025, date: '2025-04-15'},
    {month: 'AUG', year: 2025, date: '2025-08-15'},
    {month: 'OCT', year: 2025, date: '2025-10-15'}
  ]
  
  const partnersForMock = [
    { 
      id:'cordoba', 
      name:'Cordoba Law Group', 
      code:'CLG', 
      terms:{ hurdle:125, pre:75, post:50 },
      performanceGuarantees: [
        { period: 6, target: 21.2 },
        { period: 9, target: 37.7 },
        { period: 12, target: 50.1 },
        { period: 18, target: 66.8 }
      ]
    },
    { 
      id:'accs', 
      name:'ACCS', 
      code:'ACCS', 
      terms:{ hurdle:125, pre:75, post:50 },
      performanceGuarantees: [
        { period: 6, target: 20.0 },
        { period: 9, target: 35.0 },
        { period: 12, target: 48.0 },
        { period: 18, target: 64.0 }
      ]
    }
  ]

  months.forEach((monthInfo) => {
    partnersForMock.forEach((partner, partnerIdx) => {
      const enrolled = 2_000_000 + Math.floor(Math.random() * 3_000_000)
      const advanceRate = 6.5 + Math.random() * 1.5
      const purchasePrice = Math.round(enrolled * (advanceRate / 100))
      const accountCount = 100 + Math.floor(Math.random() * 150)
      
      const performance = {
        cashCollections: [],
        settlements: [],
        cancellations: []
      }
      
      // Generate 12 months of performance data
      // Create one underperforming vintage for demonstration (APR 2025 CLG will be 6 months old)
      const isUnderperformer = monthInfo.month === 'APR' && partnerIdx === 0
      
      for(let m = 1; m <= 12; m++) {
        if (isUnderperformer) {
          // This vintage underperforms significantly
          // At month 6: cumulative ~15-16% (vs 21.2% target, 19.08% minimum threshold)
          const cashPct = (m / 24) * 15 + Math.random() * 0.5
          performance.cashCollections.push(Math.round(cashPct * 10) / 10)
        } else {
          const cashPct = Math.min(100, (m / 24) * 85 + Math.random() * 10)
          performance.cashCollections.push(Math.round(cashPct * 10) / 10)
        }
        
        const settlePct = Math.min(65, (m / 24) * 60 + Math.random() * 5)
        performance.settlements.push(Math.round(settlePct * 10) / 10)
        
        const cancelPct = Math.min(20, (m / 24) * 18 + Math.random() * 3)
        performance.cancellations.push(Math.round(cancelPct * 10) / 10)
      }
      
      mockVintages.push({
        id: `mock-${partner.id}-${monthInfo.month}-${monthInfo.year}`,
        vintageName: `${partner.code}-${monthInfo.month}-${monthInfo.year}`,
        partnerId: partner.id,
        partnerName: partner.name,
        partnerCode: partner.code,
        purchaseDate: monthInfo.date,
        accountCount: accountCount,
        totalEnrolledDebt: enrolled,
        purchasePrice: purchasePrice,
        purchasePricePct: advanceRate,
        terms: partner.terms,
        accounts: Array.from({length: accountCount}, (_, i) => `CLT-${10000 + i}`),
        performanceGuarantees: partner.performanceGuarantees || [],
        performanceTracking: {
          baseSplits: { pre: partner.terms.pre, post: partner.terms.post },
          currentSplits: { pre: partner.terms.pre, post: partner.terms.post },
          currentPhase: 'pre',
          status: 'on-track',
          adjustmentHistory: []
        },
        performance: performance
      })
    })
  })
  
  return mockVintages.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
}

export default function App() {
  const [module, setModule] = useState('eligibility')
  const [step, setStep] = useState('partner')
  const [partners, setPartners] = useState(demoPartners)
  const [selectedPartnerId, setSelectedPartnerId] = useState(null)
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false)
  const [newPartner, setNewPartner] = useState({
    name: '',
    code: '',
    hurdle: 125,
    preSplit: 75,
    postSplit: 50,
    advanceRate: 7.0,
    chargeBackPolicy: 'Full Duration',
    guarantees: []
  })
  
  const [columnMappings, setColumnMappings] = useState(DEFAULT_MAPPINGS)
  const [eligibilityRules, setEligibilityRules] = useState(DEFAULT_RULES)
  
  const [uploadedFile, setUploadedFile] = useState(null)
  const [parsedData, setParsedData] = useState(null)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [uploading, setUploading] = useState(false)
  
  const [eligibilityResults, setEligibilityResults] = useState(null)
  const [selectedAccounts, setSelectedAccounts] = useState(new Set())
  const [reviewFilter, setReviewFilter] = useState('eligible')
  const [purchasePricePct, setPurchasePricePct] = useState(7.0)
  const [chargeBackReduction, setChargeBackReduction] = useState(0)
  const [vintageName, setVintageName] = useState('')
  const [purchasedVintages, setPurchasedVintages] = useState([])
  const [storageLoaded, setStorageLoaded] = useState(false)
  const [showAdminMenu, setShowAdminMenu] = useState(false)
  const [adminView, setAdminView] = useState(null)
  const [processing, setProcessing] = useState(false)
  
  const [performanceView, setPerformanceView] = useState('portfolio')
  const [selectedPerformanceDSC, setSelectedPerformanceDSC] = useState(null)
  const [selectedPerformanceVintage, setSelectedPerformanceVintage] = useState(null)
  const [performanceDetailTab, setPerformanceDetailTab] = useState('cancellations')

  React.useEffect(() => {
    setPurchasedVintages(loadMockVintages())
    setStorageLoaded(true)
  }, [])

  const selectedPartner = partners.find(p=> p.id===selectedPartnerId) || null

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if(!file) return
    
    setUploading(true)
    setUploadedFileName(file.name)
    
    setTimeout(() => {
      setParsedData([])
      setUploadedFile(file)
      setUploading(false)
    }, 500)
  }

  const processEligibility = () => {
    if(!parsedData) return
    
    setProcessing(true)
    setTimeout(() => {
      const results = parsedData.map(row => {
        const eligibility = checkEligibility(row, columnMappings, eligibilityRules)
        return {
          clientId: row[columnMappings.clientId],
          accountName: row[columnMappings.accountName],
          fico: row[columnMappings.fico],
          enrolledDebt: row[columnMappings.enrolledDebt],
          epfPct: row[columnMappings.epfPct],
          firstPayCleared: row[columnMappings.firstPaymentCleared],
          ...eligibility,
          rawData: row
        }
      })
      
      setEligibilityResults(results)
      
      if(selectedPartner) {
        const now = new Date()
        const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase()
        const year = now.getFullYear()
        const partnerCode = selectedPartner.code || selectedPartner.name.split(' ').map(w=>w[0]).join('').toUpperCase()
        setVintageName(`${partnerCode}-${month}-${year}`)
      }
      
      setStep('review')
      setProcessing(false)
    }, 1000)
  }

  const handlePurchase = async () => {
    if(!eligibilityResults || !selectedPartner) return
    
    setProcessing(true)
    
    setTimeout(() => {
      const eligible = eligibilityResults.filter(r => r.allPass || selectedAccounts.has(r.clientId))
      const totalEnrolled = eligible.reduce((sum, r) => sum + r.enrolledDebt, 0)
      const basePurchasePrice = Math.round(totalEnrolled * (purchasePricePct / 100))
      const actualPurchasePrice = basePurchasePrice - chargeBackReduction
      const effectivePct = totalEnrolled > 0 ? (actualPurchasePrice / totalEnrolled) * 100 : purchasePricePct
      
      const newVintage = {
        id: `${Date.now()}-${vintageName}`,
        vintageName: vintageName,
        partnerId: selectedPartner.id,
        partnerName: selectedPartner.name,
        partnerCode: selectedPartner.code,
        purchaseDate: new Date().toISOString(),
        accountCount: eligible.length,
        totalEnrolledDebt: totalEnrolled,
        purchasePrice: actualPurchasePrice,
        purchasePricePct: effectivePct,
        basePurchasePricePct: purchasePricePct,
        chargeBackReduction: chargeBackReduction,
        terms: selectedPartner.terms,
        accounts: eligible.map(a => a.clientId),
        performanceGuarantees: selectedPartner.performanceGuarantees || [],
        performanceTracking: {
          baseSplits: { pre: selectedPartner.terms.pre, post: selectedPartner.terms.post },
          currentSplits: { pre: selectedPartner.terms.pre, post: selectedPartner.terms.post },
          currentPhase: 'pre',
          status: 'on-track',
          adjustmentHistory: []
        },
        performance: {
          cashCollections: Array.from({length: 12}, (_, i) => Math.round((Math.min(100, (i+1) / 12 * 85 + Math.random() * 10)) * 10) / 10),
          settlements: Array.from({length: 12}, (_, i) => Math.round((Math.min(65, (i+1) / 12 * 60 + Math.random() * 5)) * 10) / 10),
          cancellations: Array.from({length: 12}, (_, i) => Math.round((Math.min(20, (i+1) / 12 * 18 + Math.random() * 3)) * 10) / 10)
        }
      }
      
      setPurchasedVintages([newVintage, ...purchasedVintages])
      setProcessing(false)
      setStep('vintages')
    }, 1500)
  }

  const handleAddPartner = () => {
    if (!newPartner.name || !newPartner.code) {
      alert('Please enter partner name and code')
      return
    }
    
    const partner = {
      id: newPartner.code.toLowerCase().replace(/\s+/g, '-'),
      name: newPartner.name,
      code: newPartner.code,
      terms: {
        hurdle: newPartner.hurdle,
        pre: newPartner.preSplit,
        post: newPartner.postSplit
      },
      advanceRate: newPartner.advanceRate,
      performanceGuarantees: newPartner.guarantees
    }
    
    setPartners([...partners, partner])
    setShowAddPartnerModal(false)
    setNewPartner({
      name: '',
      code: '',
      hurdle: 125,
      preSplit: 75,
      postSplit: 50,
      advanceRate: 7.0,
      guarantees: []
    })
  }

  const addGuaranteeRow = () => {
    const lastPeriod = newPartner.guarantees.length > 0 
      ? newPartner.guarantees[newPartner.guarantees.length - 1].period 
      : 0
    setNewPartner({
      ...newPartner,
      guarantees: [...newPartner.guarantees, { period: lastPeriod + 3, target: 0 }]
    })
  }

  const removeGuaranteeRow = (index) => {
    setNewPartner({
      ...newPartner,
      guarantees: newPartner.guarantees.filter((_, i) => i !== index)
    })
  }

  const updateGuaranteeRow = (index, field, value) => {
    const updated = [...newPartner.guarantees]
    updated[index][field] = parseFloat(value) || 0
    setNewPartner({
      ...newPartner,
      guarantees: updated
    })
  }

  const getBreadcrumbs = () => {
    const items = []
    
    if (module === 'eligibility') {
      items.push({ label: 'Eligibility & Purchase', onClick: () => setStep('partner') })
      
      if (step !== 'partner') {
        if (selectedPartner) {
          items.push({ label: selectedPartner.name, onClick: () => setStep('dashboard') })
        }
        
        const stepLabels = {
          dashboard: 'Dashboard',
          upload: 'Upload',
          eligibility: 'Eligibility',
          review: 'Review',
          purchase: 'Purchase',
          vintages: 'Vintages'
        }
        
        if (stepLabels[step]) {
          items.push({ label: stepLabels[step], onClick: () => {} })
        }
      }
    } else {
      items.push({ label: 'Performance', onClick: () => setPerformanceView('portfolio') })
      
      if (performanceView === 'dsc' && selectedPerformanceDSC) {
        const dsc = purchasedVintages.find(v => v.partnerId === selectedPerformanceDSC)
        if (dsc) {
          items.push({ label: dsc.partnerName, onClick: () => {} })
        }
      }
      
      if (performanceView === 'vintage' && selectedPerformanceVintage) {
        const vintage = purchasedVintages.find(v => v.id === selectedPerformanceVintage)
        if (vintage) {
          items.push({ label: vintage.partnerName, onClick: () => setPerformanceView('dsc') })
          items.push({ label: vintage.vintageName, onClick: () => {} })
        }
      }
    }
    
    return items
  }

  return (
    <div className="h-screen w-full flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              F
            </div>
            <span className="font-bold text-gray-900">Flobase</span>
          </div>
          <p className="text-xs text-gray-500">Capital Management</p>
        </div>
        
        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={() => setModule('eligibility')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              module === 'eligibility'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Eligibility & Purchase
          </button>
          
          <button
            onClick={() => setModule('performance')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              module === 'performance'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Performance Monitoring
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <div className="font-medium mb-1">Enhanced UI v2.0</div>
            <div>Modern Design System</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {module === 'eligibility' ? 'Eligibility & Purchase' : 'Performance Monitoring'}
              </h1>
              {getBreadcrumbs().length > 0 && (
                <Breadcrumb items={getBreadcrumbs()} />
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                
                {showAdminMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => { setAdminView('mappings'); setShowAdminMenu(false) }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      Column Mappings
                    </button>
                    <button
                      onClick={() => { setAdminView('access'); setShowAdminMenu(false) }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      User Access
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {module === 'eligibility' && (
              <>
                {step === 'partner' && (
                  <div className="space-y-6">
                    <Card>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">Partner Selection</h2>
                          <p className="text-sm text-gray-500 mt-1">Select a debt settlement company to begin</p>
                        </div>
                        <Button onClick={() => setShowAddPartnerModal(true)}>
                          + Add Partner
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {partners.map(p => (
                          <Card key={p.id} hoverable className="cursor-pointer group !p-4">
                            <div className="flex items-start justify-between mb-2 min-w-0">
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                  {p.name}
                                </h3>
                                <Badge variant="info" className="mt-1">DSC</Badge>
                              </div>
                            </div>
                            
                            <div className="space-y-0.5 text-xs text-gray-600 mb-3">
                              <div className="flex justify-between">
                                <span>Hurdle:</span>
                                <span className="font-medium">{p.terms.hurdle}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Split:</span>
                                <span className="font-medium">{p.terms.pre}% → {p.terms.post}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Advance Rate:</span>
                                <span className="font-medium">{p.advanceRate}%</span>
                              </div>
                            </div>
                            
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setSelectedPartnerId(p.id)
                                setStep('dashboard')
                              }}
                              className="w-full"
                            >
                              Select Partner →
                            </Button>
                          </Card>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {step === 'dashboard' && selectedPartner && (
                  <div className="space-y-6">
                    <Card>
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{selectedPartner.name}</h2>
                          <p className="text-sm text-gray-500 mt-1">
                            Hurdle {selectedPartner.terms.hurdle}% • Split {selectedPartner.terms.pre}%→{selectedPartner.terms.post}%
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="secondary" onClick={() => setModule('performance')}>
                            View Performance
                          </Button>
                          <Button onClick={() => setStep('upload')}>
                            New Purchase →
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4" style={{gridTemplateColumns: '1fr 2fr 2fr'}}>
                        <StatCard
                          label="Vintages"
                          value={purchasedVintages.filter(v => v.partnerId === selectedPartner.id).length}
                          color="blue"
                        />
                        <StatCard
                          label="Total Enrolled Debt"
                          value={<Currency value={purchasedVintages.filter(v => v.partnerId === selectedPartner.id).reduce((sum, v) => sum + v.totalEnrolledDebt, 0)} />}
                          color="green"
                        />
                        <StatCard
                          label="Total Deployed"
                          value={<Currency value={purchasedVintages.filter(v => v.partnerId === selectedPartner.id).reduce((sum, v) => sum + v.purchasePrice, 0)} />}
                          color="yellow"
                        />
                      </div>
                    </Card>
                  </div>
                )}

                {step === 'upload' && (
                  <Card>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload Portfolio File</h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Upload a CSV or Excel file with account data for {selectedPartner?.name}
                    </p>

                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors">
                      {uploading ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          <div className="mb-4">
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                              <span className="text-blue-600 hover:text-blue-700 font-medium">
                                Choose a file
                              </span>
                            </label>
                            <span className="text-gray-500"> or drag and drop</span>
                          </div>
                          <p className="text-xs text-gray-500">CSV, XLSX up to 10MB</p>
                        </>
                      )}
                    </div>

                    {uploadedFileName && parsedData && (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 text-xl">✓</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{uploadedFileName}</p>
                            <p className="text-xs text-gray-600">{parsedData.length} accounts loaded</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex gap-3">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          if (!selectedPartner) return alert('Select a partner first')
                          const mockData = []
                          for (let i = 1; i <= 200; i++) {
                            mockData.push({
                              CLIENT_ID: `CLT-${10000 + i}`,
                              ACCOUNT_NAME: `${selectedPartner.name} Account ${i}`,
                              CREDIT_SCORE: 480 + Math.floor(Math.random() * 200),
                              ENROLLED_DEBT: 10000 + Math.floor(Math.random() * 40000),
                              FIRST_PAYMENT_CLEARED_DATE: Math.random() > 0.15 ? '2025-09-15' : null,
                              SETTLEMENT_FEE_PERCENTAGE: 24 + Math.floor(Math.random() * 5),
                            })
                          }
                          setParsedData(mockData)
                          setUploadedFileName(`${selectedPartner.name}-sample-data.csv`)
                        }}
                      >
                        Use Sample Data
                      </Button>
                      
                      {parsedData && (
                        <Button onClick={() => setStep('eligibility')}>
                          Continue →
                        </Button>
                      )}
                    </div>
                  </Card>
                )}

                {step === 'eligibility' && parsedData && (
                  <Card>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Eligibility Criteria</h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Configure rules for {parsedData.length.toLocaleString()} accounts
                    </p>

                    <div className="space-y-3">
                      {eligibilityRules.filter(r => r.enabled).map((rule, idx) => (
                        <div key={rule.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 mb-1">{rule.label}</div>
                              {rule.editable ? (
                                <div className="flex items-center gap-3">
                                  <input
                                    type="number"
                                    value={rule.value}
                                    onChange={(e) => {
                                      const updated = [...eligibilityRules]
                                      updated[idx].value = parseFloat(e.target.value) || 0
                                      setEligibilityRules(updated)
                                    }}
                                    className="w-32 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                  />
                                  <span className="text-xs text-gray-500">
                                    {rule.id === 'debt' && '(dollars)'}
                                    {rule.id === 'epf' && '(percentage)'}
                                    {rule.id === 'fico' && '(score)'}
                                  </span>
                                </div>
                              ) : (
                                <p className="text-xs text-gray-500">Column: {columnMappings[rule.field]}</p>
                              )}
                            </div>
                            <Badge variant="success">Active</Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Button variant="secondary" onClick={() => setStep('upload')}>
                        ← Back
                      </Button>
                      <Button onClick={processEligibility} loading={processing}>
                        Run Eligibility Check →
                      </Button>
                    </div>
                  </Card>
                )}

                {step === 'review' && eligibilityResults && (
                  <Card>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Review Results</h2>
                        <p className="text-sm text-gray-500 mt-1">
                          {reviewFilter === 'eligible'
                            ? `${eligibilityResults.filter(r => r.allPass).length} eligible accounts`
                            : `${eligibilityResults.filter(r => !r.allPass).length} ineligible accounts`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={reviewFilter === 'eligible' ? 'success' : 'secondary'}
                          size="sm"
                          onClick={() => setReviewFilter('eligible')}
                        >
                          ✓ Eligible ({eligibilityResults.filter(r => r.allPass).length})
                        </Button>
                        <Button
                          variant={reviewFilter === 'ineligible' ? 'danger' : 'secondary'}
                          size="sm"
                          onClick={() => setReviewFilter('ineligible')}
                        >
                          ✗ Ineligible ({eligibilityResults.filter(r => !r.allPass).length})
                        </Button>
                      </div>
                    </div>

                    <div className="overflow-x-auto -mx-6 px-6">
                      <table className="w-full text-sm min-w-max">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Client ID</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Account</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">FICO</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">Enrolled Debt</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">EPF %</th>
                            <th className="px-4 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">First Pay</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {eligibilityResults
                            .filter(r => reviewFilter === 'eligible' ? r.allPass : !r.allPass)
                            .slice(0, 50)
                            .map((r, i) => (
                              <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{r.clientId}</td>
                                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{r.accountName}</td>
                                <td className="px-4 py-3 text-right text-gray-900 whitespace-nowrap">{r.fico}</td>
                                <td className="px-4 py-3 text-right font-medium whitespace-nowrap">
                                  <Currency value={r.enrolledDebt} />
                                </td>
                                <td className="px-4 py-3 text-right whitespace-nowrap">{r.epfPct}%</td>
                                <td className="px-4 py-3 text-center whitespace-nowrap">
                                  {r.firstPayCleared ? (
                                    <span className="text-green-600">✓</span>
                                  ) : (
                                    <span className="text-red-600">✗</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Button variant="secondary" onClick={() => setStep('eligibility')}>
                        ← Back
                      </Button>
                      <Button onClick={() => setStep('purchase')}>
                        Continue to Purchase →
                      </Button>
                    </div>
                  </Card>
                )}

                {step === 'purchase' && eligibilityResults && (
                  <div className="space-y-6">
                    <Card>
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">Execute Purchase</h2>
                          <p className="text-sm text-gray-500 mt-1">Review and finalize the vintage purchase</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">Partner</div>
                          <div className="text-lg font-bold text-gray-900">{selectedPartner?.name}</div>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vintage Name
                          </label>
                          <input
                            type="text"
                            value={vintageName}
                            onChange={(e) => setVintageName(e.target.value)}
                            placeholder="e.g., CLG-OCT-2025"
                            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Purchase Price (% of Enrolled Debt)
                          </label>
                          <div className="flex items-start gap-4">
                            <div className="flex items-center gap-3">
                              <input
                                type="number"
                                step="0.1"
                                value={purchasePricePct}
                                onChange={(e) => setPurchasePricePct(parseFloat(e.target.value) || 0)}
                                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                              <span className="text-sm text-gray-500">
                                {purchasePricePct}% advance rate
                              </span>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Charge Back Reduction
                              </label>
                              <input
                                type="number"
                                value={chargeBackReduction}
                                onChange={(e) => setChargeBackReduction(parseFloat(e.target.value) || 0)}
                                placeholder="$0"
                                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Effective Purchase Price
                              </label>
                              <div className="w-40 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                                {(() => {
                                  const enrolledDebt = eligibilityResults.filter(r => r.allPass).reduce((s, r) => s + r.enrolledDebt, 0)
                                  const purchasePrice = enrolledDebt * (purchasePricePct / 100)
                                  const effectivePurchase = purchasePrice - chargeBackReduction
                                  const effectivePct = enrolledDebt > 0 ? (effectivePurchase / enrolledDebt) * 100 : 0
                                  return `${effectivePct.toFixed(2)}% of enrolled`
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                          label="Total Accounts"
                          value={eligibilityResults.filter(r => r.allPass).length}
                          color="gray"
                        />
                        <StatCard
                          label="Enrolled Debt"
                          value={<Currency value={eligibilityResults.filter(r => r.allPass).reduce((s, r) => s + r.enrolledDebt, 0)} />}
                          color="blue"
                        />
                        <StatCard
                          label="Purchase Price"
                          value={<Currency value={Math.round(eligibilityResults.filter(r => r.allPass).reduce((s, r) => s + r.enrolledDebt, 0) * (purchasePricePct / 100) - chargeBackReduction)} />}
                          sublabel={`${purchasePricePct}% of enrolled${chargeBackReduction > 0 ? ` - $${chargeBackReduction.toLocaleString()} chargeback` : ''}`}
                          color="green"
                        />
                      </div>

                      <div className="mt-6 flex gap-3">
                        <Button variant="secondary" onClick={() => setStep('review')}>
                          ← Back
                        </Button>
                        <Button variant="success" onClick={handlePurchase} loading={processing}>
                          {processing ? 'Processing...' : 'Execute Purchase'}
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}

                {step === 'vintages' && (
                  <div className="space-y-6">
                    <Card>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">Recent Vintages</h2>
                          <p className="text-sm text-gray-500 mt-1">
                            {storageLoaded ? `${purchasedVintages.length} total vintages` : 'Loading...'}
                          </p>
                        </div>
                        <Button onClick={() => setStep('upload')}>
                          + New Vintage
                        </Button>
                      </div>

                      {!storageLoaded ? (
                        <LoadingSpinner />
                      ) : purchasedVintages.length === 0 ? (
                        <EmptyState
                          title="No Vintages Yet"
                          description="Complete a purchase to see vintages appear here."
                          action={
                            <Button onClick={() => setStep('partner')}>
                              Get Started
                            </Button>
                          }
                        />
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {purchasedVintages.slice(0, 6).map((v, idx) => (
                            <Card
                              key={v.id}
                              className={`${idx === 0 ? 'border-green-300 bg-green-50' : ''} !p-4`}
                              hoverable
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="min-w-0 flex-1 pr-2">
                                  <h3 className="font-semibold text-sm text-gray-900 truncate">{v.vintageName}</h3>
                                  <p className="text-xs text-gray-500 mt-0.5 truncate">{v.partnerName}</p>
                                </div>
                                {idx === 0 && <Badge variant="success">Latest</Badge>}
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="min-w-0">
                                  <p className="text-xs text-gray-500">Date</p>
                                  <p className="font-medium text-gray-900 truncate">
                                    {new Date(v.purchaseDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs text-gray-500">Accounts</p>
                                  <p className="font-medium text-gray-900 truncate">
                                    {v.accountCount.toLocaleString()}
                                  </p>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs text-gray-500">Enrolled</p>
                                  <p className="font-medium text-gray-900 truncate">
                                    <Currency value={v.totalEnrolledDebt} />
                                  </p>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs text-gray-500">Purchase</p>
                                  <p className="font-medium text-green-600 truncate">
                                    <Currency value={v.purchasePrice} />
                                  </p>
                                </div>
                              </div>

                              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-600">
                                <span className="truncate">Rate: {v.purchasePricePct.toFixed(1)}%</span>
                                <span className="truncate">Hurdle: {v.terms.hurdle}%</span>
                                <span className="truncate">Split: {v.terms.pre}%→{v.terms.post}%</span>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                )}
              </>
            )}

            {module === 'performance' && (
              <>
                {performanceView === 'portfolio' && (
                  <div className="space-y-6">
                    <Card>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Portfolio Metrics</h2>
                      <p className="text-sm text-gray-500 mb-6">
                        Aggregate performance across all partners and vintages
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(() => {
                          const totalCapitalDeployed = purchasedVintages.reduce((sum, v) => sum + v.purchasePrice, 0)
                          const totalEnrolledDebt = purchasedVintages.reduce((sum, v) => sum + v.totalEnrolledDebt, 0)
                          
                          // Calculate total cash collected (Flobase's share based on splits)
                          const totalCashCollected = purchasedVintages.reduce((sum, v) => {
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
                          
                          purchasedVintages.forEach(v => {
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
                          
                          // Weighted average advance rate
                          const weightedAvgAdvance = totalEnrolledDebt > 0
                            ? (totalCapitalDeployed / totalEnrolledDebt) * 100
                            : 0
                          
                          return (
                            <>
                              <StatCard
                                label="Total Capital Deployed"
                                value={<Currency value={totalCapitalDeployed} />}
                                sublabel={`${purchasedVintages.length} vintages`}
                                color="blue"
                              />
                              <StatCard
                                label="Total Cash Collected"
                                value={<Currency value={Math.round(totalCashCollected)} />}
                                sublabel="Flobase share (EPF)"
                                color="green"
                              />
                              <StatCard
                                label="Total Enrolled Debt"
                                value={<Currency value={totalEnrolledDebt} />}
                                sublabel={`${purchasedVintages.reduce((sum, v) => sum + v.accountCount, 0).toLocaleString()} accounts`}
                                color="gray"
                              />
                              <StatCard
                                label="Total Active Debt"
                                value={<Currency value={Math.round(totalActiveDebt)} />}
                                sublabel="Enrolled - Cancelled - Settled"
                                color="blue"
                              />
                              <StatCard
                                label="Total Cancelled Debt"
                                value={<Currency value={Math.round(totalCancelledDebt)} />}
                                sublabel={`${((totalCancelledDebt / totalEnrolledDebt) * 100).toFixed(1)}% of enrolled`}
                                color="yellow"
                              />
                              <StatCard
                                label="Avg. Advance Rate"
                                value={`${weightedAvgAdvance.toFixed(2)}%`}
                                sublabel="Weighted average"
                                color="gray"
                              />
                            </>
                          )
                        })()}
                      </div>
                    </Card>

                    <Card>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Performance by DSC</h2>
                      <p className="text-sm text-gray-500 mb-6">Click a partner to view detailed metrics</p>

                      {purchasedVintages.length === 0 ? (
                        <EmptyState
                          title="No Performance Data"
                          description="Purchase vintages to see performance metrics here."
                          action={
                            <Button onClick={() => setModule('eligibility')}>
                              Start Purchasing
                            </Button>
                          }
                        />
                      ) : (
                        <div className="overflow-x-auto -mx-6 px-6">
                          <table className="w-full text-sm min-w-max">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                              <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">DSC</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">Vintages</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">Capital Deployed</th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">Active Debt</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {Array.from(new Set(purchasedVintages.map(v => v.partnerId))).map(partnerId => {
                                const dscVintages = purchasedVintages.filter(v => v.partnerId === partnerId)
                                const dscName = dscVintages[0].partnerName
                                const capitalDeployed = dscVintages.reduce((sum, v) => sum + v.purchasePrice, 0)
                                
                                // Calculate active debt for this DSC
                                let enrolledDebt = 0
                                let cancelledDebt = 0
                                let settledDebt = 0
                                
                                dscVintages.forEach(v => {
                                  enrolledDebt += v.totalEnrolledDebt
                                  
                                  if (v.performance) {
                                    const vintageAge = calculateVintageAge(v.purchaseDate)
                                    
                                    if (v.performance.cancellations) {
                                      const cumulativeCancelPct = v.performance.cancellations
                                        .slice(0, Math.min(vintageAge, v.performance.cancellations.length))
                                        .reduce((acc, val) => acc + val, 0)
                                      cancelledDebt += (cumulativeCancelPct / 100) * v.totalEnrolledDebt
                                    }
                                    
                                    if (v.performance.settlements) {
                                      const cumulativeSettlePct = v.performance.settlements
                                        .slice(0, Math.min(vintageAge, v.performance.settlements.length))
                                        .reduce((acc, val) => acc + val, 0)
                                      settledDebt += (cumulativeSettlePct / 100) * v.totalEnrolledDebt
                                    }
                                  }
                                })
                                
                                const activeDebt = enrolledDebt - cancelledDebt - settledDebt

                                return (
                                  <tr key={partnerId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{dscName}</td>
                                    <td className="px-4 py-3 text-center whitespace-nowrap">{dscVintages.length}</td>
                                    <td className="px-4 py-3 text-right font-medium whitespace-nowrap">
                                      <Currency value={capitalDeployed} />
                                    </td>
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                      <Currency value={Math.round(activeDebt)} />
                                    </td>
                                    <td className="px-4 py-3 text-center whitespace-nowrap">
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          setSelectedPerformanceDSC(partnerId)
                                          setPerformanceView('dsc')
                                        }}
                                      >
                                        View Details →
                                      </Button>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Card>
                  </div>
                )}

                {performanceView === 'dsc' && selectedPerformanceDSC && (
                  <div className="space-y-6">
                    <Card>
                      <div className="flex items-start justify-between mb-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPerformanceView('portfolio')
                            setSelectedPerformanceDSC(null)
                          }}
                        >
                          ← Back to Portfolio
                        </Button>
                        <Button variant="secondary" size="sm">
                          Export Data
                        </Button>
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {purchasedVintages.find(v => v.partnerId === selectedPerformanceDSC)?.partnerName}
                      </h2>
                      <p className="text-sm text-gray-500 mb-6">Detailed performance metrics</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(() => {
                          const dscVintages = purchasedVintages.filter(v => v.partnerId === selectedPerformanceDSC)
                          const totalDeployed = dscVintages.reduce((sum, v) => sum + v.purchasePrice, 0)
                          
                          // Calculate total cash collected (Flobase's share)
                          const totalCashCollected = dscVintages.reduce((sum, v) => {
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
                          
                          const moic = totalDeployed > 0 ? totalCashCollected / totalDeployed : 0
                          
                          // Calculate active debt
                          let enrolledDebt = 0
                          let cancelledDebt = 0
                          let settledDebt = 0
                          
                          dscVintages.forEach(v => {
                            enrolledDebt += v.totalEnrolledDebt
                            
                            if (v.performance) {
                              const vintageAge = calculateVintageAge(v.purchaseDate)
                              
                              if (v.performance.cancellations) {
                                const cumulativeCancelPct = v.performance.cancellations
                                  .slice(0, Math.min(vintageAge, v.performance.cancellations.length))
                                  .reduce((acc, val) => acc + val, 0)
                                cancelledDebt += (cumulativeCancelPct / 100) * v.totalEnrolledDebt
                              }
                              
                              if (v.performance.settlements) {
                                const cumulativeSettlePct = v.performance.settlements
                                  .slice(0, Math.min(vintageAge, v.performance.settlements.length))
                                  .reduce((acc, val) => acc + val, 0)
                                settledDebt += (cumulativeSettlePct / 100) * v.totalEnrolledDebt
                              }
                            }
                          })
                          
                          const activeDebt = enrolledDebt - cancelledDebt - settledDebt

                          return (
                            <>
                              <StatCard
                                label="MOIC"
                                value={`${moic.toFixed(2)}x`}
                                sublabel="Multiple on capital"
                                color="yellow"
                              />
                              <StatCard
                                label="Capital Deployed"
                                value={<Currency value={totalDeployed} />}
                                sublabel={`${dscVintages.length} vintages`}
                                color="blue"
                              />
                              <StatCard
                                label="Active Debt"
                                value={<Currency value={Math.round(activeDebt)} />}
                                sublabel="Enrolled - Cancelled - Settled"
                                color="gray"
                              />
                              <StatCard
                                label="Cash Collected"
                                value={<Currency value={Math.round(totalCashCollected)} />}
                                sublabel="Flobase share (EPF)"
                                color="green"
                              />
                            </>
                          )
                        })()}
                      </div>
                    </Card>

                    <Card>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Vintages</h2>
                      <p className="text-sm text-gray-500 mb-6">Click to view detailed performance curves</p>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {purchasedVintages.filter(v => v.partnerId === selectedPerformanceDSC).map(vintage => {
                          const latestCashPct = vintage.performance?.cashCollections?.[vintage.performance.cashCollections.length - 1] || 0
                          const cashCollected = vintage.purchasePrice * (latestCashPct / 100)
                          const moic = vintage.purchasePrice > 0 ? cashCollected / vintage.purchasePrice : 0
                          
                          // Check performance guarantee status
                          const pgStatus = checkPerformanceGuarantee(vintage)
                          const isTriggered = pgStatus.status === 'triggered'
                          const isWarning = pgStatus.status === 'warning'

                          return (
                            <Card
                              key={vintage.id}
                              hoverable
                              className={`cursor-pointer ${isTriggered ? 'border-red-300 bg-red-50' : isWarning ? 'border-yellow-300 bg-yellow-50' : ''}`}
                              onClick={() => {
                                setSelectedPerformanceVintage(vintage.id)
                                setPerformanceView('vintage')
                              }}
                            >
                              <div className="flex items-start justify-between mb-3 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate flex-1 mr-2">{vintage.vintageName}</h3>
                                <div className="bg-yellow-100 px-2 py-1 rounded-lg flex-shrink-0">
                                  <div className="text-lg font-bold text-yellow-900">{moic.toFixed(2)}x</div>
                                  <div className="text-xs text-yellow-700">MOIC</div>
                                </div>
                              </div>

                              {(isTriggered || isWarning) && (
                                <div className={`mb-3 p-2 rounded-lg ${isTriggered ? 'bg-red-100 border border-red-200' : 'bg-yellow-100 border border-yellow-200'}`}>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className={`text-xs font-medium ${isTriggered ? 'text-red-700' : 'text-yellow-700'}`}>
                                      {isTriggered ? '🔴 Guarantee Triggered' : '🟡 Warning Zone'}
                                    </span>
                                  </div>
                                  {isTriggered && (
                                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                      <button className="flex-1 px-2 py-1 bg-white border border-red-300 rounded text-xs font-medium text-red-700 hover:bg-red-50">
                                        -5% Split
                                      </button>
                                      <button className="flex-1 px-2 py-1 bg-white border border-green-300 rounded text-xs font-medium text-green-700 hover:bg-green-50">
                                        +5% Split
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                <div className="min-w-0">
                                  <p className="text-gray-500">Deployed</p>
                                  <p className="font-medium text-gray-900 truncate">
                                    <Currency value={vintage.purchasePrice} />
                                  </p>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-gray-500">Collected</p>
                                  <p className="font-medium text-green-600 truncate">
                                    <Currency value={Math.round(cashCollected)} />
                                  </p>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-gray-200 text-center">
                                <span className="text-xs font-medium text-blue-600">View Performance →</span>
                              </div>
                            </Card>
                          )
                        })}
                      </div>
                    </Card>
                  </div>
                )}

                {performanceView === 'vintage' && selectedPerformanceVintage && (
                  <>
                    {(() => {
                      const vintage = purchasedVintages.find(v => v.id === selectedPerformanceVintage)
                      if (!vintage) return <EmptyState title="Vintage not found" description="" />

                      return (
                        <div className="space-y-6">
                          <Card>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setPerformanceView('dsc')
                                setSelectedPerformanceVintage(null)
                              }}
                              className="mb-4"
                            >
                              ← Back to {vintage.partnerName}
                            </Button>

                            <div className="mb-6">
                              <h2 className="text-xl font-bold text-gray-900 mb-1">{vintage.vintageName}</h2>
                              <p className="text-sm text-gray-500">
                                {vintage.partnerName} • Purchased {new Date(vintage.purchaseDate).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              {(() => {
                                const cumulativeCash = getCumulativeCashCollection(vintage)
                                const hurdleAmount = vintage.purchasePrice * (vintage.terms.hurdle / 100)
                                const totalCashCollected = (cumulativeCash / 100) * vintage.purchasePrice
                                const currentPhase = totalCashCollected >= hurdleAmount ? 'post' : 'pre'
                                const currentSplit = currentPhase === 'post' ? vintage.terms.post : vintage.terms.pre
                                
                                return (
                                  <>
                                    <StatCard
                                      label="Purchase Price"
                                      value={<Currency value={vintage.purchasePrice} />}
                                      sublabel={`${vintage.purchasePricePct.toFixed(1)}% advance`}
                                      color="blue"
                                    />
                                    <StatCard
                                      label="Enrolled Debt"
                                      value={<Currency value={vintage.totalEnrolledDebt} />}
                                      sublabel={`${vintage.accountCount} accounts`}
                                      color="green"
                                    />
                                    <StatCard
                                      label="Pref Hurdle"
                                      value={`${vintage.terms.hurdle}%`}
                                      sublabel={
                                        <span>
                                          <Currency value={hurdleAmount} />
                                          {totalCashCollected >= hurdleAmount && (
                                            <span className="text-green-600 font-semibold ml-1">✓ Crossed</span>
                                          )}
                                        </span>
                                      }
                                      color="yellow"
                                    />
                                    <StatCard
                                      label="Current Split"
                                      value={
                                        <span>
                                          {currentSplit}% Flobase
                                        </span>
                                      }
                                      sublabel={
                                        <span className="capitalize">
                                          {currentPhase}-Hurdle ({vintage.terms.pre}% / {vintage.terms.post}%)
                                        </span>
                                      }
                                      color="gray"
                                    />
                                  </>
                                )
                              })()}
                            </div>
                          </Card>

                          {vintage.performanceGuarantees && vintage.performanceGuarantees.length > 0 && (() => {
                            const pgStatus = checkPerformanceGuarantee(vintage)
                            const statusColors = {
                              'on-track': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '🟢' },
                              'warning': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: '🟡' },
                              'triggered': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: '🔴' },
                              'pending': { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: '⏳' },
                              'between-periods': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: '📊' },
                              'no-guarantee': { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'ℹ️' }
                            }
                            const colors = statusColors[pgStatus.status] || statusColors['no-guarantee']
                            
                            const cumulativeCash = getCumulativeCashCollection(vintage)
                            const hurdleAmount = vintage.purchasePrice * (vintage.terms.hurdle / 100)
                            const totalCashCollected = (cumulativeCash / 100) * vintage.purchasePrice
                            const currentPhase = totalCashCollected >= hurdleAmount ? 'post' : 'pre'
                            const currentSplit = vintage.performanceTracking?.currentSplits?.[currentPhase] || vintage.terms[currentPhase]
                            const baseSplit = vintage.performanceTracking?.baseSplits?.[currentPhase] || vintage.terms[currentPhase]
                            
                            return (
                              <Card className={`${colors.bg} ${colors.border}`}>
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                      {colors.icon} Performance Guarantee Status
                                    </h2>
                                    <p className={`text-sm font-medium ${colors.text}`}>
                                      {pgStatus.message}
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-500 mb-1">Current Age</p>
                                    <p className="font-semibold text-gray-900">{pgStatus.vintageAge || 0} months</p>
                                  </div>
                                  
                                  <div>
                                    <p className="text-gray-500 mb-1">Cumulative Cash</p>
                                    <p className="font-semibold text-gray-900">
                                      {cumulativeCash ? `${cumulativeCash.toFixed(1)}%` : '0.0%'}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      <Currency value={Math.round(totalCashCollected)} />
                                    </p>
                                  </div>

                                  {pgStatus.target && (
                                    <>
                                      <div>
                                        <p className="text-gray-500 mb-1">Target / Min / Reset</p>
                                        <p className="font-semibold text-gray-900">
                                          {pgStatus.target.toFixed(1)}% / {pgStatus.min.toFixed(1)}% / {pgStatus.reset.toFixed(1)}%
                                        </p>
                                      </div>

                                      <div>
                                        <p className="text-gray-500 mb-1">Delta vs Target</p>
                                        <p className={`font-semibold ${pgStatus.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {pgStatus.delta >= 0 ? '+' : ''}{pgStatus.delta.toFixed(1)}%
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-500 mb-1">Active Phase</p>
                                      <p className={`font-semibold ${totalCashCollected >= hurdleAmount ? 'text-green-600' : 'text-blue-600'} capitalize`}>
                                        {currentPhase}-Hurdle
                                        {totalCashCollected >= hurdleAmount && ' ✓'}
                                      </p>
                                      {currentPhase === 'pre' && (
                                        <p className="text-xs text-gray-600">
                                          Need <Currency value={hurdleAmount} /> to cross
                                        </p>
                                      )}
                                      {currentPhase === 'post' && (
                                        <p className="text-xs text-green-600">
                                          Crossed at <Currency value={hurdleAmount} />
                                        </p>
                                      )}
                                    </div>
                                    
                                    <div>
                                      <p className="text-gray-500 mb-1">Base Split</p>
                                      <p className="font-semibold text-gray-900">{baseSplit}% Flobase</p>
                                    </div>

                                    <div>
                                      <p className="text-gray-500 mb-1">Current Split</p>
                                      <p className={`font-semibold ${currentSplit !== baseSplit ? 'text-red-600' : 'text-gray-900'}`}>
                                        {currentSplit}% Flobase
                                        {currentSplit !== baseSplit && (
                                          <span className="text-xs ml-1">({currentSplit - baseSplit > 0 ? '+' : ''}{currentSplit - baseSplit}%)</span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            )
                          })()}

                          {vintage.performance && (
                            <Card>
                              <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Performance Curves</h2>
                                <Button variant="secondary" size="sm">
                                  Export Charts
                                </Button>
                              </div>

                              <div className="space-y-8">
                                <div>
                                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                    Cash Collections (% of Purchase Price)
                                  </h3>
                                  <div className="h-48 bg-gray-50 rounded-lg p-4">
                                    <svg width="100%" height="100%" viewBox="0 0 1200 160">
                                      {[0, 25, 50, 75, 100].map(val => (
                                        <g key={val}>
                                          <line
                                            x1="40"
                                            y1={140 - val * 1.2}
                                            x2="1160"
                                            y2={140 - val * 1.2}
                                            stroke="#e5e7eb"
                                            strokeWidth="1"
                                          />
                                          <text x="10" y={145 - val * 1.2} fontSize="12" fill="#6b7280">
                                            {val}%
                                          </text>
                                        </g>
                                      ))}
                                      <polyline
                                        points={vintage.performance.cashCollections
                                          .map((val, i) => `${60 + i * 92},${140 - val * 1.2}`)
                                          .join(' ')}
                                        fill="none"
                                        stroke="#2563eb"
                                        strokeWidth="3"
                                      />
                                      {vintage.performance.cashCollections.map((val, i) => (
                                        <circle
                                          key={i}
                                          cx={60 + i * 92}
                                          cy={140 - val * 1.2}
                                          r="3"
                                          fill="#2563eb"
                                        />
                                      ))}
                                      {Array.from({ length: 12 }, (_, i) => i + 1)
                                        .filter((_, i) => i % 2 === 0)
                                        .map(month => (
                                          <text
                                            key={month}
                                            x={60 + (month - 1) * 92}
                                            y="155"
                                            fontSize="11"
                                            fill="#6b7280"
                                            textAnchor="middle"
                                          >
                                            M{month}
                                          </text>
                                        ))}
                                    </svg>
                                  </div>
                                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                                    <span>
                                      Latest:{' '}
                                      <strong className="text-blue-600">
                                        {vintage.performance.cashCollections[vintage.performance.cashCollections.length - 1]}%
                                      </strong>
                                    </span>
                                    <span>Target: 100%</span>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                    Settlements (% of Enrolled Debt)
                                  </h3>
                                  <div className="h-48 bg-gray-50 rounded-lg p-4">
                                    <svg width="100%" height="100%" viewBox="0 0 1200 160">
                                      {[0, 25, 50, 75, 100].map(val => (
                                        <g key={val}>
                                          <line
                                            x1="40"
                                            y1={140 - val * 1.2}
                                            x2="1160"
                                            y2={140 - val * 1.2}
                                            stroke="#e5e7eb"
                                            strokeWidth="1"
                                          />
                                          <text x="10" y={145 - val * 1.2} fontSize="12" fill="#6b7280">
                                            {val}%
                                          </text>
                                        </g>
                                      ))}
                                      <polyline
                                        points={vintage.performance.settlements
                                          .map((val, i) => `${60 + i * 92},${140 - val * 1.2}`)
                                          .join(' ')}
                                        fill="none"
                                        stroke="#16a34a"
                                        strokeWidth="3"
                                      />
                                      {vintage.performance.settlements.map((val, i) => (
                                        <circle
                                          key={i}
                                          cx={60 + i * 92}
                                          cy={140 - val * 1.2}
                                          r="3"
                                          fill="#16a34a"
                                        />
                                      ))}
                                      {Array.from({ length: 12 }, (_, i) => i + 1)
                                        .filter((_, i) => i % 2 === 0)
                                        .map(month => (
                                          <text
                                            key={month}
                                            x={60 + (month - 1) * 92}
                                            y="155"
                                            fontSize="11"
                                            fill="#6b7280"
                                            textAnchor="middle"
                                          >
                                            M{month}
                                          </text>
                                        ))}
                                    </svg>
                                  </div>
                                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                                    <span>
                                      Latest:{' '}
                                      <strong className="text-green-600">
                                        {vintage.performance.settlements[vintage.performance.settlements.length - 1]}%
                                      </strong>
                                    </span>
                                    <span>Typical: 55-65%</span>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                    Cancellations (% of Enrolled Debt)
                                  </h3>
                                  <div className="h-48 bg-gray-50 rounded-lg p-4">
                                    <svg width="100%" height="100%" viewBox="0 0 1200 160">
                                      {[0, 25, 50, 75, 100].map(val => (
                                        <g key={val}>
                                          <line
                                            x1="40"
                                            y1={140 - val * 1.2}
                                            x2="1160"
                                            y2={140 - val * 1.2}
                                            stroke="#e5e7eb"
                                            strokeWidth="1"
                                          />
                                          <text x="10" y={145 - val * 1.2} fontSize="12" fill="#6b7280">
                                            {val}%
                                          </text>
                                        </g>
                                      ))}
                                      <polyline
                                        points={vintage.performance.cancellations
                                          .map((val, i) => `${60 + i * 92},${140 - val * 1.2}`)
                                          .join(' ')}
                                        fill="none"
                                        stroke="#dc2626"
                                        strokeWidth="3"
                                      />
                                      {vintage.performance.cancellations.map((val, i) => (
                                        <circle
                                          key={i}
                                          cx={60 + i * 92}
                                          cy={140 - val * 1.2}
                                          r="3"
                                          fill="#dc2626"
                                        />
                                      ))}
                                      {Array.from({ length: 12 }, (_, i) => i + 1)
                                        .filter((_, i) => i % 2 === 0)
                                        .map(month => (
                                          <text
                                            key={month}
                                            x={60 + (month - 1) * 92}
                                            y="155"
                                            fontSize="11"
                                            fill="#6b7280"
                                            textAnchor="middle"
                                          >
                                            M{month}
                                          </text>
                                        ))}
                                    </svg>
                                  </div>
                                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                                    <span>
                                      Latest:{' '}
                                      <strong className="text-red-600">
                                        {vintage.performance.cancellations[vintage.performance.cancellations.length - 1]}%
                                      </strong>
                                    </span>
                                    <span>Threshold: {'<'} 20%</span>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          )}
                        </div>
                      )
                    })()}
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {adminView && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setAdminView(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {adminView === 'mappings' ? 'Column Mappings' : 'User Access'}
              </h2>
              <button
                onClick={() => setAdminView(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {adminView === 'mappings' && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600">
                    Configure CSV column mappings for eligibility criteria
                  </p>

                  <div className="space-y-3">
                    {Object.entries(columnMappings).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3 min-w-0">
                        <div className="w-48 text-sm font-medium text-gray-700 flex-shrink-0 truncate">{key}</div>
                        <input
                          type="text"
                          value={value}
                          onChange={e =>
                            setColumnMappings({ ...columnMappings, [key]: e.target.value })
                          }
                          className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminView === 'access' && (
                <EmptyState
                  title="User Access Management"
                  description="Coming soon - invite team members and manage permissions"
                />
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <Button onClick={() => setAdminView(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {showAddPartnerModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddPartnerModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Partner</h2>
              <button
                onClick={() => setShowAddPartnerModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Partner Name *
                      </label>
                      <input
                        type="text"
                        value={newPartner.name}
                        onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Cordoba Law Group"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Partner Code *
                      </label>
                      <input
                        type="text"
                        value={newPartner.code}
                        onChange={(e) => setNewPartner({ ...newPartner, code: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="CLG"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Terms</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hurdle %
                      </label>
                      <input
                        type="number"
                        value={newPartner.hurdle}
                        onChange={(e) => setNewPartner({ ...newPartner, hurdle: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pre-Hurdle Split %
                      </label>
                      <input
                        type="number"
                        value={newPartner.preSplit}
                        onChange={(e) => setNewPartner({ ...newPartner, preSplit: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Post-Hurdle Split %
                      </label>
                      <input
                        type="number"
                        value={newPartner.postSplit}
                        onChange={(e) => setNewPartner({ ...newPartner, postSplit: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Advance Rate %
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={newPartner.advanceRate}
                        onChange={(e) => setNewPartner({ ...newPartner, advanceRate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Charge Back Policy</h3>
                  <div className="max-w-xs">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Charge Back Period
                    </label>
                    <select
                      value={newPartner.chargeBackPolicy}
                      onChange={(e) => setNewPartner({ ...newPartner, chargeBackPolicy: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Full Duration">Full Duration</option>
                      <option value="90 Days">90 Days</option>
                      <option value="120 Days">120 Days</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Performance Guarantees</h3>
                    <Button size="sm" onClick={addGuaranteeRow}>
                      + Add Row
                    </Button>
                  </div>

                  {newPartner.guarantees.length > 0 ? (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Period (Months)</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Target %</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Min (90%)</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Reset (95%)</th>
                            <th className="px-4 py-2 text-center font-semibold text-gray-700">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {newPartner.guarantees.map((g, i) => (
                            <tr key={i}>
                              <td className="px-4 py-2">
                                <input
                                  type="number"
                                  value={g.period}
                                  onChange={(e) => updateGuaranteeRow(i, 'period', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="number"
                                  step="0.1"
                                  value={g.target}
                                  onChange={(e) => updateGuaranteeRow(i, 'target', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                              </td>
                              <td className="px-4 py-2 text-gray-600">
                                {(g.target * 0.90).toFixed(1)}%
                              </td>
                              <td className="px-4 py-2 text-gray-600">
                                {(g.target * 0.95).toFixed(1)}%
                              </td>
                              <td className="px-4 py-2 text-center">
                                <button
                                  onClick={() => removeGuaranteeRow(i)}
                                  className="text-red-600 hover:text-red-700 font-medium"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No performance guarantees added yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowAddPartnerModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPartner}>
                Add Partner
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

