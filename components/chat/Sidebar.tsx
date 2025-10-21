
import React, { useState, useEffect } from 'react';
import ThemeToggle from '../auth/ThemeToggle';
import { User } from '../../types';
import PencilIcon from '../icons/PencilIcon';
import SearchIcon from '../icons/SearchIcon';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onUserSelect: (user: User) => void;
  onViewProfile: (user: User) => void;
  currentUser: User;
  onEditProfile: () => void;
  blockedUserIds: Set<string>;
}

// FIX: Add missing 'email' property to mock User objects.
const mockConnections: User[] = [
  { id: '1', email: 'alice@example.com', username: 'Alice', avatar: 'https://picsum.photos/id/1011/100/100', isOnline: true, gender: 'Female', location: 'New York', interest: 'Bisexual' },
  { id: '2', email: 'bob@example.com', username: 'Bob', avatar: 'https://picsum.photos/id/1012/100/100', isOnline: false, gender: 'Male', location: 'London', interest: 'Straight' },
  { id: '3', email: 'charlie@example.com', username: 'Charlie', avatar: 'https://picsum.photos/id/1013/100/100', isOnline: true, gender: 'Male', location: 'Paris', interest: 'Gay' },
];

// FIX: Add missing 'email' property to mock User objects.
const mockHistory: User[] = [
    { id: '4', email: 'dave@example.com', username: 'Dave', avatar: 'https://picsum.photos/id/1014/100/100', isOnline: false, gender: 'Male', location: 'Tokyo', interest: 'Straight' },
    { id: '5', email: 'eve@example.com', username: 'Eve', avatar: 'https://picsum.photos/id/1015/100/100', isOnline: false, gender: 'Female', location: 'Sydney', interest: 'Lesbian' },
    { id: '1', email: 'alice@example.com', username: 'Alice', avatar: 'https://picsum.photos/id/1011/100/100', isOnline: false, gender: 'Female', location: 'New York', interest: 'Bisexual' }, // Alice was online, now shows in history
];

// Additional users from ChatWindow for a more complete search pool
const moreMockUsers: User[] = [
    { id: '10', email: 'sophia@example.com', username: 'Sophia', avatar: 'https://picsum.photos/id/1027/100/100', isOnline: true, gender: 'Female', location: 'New York', interest: 'Straight' },
    { id: '11', email: 'liam@example.com', username: 'Liam', avatar: 'https://picsum.photos/id/1028/100/100', isOnline: true, gender: 'Male', location: 'Paris', interest: 'Bisexual' },
    { id: '12', email: 'olivia@example.com', username: 'Olivia', avatar: 'https://picsum.photos/id/1029/100/100', isOnline: true, gender: 'Female', location: 'Tokyo', interest: 'Lesbian' },
    { id: '13', email: 'noah@example.com', username: 'Noah', avatar: 'https://picsum.photos/id/1031/100/100', isOnline: true, gender: 'Male', location: 'London', interest: 'Cuck Fantasies' },
    { id: '14', email: 'emma@example.com', username: 'Emma', avatar: 'https://picsum.photos/id/1032/100/100', isOnline: true, gender: 'Female', location: 'Sydney', interest: 'Gay' },
];

// For finding blocked user details and for search
const allMockUsers = [...new Map([...mockConnections, ...mockHistory, ...moreMockUsers].map(item => [item.id, item])).values()];

const UserListItem: React.FC<{user: User, onClick: () => void}> = ({ user, onClick }) => (
    <li
        onClick={onClick}
        className="flex items-center p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
    >
        <div className="relative">
            <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt={user.username} />
            {user.isOnline && <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></span>}
        </div>
        <span className="ml-3 font-medium text-gray-800 dark:text-gray-200">{user.username}</span>
    </li>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, onLogout, theme, toggleTheme, onUserSelect, onViewProfile, currentUser, onEditProfile, blockedUserIds }) => {
  const [activeTab, setActiveTab] = useState<'connections' | 'history' | 'blocked'>('connections');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const results = allMockUsers.filter(user => 
        user.id !== currentUser.id && (
            user.username.toLowerCase().includes(lowercasedQuery) ||
            user.email.toLowerCase().includes(lowercasedQuery) ||
            (user.location && user.location.toLowerCase().includes(lowercasedQuery))
        )
    );
    setSearchResults(results);
  }, [searchQuery, currentUser.id]);

  const visibleConnections = mockConnections.filter(u => !blockedUserIds.has(u.id));
  const blockedUsers = allMockUsers.filter(u => blockedUserIds.has(u.id));

  const handleViewProfileFromList = (user: User) => {
    onViewProfile(user);
    if (window.innerWidth < 768) {
        setIsOpen(false);
    }
  }

  return (
    <>
      <div className={`fixed inset-0 z-30 bg-black/30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`absolute md:relative z-40 flex flex-col w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:translate-x-0`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
             <div className="flex items-center">
               <svg className="h-8 w-auto text-primary-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.928 11.607c-.202-.488-.635-.873-1.059-1.123L12 5.92V4a1 1 0 00-2 0v1.92l-8.87 4.564c-.423.25-.856.635-1.058 1.123A2.001 2.001 0 002.003 14H2v3a1 1 0 001 1h1a1 1 0 100-2H3v-1h18v1h-1a1 1 0 100 2h1a1 1 0 001-1v-3h-.003a2 2 0 00-.069-2.393zM12 16a3 3 0 110-6 3 3 0 010 6z"/>
               </svg>
               <h1 className="text-xl font-bold ml-2 text-gray-800 dark:text-white">ChitChat</h1>
            </div>
          <button className="md:hidden text-gray-500" onClick={() => setIsOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="p-4 space-y-4">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input
                    type="text"
                    placeholder="Search by name, email, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
            
            {searchQuery.trim() === '' && (
                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
                    <button onClick={() => setActiveTab('connections')} className={`w-1/3 p-2 rounded-l-md text-sm font-semibold focus:outline-none transition-colors ${activeTab === 'connections' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>Connections</button>
                    <button onClick={() => setActiveTab('history')} className={`w-1/3 p-2 text-sm font-semibold focus:outline-none transition-colors border-l border-r border-gray-300 dark:border-gray-600 ${activeTab === 'history' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>History</button>
                    <button onClick={() => setActiveTab('blocked')} className={`w-1/3 p-2 rounded-r-md text-sm font-semibold focus:outline-none transition-colors ${activeTab === 'blocked' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>Blocked</button>
                </div>
            )}
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto px-2">
            <ul className="space-y-1">
                {searchQuery.trim() !== '' ? (
                    searchResults.length > 0 ? (
                        searchResults.map(user => 
                            <UserListItem key={user.id} user={user} onClick={() => handleViewProfileFromList(user)} />
                        )
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 p-4 text-sm">No users found.</p>
                    )
                ) : (
                    <>
                        {activeTab === 'connections' && visibleConnections.map(user => 
                            <UserListItem key={user.id} user={user} onClick={() => handleViewProfileFromList(user)} />
                        )}
                        {activeTab === 'history' && mockHistory.map(user => 
                            <UserListItem key={user.id + user.username} user={user} onClick={() => handleViewProfileFromList(user)} />
                        )}
                        {activeTab === 'blocked' && blockedUsers.map(user => 
                            <UserListItem key={user.id} user={user} onClick={() => handleViewProfileFromList(user)} />
                        )}
                        {activeTab === 'blocked' && blockedUsers.length === 0 && (
                            <p className="text-center text-gray-500 dark:text-gray-400 p-4 text-sm">You haven't blocked any users.</p>
                        )}
                    </>
                )}
            </ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center min-w-0">
                <img className="h-10 w-10 rounded-full object-cover flex-shrink-0" src={currentUser.avatar} alt="My Profile" />
                <span className="ml-3 font-semibold text-gray-800 dark:text-gray-200 truncate">{currentUser.username}</span>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
                <button onClick={onEditProfile} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Edit Profile">
                    <PencilIcon className="h-5 w-5"/>
                </button>
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                <button onClick={onLogout} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Logout">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
            </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
