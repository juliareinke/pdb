import axios from 'axios';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { TMDB_ACCESS_TOKEN } from '@env';

import Header from './components/Header.js';
import Menu from './components/Menu.js';
import Main from './components/Main.js';
import Info from './components/Info.js';
import CriarWatchlist from './components/CriarWatchList.js';
import LoginPage from './components/Login.js';
import RegisterPage from './components/Register.js';
import Perfil from './components/Perfil.js';
import MeusFavoritos from './components/Favoritos.js';

import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  fonts: {
    regular: { fontFamily: 'Comfortaa' },
    medium: { fontFamily: 'ComfortaaBold' },
    light: { fontFamily: 'Comfortaa' },
    thin: { fontFamily: 'Comfortaa' },
  },
};

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Comfortaa: require('./assets/fonts/Comfortaa/Comfortaa-Regular.ttf'),
    ComfortaaBold: require('./assets/fonts/Comfortaa/Comfortaa-Bold.ttf'),
    ComfortaaLight: require('./assets/fonts/Comfortaa/Comfortaa-Light.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const resposta = await axios.get(
          'https://api.themoviedb.org/3/authentication/token/new',
          {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
            },
          }
        );
        console.log(resposta.data);
      } catch (erro) {
        console.error('Erro ao fazer a requisição', erro);
      }
    };

    buscarDados();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const theme = {
    ...DefaultTheme,
    fonts: {
      regular: { fontFamily: 'Comfortaa' },
      medium: { fontFamily: 'ComfortaaBold' },
      light: { fontFamily: 'ComfortaaLight' },
      thin: { fontFamily: 'Comfortaa' },
    },
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Header />
        <Menu />
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              height: 0, 
            },
          }}
        >
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Info" component={Info} />
          <Stack.Screen name="CriarWatchlist" component={CriarWatchlist} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Register" component={RegisterPage} />
          <Stack.Screen name="Perfil" component={Perfil} />
          <Stack.Screen name="MeusFavoritos" component={MeusFavoritos} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

