import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResultsCard from '../components/ResultsCard';

describe('ResultsCard', () => {
  it('renders correctly with full data', () => {
    const mockData = {
      fit_score: 85,
      summary: 'A very strong candidate.',
      strengths: ['React', 'Python'],
      weaknesses: ['Java'],
      recommendations: ['Highlight backend skills'],
      missing_keywords: ['AWS']
    };

    render(<ResultsCard data={mockData} />);

    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('A very strong candidate.')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Java')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
  });

  it('renders empty states gracefully', () => {
    const mockData = {
      fit_score: 30,
      summary: 'Not a match.',
      strengths: [],
      weaknesses: [],
      recommendations: [],
      missing_keywords: []
    };

    render(<ResultsCard data={mockData} />);
    
    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(screen.getByText('None identified')).toBeInTheDocument(); // Depends on exact empty message rendered
  });
});
