import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ThemeToggle from '../components/ThemeToggle';

export default function Auth() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md fixed w-full z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/home" className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">QuadChat</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="pt-24 flex min-h-screen items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900 rounded-xl">
                <MessageSquare className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {isLogin
                ? 'Sign in to continue with QuadChat'
                : 'Join the campus community today'}
            </p>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Link
                to={isLogin ? '/register' : '/login'}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}