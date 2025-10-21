import React, { useState, FormEvent } from 'react';
import { AuthState, User } from '../../types';

interface LoginProps {
  onAuthSuccess: (user: User) => void;
  setAuthStage: (stage: AuthState) => void;
  registeredUser: User | null;
  isVerified: boolean;
}

const Login: React.FC<LoginProps> = ({ onAuthSuccess, setAuthStage, registeredUser, isVerified }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (!registeredUser) {
          setError('No user is registered. Please sign up.');
          return;
      }
      if ((emailOrUsername === registeredUser.email || emailOrUsername === registeredUser.username) && password === registeredUser.password) {
        if (!isVerified) {
            setError('Please verify your email address before logging in.');
            setAuthStage('verify-email');
            return;
        }
        onAuthSuccess(registeredUser);
      } else {
        setError('Invalid credentials.');
      }
    }, 1500);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Welcome Back!</h2>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email or Username</label>
          <input
            id="email"
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 R 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Log In'
          )}
        </button>
      </form>
      <div className="text-center mt-4">
        <button onClick={() => setAuthStage('forgot-password')} className="text-sm text-primary-600 hover:underline dark:text-primary-400">
          Forgot password?
        </button>
      </div>
      <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <button onClick={() => setAuthStage('signup')} className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;