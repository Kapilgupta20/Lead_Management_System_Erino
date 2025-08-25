import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) navigate('/dash', { replace: true });
  }, [user, navigate]);

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErrMsg(null);
    setSubmitting(true);
    try {
      if (isSignUp) {
        const result = await register({ name: form.name, email: form.email, password: form.password });
        if (result.ok) navigate('/dash');
        else setErrMsg(result.error?.message || 'Registration failed');
      } else {
        const result = await login({ email: form.email, password: form.password });
        if (result.ok) navigate('/dash');
        else setErrMsg(result.error?.message || 'Login failed');
      }
    } catch (err) {
      setErrMsg(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex flex-col">
      <header className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">Erino</h1>
      </header>

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            {isSignUp ? 'Create Account' : 'Welcome'}
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            {isSignUp ? 'Join us and start your journey.' : 'Sign in to continue where you left off.'}
          </p>

          <div className="flex mb-6 border rounded-lg overflow-hidden">
            <button
              className={`flex-1 py-2 text-sm font-medium transition-colors ${!isSignUp
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              onClick={() => setIsSignUp(false)}
            >
              Sign in
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium transition-colors ${isSignUp
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              onClick={() => setIsSignUp(true)}
            >
              Sign up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Your name"
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password with toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {errMsg && (
              <div className="text-red-600 text-sm text-center">{errMsg}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 transition-colors"
              >
                {submitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>


  );
}
