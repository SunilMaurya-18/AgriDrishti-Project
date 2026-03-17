'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import type { ReactNode } from 'react';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export function GoogleAuthWrapper({ children }: { children: ReactNode }) {
  if (!GOOGLE_CLIENT_ID) {
    // If no Google Client ID is configured, just render children without the provider
    return <>{children}</>;
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
