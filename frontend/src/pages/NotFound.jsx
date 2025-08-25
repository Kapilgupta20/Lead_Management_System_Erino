import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">404</h2>
        <p className="mb-4 text-gray-600">Page not found</p>
        <Link to="/" className="text-indigo-600 underline">Go to Home page</Link>
      </div>
    </div>
  );
}
