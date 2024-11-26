import { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function FilmesTrend() {
  const [filmes, setFilmes] = useState([]);
  const navigation = useNavigation();
  const translateX = useRef(new Animated.Value(0)).current;
  const currentIndex = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const tokenJWT =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYzZlMjkwN2UxZjI5NzYzZjM2MGVkOWEyMTQyYmM2YiIsIm5iZiI6MTcyOTEyMDMwMi45MDM2OTYsInN1YiI6IjY2YjE2MmIzMjU1ZWRiYjY4MTc1NTdhMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qSaDzNQJu2tfMxGEmUtVradXtvz73G-AiSjghyWHZZg";

  useEffect(() => {
    const fetchFilmes = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/movie/popular?language=pt-BR",
          {
            headers: {
              Authorization: `Bearer ${tokenJWT}`,
              accept: "application/json",
            },
          }
        );
        setFilmes(response.data.results);
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      }
    };

    fetchFilmes();
  }, []);

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const handleGestureEnd = ({ nativeEvent }) => {
    const { translationX, velocityX } = nativeEvent;
    const screenWidth = width;

    let newIndex = currentIndex.current;
    if (translationX < -screenWidth * 0.2 || velocityX < -500) {
      newIndex = Math.min(filmes.length - 1, currentIndex.current + 1);
    } else if (translationX > screenWidth * 0.2 || velocityX > 500) {
      newIndex = Math.max(0, currentIndex.current - 1);
    }

    currentIndex.current = newIndex;
    setActiveIndex(newIndex);

    Animated.spring(translateX, {
      toValue: -newIndex * screenWidth,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Filmes Trending</Text>
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={(event) => {
          if (event.nativeEvent.state === State.END) {
            handleGestureEnd(event);
          }
        }}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-20, 20]}
      >
        <Animated.View
          testID="carousel"
          style={[
            styles.carouselContainer,
            {
              transform: [{ translateX }],
              width: width * filmes.length,
            },
          ]}
        >
          {filmes.map((filme, index) => (
            <TouchableOpacity
              testID="movie-card"
              key={filme.id}
              style={[styles.card, { width }]}
              onPress={() => navigation.navigate("Info", { id: filme.id })}
            >
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w300${filme.poster_path}`,
                }}
                style={styles.image}
              />
              <Text style={styles.title}>{filme.title || "Sem título"}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </PanGestureHandler>
      <View style={styles.indicatorContainer}>
        {filmes.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              activeIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ac9ecf",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  carouselContainer: {
    flexDirection: "row",
    backgroundColor: "#ac9ecf",
  },
  card: {
    width,
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: 200,
    height: 300,
    borderRadius: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#333",
  },
});
