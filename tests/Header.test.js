import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
  CommonActions: {
    reset: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

describe('Header', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
    mockNavigate.mockClear();
  });

  it('renderiza corretamente sem usuário', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null); 
    const { getByText, getByTestId } = render(<Header />);

    expect(getByText('R E I N K E watch')).toBeTruthy();

    await waitFor(() => {
      const avatar = getByTestId('avatar-image');
      expect(avatar.props.source.uri).toBe(
        'https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg'
      );
    });
  });

  it('navega para Login ao clicar no avatar sem usuário', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null); 
    const { getByTestId } = render(<Header />);

    const avatar = getByTestId('avatar-image');
    fireEvent.press(avatar);

    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('carrega dados do usuário do AsyncStorage', async () => {
    const mockUser = { avatar: 'https://test.com/avatar.jpg' };
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockUser));
  
    const { getByTestId } = render(<Header />);
  
    await waitFor(() => {
      const avatar = getByTestId('avatar-image');
      expect(avatar.props.source.uri).toBe(mockUser.avatar);
    });
  });
  

  it('navega para Perfil ao clicar no avatar com usuário logado', async () => {
    const mockUser = { avatar: 'https://test.com/avatar.jpg' };
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockUser));

    const { getByTestId } = render(<Header />);

    const avatar = getByTestId('avatar-image');
    fireEvent.press(avatar);

    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });
});
