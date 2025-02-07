import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`${className}`}>
      <span className="font-['Dancing_Script'] text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Airmeet
      </span>
    </div>
  );
}