import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const register = async (name, username, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, username, email, password });
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/check');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);