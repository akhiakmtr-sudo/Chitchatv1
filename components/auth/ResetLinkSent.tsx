import React from 'react';
import { AuthState } from '../../types';

interface ResetLinkSentProps {
  userEmail?: string;
  setAuthStage: (stage: AuthState) => void;
}

const ResetLinkSent: React.FC<ResetLinkSentProps> = ({ userEmail, setAuthStage }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Check Your Email</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        We've sent a password reset link to{' '}
        <strong className="text-gray-800 dark:text-white">{userEmail || 'your email address'}</strong>.
      </p>
      
      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg mb-6">
        <p className="text-sm text-primary-700 dark:text-primary-300">
          For this simulation, click the button below to proceed to the password reset page.
        </p>
      </div>

      <button
        onClick={() => setAuthStage('reset-password')}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
      >
        Simulate Clicking Link
      </button>

       <div className="text-center mt-4">
        <button onClick={() => setAuthStage('login')} className="text-sm text-primary-600 hover:underline dark:text-primary-400">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ResetLinkSent;
