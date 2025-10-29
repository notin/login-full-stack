import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { initializeAuthAtom } from '../atoms/auth';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const [, initializeAuth] = useAtom(initializeAuthAtom);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
};
