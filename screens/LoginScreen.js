import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Fill in all fields!");
    }
    try {
      console.log("Attempting to connect to:", api.defaults.baseURL);
      const { data } = await api.post("/auth/login", { email, password });
      console.log("Login response data:", data);
      login(data);
    } catch (e) {
      console.error("Full error object:", e);
      console.error("Error message:", e.message);
      console.error("Error code:", e.code);
      console.error("Response data:", e.response?.data);
      
      // Kullanıcı dostu hata mesajı göster
      const errorMessage = e.response?.data?.msg || "Login failed. Please check your credentials.";
      Alert.alert("Login Failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
      <Text>Password:</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <View style={styles.switch}>
        <Button title="Register" onPress={() => navigation.navigate("Register")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, justifyContent:"center" },
  title: { fontSize:24, marginBottom:20, textAlign:"center" },
  input: { borderWidth:1, marginBottom:12, padding:8, borderRadius:4 },
  switch: { marginTop:12, alignItems:"center" },
});