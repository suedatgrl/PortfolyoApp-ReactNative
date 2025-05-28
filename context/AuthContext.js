// context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async ({ user: u, token }) => {
    setUser(u);
    await AsyncStorage.multiSet([
      ["user", JSON.stringify(u)],
      ["token", token],
    ]);
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.multiRemove(["user", "token"]);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
