export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Only used for auth simulation
  avatar: string;
  isOnline: boolean;
  age?: number;
  bio?: string;
  location?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  interest?: 'Bisexual' | 'Straight' | 'Gay' | 'Lesbian' | 'Cuck Fantasies';
  isPro?: boolean;
}

export interface Message {
  id: string;
  text?: string;
  file?: {
    url: string;
    type: 'image' | 'video';
    name: string;
  };
  sender: 'me' | 'stranger';
  timestamp: string;
}

export type AuthState = 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'verify-email' | 'reset-link-sent';