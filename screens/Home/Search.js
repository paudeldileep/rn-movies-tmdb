// search result page
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header/Header";
import { COLORS } from "../../constants/theme";

const Search = (props) => {
  const { navigation } = props;
  return (
    <SafeAreaView style={styles.container}>
      {/* custom header */}
      <Header title="Search" navigation={navigation} showBackButton />
      <Text>Search</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    color: COLORS.white,
  },
});

export default Search;
