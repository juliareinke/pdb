import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MeusFavoritos from '../components/Favoritos';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('MeusFavoritos', () => {
  const mockFavorites = [
    { id: 1, title: 'Favorite Movie 1', poster_path: '/poster1.jpg' },
    { id: 2, title: 'Favorite Movie 2', poster_path: '/poster2.jpg' },
  ];

  beforeEach(() => {
    AsyncStorage.getItem.mockImplementation(() => 
      Promise.resolve(JSON.stringify(mockFavorites))
    );
  });

  it('renderiza lista de favoritos', async () => {
    const { getAllByTestId } = render(<MeusFavoritos />);
    
    await waitFor(() => {
      expect(getAllByTestId('favorite-movie')).toHaveLength(2);
    });
  });

  it('navega para informações do filme ao clicar', async () => {
    const { getAllByTestId } = render(<MeusFavoritos />);
    
    await waitFor(() => {
      const movieItems = getAllByTestId('favorite-movie');
      expect(movieItems.length).toBeGreaterThan(0);
    });

    const movieItems = getAllByTestId('favorite-movie');
    fireEvent.press(movieItems[0]);

    expect(mockNavigate).toHaveBeenCalledWith('Info', expect.any(Object));
  }, 10000); 
});
