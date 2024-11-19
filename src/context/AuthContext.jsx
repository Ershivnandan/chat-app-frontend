import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("authToken", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
