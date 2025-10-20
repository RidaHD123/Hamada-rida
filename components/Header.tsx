import React from 'react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700/50 shadow-md">
      <div className="mx-auto px-6 py-4">
        <h1 className="text-xl md:text-2xl font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">{title}</h1>
      </div>
    </header>
  );
};