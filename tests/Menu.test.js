import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Menu from '../components/Menu';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('Menu', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renderiza botão do menu', () => {
    const { getByText } = render(<Menu />);
    expect(getByText('☰ Menu')).toBeTruthy();
  });

  it('alterna visibilidade do menu', () => {
    const { getByText, queryByText } = render(<Menu />);
    
    expect(queryByText('Início')).toBeNull();
    
    fireEvent.press(getByText('☰ Menu'));
    expect(getByText('Início')).toBeTruthy();
    
    fireEvent.press(getByText('☰ Menu'));
    expect(queryByText('Início')).toBeNull();
  });

  it('navega corretamente ao clicar nos itens do menu', () => {
    const { getByText } = render(<Menu />);
    
    fireEvent.press(getByText('☰ Menu'));
    fireEvent.press(getByText('Criar Watchlist'));
    
    expect(mockNavigate).toHaveBeenCalledWith('CriarWatchlist');
  });
});