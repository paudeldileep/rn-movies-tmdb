// movie details screen

import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../components";
import { COLORS } from "../../constants/theme";
import { getMovie } from "../../services/api";
import {
  saveFavourite,
  isFavourite,
  removeFavourite,
} from "../../services/localStorage";

const MovieDetails = ({ route, navigation }) => {
  const { movieId, movieTitle } = route.params;
  const [details, setDetails] = useState({});
  const [error, setError] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const fetchMovieDetails = async () => {
    try {
      const response = await getMovie(movieId);
      setDetails(response);
      setError("");
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    } finally {
      setDataLoaded(true);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchMovieDetails();
    }, 1000);
    // clean up function
    return () => {
      setDetails({});
      setError("");
      setDataLoaded(false);
    };
  }, []);

  const checkFav = async () => {
    if (await isFavourite(movieId)) {
      setIsFav(true);
    } else {
      setIsFav(false);
    }
  };

  // check favourite or not
  useEffect(() => {
    checkFav();
  }, [movieId]);

  const handleAddToFavourites = async () => {
    //check if movie is already in favourites list or not before adding
    if (await isFavourite(details.id)) {
      // remove from favourites
      try {
        await removeFavourite(details.id);
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Something went wrong");
      } finally {
        checkFav();
      }
      return;
    } else {
      try {
        const movie = {
          id: details.id,
          title: details.title,
          poster: details.poster,
          //rating upto 1 decimal place
          rating: details.rating.toFixed(1),
          genres: details.genres,
        };
        await saveFavourite(movie);
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Something went wrong");
      } finally {
        checkFav();
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        showBackButton
        navigation={navigation}
        secondaryButton
        secondaryButtonIcon={"heart"}
        handleSecondaryButtonPress={handleAddToFavourites}
        isFavourite={isFav}
      />
      {dataLoaded && !error && details ? (
        <>
          {/* poster image area */}
          <View style={styles.posterImage}>
            {/* linear foreground color */}
            {/* poster image */}
            <Image
              source={{
                uri: details.backdrop ? details.backdrop : details.poster,
              }}
              style={styles.Image}
              defaultSource={require("../../assets/movie-frame.png")}
            />
            {/* movie details area */}
            <View style={styles.movieDetails}>
              <Text numberOfLines={1} style={styles.movieTitle}>
                {details.title}
              </Text>
              <View style={styles.movieDetailsRow}>
                <Text style={styles.movieDetailsText}>
                  {details.releaseYear}
                </Text>
                {/* genre */}
                <View style={styles.movieGenre}>
                  {details.genres.slice(0, 2).map((genre, i) => (
                    <Text key={i} style={styles.movieGenreItem}>
                      {genre}
                    </Text>
                  ))}
                </View>
                <Text style={styles.movieDetailsText}>{details.runtime}</Text>
              </View>
            </View>
          </View>
          {/* movie description */}
          <View style={styles.movieDescription}>
            <Text style={styles.movieDescriptionTitle}>Plot Summary</Text>
            <Text numberOfLines={5} style={styles.movieDescriptionText}>
              {details.overview}
            </Text>
          </View>
          {/* cast */}
          <View style={styles.movieCast}>
            <Text style={styles.movieCastTitle}>Cast</Text>
            <View style={styles.movieCastList}>
              {details.cast.slice(0, 3).map((cast, i) => (
                <View key={i} style={styles.movieCastItem}>
                  <Image
                    source={{
                      uri: cast.profileImage,
                    }}
                    style={styles.movieCastItemImage}
                  />
                  <Text style={styles.movieCastItemName}>{cast.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        <ActivityIndicator size="large" color={COLORS.primary} />
      )}
    </SafeAreaView>
  );
};

export default MovieDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    color: COLORS.white,
  },
  posterImage: {
    marginTop: -hp("8%"),
    width: "100%",
    height: hp("45%"),
    borderRadius: hp("2%"),
    overflow: "hidden",
  },
  Image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  movieDetails: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  movieTitle: {
    color: COLORS.white,
    fontSize: hp("3%"),
    fontWeight: "bold",
    marginBottom: hp("1%"),
  },
  movieDetailsRow: {
    display: "flex",
    width: "60%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  movieDetailsText: {
    color: COLORS.lightgrey,
    fontSize: hp("2%"),
  },
  movieGenre: {
    flexDirection: "row",
    alignItems: "center",
  },
  movieGenreItem: {
    color: COLORS.lightgrey,
    fontSize: hp("2%"),
    marginRight: 5,
  },
  movieDescription: {
    padding: hp("2%"),
  },
  movieDescriptionTitle: {
    color: COLORS.white,
    fontSize: hp("2.4%"),
    fontWeight: "bold",
    marginBottom: hp("1%"),
  },
  movieDescriptionText: {
    color: "lightgrey",
    fontSize: hp("2%"),
    letterSpacing: 0.8,
  },
  movieCast: {
    padding: hp("2%"),
  },
  movieCastTitle: {
    color: COLORS.white,
    fontSize: hp("2.4%"),
    fontWeight: "bold",
    marginBottom: hp("1%"),
  },
  movieCastList: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  movieCastItem: {
    display: "flex",
    alignItems: "center",
    marginHorizontal: hp("1%"),
  },
  movieCastItemImage: {
    width: hp("10%"),
    height: hp("10%"),
    borderRadius: hp("5%"),
    marginBottom: hp("1%"),
  },
  movieCastItemName: {
    color: COLORS.lightgrey,
    fontSize: hp("1.5%"),
  },
});
