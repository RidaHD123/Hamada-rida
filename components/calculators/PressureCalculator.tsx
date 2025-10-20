import React, { useState, useEffect } from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { InputField } from '../InputField';
import { AiAssistant } from '../AiAssistant';

const pressureUnits = ['bar', 'psi', 'kPa', 'atm', 'Pa'];
const conversionFactors: { [key: string]: number } = {
  bar: 1,
  psi: 14.5038,
  kPa: 100,
  atm: 0.986923,
  Pa: 100000,
};

const PressureCalculator: React.FC = () => {
  const [input, setInput] = useState({ value: '1', from: 'bar', to: 'psi' });
  const [result, setResult] = useState('');

  useEffect(() => {
    const valueNum = parseFloat(input.value);
    if (isNaN(valueNum)) {
      setResult('');
      return;
    }
    const valueInBar = valueNum / conversionFactors[input.from];
    const convertedValue = valueInBar * conversionFactors[input.to];
    setResult(convertedValue.toFixed(5));
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(prev => ({ ...prev, value: e.target.value }));
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const generatePrompt = () => {
    return `I am an instrumentation technician performing a pressure unit conversion. I am converting ${input.value} ${input.from} to ${input.to}. The calculated result is ${result} ${input.to}. Could you please verify this calculation and provide any relevant context or potential pitfalls when working with these pressure units in an industrial setting?`;
  };

  return (
    <CalculatorCard title="Pressure Unit Conversion">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <InputField
          label="Value"
          name="value"
          value={input.value}
          onChange={handleInputChange}
          units={pressureUnits}
          unit={input.from}
          onUnitChange={handleUnitChange}
          unitName="from"
        />
        <div className="flex items-center justify-center text-2xl font-bold text-gray-400 dark:text-gray-500 pt-6">→</div>
        <InputField
          label="To"
          name="to"
          value={input.to}
          onChange={handleUnitChange}
          type="select"
           units={pressureUnits}
          unit={input.to}
          onUnitChange={handleUnitChange}
          unitName="to"
        />
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">Result:</p>
        <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{result || '...'} <span className="text-xl">{input.to}</span></p>
      </div>
      <AiAssistant promptGenerator={generatePrompt} />
    </CalculatorCard>
  );
};

export default PressureCalculator;