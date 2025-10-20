import React, { useState, useEffect } from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { InputField } from '../InputField';
import { AiAssistant } from '../AiAssistant';

type Status = 'idle' | 'in-tolerance' | 'out-of-tolerance';

const CalibrationCalculator: React.FC = () => {
    const [inputs, setInputs] = useState({
        setpoint: '50.0',
        measured: '50.5',
        span: '100.0', // e.g., for a 0-100 psi transmitter
        tolerance: '1.0', // in percent
    });

    const [results, setResults] = useState({
        error: '',
        errorPercent: '',
        status: 'idle' as Status,
    });

    useEffect(() => {
        const setpointNum = parseFloat(inputs.setpoint);
        const measuredNum = parseFloat(inputs.measured);
        const spanNum = parseFloat(inputs.span);
        const toleranceNum = parseFloat(inputs.tolerance);

        if ([setpointNum, measuredNum, spanNum, toleranceNum].some(isNaN) || spanNum <= 0) {
            setResults({ error: '', errorPercent: '', status: 'idle' });
            return;
        }

        const error = measuredNum - setpointNum;
        const errorPercent = (error / spanNum) * 100;
        const status: Status = Math.abs(errorPercent) <= toleranceNum ? 'in-tolerance' : 'out-of-tolerance';

        setResults({
            error: error.toFixed(3),
            errorPercent: errorPercent.toFixed(3),
            status,
        });

    }, [inputs]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const generatePrompt = () => {
        const statusText = results.status === 'in-tolerance' ? "is within the acceptable tolerance" : "is outside the acceptable tolerance";
        return `I am performing a calibration check on an instrument.
- The setpoint (ideal value) is ${inputs.setpoint}.
- The instrument's measured value is ${inputs.measured}.
- The total instrument span is ${inputs.span}.
- The acceptable tolerance is ±${inputs.tolerance}%.
My calculations show an error of ${results.error} units, which is ${results.errorPercent}% of the span. This means the instrument ${statusText}.
Based on this result, what are my next steps? If it's out of tolerance, what are common adjustment procedures (e.g., zero/span adjustment)? If it's in tolerance, should I still document the 'as-found' values?`;
    };
    
    const statusStyles: { [key in Status]: { text: string, darkText: string, bg: string, darkBg: string, label: string } } = {
        'idle': { text: 'text-gray-800', darkText: 'dark:text-gray-400', bg: 'bg-gray-200', darkBg: 'dark:bg-gray-700/50', label: 'Awaiting valid inputs...' },
        'in-tolerance': { text: 'text-green-800', darkText: 'dark:text-green-300', bg: 'bg-green-100', darkBg: 'dark:bg-green-500/20', label: 'In Tolerance (Pass)' },
        'out-of-tolerance': { text: 'text-red-800', darkText: 'dark:text-red-300', bg: 'bg-red-100', darkBg: 'dark:bg-red-500/20', label: 'Out of Tolerance (Fail)' },
    };
    const currentStatus = statusStyles[results.status];

    return (
        <CalculatorCard title="Calibration Error & Tolerance">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InputField label="Setpoint (Ideal Value)" name="setpoint" value={inputs.setpoint} onChange={handleInputChange} />
                <InputField label="Measured Value" name="measured" value={inputs.measured} onChange={handleInputChange} />
                <InputField label="Instrument Span" name="span" value={inputs.span} onChange={handleInputChange} placeholder="e.g., URV - LRV" />
                <InputField label="Tolerance (%)" name="tolerance" value={inputs.tolerance} onChange={handleInputChange} />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Calibration Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Absolute Error</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{results.error || '...'}</p>
                    </div>
                    <div className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Error (% of Span)</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{results.errorPercent || '...'} <span className="text-lg text-gray-700 dark:text-gray-300">%</span></p>
                    </div>
                     <div className={`p-4 rounded-lg text-center ${currentStatus.bg} ${currentStatus.darkBg}`}>
                        <p className={`text-sm ${currentStatus.text} ${currentStatus.darkText} opacity-75`}>Status</p>
                        <p className={`text-2xl font-semibold ${currentStatus.text} ${currentStatus.darkText}`}>{currentStatus.label}</p>
                    </div>
                </div>
            </div>
            
            <AiAssistant promptGenerator={generatePrompt} />
        </CalculatorCard>
    );
};

export default CalibrationCalculator;