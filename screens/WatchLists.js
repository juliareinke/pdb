import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WatchList() {
  const [watchlists, setWatchlists] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadWatchlists = async () => {
      try {
        const storedWatchlists = await AsyncStorage.getItem("watchlists");
        if (storedWatchlists) {
          const parsedWatchlists = JSON.parse(storedWatchlists);
          setWatchlists(parsedWatchlists);
          console.log("Loaded watchlists:", parsedWatchlists);
        } else {
          console.log("No watchlists found");
          setWatchlists([]);
        }
      } catch (error) {
        console.error("Error loading watchlists:", error);
      }
    };

    loadWatchlists();
  }, []);

  const handleWatchlistPress = (watchlist) => {
    navigation.navigate("InfoWatchList", { watchlist });
  };

  const renderWatchlistItem = ({ item: watchlist }) => {
    return (
      <TouchableOpacity
        style={styles.watchlistItem}
        onPress={() => handleWatchlistPress(watchlist)}
      >
        <Text style={styles.watchlistName}>{watchlist.name}</Text>
      </TouchableOpacity>
    );
  };
  if (watchlists.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Suas Watchlists</Text>
        <Text style={styles.noWatchlists}>
          Você ainda não criou nenhuma watchlist.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suas Watchlists</Text>
      <FlatList
        data={watchlists}
        renderItem={renderWatchlistItem}
        keyExtractor={(item) => item.id || item.name}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ac9ecf",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  watchlistItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  watchlistName: {
    fontSize: 18,
  },
  noWatchlists: {
    textAlign: "center",
    fontSize: 16,
    color: "#aaa",
  },
});
