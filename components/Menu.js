import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from '@react-navigation/native';

export default function Menu() {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigation = useNavigation();

  const toggleMenu = () => setMenuAberto(!menuAberto);

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity
        testID="menu-button"
        style={styles.menuButton}
        onPress={toggleMenu}
      >
        <Text style={styles.menuText}>☰ Menu</Text>
      </TouchableOpacity>

      {menuAberto && (
        <View style={styles.menuItems}>
          <TouchableOpacity
            testID="menu-item"
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                })
              );
            }}
          >
            <Text style={styles.menuText}>Início</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'CriarWatchlist' }],
                })
              );
            }}
          >
            <Text style={styles.menuText}>Criar Watchlist</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'MeusFavoritos' }],
                })
              );
            }}
          >
            <Text style={styles.menuText}>Meus Favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'MinhasWatchlists' }],
                })
              );
            }}
          >
            <Text style={styles.menuText}>Minhas Watchlists</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Perfil' }],
                })
              );
            }}
          >
            <Text style={styles.menuText}>Meu Perfil</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: "#ded4ee",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  menuButton: {
    padding: 10,
    backgroundColor: "#ac9ecf",
    borderRadius: 5,
    alignItems: "center",
  },
  menuText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  menuItems: {
    marginTop: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    overflow: "hidden",
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});
