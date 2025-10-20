import React from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { useSettings } from '../contexts/SettingsContext';
import type { Theme, Language } from '../../types';

const Settings: React.FC = () => {
  const { settings, setSettings } = useSettings();

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(s => ({ ...s, theme: event.target.value as Theme }));
  };
  
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(s => ({ ...s, language: event.target.value as Language }));
  };

  return (
    <CalculatorCard title="Application Settings">
      <div className="space-y-8">
        {/* Theme Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Theme</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Choose how the application looks.
          </p>
          <fieldset className="mt-4">
            <legend className="sr-only">Theme selection</legend>
            <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
              <div className="flex items-center">
                <input
                  id="light"
                  name="theme-mode"
                  type="radio"
                  value="light"
                  checked={settings.theme === 'light'}
                  onChange={handleThemeChange}
                  className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300"
                />
                <label htmlFor="light" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Light
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="dark"
                  name="theme-mode"
                  type="radio"
                  value="dark"
                  checked={settings.theme === 'dark'}
                  onChange={handleThemeChange}
                  className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300"
                />
                <label htmlFor="dark" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dark
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        {/* Language Settings */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
           <h3 className="text-lg font-medium text-gray-900 dark:text-white">Language</h3>
           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select your preferred language. (UI labels will be updated in a future version)
           </p>
           <div className="mt-4">
              <select 
                name="language" 
                id="language" 
                value={settings.language}
                onChange={handleLanguageChange}
                className="max-w-xs w-full rounded-md bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 text-gray-900 dark:text-white p-2.5"
              >
                  <option value="en">English</option>
                  <option value="fr">Français (French)</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="no">Norsk (Norwegian)</option>
                  <option value="ar">العربية (Arabic)</option>
              </select>
           </div>
        </div>
      </div>
    </CalculatorCard>
  );
};

export default Settings;