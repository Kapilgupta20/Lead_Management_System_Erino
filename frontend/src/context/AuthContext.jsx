import React, { createContext, useContext, useState } from 'react';
import { loginApi, registerApi, logoutApi } from '../utils/authapi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const register = async ({ name, email, password }) => {
    setError(null);
    try {
      const res = await registerApi({ name, email, password });
      setUser(res.user);
      return { ok: true };
    } catch (err) {
      setError(err.message || 'Registration failed');
      return { ok: false, error: err };
    }
  };

  const login = async ({ email, password }) => {
    setError(null);
    try {
      const res = await loginApi({ email, password });
      setUser(res.user);
      return { ok: true };
    } catch (err) {
      setError(err.message || 'Login failed');
      return { ok: false, error: err };
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await logoutApi();
      setUser(null);
      return { ok: true };
    } catch (err) {
      setError(err.message || 'Logout failed');
      return { ok: false, error: err };
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
