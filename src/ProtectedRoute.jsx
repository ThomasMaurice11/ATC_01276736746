
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./Context/UserContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, role } = useUser();

  if (!token) return <Navigate to="/login" /> ;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;