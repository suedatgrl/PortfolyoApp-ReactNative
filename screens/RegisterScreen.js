// screens/RegisterScreen.js
import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

export default function RegisterScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return Alert.alert("Error", "Fill in all fields!");
    }
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      login(data);
    } catch (e) {
      Alert.alert("Register Failed", e.response?.data?.msg || e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Text>Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
      <Text>Password:</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Register" onPress={handleRegister} />
      <View style={styles.switch}>
        <Button title="Back to Login" onPress={() => navigation.navigate("Login")} />
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
