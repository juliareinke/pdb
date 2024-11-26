import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Button,
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
    const loadUserData = async () => {
      try {
        const data = await AsyncStorage.getItem("userData");
        if (data) {
          setUserData(JSON.parse(data));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  if (!userData) return null;

  const handleAvatarChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Precisamos de permissão para acessar suas fotos");
      return;
    }
    Alert.alert("Alterar Avatar", "Escolha uma opção:", [
      {
        text: "Câmera",
        onPress: async () => {
          let permission = await ImagePicker.requestCameraPermissionsAsync();
          if (permission.granted) {
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              setUserData((prevUserData) => ({
                ...prevUserData,
                avatar: result.assets[0].uri,
              }));
            }
          } else {
            Alert.alert(
              "Permissão negada",
              "É necessário conceder permissão para acessar a câmera."
            );
          }
        },
      },
      {
        text: "Galeria",
        onPress: async () => {
          let permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (permission.granted) {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              setUserData((prevUserData) => ({
                ...prevUserData,
                avatar: result.assets[0].uri,
              }));
            }
          } else {
            Alert.alert(
              "Permissão negada",
              "É necessário conceder permissão para acessar a galeria."
            );
          }
        },
      },
      {
        text: "Cancelar",
        style: "cancel",
      },
    ]);
  };

  const handleSave = async () => {
    const userInfo = {
      fullName: userData.fullName,
      username: userData.username,
      avatar: userData.avatar,
    };

    try {
      await AsyncStorage.setItem("user_info", JSON.stringify(userInfo));
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil", error);
      Alert.alert("Erro", "Houve um problema ao atualizar seu perfil.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      {userData && (
        <View style={styles.profileInfo}>
          <View style={styles.avatarSection}>
            <Image
              testID="profile-avatar"
              source={{
                uri:
                  userData.avatar ||
                  "https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg",
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
      )}
      <Button title="Salvar alterações" onPress={handleSave} />
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
    textAlign: "center",
    marginBottom: 20,
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
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  userDetails: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  username: {
    fontSize: 18,
    marginBottom: 5,
  },
});
