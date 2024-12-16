import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MeusFavoritos from '../screens/Favoritos';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

describe('MeusFavoritos', () => {
  const mockFavorites = [
    { id: 1, title: 'Favorite Movie 1', poster_path: '/poster1.jpg' },
    { id: 2, title: 'Favorite Movie 2', poster_path: '/poster2.jpg' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockFavorites));
  });

  it('exibe mensagem quando não há favoritos', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('[]'); 

    const { getByText } = render(<MeusFavoritos />);

    await waitFor(() => {
      expect(getByText('Você não tem filmes/séries favoritados ainda.')).toBeTruthy();
    });
  });
});
