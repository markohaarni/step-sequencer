import { render, screen } from '@testing-library/react';
import ProjectDisplay from './ProjectDisplay';
import store from '../../app/store';
import { Provider } from 'react-redux';

test('displays correct bar, beat and tempo', () => {
  render(
    <Provider store={store}>
      <ProjectDisplay transportPosition="0:2:1" bpm={110} />
    </Provider>
  );

  expect(screen.getByTestId('value-Bar')).toHaveTextContent('1');
  expect(screen.getByTestId('value-Beat')).toHaveTextContent('3');
  expect(screen.getByTestId('value-Tempo')).toHaveTextContent('110');
});

test('handles undefined value for transportPosition', () => {
  render(
    <Provider store={store}>
      <ProjectDisplay />
    </Provider>
  );

  expect(screen.getByTestId('value-Bar')).toHaveTextContent('1');
  expect(screen.getByTestId('value-Beat')).toHaveTextContent('1');
});
