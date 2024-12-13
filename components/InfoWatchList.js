import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function InfoWatchList({ route }) {
  const { watchlist } = route.params;
  const [watchlistName, setWatchlistName] = useState(watchlist.name);
  const [watchlistMovies, setWatchlistMovies] = useState(watchlist.filmes || []);
  const navigation = useNavigation();

  const saveWatchlistChanges = async () => {
    try {
      const storedWatchlists = await AsyncStorage.getItem("watchlists");
      if (!storedWatchlists) return;

      const allWatchlists = JSON.parse(storedWatchlists);
      const updatedWatchlistIndex = allWatchlists.findIndex(
        (wl) => wl.name === watchlist.name
      );

      if (updatedWatchlistIndex !== -1) {
        allWatchlists[updatedWatchlistIndex] = {
          name: watchlistName,
          filmes: watchlistMovies,
        };
        await AsyncStorage.setItem("watchlists", JSON.stringify(allWatchlists));
        Alert.alert("Sucesso", "Watchlist atualizada com sucesso!");
        navigation.navigate("MinhasWatchlists")
      }
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  const handleRemoveMovie = (movie) => {
    Alert.alert(
      "Remover Filme",
      "Tem certeza que deseja remover este filme?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          onPress: () => {
            const updatedMovies = watchlistMovies.filter(
              (m) => m.id !== movie.id
            );
            setWatchlistMovies(updatedMovies);
          },
        },
      ]
    );
  };

  const handleDeleteWatchlist = async () => {
    Alert.alert(
      "Excluir Watchlist",
      "Tem certeza que deseja excluir esta watchlist?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const storedWatchlists = await AsyncStorage.getItem("watchlists");
              if (!storedWatchlists) return;

              const allWatchlists = JSON.parse(storedWatchlists);
              const updatedWatchlists = allWatchlists.filter(
                (wl) => wl.name !== watchlist.name
              );

              await AsyncStorage.setItem(
                "watchlists",
                JSON.stringify(updatedWatchlists)
              );
              Alert.alert("Sucesso", "Watchlist excluída com sucesso!");
              navigation.goBack();
            } catch (error) {
              console.error("Erro ao excluir a watchlist:", error);
              Alert.alert("Erro", "Não foi possível excluir a watchlist.");
            }
          },
        },
      ]
    );
  };

  const renderMovieItem = ({ item: movie }) => (
    <View style={styles.movieItem}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w200${movie.poster_path}` }}
        style={styles.moviePoster}
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{movie.title}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveMovie(movie)}
        >
          <Text style={styles.removeButtonText}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Watchlist</Text>
      <TextInput
        style={styles.input}
        value={watchlistName}
        onChangeText={setWatchlistName}
        placeholder="Editar nome da watchlist"
      />
      <FlatList
        data={watchlistMovies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveWatchlistChanges}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteWatchlist}
        >
          <Text style={styles.deleteButtonText}>Excluir Watchlist</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  movieItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  moviePoster: {
    width: 80,
    height: 120,
    borderRadius: 5,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 15,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  removeButton: {
    backgroundColor: "#ff5252",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#ff5252",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
