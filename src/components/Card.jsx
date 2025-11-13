import React from 'react'

/**
 * Card component for content containers
 */
function Card({ children, className = '', hoverable, ...props }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm overflow-hidden ${
        hoverable ? 'transition-all duration-200 hover:shadow-md hover:border-gray-300' : ''
      } ${className}`}
      data-testid="card"
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
