import React from 'react'
import { render, screen } from '@testing-library/react'
import Card from '../../components/Card'

describe('Card Component', () => {
  it('should render children content', () => {
    render(<Card>Test Content</Card>)

    expect(screen.getByTestId('card')).toHaveTextContent('Test Content')
  })

  it('should apply base classes', () => {
    render(<Card>Content</Card>)

    const card = screen.getByTestId('card')
    expect(card).toHaveClass(
      'bg-white',
      'border',
      'border-gray-200',
      'rounded-xl',
      'p-5',
      'shadow-sm',
      'overflow-hidden'
    )
  })

  it('should apply custom className', () => {
    render(<Card className="custom-class">Content</Card>)

    const card = screen.getByTestId('card')
    expect(card).toHaveClass('custom-class')
  })

  it('should apply hoverable classes when hoverable is true', () => {
    render(<Card hoverable>Content</Card>)

    const card = screen.getByTestId('card')
    expect(card).toHaveClass('transition-all', 'duration-200', 'hover:shadow-md', 'hover:border-gray-300')
  })

  it('should not apply hoverable classes when hoverable is false', () => {
    render(<Card hoverable={false}>Content</Card>)

    const card = screen.getByTestId('card')
    expect(card).not.toHaveClass('transition-all')
    expect(card).not.toHaveClass('duration-200')
  })

  it('should not apply hoverable classes by default', () => {
    render(<Card>Content</Card>)

    const card = screen.getByTestId('card')
    expect(card).not.toHaveClass('transition-all')
  })

  it('should forward additional props', () => {
    render(<Card data-custom="test" id="card-id">Content</Card>)

    const card = screen.getByTestId('card')
    expect(card).toHaveAttribute('data-custom', 'test')
    expect(card).toHaveAttribute('id', 'card-id')
  })

  it('should render complex children', () => {
    render(
      <Card>
        <h1>Title</h1>
        <p>Description</p>
        <button>Action</button>
      </Card>
    )

    const card = screen.getByTestId('card')
    expect(card).toContainHTML('<h1>Title</h1>')
    expect(card).toContainHTML('<p>Description</p>')
    expect(card).toContainHTML('<button>Action</button>')
  })

  it('should handle empty children', () => {
    render(<Card></Card>)

    expect(screen.getByTestId('card')).toBeInTheDocument()
  })

  it('should combine custom className with hoverable', () => {
    render(<Card className="custom-class" hoverable>Content</Card>)

    const card = screen.getByTestId('card')
    expect(card).toHaveClass('custom-class')
    expect(card).toHaveClass('transition-all')
  })
})
