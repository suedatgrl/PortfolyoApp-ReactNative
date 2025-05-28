
// screens/SavedPostsScreen.js
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { useIsFocused } from '@react-navigation/native';

const POSTS = [
  { id: '1', title: 'React Native Tips', content: 'Learn hooks, navigation, and styling.' },
  { id: '2', title: 'Node.js Best Practices', content: 'Error handling, async/await, and MVC.' },
  { id: '3', title: 'MongoDB Guide', content: 'Schema design, indexing, and aggregation.' },
  { id: '4', title: 'Express Routing', content: 'Middleware, routers, and error flow.' },
  { id: '5', title: 'JWT Authentication', content: 'Secure endpoints with JSON Web Tokens.' }
];

export default function SavedPostsScreen() {
  const { user } = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [savedIds, setSavedIds] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    if (!isFocused) return;
    const loadSaved = async () => {
      try {
        const json = await AsyncStorage.getItem(`savedPosts_${user.id}`);
        const ids = json ? JSON.parse(json) : [];
        setSavedIds(ids);
        setSavedPosts(POSTS.filter(p => ids.includes(p.id)));
      } catch (e) {
        console.error('Error loading saved posts:', e);
      }
    };
    loadSaved();
  }, [user.id, isFocused]);

  const removeSave = async (postId) => {
    try {
      const newIds = savedIds.filter(id => id !== postId);
      setSavedIds(newIds);
      setSavedPosts(prev => prev.filter(p => p.id !== postId));
      await AsyncStorage.setItem(
        `savedPosts_${user.id}`,
        JSON.stringify(newIds)
      );
    } catch (e) {
      console.error('Error removing saved post:', e);
    }
  };

  if (savedPosts.length === 0) {
    return (
      <View style={savedStyles.emptyContainer}>
        <Text style={savedStyles.message}>No saved posts.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={savedPosts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={savedStyles.card}>
          <Text style={savedStyles.title}>{item.title}</Text>
          <Text style={savedStyles.content}>{item.content}</Text>
          <Button title="Remove" onPress={() => removeSave(item.id)} />
        </View>
      )}
      contentContainerStyle={savedStyles.container}
    />
  );
}

const savedStyles = StyleSheet.create({
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    fontSize: 16,
    color: '#777'
  }
});
