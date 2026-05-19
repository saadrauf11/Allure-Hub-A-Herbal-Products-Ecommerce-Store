'use client';

import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const signup = useCallback(async (name, email, password, role) => {
    try {
      const response = await authAPI.signup({
        name,
        email,
        password,
        role,
      });

      const { user: userData, accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setToken(accessToken);

      return { success: true, data: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed',
      };
    }
  }, []);

  const signin = useCallback(async (email, password, role) => {
    try {
      const response = await authAPI.signin({
        email,
        password,
        role,
      });

      const { user: userData, accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setToken(accessToken);

      return { success: true, data: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signin failed',
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    setUser(null);
    setToken(null);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await authAPI.refresh(refreshToken);
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      setToken(accessToken);

      return true;
    } catch (error) {
      logout();
      return false;
    }
  }, [logout]);

  const value = {
    user,
    token,
    loading,
    signup,
    signin,
    logout,
    refreshAccessToken,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
