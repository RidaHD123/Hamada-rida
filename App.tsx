import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MENU_ITEMS } from './constants';
import type { Page } from './types';
import { SettingsProvider } from './components/contexts/SettingsContext';

const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('pressure');

  const ActiveCalculator = MENU_ITEMS.find(item => item.id === activePage)?.component || (() => <div>Page not found</div>);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={MENU_ITEMS.find(item => item.id === activePage)?.title || 'Dashboard'} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800/50 p-6 md:p-8">
          <div className="container mx-auto max-w-7xl">
            <ActiveCalculator />
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
};

export default App;