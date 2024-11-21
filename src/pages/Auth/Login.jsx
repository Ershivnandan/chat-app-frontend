import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { googleLogin, loginUser } from "../../api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      login(response.data);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.", err.message);
    }
  };

  const handleGoogleLogin = () => {
    googleLogin();
  };
  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 shadow-lg rounded">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">OR</p>
            <button
              onClick={handleGoogleLogin}
              className="w-full py-2 px-4 mt-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
