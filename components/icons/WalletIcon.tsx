
import React from 'react';

export function WalletIcon({ className }: { className?: string }): React.ReactNode {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0-2 2v6a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V7Z"/>
      <path d="M3 5v14a2 2 0 0 0 2 2h11"/>
    </svg>
  );
}