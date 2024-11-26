import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FilmesTrend from "./FilmesTrend.js";

export default function Main() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Crie sua WatchList {"\n"}
        personalizada {"\n"}
        com Reinke Watch
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("CriarWatchlist")}
        style={styles.button}
      >
        <Text>Crie a sua agora!</Text>
      </TouchableOpacity>
      <View style={styles.containerBottom}>
        <FilmesTrend />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ac9ecf",
    margin: 0,
    paddingTop: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
  },
  title: {
    margin: 0,
    fontWeight: "normal",
    backgroundColor: "rgba(222, 212, 238, 0.6)",
    textAlign: "center",
    fontSize: 24,
    marginHorizontal: 15,
    borderRadius: 15,
    padding: 5,
    maxWidth: 390,
  },
  containerBottom: {
    width: "100%",
    flex: 1,
    paddingVertical: 5,
    backgroundColor: "#ac9ecf",
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
  },
});
