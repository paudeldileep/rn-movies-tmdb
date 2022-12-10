// pop up onboarding modal

import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { COLORS } from "../../constants/theme";

const OnboardingModal = (props) => {
  const { onClose } = props;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <Image source={require("../../assets/reel.png")} style={styles.image} />
        <Text style={styles.modalText}>Search Your Movies</Text>
        <Text style={styles.modalSubText}>Add to Favourites</Text>
        <TouchableOpacity style={{ ...styles.openButton }} onPress={onClose}>
          <Text style={styles.textStyle}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default OnboardingModal;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
  },
  openButton: {
    backgroundColor: COLORS.primary,
    borderRadius: heightPercentageToDP("4%"),
    padding: heightPercentageToDP("2%"),
    position: "absolute",
    bottom: heightPercentageToDP("5%"),
    elevation: 2,
    width: "80%",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: heightPercentageToDP("2.5%"),
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: heightPercentageToDP("3%"),
    color: COLORS.white,
    fontWeight: "bold",
  },
  modalSubText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: heightPercentageToDP("2.5%"),
    color: COLORS.grey,
  },
  image: {
    width: heightPercentageToDP("40%"),
    height: heightPercentageToDP("20%"),
    marginBottom: heightPercentageToDP("4%"),
  },
});
