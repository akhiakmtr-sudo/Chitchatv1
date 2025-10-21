
import React from 'react';
import { Message, User } from '../../types';

interface MessageBubbleProps {
  message: Message;
  user: User | null;
  isTyping?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, user, isTyping = false }) => {
  const isMe = message.sender === 'me';

  if (isTyping) {
    return (
        <div className="flex items-end">
            {user && <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full object-cover mr-3" />}
            <div className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg rounded-bl-none max-w-xs lg:max-w-md">
                <div className="flex items-center justify-center space-x-1 h-5">
                    <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></span>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className={`flex items-end gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && user && (
        <img
          src={user.avatar}
          alt={user.username}
          className="w-8 h-8 rounded-full object-cover self-start"
        />
      )}
      <div className="flex flex-col">
        <div
          className={`rounded-xl max-w-xs lg:max-w-md break-words ${
            isMe
              ? 'bg-primary-500 text-white rounded-br-none'
              : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-md'
          } ${message.file ? 'p-1' : 'px-4 py-2'}`}
        >
          {message.text && <p>{message.text}</p>}
          {message.file && message.file.type === 'image' && (
             <img src={message.file.url} alt={message.file.name} className="rounded-lg max-w-full h-auto" loading="lazy" />
          )}
          {message.file && message.file.type === 'video' && (
             <video src={message.file.url} controls className="rounded-lg max-w-full h-auto" />
          )}
        </div>
        <span className={`text-xs mt-1 ${isMe ? 'text-right' : 'text-left'} text-gray-500 dark:text-gray-400`}>
          {message.timestamp}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;