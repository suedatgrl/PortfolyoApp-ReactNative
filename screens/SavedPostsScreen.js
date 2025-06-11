import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Button, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  TouchableOpacity 
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Ionicons } from '@expo/vector-icons';

export default function SavedPostsScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [removingPostId, setRemovingPostId] = useState(null);

  useEffect(() => {
    if (user) {
      loadSavedPosts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSavedPosts = async () => {
    if (!user) return;
    
    try {
    setLoading(true);
    setError(false);
    console.log('Fetching saved posts for user:', user.id);
    const response = await api.get('/posts/saved');
    console.log('Saved posts received:', response.data);
    console.log('First saved post:', JSON.stringify(response.data[0] || {}));
    setSavedPosts(response.data);
  } catch (error) {
    console.error('Error loading saved posts:', error);
    console.error('Full error:', JSON.stringify(error.response?.data, null, 2));
    setError(true);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadSavedPosts();
  };

  const handleRemoveSaved = async (postId) => {
    try {
      setRemovingPostId(postId);
      
      // Confirm before unsaving
      Alert.alert(
        'Kayıttan Kaldır',
        'Bu gönderiyi kayıtlarınızdan kaldırmak istediğinize emin misiniz?',
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Kaldır',
            onPress: async () => {
              try {
                await api.delete(`/posts/unsave/${postId}`);
                setSavedPosts(savedPosts.filter(post => post.id !== postId));
                Alert.alert('Başarılı', 'Gönderi kayıtlarınızdan kaldırıldı');
              } catch (error) {
                console.error('Error removing saved post:', error);
                Alert.alert('Hata', 'Gönderi kaldırılamadı');
              } finally {
                setRemovingPostId(null);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Remove saved error:', error);
      setRemovingPostId(null);
    }
  };

  // Kullanıcı giriş yapmamışsa giriş mesajı göster
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.loginMessage}>
          <Text style={styles.messageText}>
            Kaydettiğiniz gönderileri görmek için lütfen giriş yapınız.
          </Text>
          <Button 
            title="Giriş Yap" 
            onPress={() => navigation.navigate('Login')} 
          />
          <Text style={styles.registerText}>
            Hesabınız yok mu?{' '}
            <Text 
              style={styles.link} 
              onPress={() => navigation.navigate('Register')}
            >
              Kayıt Ol
            </Text>
          </Text>
        </View>
      </View>
    );
  }

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
          Kaydedilen gönderiler yüklenirken bir hata oluştu.
        </Text>
        <Button title="Tekrar Dene" onPress={loadSavedPosts} />
      </View>
    );
  }

  if (savedPosts.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          Henüz kaydedilmiş gönderi bulunmuyor.
        </Text>
        <Button 
          title="Gönderilere Göz At" 
          onPress={() => navigation.navigate('Posts')} 
        />
      </View>
    );
  }

  return (
    <FlatList
      data={savedPosts}
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
              onPress={() => handleRemoveSaved(item.id)}
              disabled={removingPostId === item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                opacity: removingPostId === item.id ? 0.5 : 1
              }}
            >
              {removingPostId === item.id ? (
                <ActivityIndicator size="small" color="#ff3b30" style={{ marginRight: 5 }} />
              ) : (
                <Ionicons name="bookmark" size={20} color="#ff3b30" style={{ marginRight: 5 }} />
              )}
              <Text style={{ color: '#ff3b30' }}>Kaldır</Text>
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
  },
});