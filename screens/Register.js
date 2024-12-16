import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { API_KEY } from "@env";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const axiosInstance = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  const createGuestSession = async () => {
    try {
      const response = await axiosInstance.get("/authentication/guest_session/new");
      const guestSessionId = response.data.guest_session_id;
      await AsyncStorage.setItem("guest_session_id", guestSessionId);
      return guestSessionId;
    } catch (error) {
      console.error("Erro ao criar sessão de convidado", error);
      throw error;
    }
  };

  const handleRegister = async () => {
    if (!fullName || !username || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const userInfo = {
      fullName,
      username,
      password,
      avatar: null,
    };

    try {
      await AsyncStorage.setItem("user_info", JSON.stringify(userInfo));

      const guestSessionId = await createGuestSession();
      console.log("Guest Session ID:", guestSessionId);

      Alert.alert("Sucesso", "Sessão criada com sucesso!");
      navigation.replace("Perfil");
    } catch (error) {
      console.error("Erro ao salvar usuário ou criar sessão", error);
      Alert.alert("Erro", "Houve um problema ao criar sua conta.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome completo"
        value={fullName}
        onChangeText={setFullName}
        testID="fullname-input"
      />
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome de usuário"
        value={username}
        onChangeText={setUsername}
        testID="username-input"
      />
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        testID="password-input"
      />
      <Button title="Criar Conta"  testID="register-button" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
});
