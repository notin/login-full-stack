import { atom } from 'jotai';
import { authService, User } from '../services/api';
import { authActionsAtom } from './auth';

// Login action atom
export const loginAtom = atom(
  null,
  async (get, set, { email, password }: { email: string; password: string }) => {
    try {
      const response = await authService.login(email, password);
      set(authActionsAtom, {
        type: 'SET_AUTH',
        payload: { user: response.user, token: response.token }
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }
);

// Register action atom
export const registerAtom = atom(
  null,
  async (get, set, { email, password }: { email: string; password: string }) => {
    try {
      const response = await authService.register(email, password);
      set(authActionsAtom, {
        type: 'SET_AUTH',
        payload: { user: response.user, token: response.token }
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }
);

// Logout action atom
export const logoutAtom = atom(
  null,
  (get, set) => {
    set(authActionsAtom, { type: 'CLEAR_AUTH' });
  }
);
