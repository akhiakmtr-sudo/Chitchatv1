import React from 'react';
import { AuthState } from '../../types';

interface VerifyEmailProps {
  onVerify: () => void;
  userEmail?: string;
  setAuthStage: (stage: AuthState) => void;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ onVerify, userEmail, setAuthStage }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Verify Your Email</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        We've sent a verification link to{' '}
        <strong className="text-gray-800 dark:text-white">{userEmail || 'your email address'}</strong>.
        Please check your inbox and click the link to continue.
      </p>
      
      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg mb-6">
        <p className="text-sm text-primary-700 dark:text-primary-300">
          For this simulation, you can click the button below to instantly verify your email.
        </p>
      </div>

      <button
        onClick={onVerify}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
      >
        I've Verified My Email
      </button>

       <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        Signed up with the wrong email?{' '}
        <button onClick={() => setAuthStage('signup')} className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
          Go Back
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;