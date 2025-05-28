
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';

const POSTS = [
  { id: '1', title: 'React Native Tips', content: 'Learn hooks, navigation, and styling.' },
  { id: '2', title: 'Node.js Best Practices', content: 'Error handling, async/await, and MVC.' },
  { id: '3', title: 'MongoDB Guide', content: 'Schema design, indexing, and aggregation.' },
  { id: '4', title: 'Express Routing', content: 'Middleware, routers, and error flow.' },
  { id: '5', title: 'JWT Authentication', content: 'Secure endpoints with JSON Web Tokens.' }
];

export default function PostsScreen() {
  const { user } = useContext(AuthContext);
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    const loadSaved = async () => {
      try {
        const json = await AsyncStorage.getItem(`savedPosts_${user.id}`);
        setSavedIds(json ? JSON.parse(json) : []);
      } catch (e) {
        console.error('Error loading saved posts:', e);
      }
    };
    loadSaved();
  }, [user.id]);

  const toggleSave = async (postId) => {
    try {
      const newIds = savedIds.includes(postId)
        ? savedIds.filter(id => id !== postId)
        : [...savedIds, postId];
      setSavedIds(newIds);
      await AsyncStorage.setItem(
        `savedPosts_${user.id}`,
        JSON.stringify(newIds)
      );
    } catch (e) {
      console.error('Error saving post:', e);
    }
  };

  const renderItem = ({ item }) => (
    <View style={postsStyles.card}>
      <Text style={postsStyles.title}>{item.title}</Text>
      <Text style={postsStyles.content}>{item.content}</Text>
      <Button
        title={savedIds.includes(item.id) ? 'Unsave' : 'Save'}
        onPress={() => toggleSave(item.id)}
      />
    </View>
  );

  return (
    <FlatList
      data={POSTS}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={postsStyles.container}
    />
  );
}

const postsStyles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f2f5'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6
  },
  content: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8
  }
});