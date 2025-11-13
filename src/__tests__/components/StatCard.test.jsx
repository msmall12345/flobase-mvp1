import React from 'react'
import { render, screen } from '@testing-library/react'
import StatCard from '../../components/StatCard'

describe('StatCard Component', () => {
  it('should render label and value', () => {
    render(<StatCard label="Total Revenue" value="$1,000,000" />)

    expect(screen.getByTestId('stat-label')).toHaveTextContent('Total Revenue')
    expect(screen.getByTestId('stat-value')).toHaveTextContent('$1,000,000')
  })

  it('should render sublabel when provided', () => {
    render(<StatCard label="Total Revenue" value="$1,000,000" sublabel="Last 30 days" />)

    expect(screen.getByTestId('stat-sublabel')).toHaveTextContent('Last 30 days')
  })

  it('should not render sublabel when not provided', () => {
    render(<StatCard label="Total Revenue" value="$1,000,000" />)

    expect(screen.queryByTestId('stat-sublabel')).not.toBeInTheDocument()
  })

  it('should render positive trend correctly', () => {
    render(<StatCard label="Total Revenue" value="$1,000,000" trend={15.5} />)

    const trend = screen.getByTestId('stat-trend')
    expect(trend).toBeInTheDocument()
    expect(trend).toHaveTextContent('↑ 15.5%')
    expect(trend.querySelector('span')).toHaveClass('text-green-600')
  })

  it('should render negative trend correctly', () => {
    render(<StatCard label="Total Revenue" value="$1,000,000" trend={-8.2} />)

    const trend = screen.getByTestId('stat-trend')
    expect(trend).toBeInTheDocument()
    expect(trend).toHaveTextContent('↓ 8.2%')
    expect(trend.querySelector('span')).toHaveClass('text-red-600')
  })

  it('should not render trend when not provided', () => {
    render(<StatCard label="Total Revenue" value="$1,000,000" />)

    expect(screen.queryByTestId('stat-trend')).not.toBeInTheDocument()
  })

  it('should apply blue color by default', () => {
    render(<StatCard label="Total Revenue" value="$1,000,000" />)

    const card = screen.getByTestId('stat-card')
    expect(card).toHaveClass('bg-blue-50', 'border-blue-200')
  })

  it('should apply green color when specified', () => {
    render(<StatCard label="Total Revenue" value="$1,000,000" color="green" />)

    const card = screen.getByTestId('stat-card')
    expect(card).toHaveClass('bg-green-50', 'border-green-200')
  })

  it('should apply yellow color when specified', () => {
    render(<StatCard label="Total Revenue" value="$1,000,000" color="yellow" />)

    const card = screen.getByTestId('stat-card')
    expect(card).toHaveClass('bg-yellow-50', 'border-yellow-200')
  })

  it('should apply gray color when specified', () => {
    render(<StatCard label="Total Revenue" value="$1,000,000" color="gray" />)

    const card = screen.getByTestId('stat-card')
    expect(card).toHaveClass('bg-gray-50', 'border-gray-200')
  })

  it('should handle React elements as value', () => {
    const value = <span data-testid="custom-value">Custom Value</span>
    render(<StatCard label="Total Revenue" value={value} />)

    expect(screen.getByTestId('custom-value')).toBeInTheDocument()
    expect(screen.getByTestId('custom-value')).toHaveTextContent('Custom Value')
  })

  it('should render all elements together', () => {
    render(
      <StatCard
        label="Total Revenue"
        value="$1,000,000"
        sublabel="Last 30 days"
        trend={12.5}
        color="green"
      />
    )

    expect(screen.getByTestId('stat-label')).toHaveTextContent('Total Revenue')
    expect(screen.getByTestId('stat-value')).toHaveTextContent('$1,000,000')
    expect(screen.getByTestId('stat-sublabel')).toHaveTextContent('Last 30 days')
    expect(screen.getByTestId('stat-trend')).toHaveTextContent('↑ 12.5%')
    expect(screen.getByTestId('stat-card')).toHaveClass('bg-green-50')
  })

  it('should not render trend section when trend is zero', () => {
    render(<StatCard label="Total Revenue" value="$1,000,000" trend={0} />)

    // Zero is falsy, so trend section should not render
    expect(screen.queryByTestId('stat-trend')).not.toBeInTheDocument()
  })
})
