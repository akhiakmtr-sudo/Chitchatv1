
import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import SendIcon from '../icons/SendIcon';
import { User, Message } from '../../types';
import PhoneIcon from '../icons/PhoneIcon';
import PaperclipIcon from '../icons/PaperclipIcon';
import ProBadgeIcon from '../icons/ProBadgeIcon';

interface ChatWindowProps {
  toggleSidebar: () => void;
  activeChatUser: User | null;
  setActiveChatUser: (user: User | null) => void;
  onViewProfile: (user: User) => void;
  blockedUserIds: Set<string>;
  isPro: boolean;
  onOpenProModal: () => void;
}

// FIX: Add missing 'email' property to mock User objects.
const mockUsers: User[] = [
    { id: '10', email: 'sophia@example.com', username: 'Sophia', avatar: 'https://picsum.photos/id/1027/100/100', isOnline: true, gender: 'Female', location: 'New York', interest: 'Straight' },
    { id: '11', email: 'liam@example.com', username: 'Liam', avatar: 'https://picsum.photos/id/1028/100/100', isOnline: true, gender: 'Male', location: 'Paris', interest: 'Bisexual' },
    { id: '12', email: 'olivia@example.com', username: 'Olivia', avatar: 'https://picsum.photos/id/1029/100/100', isOnline: true, gender: 'Female', location: 'Tokyo', interest: 'Lesbian' },
    { id: '1', email: 'alice@example.com', username: 'Alice', avatar: 'https://picsum.photos/id/1011/100/100', isOnline: true, gender: 'Female', location: 'New York', interest: 'Bisexual' },
    { id: '2', email: 'bob@example.com', username: 'Bob', avatar: 'https://picsum.photos/id/1012/100/100', isOnline: true, gender: 'Male', location: 'London', interest: 'Straight' },
    { id: '3', email: 'charlie@example.com', username: 'Charlie', avatar: 'https://picsum.photos/id/1013/100/100', isOnline: true, gender: 'Male', location: 'Paris', interest: 'Gay' },
    { id: '13', email: 'noah@example.com', username: 'Noah', avatar: 'https://picsum.photos/id/1031/100/100', isOnline: true, gender: 'Male', location: 'London', interest: 'Cuck Fantasies' },
    { id: '14', email: 'emma@example.com', username: 'Emma', avatar: 'https://picsum.photos/id/1032/100/100', isOnline: true, gender: 'Female', location: 'Sydney', interest: 'Gay' },
];

const ChatWindow: React.FC<ChatWindowProps> = ({ toggleSidebar, activeChatUser, setActiveChatUser, onViewProfile, blockedUserIds, isPro, onOpenProModal }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'searching' | 'connected' | 'disconnected'>('idle');
  const [voiceCallStatus, setVoiceCallStatus] = useState<'idle' | 'calling' | 'connected'>('idle');
  
  const [genderFilter, setGenderFilter] = useState('');
  const [interestFilter, setInterestFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeChatUser) {
        setConnectionStatus('connected');
        setMessages([
            { id: 'start-1', text: `You are now connected with ${activeChatUser.username}.`, sender: 'stranger', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
    } else {
        setConnectionStatus('idle');
        setVoiceCallStatus('idle');
        setMessages([]);
    }
  }, [activeChatUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !activeChatUser) return;
    const myMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, myMessage]);
    setNewMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const strangerResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'That is interesting! Tell me more.',
        sender: 'stranger',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setIsTyping(false);
      setMessages(prev => [...prev, strangerResponse]);
    }, 2000 + Math.random() * 1000);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChatUser) return;
    
    const fileUrl = URL.createObjectURL(file);
    const fileType = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;

    if (!fileType) {
        alert("Unsupported file type. Please select an image or video.");
        return;
    }

    const fileMessage: Message = {
        id: Date.now().toString(),
        file: { url: fileUrl, type: fileType, name: file.name },
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, fileMessage]);

    setIsTyping(true);
    setTimeout(() => {
        setIsTyping(false);
        const strangerFileResponse: Message = {
             id: (Date.now() + 1).toString(),
             file: { url: 'https://picsum.photos/seed/'+Date.now()+'/400/300', type: 'image', name: 'response.jpg' },
             sender: 'stranger',
             timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages(prev => [...prev, strangerFileResponse]);
    }, 2500);

    if (e.target) e.target.value = '';
  }
  
  const handleAttachmentClick = () => {
      if (!isPro) {
          onOpenProModal();
          return;
      }
      fileInputRef.current?.click();
  }

  const handleFindStranger = () => {
    setConnectionStatus('searching');
    setActiveChatUser(null);
    setMessages([]);
    setTimeout(() => {
        let availableUsers = mockUsers.filter(u => !blockedUserIds.has(u.id));

        if (isPro) {
            if (genderFilter) {
                availableUsers = availableUsers.filter(u => u.gender === genderFilter);
            }
            if (interestFilter) {
                availableUsers = availableUsers.filter(u => u.interest === interestFilter);
            }
            if (locationFilter.trim()) {
                availableUsers = availableUsers.filter(u => u.location?.toLowerCase().includes(locationFilter.trim().toLowerCase()));
            }
        }

        if (availableUsers.length > 0) {
            const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
            setActiveChatUser(randomUser);
        } else {
            setConnectionStatus('idle');
            alert("No available users match your filter criteria.");
        }
    }, 2500);
  }

  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
     setTimeout(() => {
        setActiveChatUser(null);
     }, 1000)
  }

  const handleInitiateCall = () => {
    if (!isPro) {
        onOpenProModal();
        return;
    }
    setVoiceCallStatus('calling');
    setTimeout(() => {
        setVoiceCallStatus('connected');
    }, 3000);
  }

  const handleEndCall = () => {
      setVoiceCallStatus('idle');
  }
  
  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (!isPro) {
          onOpenProModal();
          return;
      }
      setter(e.target.value);
  }

  const renderContent = () => {
    switch (connectionStatus) {
        case 'searching':
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <svg className="animate-spin h-12 w-12 text-primary-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Searching for a stranger...</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Applying your filters to find the perfect match.</p>
                </div>
            )
        case 'connected':
             return (
                 <>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} user={activeChatUser} />
                        ))}
                        {isTyping && activeChatUser && <MessageBubble message={{ id: 'typing', text: '...', sender: 'stranger', timestamp: ''}} user={activeChatUser} isTyping />}
                        <div ref={chatEndRef} />
                    </div>
                    {/* Message Input */}
                    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,video/*" className="hidden" />
                        <button onClick={handleAttachmentClick} className="mr-3 text-gray-500 hover:text-primary-500 transition-colors relative">
                            <PaperclipIcon className="w-6 h-6" />
                            {!isPro && <ProBadgeIcon className="absolute -top-1 -right-1 w-4 h-4" />}
                        </button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
                        />
                        <button onClick={handleSendMessage} className="ml-4 text-primary-500 hover:text-primary-600 disabled:text-gray-400 transition-colors" disabled={!newMessage.trim()}>
                            <SendIcon className="w-6 h-6" />
                        </button>
                        </div>
                    </div>
                 </>
             )
        default: // idle or disconnected
            return (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 overflow-y-auto">
                    {connectionStatus === 'disconnected' && activeChatUser && (
                        <p className="text-lg font-semibold text-red-500 mb-6 p-3 bg-red-100 dark:bg-red-900/50 rounded-lg">You have disconnected from {activeChatUser.username}.</p>
                    )}
                    <svg className="h-24 w-24 text-primary-400 mb-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19.431 15.313a1 1 0 00-1.431.323 3 3 0 01-4.243 0 1 1 0 00-1.5-.083c-.025.033-.05.066-.072.1l-1.155 1.732a3 3 0 01-4.243 0 1 1 0 10-1.43 1.431 5 5 0 007.113 0l1.732-2.598a1 1 0 00.323-1.431zM4 11a3 3 0 013-3h10a3 3 0 013 3v2a1 1 0 102 0v-2a5 5 0 00-5-5H7a5 5 0 00-5 5v2a1 1 0 102 0v-2z"/></svg>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Start a new conversation</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">Connect with a random user and see where the conversation takes you. Your next great chat is just a click away.</p>
                    
                     <div 
                        className={`mt-8 w-full max-w-sm space-y-4 bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 relative ${!isPro ? 'cursor-pointer' : ''}`}
                        onClick={!isPro ? onOpenProModal : undefined}
                     >
                        {!isPro && <div className="absolute inset-0 bg-transparent z-10"></div>}
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Filter Options</h3>
                            {!isPro && <ProBadgeIcon className="w-5 h-5" />}
                        </div>
                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${!isPro ? 'opacity-50' : ''}`}>
                            <div>
                                <label htmlFor="genderFilter" className="block text-sm font-medium text-gray-600 dark:text-gray-400 text-left mb-1">Gender</label>
                                <select id="genderFilter" value={genderFilter} onChange={handleFilterChange(setGenderFilter)} disabled={!isPro} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed">
                                    <option value="">Any</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="interestFilter" className="block text-sm font-medium text-gray-600 dark:text-gray-400 text-left mb-1">Interest</label>
                                <select id="interestFilter" value={interestFilter} onChange={handleFilterChange(setInterestFilter)} disabled={!isPro} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed">
                                    <option value="">Any</option>
                                    <option>Bisexual</option>
                                    <option>Straight</option>
                                    <option>Gay</option>
                                    <option>Lesbian</option>
                                    <option>Cuck Fantasies</option>
                                </select>
                            </div>
                        </div>
                        <div className={!isPro ? 'opacity-50' : ''}>
                            <label htmlFor="locationFilter" className="block text-sm font-medium text-gray-600 dark:text-gray-400 text-left mb-1">Location</label>
                            <input type="text" id="locationFilter" value={locationFilter} onChange={handleFilterChange(setLocationFilter)} placeholder="e.g., New York" disabled={!isPro} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed" />
                        </div>
                    </div>

                    <button onClick={handleFindStranger} className="mt-8 bg-primary-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-transform transform hover:scale-105">
                        Find a Stranger
                    </button>
                </div>
            )
    }
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-18">
        <div className="flex items-center min-w-0">
          <button className="md:hidden text-gray-500 dark:text-gray-400 mr-4" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          {activeChatUser && (
            <div onClick={() => onViewProfile(activeChatUser)} className="flex items-center cursor-pointer min-w-0">
              <div className="relative">
                <img className="h-10 w-10 rounded-full object-cover" src={activeChatUser.avatar} alt={activeChatUser.username} />
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></span>
              </div>
              <div className="ml-3 min-w-0">
                <h2 className="font-semibold text-gray-800 dark:text-white truncate">{activeChatUser.username}</h2>
                <p className="text-sm text-green-500">Online</p>
              </div>
            </div>
          )}
        </div>
        {activeChatUser && (
             <div className="flex items-center space-x-2 flex-shrink-0">
                {voiceCallStatus === 'idle' &&
                    <button onClick={handleInitiateCall} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative" aria-label="Start voice call">
                        <PhoneIcon className="h-6 w-6" />
                        {!isPro && <ProBadgeIcon className="absolute -top-1 -right-1 w-4 h-4" />}
                    </button>
                }
                <button onClick={handleDisconnect} className="text-sm bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-colors">
                    Disconnect
                </button>
            </div>
        )}
      </header>
       {/* Voice Call UI Overlay */}
      {activeChatUser && voiceCallStatus !== 'idle' && (
        <div className="p-2 bg-green-100 dark:bg-green-900/50 border-b border-green-200 dark:border-green-800 flex items-center justify-center text-sm font-medium text-green-800 dark:text-green-200">
            {voiceCallStatus === 'calling' && `Calling ${activeChatUser.username}...`}
            {voiceCallStatus === 'connected' && `Voice call connected with ${activeChatUser.username}.`}
            {voiceCallStatus === 'connected' && 
                <button onClick={handleEndCall} className="ml-4 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-lg hover:bg-red-600">End Call</button>
            }
        </div>
      )}

      {/* Chat Area */}
      {renderContent()}
    </div>
  );
};

export default ChatWindow;
