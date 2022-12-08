// home page for the app

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";
import IonIcons from "@expo/vector-icons/Ionicons";

const Home = (props) => {
  const { navigation } = props;
  return (
    <SafeAreaView style={styles.container}>
      {/* search text input area */}
      <View style={styles.searchAreaView}>
        <View style={styles.searchBox}>
          {/* text input with search icon as button */}
          <TextInput style={styles.searchInput} placeholder="Search" />
          <TouchableOpacity style={styles.searchButton}>
            <IonIcons name="search" size={hp("3%")} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
      {/* popular movies area */}
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
});

export default Home;
