import { Link, useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../hooks/useForm";
import { LoginFormData } from "../types";

function validateLogin(values: LoginFormData) {
  const errors: Record<string, string> = {};

  if (!values.username) {
    errors.username = "Username is required";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  return errors;
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldError,
  } = useForm({
    initialValues: { username: "", password: "" },
    validate: validateLogin,
    onSubmit: async (credentials: LoginFormData) => {
      try {
        const token = await loginApi(credentials);
        login(token);
        navigate("/dashboard");
      } catch (error) {
        if (error instanceof Error) {
          setFieldError("general", error.message);
        } else {
          setFieldError("general", "An unknown error occurred");
        }
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-5 text-center">Login</h2>

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={values.username}
            placeholder="Enter username"
            onChange={handleChange}
            disabled={isSubmitting}
            autoFocus
          />
          {errors.username && (
            <div className="mt-1 text-red-600 text-sm">{errors.username}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={values.password}
            placeholder="Enter password"
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.password && (
            <div className="mt-1 text-red-600 text-sm">{errors.password}</div>
          )}
        </div>

        {errors.general && (
          <div className="my-2 pb-2 text-red-600 text-sm text-left">
            {errors.general}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
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
