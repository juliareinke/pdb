import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

const mockUser = {
  avatar: "https://test.com/avatar.jpg"
};

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify(mockUser)))
}));

describe('Header', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
    mockNavigate.mockClear();
  });

  it('renderiza corretamente sem usuário', () => {
    const { getByText, getByTestId } = render(<Header />);
    expect(getByText('R E I N K E watch')).toBeTruthy();
  });

  it('navega para Login ao clicar no avatar sem usuário', () => {
    const { getByTestId } = render(<Header />);
    const avatar = getByTestId('avatar-image');
    fireEvent.press(avatar);
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('carrega dados do usuário do AsyncStorage', async () => {
    const { getByTestId } = render(<Header />);
    
    await waitFor(() => {
      const avatar = getByTestId('avatar-image');
      expect(avatar.props.source.uri).toBe(mockUser.avatar);
    });
  });
});