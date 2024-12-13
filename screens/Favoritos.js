import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MeusFavoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const verificarUsuario = async () => {
      try {
        const usuario = await AsyncStorage.getItem("user_info");
        if (!usuario) {
          navigation.navigate("Login");
        } else {
          const favoritosArmazenados =
            (await AsyncStorage.getItem("favorites")) || "[]";
          setFavoritos(JSON.parse(favoritosArmazenados));
        }
      } catch (error) {
        console.error("Erro ao acessar informações:", error);
      }
    };

    verificarUsuario();
  }, [navigation]);

  const handleMovieClick = (id) => {
    navigation.navigate("Info", { id });
  };

  if (favoritos.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Meus Favoritos</Text>
        <Text style={styles.message}>
          Você não tem filmes/séries favoritados ainda.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Favoritos</Text>
      <View style={styles.favoritesList}>
        {favoritos.map((movie) => (
          <TouchableOpacity
            testID="favorite-movie"
            key={movie.id}
            style={styles.favoriteItem}
            onPress={() => handleMovieClick(movie.id)}
          >
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              }}
              style={styles.favoritePoster}
            />
            <Text style={styles.movieTitle}>{movie.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#ac9ecf",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center"
  },
  message: {
    fontSize: 18,
    color: "#555",
  },
  favoritesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  favoriteItem: {
    width: "48%",
    marginBottom: 15,
    alignItems: "center",
  },
  favoritePoster: {
    width: 150,
    height: 225,
    borderRadius: 10,
  },
  movieTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
