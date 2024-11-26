import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CriarWatchList from '../components/CriarWatchList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

jest.mock('axios');
const API_KEY = 'mock-api-key';
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('CriarWatchList', () => {
  const mockMovies = {
    data: {
      results: [
        { id: 1, title: 'Movie 1', poster_path: '/poster1.jpg' },
        { id: 2, title: 'Movie 2', poster_path: '/poster2.jpg' },
      ],
    },
  };

  beforeEach(() => {
    axios.get.mockResolvedValue(mockMovies);
    AsyncStorage.clear();
    axios.get.mockResolvedValue({
      data: {
        genres: [
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' }
        ]
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza campo de busca e filtros de gênero', async () => {
    const { getByPlaceholderText, getByText } = render(<CriarWatchList />);
    
    expect(getByPlaceholderText('Buscar filmes...')).toBeTruthy();
    await waitFor(() => {
      expect(getByText('Gêneros')).toBeTruthy();
    });
  });

  it('processa busca de filmes', async () => {
    const { getByPlaceholderText } = render(<CriarWatchList />);
    const searchInput = getByPlaceholderText('Buscar filmes...');
    
    fireEvent.changeText(searchInput, 'test movie');
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('search/movie'),
        expect.any(Object)
      );
    });
  });
});