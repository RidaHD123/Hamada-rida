import React from 'react';

interface CalculatorCardProps {
  title: string;
  children: React.ReactNode;
  Icon?: React.ElementType;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ title, children, Icon }) => {
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 border border-gray-200/80 dark:border-gray-700/80 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm">
      <div className="p-5 border-b border-gray-200/80 dark:border-gray-700/80 flex items-center space-x-3 bg-gray-50/30 dark:bg-gray-900/30">
        {Icon && <Icon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};