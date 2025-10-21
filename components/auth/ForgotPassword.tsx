import React, { useState, FormEvent } from 'react';
import { AuthState, User } from '../../types';

interface ForgotPasswordProps {
  setAuthStage: (stage: AuthState) => void;
  registeredUser: User | null;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ setAuthStage, registeredUser }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Email is required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
        setIsLoading(false);
        // This is the core logic for the simulation.
        // Check if there's a registered user and if the email matches.
        if (registeredUser && registeredUser.email === email) {
            // If it matches, proceed to the next step in the flow.
            setAuthStage('reset-link-sent');
        } else {
            // If it doesn't match, or no user is registered,
            // display a generic success message. This mimics real-world
            // behavior where you don't want to reveal which emails are registered.
            // The user won't be able to proceed.
            setMessage("If an account with that email exists, we've sent a password reset link.");
        }
    }, 1500);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Forgot Password</h2>
      {message && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">{message}</p>}
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Enter your email and we'll send you a link to reset your password.</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-primary-500'}`}
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
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>
      <div className="text-center mt-4">
        <button onClick={() => setAuthStage('login')} className="text-sm text-primary-600 hover:underline dark:text-primary-400">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;