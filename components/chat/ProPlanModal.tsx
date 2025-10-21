import React, { useState } from 'react';
import ProBadgeIcon from '../icons/ProBadgeIcon';

interface ProPlanModalProps {
  onClose: () => void;
  onSubscribe: () => Promise<void>;
}

const ProPlanModal: React.FC<ProPlanModalProps> = ({ onClose, onSubscribe }) => {
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribeClick = async () => {
    setIsSubscribing(true);
    await onSubscribe();
    // The component will unmount, but setting state back is good practice
    // in case the parent component logic changes.
    setIsSubscribing(false);
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col transform transition-transform duration-300 scale-95 animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full">
                <ProBadgeIcon className="w-8 h-8 text-primary-500" />
              </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Go Pro to Unlock More!</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Upgrade your experience with these exclusive features.</p>
        </div>
        
        <div className="p-6 overflow-y-auto">
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    <span><strong>Advanced Search Filters</strong> (Gender, Interest, Location)</span>
                </li>
                <li className="flex items-center gap-3">
                     <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    <span>Share <strong>Unlimited Images & Videos</strong></span>
                </li>
                <li className="flex items-center gap-3">
                     <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    <span>Initiate <strong>Voice Calls</strong></span>
                </li>
            </ul>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border-2 border-gray-200 dark:border-gray-600 p-4 rounded-lg text-center">
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">10 Days</p>
                    <p className="text-3xl font-bold text-primary-500 mt-2">₹49</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Basic Plan</p>
                </div>
                 <div className="border-2 border-primary-500 p-4 rounded-lg text-center relative">
                    <span className="absolute top-0 -translate-y-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</span>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">1 Month</p>
                    <p className="text-3xl font-bold text-primary-500 mt-2">₹99</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Value Plan</p>
                </div>
            </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900/50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 rounded-b-2xl mt-auto">
          <button 
            onClick={handleSubscribeClick} 
            disabled={isSubscribing}
            className="w-full px-4 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
            {isSubscribing ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                'Subscribe Now'
            )}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isSubscribing}
            className="w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Maybe Later
          </button>
        </div>

        <style>{`
            @keyframes scale-in {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
        `}</style>
      </div>
    </div>
  );
};

export default ProPlanModal;
