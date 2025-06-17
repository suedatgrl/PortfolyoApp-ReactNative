import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function ContactScreen() {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
  if (!subject.trim() || !message.trim()) {
    return Alert.alert("Hata", "Konu ve mesaj boş olamaz.");
  }
  try {
    await api.post("/messages", { subject, message });
    Alert.alert("Başarılı", "Mesajınız gönderildi");
    setSubject("");
    setMessage("");
  } catch (e) {
    Alert.alert("Hata", e.response?.data?.msg || e.message);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin’e Mesaj Gönder</Text>
      <TextInput
        style={styles.input}
        placeholder="Adınız"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Konu"
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        style={styles.textarea}
        multiline
        placeholder="Mesajınız..."
        value={message}
        onChangeText={setMessage}
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
    padding:12, marginBottom:12
  },
  textarea:  {
    borderWidth:1, borderColor:"#ccc", borderRadius:6,
    padding:12, height:120, marginBottom:16, textAlignVertical:"top"
  },
});