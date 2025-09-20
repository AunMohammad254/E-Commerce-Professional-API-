import React from 'react';
import { render, screen } from '@testing-library/react';

// Create a simple test component to verify React Testing Library works
const TestComponent = () => {
  return <div data-testid="test-component">Hello World</div>;
};

test('React Testing Library works correctly', () => {
  render(<TestComponent />);
  expect(screen.getByTestId('test-component')).toBeInTheDocument();
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});

test('Basic functionality works', () => {
  expect(1 + 1).toBe(2);
  expect('hello').toBe('hello');
});

test('React is properly imported', () => {
  expect(React).toBeDefined();
  expect(React.createElement).toBeDefined();
});

test('Testing environment is properly configured', () => {
  // Test that Jest and React Testing Library are working
  expect(typeof expect).toBe('function');
  expect(typeof render).toBe('function');
  expect(typeof screen).toBe('object');
});

test('DOM testing utilities work', () => {
  const { container } = render(<TestComponent />);
  expect(container).toBeInTheDocument();
  expect(container.firstChild).toBeInTheDocument();
});
