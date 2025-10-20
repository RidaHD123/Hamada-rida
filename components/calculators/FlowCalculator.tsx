import React, { useState, useEffect } from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { InputField } from '../InputField';
import { AiAssistant } from '../AiAssistant';

// Unit definitions and conversion factors to SI base units
const units = {
  diameter: { mm: 0.001, in: 0.0254 },
  velocity: { 'm/s': 1, 'ft/s': 0.3048 },
  volumetricFlow: { 'm³/h': 1 / 3600, 'L/min': 1 / 60000, gpm: 0.0000630902 },
  massFlow: { 'kg/s': 1, 'lb/min': 0.453592 / 60 },
  density: { 'kg/m³': 1, 'lb/ft³': 16.0185 },
};

type CalcMode = 'velocity' | 'volumetric' | 'mass';

const FlowCalculator: React.FC = () => {
    const [mode, setMode] = useState<CalcMode>('volumetric');

    const [inputs, setInputs] = useState({
        diameter: '100',
        diameterUnit: 'mm',
        density: '1000',
        densityUnit: 'kg/m³',
        value: '50',
    });

    const [unitsState, setUnitsState] = useState({
        velocityUnit: 'm/s',
        volumetricFlowUnit: 'm³/h',
        massFlowUnit: 'kg/s'
    });

    const [results, setResults] = useState({
        velocity: '',
        volumetricFlow: '',
        massFlow: '',
    });

    useEffect(() => {
        const diameterM = parseFloat(inputs.diameter) * (units.diameter[inputs.diameterUnit as keyof typeof units.diameter] || 0);
        const densityKgM3 = parseFloat(inputs.density) * (units.density[inputs.densityUnit as keyof typeof units.density] || 0);
        const valueNum = parseFloat(inputs.value);

        if (isNaN(diameterM) || diameterM <= 0 || isNaN(densityKgM3) || isNaN(valueNum)) {
            setResults({ velocity: '', volumetricFlow: '', massFlow: '' });
            return;
        }

        const areaM2 = Math.PI * Math.pow(diameterM / 2, 2);

        let velocitySI = 0, volumetricFlowSI = 0, massFlowSI = 0;

        if (mode === 'velocity') {
            velocitySI = valueNum * units.velocity[unitsState.velocityUnit as keyof typeof units.velocity];
            volumetricFlowSI = velocitySI * areaM2;
            massFlowSI = volumetricFlowSI * densityKgM3;
        } else if (mode === 'volumetric') {
            volumetricFlowSI = valueNum * units.volumetricFlow[unitsState.volumetricFlowUnit as keyof typeof units.volumetricFlow];
            velocitySI = volumetricFlowSI / areaM2;
            massFlowSI = volumetricFlowSI * densityKgM3;
        } else if (mode === 'mass') {
            massFlowSI = valueNum * units.massFlow[unitsState.massFlowUnit as keyof typeof units.massFlow];
            volumetricFlowSI = massFlowSI / densityKgM3;
            velocitySI = volumetricFlowSI / areaM2;
        }

        setResults({
            velocity: (velocitySI / units.velocity[unitsState.velocityUnit as keyof typeof units.velocity]).toFixed(3),
            volumetricFlow: (volumetricFlowSI / units.volumetricFlow[unitsState.volumetricFlowUnit as keyof typeof units.volumetricFlow]).toFixed(3),
            massFlow: (massFlowSI / units.massFlow[unitsState.massFlowUnit as keyof typeof units.massFlow]).toFixed(3),
        });

    }, [inputs, mode, unitsState]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (['velocityUnit', 'volumetricFlowUnit', 'massFlowUnit'].includes(name)) {
            setUnitsState(prev => ({ ...prev, [name]: value }));
        } else if (['diameterUnit', 'densityUnit'].includes(name)) {
            setInputs(prev => ({ ...prev, [name]: value }));
        }
    };

    const renderInputField = () => {
        switch (mode) {
            case 'velocity':
                return <InputField label="Fluid Velocity" name="value" value={inputs.value} onChange={handleInputChange} unit={unitsState.velocityUnit} onUnitChange={handleUnitChange} unitName="velocityUnit" units={Object.keys(units.velocity)} />;
            case 'volumetric':
                return <InputField label="Volumetric Flow Rate" name="value" value={inputs.value} onChange={handleInputChange} unit={unitsState.volumetricFlowUnit} onUnitChange={handleUnitChange} unitName="volumetricFlowUnit" units={Object.keys(units.volumetricFlow)} />;
            case 'mass':
                return <InputField label="Mass Flow Rate" name="value" value={inputs.value} onChange={handleInputChange} unit={unitsState.massFlowUnit} onUnitChange={handleUnitChange} unitName="massFlowUnit" units={Object.keys(units.massFlow)} />;
        }
    };

    const generatePrompt = () => {
        const activeUnit = mode === 'velocity' ? unitsState.velocityUnit : mode === 'volumetric' ? unitsState.volumetricFlowUnit : unitsState.massFlowUnit;
        return `I am performing a fluid flow calculation for a pipe with an inner diameter of ${inputs.diameter} ${inputs.diameterUnit}. The fluid density is ${inputs.density} ${inputs.densityUnit}. 
        My input is a ${mode} flow of ${inputs.value} ${activeUnit}.
        The calculated results are:
        - Velocity: ${results.velocity} ${unitsState.velocityUnit}
        - Volumetric Flow: ${results.volumetricFlow} ${unitsState.volumetricFlowUnit}
        - Mass Flow: ${results.massFlow} ${unitsState.massFlowUnit}
        Could you verify these calculations and provide context on the importance of accurate pipe diameter and density measurements in industrial flow applications? Also, briefly mention how a device like an orifice plate would alter this calculation.`;
    };

    return (
        <CalculatorCard title="Flow Rate Calculations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InputField label="Pipe Inner Diameter" name="diameter" value={inputs.diameter} onChange={handleInputChange} units={Object.keys(units.diameter)} unit={inputs.diameterUnit} onUnitChange={handleUnitChange} unitName="diameterUnit" />
                <InputField label="Fluid Density" name="density" value={inputs.density} onChange={handleInputChange} units={Object.keys(units.density)} unit={inputs.densityUnit} onUnitChange={handleUnitChange} unitName="densityUnit" />
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="mb-4">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Calculate from:</span>
                    <div className="flex space-x-2 rounded-md bg-gray-200 dark:bg-gray-900/50 p-1">
                        {(['volumetric', 'mass', 'velocity'] as CalcMode[]).map(m => (
                            <button key={m} onClick={() => setMode(m)} className={`w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${mode === m ? 'bg-cyan-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
                                {m.charAt(0).toUpperCase() + m.slice(1)} Flow
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    {renderInputField()}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Velocity</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{results.velocity || '...'} <span className="text-lg text-gray-600 dark:text-gray-300">{unitsState.velocityUnit}</span></p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Volumetric Flow</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{results.volumetricFlow || '...'} <span className="text-lg text-gray-600 dark:text-gray-300">{unitsState.volumetricFlowUnit}</span></p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Mass Flow</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{results.massFlow || '...'} <span className="text-lg text-gray-600 dark:text-gray-300">{unitsState.massFlowUnit}</span></p>
                    </div>
                </div>
            </div>

            <AiAssistant promptGenerator={generatePrompt} />
        </CalculatorCard>
    );
};

export default FlowCalculator;