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
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";
import IonIcons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { getMovies } from "../../services/api";

const Home = (props) => {
  const { navigation } = props;

  const [popularMovies, setPopularMovies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState(null);

  //get popular movies
  const getPopularMovies = async () => {
    try {
      const response = await getMovies("", page);
      setPopularMovies(response.movies);
      setTotalPages(response.total_pages);
      setDataLoaded(true);
      setError(null);
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };
  useEffect(() => {
    setTimeout(() => {
      getPopularMovies();
    }, 1000);

    // clean up function
    return () => {
      setPopularMovies([]);
      setSearchText("");
      setSearchResult([]);
      setPage(1);
      setTotalPages(1);
      setDataLoaded(false);
      setError(null);
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

  const handleItemPress = (itemId, itemTitle) => {
    navigation.navigate("MovieDetails", {
      movieId: itemId,
      movieTitle: itemTitle,
    });
  };

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
        {dataLoaded && !error ? (
          <View style={styles.popularMoviesList}>
            <FlatList
              data={popularMovies}
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
  buttonText: {
    color: COLORS.white,
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
    marginTop: hp("5%"),
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
});

export default Home;