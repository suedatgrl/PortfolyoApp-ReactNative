import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import HomeScreen from "../screens/HomeScreen";
import PostsScreen from "../screens/PostsScreen";
import SavedPostsScreen from "../screens/SavedPostsScreen";
import ContactScreen from "../screens/ContactScreen";
import AdminPostsScreen from "../screens/AdminPostsScreen";
import AdminMessagesScreen from "../screens/AdminMessagesScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator({ navigation }) {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerRight: () => (
          user ? (
            <TouchableOpacity 
              onPress={() => navigation.navigate("Profile")}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="person-circle-outline" size={28} color="#000" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={() => navigation.navigate("Login")}
              style={{ marginRight: 16 }}
            >
              <Text style={{ color: '#007AFF' }}>Giriş Yap</Text>
            </TouchableOpacity>
          )
        ),
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Posts":
              iconName = focused ? "list" : "list-outline";
              break;
            case "Saved":
              iconName = focused ? "bookmark" : "bookmark-outline";
              break;
            case "Contact":
              iconName = focused ? "mail" : "mail-outline";
              break;
            case "Admin Posts":
              iconName = focused ? "create" : "create-outline";
              break;
            case "Admin Messages":
              iconName = focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline";
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
      
      {/* Admin sekmeleri sadece admin kullanıcısı için görünür */}
      {isAdmin && (
        <>
          <Tab.Screen name="Admin Posts" component={AdminPostsScreen} />
          <Tab.Screen name="Admin Messages" component={AdminMessagesScreen} />
        </>
      )}
    </Tab.Navigator>
  );
}