import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Perfil from '../components/Perfil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

jest.mock('expo-image-picker');
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

const mockUser = {
  fullName: 'Test User',
  username: 'testuser',
  avatar: 'https://test.com/avatar.jpg'
};

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify(mockUser))),
  setItem: jest.fn(() => Promise.resolve())
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({
    canceled: false,
    assets: [{ uri: 'new-image-uri' }]
  }))
}));

describe('Perfil', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockImplementation(() => Promise.resolve(JSON.stringify(mockUser)));
  });

  it('renderiza perfil do usuário corretamente', async () => {
    const { getByText, getByTestId } = render(<Perfil />);
    
    await waitFor(() => {
      expect(getByText(`Olá, ${mockUser.fullName}`)).toBeTruthy();
      expect(getByText(`@${mockUser.username}`)).toBeTruthy();
      expect(getByTestId('profile-avatar')).toBeTruthy();
    });
  });

  it('gerencia alteração de avatar', async () => {
    const { getByTestId } = render(<Perfil />);
    
    await waitFor(() => {
      fireEvent.press(getByTestId('change-avatar-button'));
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
    });
  });
});