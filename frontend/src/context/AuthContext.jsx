import { createContext, useState, useEffect, useContext } from 'react';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const savedUser = localStorage.getItem('sheShieldUser');
    const savedToken = localStorage.getItem('sheShieldToken');
    if (savedUser && savedToken) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);
  const login = (userData, token) => {
    localStorage.setItem('sheShieldUser', JSON.stringify(userData));
    localStorage.setItem('sheShieldToken', token);
    setUser(userData);
  };
  const logout = () => {
    localStorage.removeItem('sheShieldUser');
    localStorage.removeItem('sheShieldToken');
    setUser(null);
  };
  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
};