// navigation/TabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import PostsScreen from "../screens/PostsScreen";
import SavedPostsScreen from "../screens/SavedPostsScreen";
import ContactScreen from "../screens/ContactScreen";
import AdminMessagesScreen from "../screens/AdminMessagesScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: true,
        headerRight: () => (
          <Ionicons
            name="person-circle-outline"
            size={28}
            style={{ marginRight: 16 }}
            onPress={() => navigation.navigate("Profile")}
          />
        ),
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Posts":
              iconName = "list";
              break;
            case "Saved":
              iconName = "bookmark";
              break;
            case "Contact":
              iconName = "mail";
              break;
            default:
              iconName = "circle";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Posts" component={PostsScreen} />
      <Tab.Screen name="Saved" component={SavedPostsScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />

      <Tab.Screen
        name="Admin"
        component={AdminMessagesScreen}
        options={{ tabBarIcon: ({color,size}) => (
          <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
        )}}
      />
    </Tab.Navigator>
  );
}
