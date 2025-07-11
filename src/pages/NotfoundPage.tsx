import { Link } from "react-router-dom";

export default function NotfoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-lg mb-4">Page not found</p>
        <Link to="/" className="text-blue-600 hover:text-blue-700">
          Go back to home
        </Link>
      </div>
    </div>
  );
}
