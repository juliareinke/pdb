import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterPage from '../components/Register';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    AsyncStorage.clear();
    mockNavigate.mockClear();
  });

  it('renderiza o formulário de registro', () => {
    const { getByTestId, getByPlaceholderText } = render(<RegisterPage />);
    
    expect(getByPlaceholderText('Digite seu nome completo')).toBeTruthy();
    expect(getByPlaceholderText('Digite seu nome de usuário')).toBeTruthy();
    expect(getByPlaceholderText('Digite sua senha')).toBeTruthy();
    expect(getByTestId('register-button')).toBeTruthy();
  });

  it('processa registro com sucesso', async () => {
    const { getByTestId, getByPlaceholderText } = render(<RegisterPage />);
    
    fireEvent.changeText(getByPlaceholderText('Digite seu nome completo'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Digite seu nome de usuário'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Digite sua senha'), 'password123');
    
    fireEvent.press(getByTestId('register-button'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'user_info',
        expect.stringContaining('Test User')
      );
    });
  });

  it('mostra erro para campos vazios', async () => {
    const { getByTestId } = render(<RegisterPage />);
    
    fireEvent.press(getByTestId('register-button'));

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith('Perfil');
    });
  });
});
