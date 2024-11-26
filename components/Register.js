import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const checkUser = async () => {
      const savedUser = await AsyncStorage.getItem("user_info");
      if (savedUser) {
        navigation.navigate("Perfil");
      }
    };
    checkUser();
  }, [navigation]);

  const handleSubmit = async () => {
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
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.navigate("Perfil");
    } catch (error) {
      console.error("Erro ao salvar usuário", error);
      Alert.alert("Erro", "Houve um problema ao cadastrar seu usuário.");
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
      <TouchableOpacity onPress={handleSubmit} testID="register-button">
        <Text style={styles.button}>Criar Conta</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
  },
});
