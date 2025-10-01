
import React from 'react';

export function TransportIcon({ className }: { className?: string }): React.ReactNode {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v1"/>
        <path d="M16 17h-3v-4h3"/>
        <path d="M4 17h-1c-.6 0-1-.4-1-1v-3c0-1.1.9-2 2-2h1"/>
        <path d="M5 17a2 2 0 1 0 4 0H5Z"/>
        <path d="M15 17a2 2 0 1 0 4 0h-4Z"/>
    </svg>
  );
}
