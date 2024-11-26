import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Info() {
  const route = useRoute();
  const { id } = route.params;

  const [filme, setFilme] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const tokenJWT =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYzZlMjkwN2UxZjI5NzYzZjM2MGVkOWEyMTQyYmM2YiIsIm5iZiI6MTcyOTEyMDMwMi45MDM2OTYsInN1YiI6IjY2YjE2MmIzMjU1ZWRiYjY4MTc1NTdhMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qSaDzNQJu2tfMxGEmUtVradXtvz73G-AiSjghyWHZZg";

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?language=pt-BR&append_to_response=videos`,
          {
            headers: {
              Authorization: `Bearer ${tokenJWT}`,
              accept: "application/json",
            },
          }
        );

        setFilme(response.data);

        const storedFavorites = JSON.parse(
          (await AsyncStorage.getItem("favorites")) || "[]"
        );
        const isAlreadyFavorite = storedFavorites.some(
          (movie) => movie.id === id
        );
        setIsFavorite(isAlreadyFavorite);
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
      }
    };
    fetchMovieDetails();
  }, []);

  const toggleFavorite = async () => {
    try {
      const storedFavorites = JSON.parse(
        (await AsyncStorage.getItem("favorites")) || "[]"
      );

      let updatedFavorites;

      if (isFavorite) {
        updatedFavorites = storedFavorites.filter(
          (movie) => movie.id !== filme.id
        );
      } else {
        updatedFavorites = [...storedFavorites, filme];
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Erro ao salvar favoritos:", error);
    }
  };

  if (!filme) return <Text style={styles.loading}>Carregando...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container_info}>
      <Text style={styles.title}>{filme.title}</Text>
      <Image
        testID="movie-poster"
        source={{ uri: `https://image.tmdb.org/t/p/w500${filme.poster_path}` }}
        style={styles.info_cartaz}
      />
      <View style={styles.sideInfo}>
        <TouchableOpacity
          testID="favorite-button"
          onPress={toggleFavorite}
          style={styles.favoriteButton}
        >
          <Text>
            {isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.text}>{filme.overview}</Text>
        <Text style={styles.genres}>
          GÊNEROS: {filme.genres.map((genero) => genero.name).join(", ")}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container_info: {
    flexGrow: 1,
    backgroundColor: "#ac9ecf",
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Comfortaa",
    textAlign: "center",
    marginBottom: 15,
  },
  info_cartaz: {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").width * 1.2,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 15,
  },
  sideInfo: {
    width: "85%",
    backgroundColor: "#ded4ee",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  genres: {
    fontWeight: "bold",
    fontSize: 16,
  },
  loading: {
    flex: 1,
    backgroundColor: "#ac9ecf",
    fontFamily: "Comfortaa",
    fontSize: 24,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
