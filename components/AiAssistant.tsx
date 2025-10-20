import React, { useState } from 'react';
import { useGemini } from '../hooks/useGemini';

// A simple Markdown parser
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n').map((line, index) => {
        if (line.startsWith('### ')) {
            return <h3 key={index} className="text-lg font-bold mt-4 mb-2 text-cyan-700 dark:text-cyan-300">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
            return <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-cyan-800 dark:text-cyan-200">{line.substring(3)}</h2>;
        }
        if (line.startsWith('# ')) {
            return <h1 key={index} className="text-2xl font-bold mt-8 mb-4 text-cyan-900 dark:text-cyan-100">{line.substring(2)}</h1>;
        }
        if (line.startsWith('* ')) {
            return <li key={index} className="ml-6 list-disc">{line.substring(2)}</li>;
        }
        if (line.trim() === '') {
            return <br key={index} />;
        }
        return <p key={index} className="mb-2">{line}</p>;
    });

    return <>{lines}</>;
};


const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse"></div>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">AI is thinking...</span>
    </div>
);


interface AiAssistantProps {
  promptGenerator: () => string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ promptGenerator }) => {
  const { data, error, isLoading, generateContent, reset } = useGemini();
  const [isOpen, setIsOpen] = useState(false);

  const handleAssistClick = () => {
    const prompt = promptGenerator();
    generateContent(prompt);
    setIsOpen(true);
  };
  
  const handleClose = () => {
      setIsOpen(false);
      reset();
  }

  return (
    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
      <button
        onClick={handleAssistClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-cyan-800 disabled:cursor-not-allowed transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        AI Assist
      </button>

      {isOpen && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-cyan-600 dark:text-cyan-400">AI Assistant Response</h4>
                <button onClick={handleClose} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">&times;</button>
            </div>
            {isLoading && <LoadingSpinner />}
            {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
            {data && <div className="text-gray-700 dark:text-gray-300 text-sm prose prose-invert max-w-none"><SimpleMarkdown text={data} /></div>}
        </div>
      )}
    </div>
  );
};