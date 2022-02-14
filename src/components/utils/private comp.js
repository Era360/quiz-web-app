import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../../firebase";

function PrivateRoute() {
    const { currentUser } = auth;
    return currentUser ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
