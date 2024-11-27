import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { TMDB_ACCESS_TOKEN } from '@env';
console.log(TMDB_ACCESS_TOKEN);

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

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/authentication/token/new', {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`, 
          },
        });
        console.log(response.data);
        setDataLoaded(true);
      } catch (error) {
        console.error('Erro ao carregar dados da API', error);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const prepare = async () => {
      if (fontsLoaded && dataLoaded) {
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, [fontsLoaded, dataLoaded]);

  if (!fontsLoaded || !dataLoaded) {
    return null;
  }

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

