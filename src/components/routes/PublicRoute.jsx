import React, { useContext } from "react";
import { UserContext } from "../../Context";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { user } = useContext(UserContext);
  return !user ? <Outlet /> : <Navigate to="/dash" replace />;
};

export default PublicRoute;
