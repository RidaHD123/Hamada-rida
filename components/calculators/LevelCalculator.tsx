import React, { useState, useEffect } from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { InputField } from '../InputField';
import { AiAssistant } from '../AiAssistant';

const shapeOptions = ['Cylindrical (Vertical)', 'Cylindrical (Horizontal)', 'Rectangular', 'Spherical'];

const LevelCalculator: React.FC = () => {
    const [inputs, setInputs] = useState({
        shape: 'Cylindrical (Vertical)',
        diameter: '2',
        height: '5',
        level: '3',
        density: '1000' // kg/m³ for water
    });
    const [volume, setVolume] = useState<number | null>(null);
    const [mass, setMass] = useState<number | null>(null);

    useEffect(() => {
        const d = parseFloat(inputs.diameter);
        const h = parseFloat(inputs.height);
        const l = parseFloat(inputs.level);
        const rho = parseFloat(inputs.density);

        if ([d, h, l, rho].some(isNaN)) {
            setVolume(null);
            setMass(null);
            return;
        }

        let calculatedVolume = 0;
        if (inputs.shape === 'Cylindrical (Vertical)') {
            const radius = d / 2;
            calculatedVolume = Math.PI * Math.pow(radius, 2) * l;
        }
        // Placeholder for other shapes
        // else if (inputs.shape === 'Rectangular') { ... }

        setVolume(calculatedVolume);
        setMass(calculatedVolume * rho);

    }, [inputs]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const generatePrompt = () => {
        return `As an instrumentation expert, I am calculating the fluid volume and mass in a ${inputs.shape} tank.
        - Diameter: ${inputs.diameter} m
        - Total Height: ${inputs.height} m
        - Measured Fluid Level: ${inputs.level} m
        - Fluid Density: ${inputs.density} kg/m³
        My calculation shows a volume of ${volume?.toFixed(3)} m³ and a mass of ${mass?.toFixed(3)} kg.
        Please verify the formula for a vertical cylindrical tank and explain any important considerations, such as sensor placement, temperature effects on density, or tank end-cap shapes (dished ends).`;
    };

    return (
        <CalculatorCard title="Tank Level, Volume & Mass">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="shape" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tank Shape</label>
                    <select name="shape" id="shape" value={inputs.shape} onChange={handleSelectChange} className="w-full rounded-md bg-gray-100 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 text-gray-900 dark:text-white p-2.5">
                        {shapeOptions.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                </div>
                <InputField label="Diameter (m)" name="diameter" value={inputs.diameter} onChange={handleInputChange} />
                <InputField label="Total Height (m)" name="height" value={inputs.height} onChange={handleInputChange} />
                <InputField label="Fluid Level (m)" name="level" value={inputs.level} onChange={handleInputChange} />
                <InputField label="Fluid Density (kg/m³)" name="density" value={inputs.density} onChange={handleInputChange} />
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-gray-600 dark:text-gray-400">Calculated Volume:</p>
                    <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{volume?.toFixed(3) ?? '...'} <span className="text-xl">m³</span></p>
                </div>
                <div>
                    <p className="text-gray-600 dark:text-gray-400">Calculated Mass:</p>
                    <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{mass?.toFixed(3) ?? '...'} <span className="text-xl">kg</span></p>
                </div>
            </div>
            <AiAssistant promptGenerator={generatePrompt} />
        </CalculatorCard>
    );
};

export default LevelCalculator;