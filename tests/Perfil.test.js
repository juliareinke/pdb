import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Perfil from '../screens/Perfil';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({ canceled: false, assets: [{ uri: 'new-image-uri' }] })
  ),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    replace: mockNavigate,
  }),
}));

const mockUser = {
  fullName: 'Test User',
  username: 'testuser',
  avatar: 'https://test.com/avatar.jpg',
};

describe('Perfil', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockImplementation((key) =>
      key === 'user_info' ? Promise.resolve(JSON.stringify(mockUser)) : null
    );
  });

  it('navega para Login se não há sessão', async () => {
    AsyncStorage.getItem.mockImplementation(() => Promise.resolve(null));
    render(<Perfil />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Login');
    });
  });
});
