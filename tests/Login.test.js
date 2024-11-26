import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginPage from '../components/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    AsyncStorage.clear();
    mockNavigate.mockClear();
  });

  it('renderiza formulário de login corretamente', () => {
    const { getByPlaceholderText, getByText } = render(<LoginPage />);
    
    expect(getByPlaceholderText('Usuário')).toBeTruthy();
    expect(getByPlaceholderText('Senha')).toBeTruthy();
    expect(getByText('Entrar')).toBeTruthy();
  });

  it('processa login com sucesso', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginPage />);
    
    fireEvent.changeText(getByPlaceholderText('Usuário'), 'user');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'password');
    fireEvent.press(getByText('Entrar'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('auth_token', 'fake-jwt-token');
      expect(mockNavigate).toHaveBeenCalledWith('CriarWatchlist');
    });
  });

  it('mostra erro para credenciais inválidas', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginPage />);
    
    fireEvent.changeText(getByPlaceholderText('Usuário'), 'wrong');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'wrong');
    fireEvent.press(getByText('Entrar'));

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});