import type { ReactNode } from 'react';

export type Page = 'pressure' | 'temperature' | 'flow' | 'level' | 'signal' | 'calibration' | 'pid' | 'conversion' | 'settings';

export interface MenuItem {
  id: Page;
  title: string;
  // FIX: Changed JSX.Element to ReactNode to resolve namespace error.
  icon: ReactNode;
  component: React.FC;
}

export type Theme = 'dark' | 'light';
export type Language = 'en' | 'fr' | 'es' | 'ar' | 'no';

export interface AppSettings {
  theme: Theme;
  language: Language;
}