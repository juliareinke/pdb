import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from '@react-navigation/native';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    const storedUserData = await AsyncStorage.getItem("user_info");

    if (storedUserData) {
      const userData = JSON.parse(storedUserData);

      if (userData.username === username && userData.password === password) {
        try {
          const sessionId = await AsyncStorage.getItem("session_id");
          if (sessionId) {
            Alert.alert("Sucesso", "Login bem-sucedido!");
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Main" }],
              })
            )
          } else {
            Alert.alert("Erro", "Sessão não encontrada. Faça o login novamente.");
          }
        } catch (error) {
          console.error("Erro ao acessar a sessão", error);
          Alert.alert("Erro", "Erro ao acessar a sessão.");
        }
      } else {
        Alert.alert("Erro", "Nome de usuário ou senha incorretos!");
      }
    } else {
      Alert.alert("Erro", "Nenhum usuário encontrado. Cadastre-se primeiro.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} />
      <Text style={styles.registerText}>
        Não tem uma conta?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
          Criar uma conta
        </Text>
      </Text>
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
  registerText: {
    marginTop: 20,
    textAlign: "center",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
