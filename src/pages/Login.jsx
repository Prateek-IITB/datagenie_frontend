import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from '../assets/background_image.jpeg';


const BASE_URL = process.env.REACT_APP_BACKEND_URL;

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false); // false = signup
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUserName("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const res = await axios.post(`${BASE_URL}/api/auth/login`, {
          email,
          password,
        });

        const data = res.data;

        if (data?.user) {
          localStorage.setItem("datagenie_user", JSON.stringify(data.user));
          navigate("/");
        } else {
          setError("Invalid login response. Please try again.");
        }
      } else {
        const res = await axios.post(`${BASE_URL}/api/auth/signup`, {
          email,
          password,
          user_name: userName,
        });

        const data = res.data;

        if (data?.user) {
          localStorage.setItem("datagenie_user", JSON.stringify(data.user));
          navigate("/");
        } else {
          setError("Signup failed. Please try again.");
        }
      }
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
    }
  };

return (
  <div
    className="relative min-h-screen flex items-center justify-center px-4 text-white bg-repeat"
    style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: '400px',
      backgroundPosition: 'top left',
    }}
  >
    {/* Optional overlay for subtle tint */}
    <div className="absolute inset-0 bg-black/30 z-0" />

        <div className="relative z-10 w-full max-w-lg p-10 rounded-2xl shadow-2xl bg-white/90 text-gray-900">
        {/* <h2 className="text-2xl font-bold mb-2 text-center">
            Congrats on being an early user of DataGenie
        </h2> */}
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center whitespace-nowrap">
            {isLogin ? "Log in to DatanautAI" : "Create your DatanautAI account"}
        </h2>


        {/* Toggle */}
        <div className="flex justify-between mb-6 rounded overflow-hidden border border-gray-400">
        <button
            onClick={() => {
            setIsLogin(false);
            resetForm();
            }}
            className={`w-1/2 py-2 font-semibold transition ${
            !isLogin
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
        >
            Signup
        </button>
        <button
            onClick={() => {
            setIsLogin(true);
            resetForm();
            }}
            className={`w-1/2 py-2 font-semibold transition ${
            isLogin
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
        >
            Login
        </button>
        </div>


      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded text-gray-800 placeholder-gray-500"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded text-gray-800 placeholder-gray-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded text-gray-800 placeholder-gray-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition"
        >
          {isLogin ? "Login" : "Signup"}
        </button>
      </form>

      {/* Bottom Toggle Link */}
      <div className="text-center mt-6 text-sm text-gray-700">
        {isLogin ? (
          <>
            Don’t have an account?{" "}
            <button
              onClick={() => {
                setIsLogin(false);
                resetForm();
              }}
              className="text-gray-800 font-medium hover:underline"
            >
              Signup
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => {
                setIsLogin(true);
                resetForm();
              }}
              className="text-gray-800 font-medium hover:underline"
            >
              Login
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);


}

export default Login;
