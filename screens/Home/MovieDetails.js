// movie details screen

import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../components";
import { COLORS } from "../../constants/theme";

const MovieDetails = ({ route, navigation }) => {
  const { movieId, movieTitle } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Header title={movieTitle || ""} showBackButton navigation={navigation} />
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
});
