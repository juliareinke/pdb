import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CriarWatchList() {
  const [filmes, setFilmes] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [watchlistName, setWatchlistName] = useState("");
  const navigation = useNavigation();

  const tokenJWT =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYzZlMjkwN2UxZjI5NzYzZjM2MGVkOWEyMTQyYmM2YiIsIm5iZiI6MTcyOTEyMDMwMi45MDM2OTYsInN1YiI6IjY2YjE2MmIzMjU1ZWRiYjY4MTc1NTdhMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qSaDzNQJu2tfMxGEmUtVradXtvz73G-AiSjghyWHZZg";

  useEffect(() => {
    const token = AsyncStorage.getItem("auth_token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchFilmes = async () => {
      try {
        let url;
        let params = {};

        if (keywords) {
          url = "https://api.themoviedb.org/3/search/movie?language=pt-BR";
          params.query = keywords;
        } else {
          url = "https://api.themoviedb.org/3/discover/movie?language=pt-BR";
        }

        if (selectedGenres.length > 0) {
          params.with_genres = selectedGenres.join(",");
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${tokenJWT}`,
            accept: "application/json",
          },
          params,
        });

        let filmesFiltrados = response.data.results;
        if (keywords && selectedGenres.length > 0) {
          filmesFiltrados = filmesFiltrados.filter((filme) =>
            selectedGenres.every((genreId) => filme.genre_ids.includes(genreId))
          );
        }
        setFilmes(filmesFiltrados);
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      }
    };

    fetchFilmes();
  }, [keywords, selectedGenres]);

  const addToWatchlist = (filme) => {
    if (!watchlist.find((f) => f.id === filme.id)) {
      setWatchlist([...watchlist, filme]);
    }
  };

  const removeFromWatchlist = (filme) => {
    setWatchlist(watchlist.filter((f) => f.id !== filme.id));
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/genre/movie/list?language=pt-BR",
          {
            headers: {
              Authorization: `Bearer ${tokenJWT}`,
              accept: "application/json",
            },
          }
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
      }
    };

    fetchGenres();
  }, []);

  const createWatchlist = async () => {
    if (!watchlistName) {
      alert("Por favor, insira um nome para sua watchlist!");
      return;
    }

    await AsyncStorage.setItem(
      "watchlist",
      JSON.stringify({ name: watchlistName, filmes: watchlist })
    );
    alert("Watchlist criada com sucesso!");
  };

  const redirectToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crie sua Watchlist Personalizada</Text>

      <View style={styles.filters}>
        <Text>Palavras-chave (separadas por vírgula):</Text>
        <TextInput
          testID="search-input"
          placeholder="Buscar filmes..."
          value={keywords}
          onChangeText={setKeywords}
          style={styles.input}
        />

        <Text>Gêneros</Text>
        <View style={styles.genresContainer}>
          {genres.map((genre) => (
            <View key={genre.id} style={styles.genreCheckbox}>
              <Pressable
                onPress={() => {
                  if (selectedGenres.includes(genre.id)) {
                    setSelectedGenres(
                      selectedGenres.filter((id) => id !== genre.id)
                    );
                  } else {
                    setSelectedGenres([...selectedGenres, genre.id]);
                  }
                }}
                style={[
                  styles.checkbox,
                  selectedGenres.includes(genre.id) && styles.checkboxSelected,
                ]}
              >
                {selectedGenres.includes(genre.id) && (
                  <Text style={styles.checkboxText}>✔</Text>
                )}
              </Pressable>
              <Text style={styles.genreText}>{genre.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.filmesList}>
        {filmes.length > 0 ? (
          filmes.map((filme) => (
            <TouchableOpacity
              testID="watchlist-movie"
              key={filme.id}
              style={styles.movieItem}
              onPress={() => addToWatchlist(filme)}
            >
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w200${filme.poster_path}`,
                }}
                style={styles.filmePoster}
              />
              <Text style={styles.filmeTitle}>{filme.title}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>Nenhum filme encontrado.</Text>
        )}
      </View>

      <View style={styles.watchlistSummary}>
        <Text style={styles.subTitle}>Sua Watchlist</Text>
        {watchlist.length > 0 ? (
          watchlist.map((filme) => (
            <View key={filme.id} style={styles.watchlistItem}>
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w200${filme.poster_path}`,
                }}
                style={styles.watchlistPoster}
              />
              <Text>{filme.title}</Text>
              <Button
                title="Remover da lista"
                onPress={() => removeFromWatchlist(filme)}
              />
            </View>
          ))
        ) : (
          <Text>Nenhum filme na sua watchlist.</Text>
        )}
      </View>

      {isLoggedIn ? (
        <View>
          <Button title="Criar Watchlist" onPress={() => setShowModal(true)} />
          {showModal && (
            <View style={styles.modal}>
              <Text>Tem certeza que deseja criar essa watchlist?</Text>
              <Button title="Sim" onPress={createWatchlist} />
              <Button title="Não" onPress={() => setShowModal(false)} />
            </View>
          )}
          <TextInput
            style={styles.input}
            value={watchlistName}
            onChangeText={setWatchlistName}
            placeholder="Digite um nome para sua Watchlist"
          />
        </View>
      ) : (
        <View>
          <Text>Você precisa estar logado para criar uma watchlist.</Text>
          <Button title="Ir para Login" onPress={redirectToLogin} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  filters: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  genresContainer: {
    marginBottom: 20,
  },
  genreCheckbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  filmesList: {
    marginBottom: 20,
  },
  filmeItem: {
    marginBottom: 10,
  },
  filmePoster: {
    width: 100,
    height: 150,
  },
  filmeTitle: {
    textAlign: "center",
  },
  watchlistSummary: {
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  watchlistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  watchlistPoster: {
    width: 50,
    height: 75,
  },
  modal: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  checkboxText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  genreText: {
    fontSize: 16,
  },
});
