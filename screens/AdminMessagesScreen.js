// screens/AdminMessagesScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import api from "../utils/api";

export default function AdminMessagesScreen() {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/messages")
      .then(res => setMsgs(res.data))
      .catch(e => console.error("Msg fetch error:", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Text style={styles.loading}>Yükleniyor...</Text>;

  return (
    <FlatList
      data={msgs}
      keyExtractor={item => item._id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.user}>
            {item.userId.name} ({item.userId.email})
          </Text>
          <Text style={styles.text}>{item.text}</Text>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list:    { padding:20 },
  loading: { textAlign:"center", marginTop:20 },
  card:    {
    backgroundColor:"#fff", borderRadius:8, padding:12,
    marginBottom:12, shadowColor:"#000", shadowOffset:{width:0,height:1},
    shadowOpacity:0.1, shadowRadius:2, elevation:2
  },
  user:    { fontWeight:"600", marginBottom:4 },
  text:    { fontSize:16, color:"#333", marginBottom:6 },
  date:    { fontSize:12, color:"#666", textAlign:"right" }
});
