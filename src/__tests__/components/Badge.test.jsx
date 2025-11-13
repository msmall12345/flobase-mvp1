import React from 'react'
import { render, screen } from '@testing-library/react'
import Badge from '../../components/Badge'

describe('Badge Component', () => {
  it('should render children text', () => {
    render(<Badge>Active</Badge>)

    expect(screen.getByTestId('badge')).toHaveTextContent('Active')
  })

  it('should apply default variant by default', () => {
    render(<Badge>Status</Badge>)

    const badge = screen.getByTestId('badge')
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-700')
    expect(badge).toHaveAttribute('data-variant', 'default')
  })

  it('should apply success variant correctly', () => {
    render(<Badge variant="success">Completed</Badge>)

    const badge = screen.getByTestId('badge')
    expect(badge).toHaveClass('bg-green-100', 'text-green-700')
    expect(badge).toHaveAttribute('data-variant', 'success')
  })

  it('should apply danger variant correctly', () => {
    render(<Badge variant="danger">Failed</Badge>)

    const badge = screen.getByTestId('badge')
    expect(badge).toHaveClass('bg-red-100', 'text-red-700')
    expect(badge).toHaveAttribute('data-variant', 'danger')
  })

  it('should apply warning variant correctly', () => {
    render(<Badge variant="warning">Pending</Badge>)

    const badge = screen.getByTestId('badge')
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-700')
    expect(badge).toHaveAttribute('data-variant', 'warning')
  })

  it('should apply info variant correctly', () => {
    render(<Badge variant="info">Info</Badge>)

    const badge = screen.getByTestId('badge')
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-700')
    expect(badge).toHaveAttribute('data-variant', 'info')
  })

  it('should render with consistent styling classes', () => {
    render(<Badge>Test</Badge>)

    const badge = screen.getByTestId('badge')
    expect(badge).toHaveClass('px-2.5', 'py-0.5', 'rounded-full', 'text-xs', 'font-semibold')
  })

  it('should handle React elements as children', () => {
    render(
      <Badge variant="success">
        <span data-testid="icon">✓</span> Approved
      </Badge>
    )

    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByTestId('badge')).toHaveTextContent('✓ Approved')
  })

  it('should handle empty children', () => {
    render(<Badge></Badge>)

    expect(screen.getByTestId('badge')).toBeInTheDocument()
    expect(screen.getByTestId('badge')).toHaveTextContent('')
  })
})
