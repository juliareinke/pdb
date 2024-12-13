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

import CustomModal from "../components/CustomModal";

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
    const checkLoginStatus = async () => {
      const sessionId = await AsyncStorage.getItem("session_id");

      if (sessionId) {
        setIsLoggedIn(true);
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );
      }
    };

    checkLoginStatus();
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

    const newWatchlist = { name: watchlistName, filmes: watchlist };

    try {
      const storedWatchlists = await AsyncStorage.getItem("watchlists");
      let parsedWatchlists = [];

      if (storedWatchlists) {
        parsedWatchlists = JSON.parse(storedWatchlists);
      }

      parsedWatchlists.push(newWatchlist);

      await AsyncStorage.setItem("watchlists", JSON.stringify(parsedWatchlists));

      alert("Watchlist criada com sucesso!");
      setShowModal(false);
      setWatchlistName("");
      setWatchlist([]);
      navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: "Main" }],
                    })
                  )
    } catch (error) {
      console.error("Error saving watchlist:", error);
    }
  };

  const redirectToLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
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
          <TextInput
            style={styles.input}
            value={watchlistName}
            onChangeText={setWatchlistName}
            placeholder="Digite um nome para sua Watchlist"
          />
          <Button
            title="Criar Watchlist"
            onPress={() => setShowModal(true)}
          />
          <CustomModal
            visible={showModal}
            onConfirm={createWatchlist}
            onCancel={() => setShowModal(false)}
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
    backgroundColor: "#ac9ecf",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 20,
  },
  filters: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#ffffffaa",
    padding: 15,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: "#000",
  },
  genresContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  genreCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "#fff",
  },
  checkboxSelected: {
    backgroundColor: "#baa7cc",
    borderColor: "#baa7cc",
  },
  checkboxText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  genreText: {
    fontSize: 14,
    color: "#000",
  },
  filmesList: {
    width: "100%",
    marginBottom: 20,
  },
  movieItem: {
    marginBottom: 15,
    alignItems: "center",
  },
  filmePoster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  filmeTitle: {
    textAlign: "center",
    color: "#000",
    marginTop: 5,
    fontWeight: "bold",
  },
  watchlistSummary: {
    width: "100%",
    backgroundColor: "#ffffffaa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
  },
  watchlistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  watchlistPoster: {
    width: 50,
    height: 75,
    borderRadius: 5,
  },
  modal: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#6f42c1",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

