import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from '@react-navigation/native';

export default function Header() {
  const [usuario, setUsuario] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const recuperarUsuario = async () => {
      try {
        const userInfo = await AsyncStorage.getItem("user_info");
        if (userInfo) {
          setUsuario(JSON.parse(userInfo));
        }
      } catch (error) {
        console.error("Erro ao recuperar informações do usuário:", error);
      }
    };

    recuperarUsuario();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Main" }],
            })
          );
        }}
      >
        <Text testID="header-title" style={styles.header}>
          R E I N K E watch
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate(usuario ? "Perfil" : "Login")}
      >
        <Image
          testID="avatar-image"
          source={{
            uri: usuario?.avatar || "https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg", 
          }}
          style={styles.avatar}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Comfortaa, sans-serif",
    backgroundColor: "#ded4ee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    height: "12%",
    borderBottomWidth: 1,
    borderColor: "black",
    padding: 10,
    boxSizing: "border-box",
  },
  header: {
    fontSize: 24,
    fontWeight: "500",
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
  },
});
