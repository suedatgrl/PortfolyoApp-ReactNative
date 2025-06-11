import React, { useContext, useState, useEffect } from 'react';
import { 
  View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Alert, TouchableOpacity 
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Ionicons } from '@expo/vector-icons';

export default function PostsScreen({ navigation }) {
  // AuthContext'i kullan
  const { user } = useContext(AuthContext) || {}; // Null check
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [savingPostId, setSavingPostId] = useState(null);
  const [savedPostIds, setSavedPostIds] = useState([]);
  
  useEffect(() => {
    loadPosts();
    if(user){
      loadSavedPostIds();
    }
  }, [user]);

  
  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadSavedPostIds = async () => {
    try {
      const response = await api.get('/posts/saved');
      // Post ID'lerini bir diziye dönüştür
      const ids = response.data.map(post => post.id);
      setSavedPostIds(ids);
      console.log('Loaded saved post IDs:', ids);
    } catch (error) {
      console.error('Error loading saved post IDs:', error);
    }
  };


  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const handleSavePost = async (postId) => {
    if (!user) {
      Alert.alert(
        'Giriş Gerekli',
        'Bu gönderiyi kaydetmek için lütfen giriş yapınız.',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Giriş Yap', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    if(savedPostIds.includes(postId)){
      Alert.alert('Bilgi', ' Bu gönderi zaten kaydedilmiş');
      return;
    }

   try {
      setSavingPostId(postId);
      await api.post(`/posts/save/${postId}`);
      // Kaydedilmiş ID'lere ekle
      setSavedPostIds([...savedPostIds, postId]);
      Alert.alert('Başarılı', 'Gönderi kaydedildi');
    } catch (error) {
      console.error('Error saving post:', error);
      if (error.response?.status === 400) {
        Alert.alert('Bilgi', 'Bu gönderi zaten kaydedilmiş.');
        // ID listesini güncelle
        if (!savedPostIds.includes(postId)) {
          setSavedPostIds([...savedPostIds, postId]);
        }
      } else {
        Alert.alert('Hata', 'Gönderi kaydedilemedi');
      }
    } finally {
      setSavingPostId(null);
    }
  };

  const isPostSaved = (postId) => {
    return savedPostIds.includes(postId);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>
          Gönderiler yüklenirken bir hata oluştu.
        </Text>
        <Button title="Tekrar Dene" onPress={loadPosts} />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          Henüz gönderi bulunmuyor.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id?.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.content}>{item.content}</Text>
          <View style={styles.footer}>
            <Text style={styles.date}>
              {item.createdAt 
                ? `Paylaşım: ${new Date(item.createdAt).toLocaleDateString()}`
                : ''}
            </Text>
            <TouchableOpacity
              onPress={() => handleSavePost(item.id)}
              disabled={savingPostId === item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                opacity: savingPostId === item.id ? 0.5 : 1
              }}
            >
              {savingPostId === item.id ? (
                <ActivityIndicator size="small" color="#007AFF" style={{ marginRight: 5 }} />
              ) : (
                <Ionicons 
                name={isPostSaved(item.id) ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color="#007AFF" 
                style={{ marginRight: 5 }} />
              )}
              <Text style={{ color: '#007AFF' }}>
                {isPostSaved(item.id) ? 'Kaydedildi' : 'Kaydet'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      contentContainerStyle={styles.container}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
}

const styles = StyleSheet.create({
 
  container: {
    padding: 16,
    backgroundColor: '#f0f2f5',
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
    textAlign: 'center',
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
    marginBottom: 12
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  date: {
    fontSize: 12,
    color: '#777'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  errorMessage: {
    fontSize: 16,
    color: '#cc0000',
    marginBottom: 20,
    textAlign: 'center',
  },
  loginMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  registerText: {
    marginTop: 15,
    color: '#555',
  },
  link: {
    color: '#007AFF',
  }
});