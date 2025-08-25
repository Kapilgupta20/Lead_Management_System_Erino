import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMeApi } from '../utils/authapi';

export default function ProtectedRoute({ children }) {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchMeApi();
        if (res?.user && mounted) setUser(res.user);
      } catch (err) {
        // Ignore 401 errors silently
      } finally {
        if (mounted) {
          setLoading(false);
          setChecked(true);
        }
      }
    })();
    return () => { mounted = false; };
  }, [setUser]);

  if (loading && !user && !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-gray-500">Checking session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
