import React from 'react';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import ThemeToggle from './ThemeToggle';
import { AuthState, User } from '../../types';
import VerifyEmail from './VerifyEmail';
import ResetLinkSent from './ResetLinkSent';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
  authStage: AuthState;
  setAuthStage: (stage: AuthState) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onRegister: (user: User) => void;
  onVerify: () => void;
  registeredUser: User | null;
  isVerified: boolean;
  userEmail?: string;
  onPasswordReset: (newPassword: string) => void;
}

const Auth: React.FC<AuthProps> = ({ 
    onAuthSuccess, authStage, setAuthStage, theme, toggleTheme, 
    onRegister, onVerify, registeredUser, isVerified, userEmail,
    onPasswordReset
}) => {
  const renderStage = () => {
    switch (authStage) {
      case 'login':
        return <Login onAuthSuccess={onAuthSuccess} setAuthStage={setAuthStage} registeredUser={registeredUser} isVerified={isVerified} />;
      case 'signup':
        return <Signup onRegister={onRegister} setAuthStage={setAuthStage} />;
      case 'verify-email':
        return <VerifyEmail onVerify={onVerify} userEmail={userEmail} setAuthStage={setAuthStage} />;
      case 'forgot-password':
        return <ForgotPassword setAuthStage={setAuthStage} registeredUser={registeredUser} />;
      case 'reset-link-sent':
        return <ResetLinkSent setAuthStage={setAuthStage} userEmail={registeredUser?.email} />;
      case 'reset-password':
        return <ResetPassword setAuthStage={setAuthStage} onPasswordReset={onPasswordReset} />;
      default:
        return <Login onAuthSuccess={onAuthSuccess} setAuthStage={setAuthStage} registeredUser={registeredUser} isVerified={isVerified}/>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors">
        <div className="absolute top-4 right-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
           <svg className="h-12 w-auto text-primary-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.928 11.607c-.202-.488-.635-.873-1.059-1.123L12 5.92V4a1 1 0 00-2 0v1.92l-8.87 4.564c-.423.25-.856.635-1.058 1.123A2.001 2.001 0 002.003 14H2v3a1 1 0 001 1h1a1 1 0 100-2H3v-1h18v1h-1a1 1 0 100 2h1a1 1 0 001-1v-3h-.003a2 2 0 00-.069-2.393zM12 16a3 3 0 110-6 3 3 0 010 6z"/>
           </svg>
           <h1 className="text-4xl font-bold ml-2 text-gray-800 dark:text-white">ChitChat</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
            {renderStage()}
        </div>
      </div>
    </div>
  );
};

export default Auth;