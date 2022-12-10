//account screen
import { StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";

const Account = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Coming Soon...!!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    color: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: COLORS.white,
    fontSize: heightPercentageToDP("3%"),
    fontWeight: "bold",
    marginBottom: 10,
  },
});
export default Account;
