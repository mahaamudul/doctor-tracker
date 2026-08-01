'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-center"
        closeButton
        toastOptions={{
          style: {
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.75rem',
            padding: '0.625rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            width: 'fit-content',
            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.35)',
          },
        }}
      />
    </SessionProvider>
  );
}