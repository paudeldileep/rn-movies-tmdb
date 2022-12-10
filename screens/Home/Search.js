// search result page
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  VirtualizedList,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../components";
import { COLORS } from "../../constants/theme";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import IonIcons from "@expo/vector-icons/Ionicons";
import { getMovies } from "../../services/api";

const Search = (props) => {
  const { navigation, route } = props;
  //get search text from navigation params
  const sText = route.params.searchText;
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState("");

  //search movies
  const searchMovies = async (query) => {
    //hide keyboard
    Keyboard.dismiss();
    //clear previous search result
    setSearchResult([]);

    try {
      const response = await getMovies(query, page);
      //setSearchResult(response.movies);
      setSearchResult((prev) => [...response.movies, ...prev]);
      setTotalPages(response.total_pages);
      setError("");
      // console.log(response);
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    } finally {
      setDataLoaded(true);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      searchMovies(sText);
    }, 1000);
    // clean up function
    return () => {
      setSearchText("");
      setSearchResult([]);
      setPage(1);
      setTotalPages(1);
      setDataLoaded(false);
      setError(null);
    };
  }, []);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
      setDataLoaded(false);
      setTimeout(() => {
        searchMovies(searchText);
      }, 1000);
    } else {
      if (Platform.OS === "android") {
        ToastAndroid.show("No more movies", ToastAndroid.SHORT);
      } else {
        Alert.alert("No more movies");
      }
    }
  };

  const handleItemPress = (itemId, itemTitle) => {
    navigation.navigate("MovieDetails", {
      movieId: itemId,
      movieTitle: itemTitle,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* custom header */}
      <Header title="Search Movies" navigation={navigation} showBackButton />
      {/* search text input area */}
      <View style={styles.searchAreaView}>
        <View style={styles.searchBox}>
          {/* text input with search icon as button */}
          <TextInput
            style={styles.searchInput}
            placeholder="Type to search..."
            onChangeText={(text) => setSearchText(text)}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              if (searchText === "") {
                if (Platform.OS === "android") {
                  ToastAndroid.show(
                    "Please enter search term",
                    ToastAndroid.SHORT
                  );
                } else {
                  Alert.alert("Please enter search term");
                }
                return;
              }
              setDataLoaded(false);
              setTimeout(() => {
                searchMovies(searchText);
              }, 1000);
            }}
          >
            <IonIcons
              name="search"
              size={hp("3%")}
              color={searchText ? COLORS.white : COLORS.lightgrey}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* search result area */}
      <View style={styles.searchResultAreaView}>
        {!dataLoaded ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: hp("5%") }}
          />
        ) : null}
        {dataLoaded && !error ? (
          <View style={styles.searchResult}>
            {searchResult.length > 0 ? (
              <>
                <Text style={styles.title}>Search Result</Text>
                <VirtualizedList
                  data={searchResult}
                  style={styles.list}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={{ paddingBottom: hp("8%") }}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={5}
                  getItem={(data, index) => data[index]}
                  getItemCount={(data) => data.length}
                  onEndReached={handleLoadMore}
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
                          <Image
                            source={{ uri: item.poster }}
                            style={styles.image}
                          />
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
                        <Text style={styles.title}>{item.title}</Text>
                        {/* show number of stars corresponding to rating value */}
                        <View style={styles.rating}>
                          <IonIcons
                            name="star"
                            size={hp("2.5%")}
                            color={
                              item.rating >= 3
                                ? COLORS.primary
                                : COLORS.offprimary
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
                        <Text style={styles.releaseDate}>
                          Released: {item.releaseDate.split("-")[0]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </>
            ) : (
              <Text style={styles.errorText}>No Movies Found!</Text>
            )}
          </View>
        ) : (
          <Text style={styles.errorText}>{error}</Text>
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
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    fontSize: hp("2.2%"),
  },
  searchResultAreaView: {
    marginTop: hp("5%"),
    justifyContent: "center",
    alignItems: "center",
  },
  searchResult: {
    height: "100%",
    width: "90%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
  },
  title: {
    fontSize: hp("2.5%"),
    color: COLORS.white,
    marginBottom: hp("2%"),
    alignSelf: "flex-start",
  },
  errorText: {
    fontSize: hp("2.5%"),
    color: COLORS.white,
    textAlign: "center",
    marginTop: hp("5%"),
  },
  list: {
    width: "100%",
    paddingBottom: hp("8%"),
  },
  listitem: {
    height: hp("20%"),
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
});

export default Search;
