// screens/ContactScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import api from "../utils/api";

export default function ContactScreen() {
  const [text, setText] = useState("");

  const sendMessage = async () => {
    if (!text.trim()) return Alert.alert("Error", "Mesaj boş olamaz");
    try {
      await api.post("/messages", { text });
      Alert.alert("Başarılı", "Mesajınız gönderildi");
      setText("");
    } catch (e) {
      Alert.alert("Hata", e.response?.data?.msg || e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin’e Mesaj Gönder</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Mesajınız..."
        value={text}
        onChangeText={setText}
      />
      <Button title="Gönder" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20 },
  heading:   { fontSize:18, fontWeight:"600", marginBottom:12 },
  input:     {
    borderWidth:1, borderColor:"#ccc", borderRadius:6,
    padding:12, height:120, marginBottom:16, textAlignVertical:"top"
  },
});
