//favourites screen
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";
import { getFavourites } from "../../services/localStorage";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import IonIcons from "react-native-vector-icons/Ionicons";

const Favourites = ({ navigation }) => {
  const [favourites, setFavourites] = useState([]);
  const [favouritesLoading, setFavouritesLoading] = useState(true);

  // get favorite movies from local storage
  const getFavoriteMovies = async () => {
    try {
      const favorites = await getFavourites();
      setFavourites(favorites);
    } catch (error) {
      console.log(error);
    } finally {
      setFavouritesLoading(false);
    }
  };

  //fetch favourites when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setTimeout(() => {
        getFavoriteMovies();
      }, 1000);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setTimeout(() => {
      getFavoriteMovies();
    }, 1000);

    // clean up function
    return () => {
      setFavourites([]);
      setFavouritesLoading(true);
    };
  }, []);

  const handleItemPress = (id, title) => {
    navigation.navigate("MovieDetails", {
      movieId: id,
      movieTitle: title,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Favourites</Text>
      {favouritesLoading ? (
        <ActivityIndicator
          style={{ alignSelf: "center" }}
          size="large"
          color={COLORS.primary}
        />
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listitem}
              onPress={() => {
                handleItemPress(item.id, item.title);
              }}
            >
              {/* image area */}
              <View style={styles.imageArea}>
                {item.poster ? (
                  <Image source={{ uri: item.poster }} style={styles.image} />
                ) : (
                  <IonIcons
                    name="image"
                    size={hp("10%")}
                    color={COLORS.white}
                  />
                )}
              </View>
              {/* description */}
              <View style={styles.description}>
                <Text numberOfLines={1} style={styles.movieTitle}>
                  {item.title}
                </Text>
                {/* show number of stars corresponding to rating value */}
                <View style={styles.rating}>
                  <IonIcons
                    name="star"
                    size={hp("2.5%")}
                    color={
                      item.rating >= 3 ? COLORS.primary : COLORS.offprimary
                    }
                  />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>

                <View style={styles.movieGenre}>
                  {item.genres.slice(0, 2).map((genre, i) => (
                    <Text key={i} style={styles.movieGenreItem}>
                      {genre}
                    </Text>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    color: COLORS.white,
    paddingHorizontal: hp("2%"),
  },
  title: {
    color: COLORS.white,
    fontSize: hp("3%"),
    fontWeight: "bold",
    marginVertical: hp("2%"),
    marginHorizontal: hp("2%"),
  },
  listitem: {
    height: hp("15%"),
    width: "100%",
    backgroundColor: COLORS.grey,
    borderRadius: hp("1%"),
    marginBottom: hp("2%"),
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
  },
  imageArea: {
    height: "100%",
    width: "40%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: hp("1%"),
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  description: {
    height: "100%",
    width: "60%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingHorizontal: hp("1%"),
  },
  rating: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("1%"),
  },
  ratingText: {
    color: COLORS.white,
    fontSize: hp("2%"),
    marginLeft: hp("1%"),
  },
  movieGenre: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("1%"),
  },
  movieGenreItem: {
    color: "lightgrey",
    fontSize: hp("1.8%"),
    marginRight: hp("1%"),
  },
  releaseDate: {
    color: "lightgrey",
    fontSize: hp("1.8%"),
    marginTop: hp("1%"),
  },
  movieTitle: {
    color: COLORS.white,
    fontSize: hp("2.3%"),
    fontWeight: "bold",
  },
});
export default Favourites;
