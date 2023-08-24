import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('Going Low Carb Calculator tab is available', () => {
  render(<App />);
  const linkElement = screen.getByText(/Going Low Carb Calculator/i);
  expect(linkElement).toBeInTheDocument();
});
