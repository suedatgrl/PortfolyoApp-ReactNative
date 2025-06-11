import React, { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Context oluşturma
export const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {}
});

// Provider bileşeni
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Başlangıçta kullanıcı bilgilerini yükleme
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Auth load error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Login fonksiyonu
  const login = useCallback(async ({ user: userData, token }) => {
    try {
      await AsyncStorage.multiSet([
        ["user", JSON.stringify(userData)],
        ["token", token],
      ]);
      setUser(userData);
    } catch (error) {
      console.error("Login error:", error);
    }
  }, []);

  // Logout fonksiyonu
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(["user", "token"]);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  // Context değeri
  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Dosyayı AuthProvider ile export et
export default AuthProvider;