
import { useState, useCallback } from 'react';
import { getAiAssistance } from '../services/geminiService';

interface UseGeminiReturn {
  data: string | null;
  error: string | null;
  isLoading: boolean;
  generateContent: (prompt: string) => Promise<void>;
  reset: () => void;
}

export const useGemini = (): UseGeminiReturn => {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateContent = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await getAiAssistance(prompt);
      setData(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, error, isLoading, generateContent, reset };
};
