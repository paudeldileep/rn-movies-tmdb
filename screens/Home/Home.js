// home page for the app

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  VirtualizedList,
  BackHandler,
  Alert,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";
import IonIcons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { getMovies } from "../../services/api";
import { getFavourites } from "../../services/localStorage";
import OnboardingModal from "../../components/Onboarding/OnboardingModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = (props) => {
  const { navigation } = props;

  const [popularMovies, setPopularMovies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [favouriteMovies, setFavouriteMovies] = useState([]);
  const [favouritesLoading, setFavouritesLoading] = useState(true);

  //get popular movies
  const getPopularMovies = async () => {
    //clear previous data

    setPopularMovies([]);

    try {
      const response = await getMovies("", page);
      setPopularMovies((prev) => [...prev, ...response.movies]);
      setTotalPages(response.total_pages);
      setDataLoaded(true);
      setError(null);
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };

  // get favorite movies from local storage
  const getFavoriteMovies = async () => {
    try {
      const favorites = await getFavourites();
      setFavouriteMovies(favorites);
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
      getPopularMovies();
      getFavoriteMovies();
    }, 1000);

    // clean up function
    return () => {
      setPopularMovies([]);
      setSearchText("");
      setPage(1);
      setTotalPages(1);
      setDataLoaded(false);
      setError(null);
      setFavouritesLoading(true);
    };
  }, []);

  // search movies
  //when user clicks search button send to search page with search text
  const searchMovies = () => {
    if (searchText === "") {
      //toast message
      if (Platform.OS === "android") {
        ToastAndroid.show("Please enter a search text", ToastAndroid.SHORT);
      } else {
        Alert.alert("Please enter a search text");
      }
      return;
    }
    navigation.navigate("Search", { searchText });
  };

  //navigate to movie details page
  const handleItemPress = (itemId, itemTitle) => {
    navigation.navigate("MovieDetails", {
      movieId: itemId,
      movieTitle: itemTitle,
    });
  };

  // load more movies
  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
      setDataLoaded(false);
      setTimeout(() => {
        getPopularMovies();
      }, 1000);
    } else {
      if (Platform.OS === "android") {
        ToastAndroid.show("No more movies", ToastAndroid.SHORT);
      } else {
        Alert.alert("No more movies");
      }
    }
  };

  //show onboarding modal
  const [isFirstTime, setIsFirstTime] = useState(true);

  //check if it is the first time user is opening the app
  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const isFirstTime = await AsyncStorage.getItem("isFirstTime");
        if (isFirstTime === null) {
          setIsFirstTime(true);
          await AsyncStorage.setItem("isFirstTime", "false");
        } else {
          setIsFirstTime(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkFirstTime();
  }, []);

  //exit app if back button is pressed
  useEffect(() => {
    const backAction = () => {
      //ask user if they want to exit
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  if (isFirstTime) {
    return <OnboardingModal onClose={() => setIsFirstTime(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* search text input area */}
      <View style={styles.searchAreaView}>
        <View style={styles.searchBox}>
          {/* text input with search icon as button */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            onChangeText={(text) => setSearchText(text)}
          />
          <TouchableOpacity style={styles.searchButton} onPress={searchMovies}>
            <IonIcons name="search" size={hp("3%")} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
      {/* popular movies area */}
      <View style={styles.popularMoviesArea}>
        <Text style={styles.popularMoviesTitle}>Popular Movies</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {popularMovies.length === 0 && (
          <Text style={styles.errorText}>No Movies Found</Text>
        )}
        {dataLoaded && !error ? (
          <View style={styles.popularMoviesList}>
            <VirtualizedList
              data={popularMovies}
              initialNumToRender={10}
              getItem={(data, index) => data[index]}
              getItemCount={(data) => data.length}
              maxToRenderPerBatch={10}
              windowSize={5}
              onEndReached={handleLoadMore}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.popularMoviesItem}
                  onPress={() => {
                    handleItemPress(item.id, item.title);
                  }}
                >
                  {/* image */}
                  <View style={styles.popularMoviesItemImage}>
                    <Image source={{ uri: item.poster }} style={styles.image} />
                  </View>
                  {/* description area */}
                  <View style={{ paddingHorizontal: hp("1%"), height: "30%" }}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text numberOfLines={1} style={styles.movieTitle}>
                        {item.title}
                      </Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <IonIcons
                          name="star"
                          size={hp("2.5%")}
                          color={COLORS.primary}
                        />
                        <Text style={{ color: COLORS.white, marginLeft: 2 }}>
                          {item.rating}
                        </Text>
                      </View>
                    </View>
                    {/* movie genre array  */}
                    {/* display maximum 2 items */}

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
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flex: 1 }}
            />
          </View>
        ) : (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: hp("5%") }}
          />
        )}
      </View>
      {/* favourite movies */}
      <View style={styles.favouriteMoviesArea}>
        <Text style={styles.favouriteMoviesTitle}>Favourite Movies</Text>
        {!favouritesLoading ? (
          <>
            {favouriteMovies.length > 0 ? (
              <View style={styles.favouriteMoviesList}>
                <FlatList
                  data={favouriteMovies}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.favouriteMoviesItem}
                      onPress={() => {
                        handleItemPress(item.id, item.title);
                      }}
                    >
                      {/* image */}
                      <View style={styles.favouriteMoviesItemImage}>
                        <Image
                          source={{ uri: item.poster }}
                          style={styles.image}
                        />
                      </View>
                      {/* description area */}
                      <View
                        style={{ paddingHorizontal: hp("1%"), height: "30%" }}
                      >
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text numberOfLines={1} style={styles.movieTitle}>
                            {item.title}
                          </Text>
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <IonIcons
                              name="star"
                              size={hp("2.5%")}
                              color={COLORS.primary}
                            />
                            <Text
                              style={{ color: COLORS.white, marginLeft: 2 }}
                            >
                              {item.rating}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ flex: 1 }}
                />
              </View>
            ) : (
              <View style={styles.noFavouriteMovies}>
                <Text style={styles.noFavouriteMoviesText}>
                  You have no favourite movies
                </Text>
              </View>
            )}
          </>
        ) : (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: hp("5%") }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    color: COLORS.white,
    paddingHorizontal: hp("1%"),
  },
  searchAreaView: {
    marginTop: hp("5%"),
    height: hp("6%"),
    justifyContent: "center",
    alignItems: "center",
  },
  searchBox: {
    height: "100%",
    width: "80%",
    backgroundColor: COLORS.grey,
    borderRadius: hp("5%"),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  searchInput: {
    height: "100%",
    width: "80%",
    backgroundColor: COLORS.grey,
    color: COLORS.white,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    fontSize: hp("3%"),
    padding: hp("1%"),
    borderColor: "none",
    outline: "none",
    borderRadius: hp("5%"),
  },
  searchButton: {
    height: "100%",
    width: "10%",
    backgroundColor: COLORS.grey,
    color: COLORS.white,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    fontSize: hp("2.2%"),
  },
  popularMoviesArea: {
    marginTop: hp("3%"),
    height: hp("50%"),
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: hp("1%"),
  },
  popularMoviesTitle: {
    fontSize: hp("2.5%"),
    color: COLORS.white,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  popularMoviesList: {
    marginTop: hp("1%"),
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  popularMoviesItem: {
    height: "100%",
    width: hp("30%"),
    color: COLORS.white,
    display: "flex",
    flexDirection: "column",
    fontSize: hp("2.2%"),
    marginRight: hp("1.2%"),
    borderRadius: hp("1%"),
    marginTop: hp("0.8%"),
    paddingBottom: hp("1%"),
  },
  popularMoviesItemImage: {
    height: "70%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: hp("1.5%"),
  },
  image: {
    height: "100%",
    width: "100%",
    borderRadius: hp("1.5%"),
    resizeMode: "cover",
  },
  movieTitle: {
    color: COLORS.white,
    fontSize: hp("2.2%"),
    fontWeight: "bold",
    marginTop: hp("1%"),
    width: "70%",
  },
  movieGenre: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  movieGenreItem: {
    color: COLORS.grey,
    fontSize: hp("1.8%"),
    marginRight: hp("1%"),
    marginTop: hp("0.5%"),
  },
  errorText: {
    fontSize: hp("2.5%"),
    color: COLORS.white,
    textAlign: "center",
    marginTop: hp("5%"),
  },
  favouriteMoviesArea: {
    marginTop: hp("0.5%"),
    height: hp("20%"),
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: hp("1%"),
  },
  favouriteMoviesTitle: {
    fontSize: hp("2.5%"),
    color: COLORS.white,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  favouriteMoviesList: {
    marginTop: hp("1%"),
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  favouriteMoviesItem: {
    height: "100%",
    width: hp("30%"),
    color: COLORS.white,
    display: "flex",
    flexDirection: "column",
    fontSize: hp("2.2%"),
    marginRight: hp("1.2%"),
    borderRadius: hp("1%"),
    marginTop: hp("0.8%"),
    paddingBottom: hp("1%"),
  },
  favouriteMoviesItemImage: {
    height: "70%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: hp("1.5%"),
  },
  noFavouriteMovies: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  noFavouriteMoviesText: {
    fontSize: hp("2.5%"),
    color: COLORS.white,
    textAlign: "center",
  },
});

export default Home;
