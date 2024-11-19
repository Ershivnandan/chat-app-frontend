import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../utils/privateRoute/PrivateRoute";
import Login from "../pages/Auth/Login";
import Home from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard/Dashboard";
import { useAuth } from "../context/AuthContext";

const Allroutes = () => {
  const { user } = useAuth();
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Example dynamic behavior */}
        <Route
          path="/profile"
          element={user ? <p>User Profile</p> : <p>Login to view profile</p>}
        />
      </Routes>
    </>
  );
};

export default Allroutes;
