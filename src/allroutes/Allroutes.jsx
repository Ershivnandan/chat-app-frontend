import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../utils/privateRoute/PrivateRoute";
import Login from "../pages/Auth/Login";
import Home from "../pages/Home/Home";
import { useAuth } from "../context/AuthContext";
import Signup from "../pages/Auth/Signup";
import HomePage from "../pages/Dashboard/HomePage";

const Allroutes = () => {
  const { user } = useAuth();
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <HomePage />
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
