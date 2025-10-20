import React, { useState, useEffect, useCallback } from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { InputField } from '../InputField';

const unitData: { [key: string]: { base: string; units: { [key: string]: number } } } = {
  Pressure: {
    base: 'Pa',
    units: { Pa: 1, kPa: 1000, bar: 100000, psi: 6894.76, atm: 101325, 'inH2O': 249.089, 'mmHg': 133.322 },
  },
  Length: {
    base: 'm',
    units: { m: 1, cm: 0.01, mm: 0.001, in: 0.0254, ft: 0.3048, yd: 0.9144 },
  },
  'Volumetric Flow': {
    base: 'm³/s',
    units: { 'm³/s': 1, 'm³/h': 1/3600, 'L/s': 0.001, 'L/min': 1/60000, 'gpm (US)': 0.0000630902, 'cfm': 0.000471947 },
  },
  'Mass Flow': {
    base: 'kg/s',
    units: { 'kg/s': 1, 'kg/h': 1/3600, 'lb/s': 0.453592, 'lb/min': 0.453592/60 },
  },
  Voltage: {
    base: 'V',
    units: { V: 1, mV: 0.001, kV: 1000 },
  },
  Current: {
    base: 'A',
    units: { A: 1, mA: 0.001, µA: 0.000001 },
  },
  Resistance: {
    base: 'Ω',
    units: { 'Ω': 1, 'kΩ': 1000, 'MΩ': 1000000 },
  },
};

// Temperature conversion requires special functions
const convertTemperature = (value: number, from: string, to: string): number => {
    let valueInC: number;
    switch (from) {
        case '°C': valueInC = value; break;
        case '°F': valueInC = (value - 32) * 5 / 9; break;
        case 'K': valueInC = value - 273.15; break;
        case '°R': valueInC = (value - 491.67) * 5 / 9; break;
        default: return NaN;
    }
    switch (to) {
        case '°C': return valueInC;
        case '°F': return valueInC * 9 / 5 + 32;
        case 'K': return valueInC + 273.15;
        case '°R': return (valueInC + 273.15) * 9 / 5;
        default: return NaN;
    }
}
const tempUnits = ['°C', '°F', 'K', '°R'];

const UnitConversionCalculator: React.FC = () => {
    const [category, setCategory] = useState<string>('Pressure');
    const [fromValue, setFromValue] = useState('1');
    const [toValue, setToValue] = useState('');
    const [fromUnit, setFromUnit] = useState('bar');
    const [toUnit, setToUnit] = useState('psi');
    const [activeField, setActiveField] = useState<'from' | 'to'>('from');

    const performConversion = useCallback(() => {
        const valueToConvert = parseFloat(activeField === 'from' ? fromValue : toValue);
        const sourceUnit = activeField === 'from' ? fromUnit : toUnit;
        const targetUnit = activeField === 'from' ? toUnit : fromUnit;
        
        if (isNaN(valueToConvert)) {
            if(activeField === 'from') setToValue('');
            else setFromValue('');
            return;
        }

        let result;
        if (category === 'Temperature') {
            result = convertTemperature(valueToConvert, sourceUnit, targetUnit);
        } else {
            const categoryData = unitData[category];
            const valueInBase = valueToConvert * categoryData.units[sourceUnit];
            result = valueInBase / categoryData.units[targetUnit];
        }
        
        if (isNaN(result)) return;

        const formattedResult = result.toPrecision(6);
        if (activeField === 'from') {
            setToValue(formattedResult);
        } else {
            setFromValue(formattedResult);
        }
    }, [fromValue, toValue, fromUnit, toUnit, category, activeField]);

    useEffect(() => {
        performConversion();
    }, [performConversion]);

    useEffect(() => {
        const units = category === 'Temperature' ? tempUnits : Object.keys(unitData[category].units);
        setFromUnit(units[0]);
        setToUnit(units[1] || units[0]);
        setFromValue('1');
        setActiveField('from');
    }, [category]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
    };

    const handleValueChange = (field: 'from' | 'to') => (e: React.ChangeEvent<HTMLInputElement>) => {
        setActiveField(field);
        if (field === 'from') {
            setFromValue(e.target.value);
        } else {
            setToValue(e.target.value);
        }
    };
    
    const handleUnitChange = (field: 'from' | 'to') => (e: React.ChangeEvent<HTMLSelectElement>) => {
       if (field === 'from') {
           setFromUnit(e.target.value);
       } else {
           setToUnit(e.target.value);
       }
       // Recalculate based on the 'from' value whenever a unit changes
       setActiveField('from');
    };

    const currentUnits = category === 'Temperature' ? tempUnits : Object.keys(unitData[category].units);

    return (
        <CalculatorCard title="Comprehensive Unit Conversion">
            <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Measurement Type
                </label>
                <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={handleCategoryChange}
                    className="w-full rounded-md bg-gray-100 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 text-gray-900 dark:text-white p-2.5"
                >
                    {Object.keys(unitData).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    <option key="Temperature" value="Temperature">Temperature</option>
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <InputField
                    label="From"
                    name="from"
                    value={fromValue}
                    onChange={handleValueChange('from')}
                    units={currentUnits}
                    unit={fromUnit}
                    onUnitChange={handleUnitChange('from')}
                    unitName="fromUnit"
                />
                <div className="flex items-center justify-center text-2xl font-bold text-gray-400 dark:text-gray-500 pt-6">
                   ⇌
                </div>
                <InputField
                    label="To"
                    name="to"
                    value={toValue}
                    onChange={handleValueChange('to')}
                    units={currentUnits}
                    unit={toUnit}
                    onUnitChange={handleUnitChange('to')}
                    unitName="toUnit"
                />
            </div>
        </CalculatorCard>
    );
};

export default UnitConversionCalculator;