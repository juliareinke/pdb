import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import FilmesTrend from '../components/FilmesTrend';
import axios from 'axios';

jest.mock('axios');
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('FilmesTrend', () => {
  const mockFilmes = {
    data: {
      results: [
        {
          id: 1,
          title: 'Test Movie 1',
          poster_path: '/test1.jpg',
        },
        {
          id: 2,
          title: 'Test Movie 2',
          poster_path: '/test2.jpg',
        },
      ],
    },
  };

  beforeEach(() => {
    axios.get.mockResolvedValue(mockFilmes);
  });

  it('renders correctly', async () => {
    const { getByText, getAllByTestId } = render(<FilmesTrend />);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(getByText('Filmes Trending')).toBeTruthy();
    expect(getAllByTestId('movie-card')).toHaveLength(2);
  });

  it('handles swipe gestures', async () => {
    const { getByTestId } = render(<FilmesTrend />);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const carousel = getByTestId('carousel');
    fireEvent(carousel, 'onGestureEvent', {
      nativeEvent: { translationX: -200 }
    });
  });
});