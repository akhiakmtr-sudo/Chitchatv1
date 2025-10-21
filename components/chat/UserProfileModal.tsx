import React, { useState } from 'react';
import { User } from '../../types';
import UserBlockIcon from '../icons/UserBlockIcon';
import UserCheckIcon from '../icons/UserCheckIcon';

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
  onBlock: (userId: string) => Promise<void>;
  onUnblock: (userId: string) => Promise<void>;
  isBlocked: boolean;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, onBlock, onUnblock, isBlocked }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBlock = async () => {
    setIsProcessing(true);
    await onBlock(user.id);
    setIsProcessing(false);
  }

  const handleUnblock = async () => {
    setIsProcessing(true);
    await onUnblock(user.id);
    setIsProcessing(false);
  }

  const DetailItem: React.FC<{label: string, value: string | number | undefined}> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        <p className="text-base text-gray-800 dark:text-gray-200">{value || 'Not specified'}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Profile</h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
            <div className="flex flex-col items-center text-center">
                <div className="relative">
                    <img src={user.avatar} alt={user.username} className="h-28 w-28 rounded-full object-cover ring-4 ring-primary-200 dark:ring-primary-800" />
                    {user.isOnline && <span className="absolute bottom-1 right-3 block h-4 w-4 rounded-full bg-green-500 ring-4 ring-white dark:ring-gray-800"></span>}
                </div>
                <h3 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">{user.username}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.isOnline ? 'Online' : 'Offline'}</p>
                {user.bio && <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xs">{user.bio}</p>}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-y-4 gap-x-4 text-left">
                <DetailItem label="Age" value={user.age} />
                <DetailItem label="Gender" value={user.gender} />
                <DetailItem label="Location" value={user.location} />
                <DetailItem label="Interest" value={user.interest} />
            </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900/50 px-6 py-4 flex justify-end space-x-3 rounded-b-2xl mt-auto">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold transition-colors">Close</button>
            {isBlocked ? (
                <button 
                    onClick={handleUnblock} 
                    disabled={isProcessing}
                    className="w-36 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isProcessing ? (
                       <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <>
                            <UserCheckIcon className="w-5 h-5" />
                            <span>Unblock User</span>
                        </>
                    )}
                </button>
            ) : (
                <button 
                    onClick={handleBlock} 
                    disabled={isProcessing}
                    className="w-36 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isProcessing ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <>
                            <UserBlockIcon className="w-5 h-5" />
                            <span>Block User</span>
                        </>
                    )}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;