import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

export default function Perfil() {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    checkSessionAndLoadUser();
  }, []);

  const checkSessionAndLoadUser = async () => {
    try {
      const sessionId = await AsyncStorage.getItem("session_id");
      if (!sessionId) {
        navigation.replace("Login"); 
        return;
      }
      const data = await AsyncStorage.getItem("user_info");
      if (data) {
        setUserData(JSON.parse(data));
      } else {
        navigation.replace("Login"); 
      }
    } catch (error) {
      console.error("Erro ao checar a sessão:", error);
      navigation.replace("Login"); 
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("session_id");
      await AsyncStorage.removeItem("user_info");
      navigation.replace("Login");
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
      Alert.alert("Erro", "Não foi possível realizar logout.");
    }
  };

  const handleAvatarChange = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      console.log("Camera Permission Status:", cameraPermission.status);
      console.log("Library Permission Status:", libraryPermission.status);
  
      if (cameraPermission.status !== "granted" || libraryPermission.status !== "granted") {
        Alert.alert("Permissão necessária", "Precisamos de permissão para acessar a câmera e a galeria");
        return;
      }
  
      Alert.alert("Alterar Avatar", "Escolha uma opção:", [
        {
          text: "Câmera",
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5,
            });
  
            console.log("Camera Result:", result);  
            if (!result.canceled) {
              updateAvatar(result.assets[0].uri);
            }
          },
        },
        {
          text: "Galeria",
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5,
            });
  
            console.log("Library Result:", result);  
            if (!result.canceled) {
              updateAvatar(result.assets[0].uri);
            }
          },
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ]);
    } catch (error) {
      console.error("Erro ao alterar avatar:", error);
      Alert.alert("Erro", "Não foi possível alterar o avatar.");
    }
  };
  

  const updateAvatar = async (uri) => {
    try {
      console.log("Novo Avatar URI:", uri);  
      const updatedUserData = {
        ...userData,
        avatar: uri,
      };
      await AsyncStorage.setItem("user_info", JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
      Alert.alert("Sucesso", "Avatar atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      Alert.alert("Erro", "Não foi possível salvar o avatar.");
    }
  };
  

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      <View style={styles.profileInfo}>
        <View style={styles.avatarSection}>
          <Image
            testID="profile-avatar"
            source={{
              uri: userData.avatar || "https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg",
            }}
            style={styles.avatar}
          />
          <TouchableOpacity
            testID="change-avatar-button"
            onPress={handleAvatarChange}
            style={styles.changeAvatarButton}
          >
            <Text style={styles.buttonText}>Alterar Avatar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.username}>Olá, {userData.fullName}</Text>
          <Text style={styles.username}>@{userData.username}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ac9ecf",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ac9ecf",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  profileInfo: {
    flexDirection: "row",
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginRight: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changeAvatarButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  userDetails: {
    justifyContent: "center",
    flex: 1,
  },
  username: {
    fontSize: 18,
    marginBottom: 5,
  },
});
