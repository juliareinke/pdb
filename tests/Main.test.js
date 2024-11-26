import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Main from '../components/Main';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('../components/FilmesTrend', () => {
  return function MockFilmesTrend() {
    return null;
  };
});

describe('Main', () => {
  it('renders main content correctly', () => {
    const { getByText } = render(<Main />);
    expect(getByText(/Crie sua WatchList/i)).toBeTruthy();
    expect(getByText(/personalizada/i)).toBeTruthy();
    expect(getByText(/com Reinke Watch/i)).toBeTruthy();
  });

  it('navigates to CriarWatchlist when button is pressed', () => {
    const { getByText } = render(<Main />);
    
    fireEvent.press(getByText('Crie a sua agora!'));
    expect(mockNavigate).toHaveBeenCalledWith('CriarWatchlist');
  });
});
