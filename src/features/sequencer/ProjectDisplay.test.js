import { render, screen } from '@testing-library/react';
import ProjectDisplay from './ProjectDisplay';

test('displays correct bar, beat and tempo', () => {
  render(<ProjectDisplay transportPosition="0:2:1" bpm={110} />);

  expect(screen.getByTestId('value-Bar')).toHaveTextContent('1');
  expect(screen.getByTestId('value-Beat')).toHaveTextContent('3');
  expect(screen.getByTestId('value-Tempo')).toHaveTextContent('110');
});

test('handles undefined value for transportPosition', () => {
  render(<ProjectDisplay />);

  expect(screen.getByTestId('value-Bar')).toHaveTextContent('1');
  expect(screen.getByTestId('value-Beat')).toHaveTextContent('1');
});
