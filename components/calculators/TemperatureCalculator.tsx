import React, { useState, useEffect } from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { InputField } from '../InputField';

const tempUnits = ['°C', '°F', 'K', '°R'];

const TemperatureCalculator: React.FC = () => {
  const [input, setInput] = useState({ value: '25', from: '°C', to: '°F' });
  const [result, setResult] = useState('');

  useEffect(() => {
    const valueNum = parseFloat(input.value);
    if (isNaN(valueNum)) {
      setResult('');
      return;
    }

    let valueInC: number;
    switch (input.from) {
      case '°C': valueInC = valueNum; break;
      case '°F': valueInC = (valueNum - 32) * 5 / 9; break;
      case 'K': valueInC = valueNum - 273.15; break;
      case '°R': valueInC = (valueNum - 491.67) * 5 / 9; break;
      default: valueInC = 0;
    }

    let finalResult: number;
    switch (input.to) {
      case '°C': finalResult = valueInC; break;
      case '°F': finalResult = valueInC * 9 / 5 + 32; break;
      case 'K': finalResult = valueInC + 273.15; break;
      case '°R': finalResult = (valueInC + 273.15) * 9 / 5; break;
      default: finalResult = 0;
    }

    setResult(finalResult.toFixed(2));
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(prev => ({ ...prev, value: e.target.value }));
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  return (
    <CalculatorCard title="Temperature Unit Conversion">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <InputField
          label="Value"
          name="value"
          value={input.value}
          onChange={handleInputChange}
          units={tempUnits}
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
          units={tempUnits}
          unit={input.to}
          onUnitChange={handleUnitChange}
          unitName="to"
        />
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">Result:</p>
        <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{result || '...'} <span className="text-xl">{input.to}</span></p>
      </div>
    </CalculatorCard>
  );
};

export default TemperatureCalculator;