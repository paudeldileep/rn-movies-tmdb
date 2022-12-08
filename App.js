import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home/Home";
import Favourites from "./screens/Favourites/Favourites";
import Account from "./screens/Account/Account";
import Search from "./screens/Home/Search";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COLORS } from "./constants/theme";
import TabIcon from "./components/Tabs/TabIcon";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            backgroundColor: COLORS.secondary,
            borderTopColor: "transparent",
            height: hp("10%"),
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.grey,
          headerShown: false,
        }}
      >
        {/* tab navigation with stack navigation for home and search */}
        {/* tab screen with no header */}
        <Tab.Screen
          name="HomeTab"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={"home"} />
            ),
          }}
        >
          {() => (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Search" component={Search} />
            </Stack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Favourites"
          component={Favourites}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={"heart"} />
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={Account}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={"ios-person"} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
