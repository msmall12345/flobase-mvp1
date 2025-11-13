import React from 'react'
import Card from './Card'

/**
 * StatCard component for displaying key metrics
 */
function StatCard({ label, value, sublabel, trend, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    gray: 'bg-gray-50 border-gray-200'
  }

  return (
    <Card className={colors[color]} data-testid="stat-card">
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 truncate" data-testid="stat-label">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 mb-1 break-words" data-testid="stat-value">
          {value}
        </p>
        {sublabel && (
          <p className="text-xs text-gray-500 truncate" data-testid="stat-sublabel">
            {sublabel}
          </p>
        )}
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-gray-200" data-testid="stat-trend">
          <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        </div>
      )}
    </Card>
  )
}

export default StatCard
