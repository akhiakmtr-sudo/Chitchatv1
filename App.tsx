import React, { useState, useEffect } from 'react';
import Auth from './components/auth/Auth';
import ChatLayout from './components/chat/ChatLayout';
import { useTheme } from './hooks/useTheme';
import { AuthState, User } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStage, setAuthStage] = useState<AuthState>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Simulate checking session
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRegister = (user: User) => {
    setRegisteredUser(user);
    setIsVerified(false);
    setAuthStage('verify-email');
  };
  
  const handleVerification = () => {
    setIsVerified(true);
    // In a real app, you'd likely just confirm, but here we'll move them to login.
    alert("Email verified successfully! Please log in.");
    setAuthStage('login');
  }

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthStage('login');
  };

  const handlePasswordReset = (newPassword: string) => {
    if (registeredUser) {
      setRegisteredUser({ ...registeredUser, password: newPassword });
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <svg className="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="antialiased text-gray-800 dark:text-gray-200">
      {isAuthenticated && currentUser ? (
        <ChatLayout 
            onLogout={handleLogout} 
            theme={theme} 
            toggleTheme={toggleTheme} 
            currentUserData={currentUser}
        />
      ) : (
        <Auth
          onAuthSuccess={handleAuthSuccess}
          authStage={authStage}
          setAuthStage={setAuthStage}
          theme={theme}
          toggleTheme={toggleTheme}
          onRegister={handleRegister}
          onVerify={handleVerification}
          registeredUser={registeredUser}
          isVerified={isVerified}
          userEmail={registeredUser?.email}
          onPasswordReset={handlePasswordReset}
        />
      )}
    </div>
  );
};

export default App;