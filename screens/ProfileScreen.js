// screens/ProfileScreen.js
import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();  
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user?.name || user?.email}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Button title="Çıkış Yap" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    padding:20
  },
  name: {
    fontSize:20,
    fontWeight:"bold",
    marginBottom:8
  },
  email:{
    fontSize:16,
    marginBottom:20
  }
});
