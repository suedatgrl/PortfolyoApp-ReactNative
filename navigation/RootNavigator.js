// navigation/RootNavigator.js
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import MainStackNavigator from "./MainStackNavigator";  // <-- eskiden TabNavigator idi
import { AuthContext } from "../context/AuthContext";

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Oturum yoksa önce Login/Register göster
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // Oturum varsa MainStackNavigator’a geç
          <Stack.Screen name="Main" component={MainStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
