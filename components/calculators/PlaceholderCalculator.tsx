import React from 'react';
import { CalculatorCard } from '../CalculatorCard';

interface PlaceholderCalculatorProps {
    title: string;
}

const PlaceholderCalculator: React.FC<PlaceholderCalculatorProps> = ({ title }) => {
    return (
        <CalculatorCard title={title}>
            <div className="text-center py-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-800 dark:text-white">Feature Coming Soon</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The "{title}" module is currently under development.</p>
            </div>
        </CalculatorCard>
    );
};

export default PlaceholderCalculator;