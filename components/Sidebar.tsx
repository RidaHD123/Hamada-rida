import React from 'react';
import type { Page } from '../types';
import { MENU_ITEMS } from '../constants';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 hidden md:flex md:flex-col">
      <div className="p-4 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-sm text-center font-semibold text-cyan-600 dark:text-cyan-400">
          A gift from HAMADA RIDA to Microsoft and all global energy companies
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-left
              ${
                activePage === item.id
                  ? 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
          >
            <span className="mr-3 flex-shrink-0">{item.icon}</span>
            <span className="truncate">{item.title}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Instrumentation Toolkit v1.0
        </p>
      </div>
    </aside>
  );
};
