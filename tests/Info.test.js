import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import Info from '../components/Info';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock route params
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    params: { id: 1 }
  }),
  useNavigation: () => ({
    navigate: jest.fn()
  })
}));

// Mock axios
jest.mock('axios');

describe('Info', () => {
  const mockMovie = {
    data: {
      id: 1,
      title: 'Test Movie',
      overview: 'Test Overview',
      poster_path: '/test.jpg',
      release_date: '2024-01-01',
      genres: [{ id: 1, name: 'Action' }],
      vote_average: 8.5
    }
  };

  beforeEach(() => {
    axios.get.mockResolvedValue(mockMovie);
    AsyncStorage.clear();
  });

  it('renderiza detalhes do filme corretamente', async () => {
    const { getByText } = render(<Info />);
    
    await act(async () => {
      await waitFor(() => {
        expect(getByText('Test Movie')).toBeTruthy();
        expect(getByText('Test Overview')).toBeTruthy();
      });
    });
  });

  it('gerencia funcionalidade de favoritos', async () => {
    const { getByTestId } = render(<Info />);

    await waitFor(() => {
      const favoriteButton = getByTestId('favorite-button');
      expect(favoriteButton).toBeTruthy();
    });
  });

  it('exibe estado de carregamento inicialmente', () => {
    const { getByText } = render(<Info />);
    expect(getByText('Carregando...')).toBeTruthy();
  });
});
