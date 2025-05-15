
import React, { createContext, useContext, useState } from "react";
import {jwtDecode} from 'jwt-decode';




const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  const login = (jwtToken) => {
    try {
      const decoded = jwtDecode(jwtToken);
      const extractedRole =
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (!extractedRole) throw new Error("Role not found in token");

      setToken(jwtToken);
      setRole(extractedRole);
      localStorage.setItem("token", jwtToken);
      localStorage.setItem("role", extractedRole);
    } catch (error) {
      console.error("Invalid token", error);
      logout();
    }
  };

  const logout = () => {
    setToken("");
    setRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <UserContext.Provider value={{ token, role, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
