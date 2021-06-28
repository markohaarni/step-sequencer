import { render, screen } from '@testing-library/react';
import App from './App';
import store from './app/store';
import { Provider } from 'react-redux';

test('renders sequencer title', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  const titleElement = screen.getByText(/Step sequencer/i);
  expect(titleElement).toBeInTheDocument();
});
