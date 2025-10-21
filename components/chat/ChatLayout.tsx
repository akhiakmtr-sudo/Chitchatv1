import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import Sidebar from './Sidebar';
import { User } from '../../types';
import ProfileModal from './ProfileModal';
import UserProfileModal from './UserProfileModal';
import ProPlanModal from './ProPlanModal';

interface ChatLayoutProps {
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentUserData: User;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ onLogout, theme, toggleTheme, currentUserData }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState<User | null>(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isProPlanModalOpen, setProPlanModalOpen] = useState(false);
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());
  
  const [currentUser, setCurrentUser] = useState<User>(currentUserData);

  const handleProfileUpdate = (updatedUser: User): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            setCurrentUser(updatedUser);
            setProfileModalOpen(false);
            resolve();
        }, 1500);
    });
  };

  const handleBlockUser = (userId: string): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            setBlockedUserIds(prev => new Set(prev).add(userId));
            if (activeChatUser?.id === userId) {
            setActiveChatUser(null);
            }
            setViewedUser(null);
            resolve();
        }, 1000);
    });
  };

  const handleUnblockUser = (userId: string): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            setBlockedUserIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
            });
            setViewedUser(null);
            resolve();
        }, 1000);
    });
  };

  const handleSubscribe = (): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            setCurrentUser(prev => ({ ...prev, isPro: true }));
            setProPlanModalOpen(false);
            resolve();
        }, 1500);
    });
  };


  return (
    <div className="h-screen w-full flex bg-gray-100 dark:bg-gray-900">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        onLogout={onLogout} 
        theme={theme} 
        toggleTheme={toggleTheme}
        onUserSelect={setActiveChatUser}
        onViewProfile={setViewedUser}
        currentUser={currentUser}
        onEditProfile={() => setProfileModalOpen(true)}
        blockedUserIds={blockedUserIds}
      />
      <main className="flex-1 flex flex-col transition-all duration-300">
        <ChatWindow 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          activeChatUser={activeChatUser}
          setActiveChatUser={setActiveChatUser}
          onViewProfile={setViewedUser}
          blockedUserIds={blockedUserIds}
          isPro={currentUser.isPro ?? false}
          onOpenProModal={() => setProPlanModalOpen(true)}
        />
      </main>
      
      {isProfileModalOpen && (
        <ProfileModal 
          user={currentUser}
          onClose={() => setProfileModalOpen(false)}
          onSave={handleProfileUpdate}
        />
      )}

      {isProPlanModalOpen && (
        <ProPlanModal
          onClose={() => setProPlanModalOpen(false)}
          onSubscribe={handleSubscribe}
        />
      )}

      {viewedUser && (
        <UserProfileModal 
          user={viewedUser}
          onClose={() => setViewedUser(null)}
          onBlock={handleBlockUser}
          onUnblock={handleUnblockUser}
          isBlocked={blockedUserIds.has(viewedUser.id)}
        />
      )}
    </div>
  );
};

export default ChatLayout;
