import { atom } from 'jotai';
import { User } from '../services/api';

// Base atoms for auth state
export const userAtom = atom<User | null>(null);
export const tokenAtom = atom<string | null>(null);
export const isLoadingAtom = atom<boolean>(true);

// Derived atoms
export const isAuthenticatedAtom = atom(
  (get) => {
    const user = get(userAtom);
    const token = get(tokenAtom);
    return !!(user && token);
  }
);

// Actions atom for auth operations
export const authActionsAtom = atom(
  null,
  (get, set, action: {
    type: 'SET_USER' | 'SET_TOKEN' | 'SET_LOADING' | 'CLEAR_AUTH' | 'SET_AUTH';
    payload?: any;
  }) => {
    switch (action.type) {
      case 'SET_USER':
        set(userAtom, action.payload);
        break;
      case 'SET_TOKEN':
        set(tokenAtom, action.payload);
        break;
      case 'SET_LOADING':
        set(isLoadingAtom, action.payload);
        break;
      case 'CLEAR_AUTH':
        set(userAtom, null);
        set(tokenAtom, null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        break;
      case 'SET_AUTH':
        const { user, token } = action.payload;
        set(userAtom, user);
        set(tokenAtom, token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        break;
    }
  }
);

// Initialize auth state from localStorage
export const initializeAuthAtom = atom(
  null,
  (get, set) => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    console.log('Auth atoms: Checking localStorage', { 
      hasToken: !!storedToken, 
      hasUser: !!storedUser 
    });

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        set(userAtom, parsedUser);
        set(tokenAtom, storedToken);
        console.log('Auth atoms: Restored user from localStorage', { 
          hasToken: !!storedToken, 
          hasUser: !!parsedUser 
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      console.log('Auth atoms: No stored credentials found');
    }
    set(isLoadingAtom, false);
  }
);
