import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!username || !password) {
        setError("Username and password are required");
        return;
      }

      const token = await loginApi(username, password);

      login(token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-5 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={username}
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <div className="my-2 pb-2 text-red-600 text-sm text-left">{error}</div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
        >
          Login
        </button>
        <p className="text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
