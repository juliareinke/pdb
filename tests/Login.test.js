import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import LoginPage from '../screens/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    dispatch: jest.fn(),
  }),
  CommonActions: {
    reset: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockUserData = {
  username: 'user',
  password: 'password',
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === 'user_info') return Promise.resolve(JSON.stringify(mockUserData));
      if (key === 'guest_session_id') return Promise.resolve('guest-session-id');
      return null;
    });
  });

  it('renderiza o formulário de login corretamente', () => {
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
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('guest_session_id');
      expect(CommonActions.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    });
  });

  it('mostra erro para credenciais inválidas', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginPage />);

    fireEvent.changeText(getByPlaceholderText('Usuário'), 'wrong');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'wrong');
    fireEvent.press(getByText('Entrar'));

    await waitFor(() => {
      expect(AsyncStorage.getItem).not.toHaveBeenCalledWith('guest_session_id');
      expect(CommonActions.reset).not.toHaveBeenCalled();
    });
  });

  it('mostra erro se nenhum usuário está cadastrado', async () => {
    AsyncStorage.getItem.mockImplementation(() => Promise.resolve(null));
    const { getByText, getByPlaceholderText } = render(<LoginPage />);

    fireEvent.changeText(getByPlaceholderText('Usuário'), 'user');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'password');
    fireEvent.press(getByText('Entrar'));

    await waitFor(() => {
      expect(CommonActions.reset).not.toHaveBeenCalled();
    });
  });
});
