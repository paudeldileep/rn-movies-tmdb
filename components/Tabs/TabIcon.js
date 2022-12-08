// custom tabbar icon

import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../../constants/theme";
import { View } from "react-native";

const TabIcon = ({ focused, icon }) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Ionicons
        name={icon}
        size={focused ? 25 : 20}
        style={{ color: focused ? COLORS.primary : COLORS.white }}
      />
    </View>
  );
};

export default TabIcon;
