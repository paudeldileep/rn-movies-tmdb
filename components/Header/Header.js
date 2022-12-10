// custom header component for each screen
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS } from "../../constants/theme";
import IonIcons from "@expo/vector-icons/Ionicons";

const Header = ({
  title,
  showBackButton,
  navigation,
  secondaryButton,
  secondaryButtonIcon,
  handleSecondaryButtonPress,
  isFavourite,
}) => {
  // handle back button press
  const handleBackButtonPress = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackButtonPress}
        >
          <IonIcons name="arrow-back" size={25} color={COLORS.white} />
        </TouchableOpacity>
      )}
      {title && (
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      )}
      {secondaryButton && (
        <TouchableOpacity
          style={styles.secondaryButtonView}
          onPress={handleSecondaryButtonPress}
        >
          <IonIcons
            name={secondaryButtonIcon}
            size={25}
            color={isFavourite ? COLORS.primary : COLORS.white}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    height: hp("8%"),
    backgroundColor: "rgba(52, 52, 52, 0.4)",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: hp("1%"),
    justifyContent: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    height: "100%",
    width: hp("8%"),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
    width: "65%",
    alignSelf: "center",
  },
  secondaryButtonView: {
    alignSelf: "flex-end",
    height: "100%",
    width: hp("8%"),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 0,
  },
});
