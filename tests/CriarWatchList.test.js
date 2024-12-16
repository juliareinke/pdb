import { waitFor } from "@testing-library/react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("axios");

it("cria uma Watchlist e armazena no AsyncStorage", async () => {
  axios.get.mockResolvedValueOnce({
    data: {
      genres: [
        { id: 1, name: "Action" },
        { id: 2, name: "Drama" },
      ],
    },
  });

  const setItemMock = jest.spyOn(AsyncStorage, 'setItem');

  const watchlistName = "Minha Nova Watchlist";
  const watchlist = [];
  const newWatchlist = { name: watchlistName, filmes: watchlist };
  
  await AsyncStorage.setItem("watchlists", JSON.stringify([newWatchlist]));

  await waitFor(() => {
    expect(setItemMock).toHaveBeenCalledWith(
      "watchlists", 
      JSON.stringify([newWatchlist])
    );
  });
});
