import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea
} from 'recharts';
import { CalculatorCard } from '../CalculatorCard';
import { InputField } from '../InputField';
import { AiAssistant } from '../AiAssistant';

type TuningRule = 'Z-N P' | 'Z-N PI' | 'Z-N PID';
type PIDParams = { Kp: number; Ti: number; Td: number; };
type SavedConfig = { name: string; ku: string; tu: string; rule: TuningRule; };
type SimDataPoint = { time: number; setpoint: number; pv: number; };

// PID Simulation Logic
const runPIDSimulation = (params: PIDParams): SimDataPoint[] => {
  const { Kp, Ti, Td } = params;
  if (Kp === 0) return [];

  // Simulation Constants
  const dt = 0.1; // Time step
  const totalTime = 100;
  const setpoint = 1;

  // Process Model (Second Order System: T_p1*T_p2*y'' + (T_p1+T_p2)*y' + y = K_p*u)
  const K_p = 1;
  const T_p1 = 5;
  const T_p2 = 2;

  // PID Controller State
  let error = 0, lastError = 0, integral = 0, derivative = 0;
  
  // Process State
  let pv = 0, pv_dot = 0, pv_ddot = 0;

  const data: SimDataPoint[] = [];

  for (let t = 0; t <= totalTime; t += dt) {
    data.push({ time: t, setpoint: t < 1 ? 0 : setpoint, pv });

    error = (t < 1 ? 0 : setpoint) - pv;
    integral += error * dt;
    if(Ti > 0) integral = Math.max(-10, Math.min(10, integral)); // Anti-windup
    derivative = (error - lastError) / dt;

    const Ki = Ti > 0 ? Kp / Ti : 0;
    const Kd = Kp * Td;
    
    let controllerOutput = Kp * error + Ki * integral + Kd * derivative;
    controllerOutput = Math.max(0, Math.min(2, controllerOutput)); // Clamp output

    // Update Process
    pv_ddot = (K_p * controllerOutput - (T_p1 + T_p2) * pv_dot - pv) / (T_p1 * T_p2);
    pv_dot += pv_ddot * dt;
    pv += pv_dot * dt;
    
    lastError = error;
  }
  return data;
};

const PidCalculator: React.FC = () => {
    const [inputs, setInputs] = useState({ ku: '2.2', tu: '20', rule: 'Z-N PID' as TuningRule });
    const [pidParams, setPidParams] = useState<PIDParams>({ Kp: 0, Ti: 0, Td: 0 });
    const [simulationData, setSimulationData] = useState<SimDataPoint[]>([]);
    
    // Save/Load State
    const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
    const [configName, setConfigName] = useState('');

    // Chart Zoom State
    const [zoomDomain, setZoomDomain] = useState<{ x1?: number; x2?: number; }>({});
    const [isZooming, setIsZooming] = useState(false);
    
    useEffect(() => {
        const stored = localStorage.getItem('pid-configs');
        if(stored) setSavedConfigs(JSON.parse(stored));
    }, []);

    useEffect(() => {
        const ku = parseFloat(inputs.ku);
        const tu = parseFloat(inputs.tu);
        if (isNaN(ku) || isNaN(tu) || ku <= 0 || tu <= 0) {
            setPidParams({ Kp: 0, Ti: 0, Td: 0 });
            return;
        }

        let params: PIDParams = { Kp: 0, Ti: Infinity, Td: 0 };
        switch (inputs.rule) {
            case 'Z-N P':   params = { Kp: 0.5 * ku, Ti: Infinity, Td: 0 }; break;
            case 'Z-N PI':  params = { Kp: 0.45 * ku, Ti: tu / 1.2, Td: 0 }; break;
            case 'Z-N PID': params = { Kp: 0.6 * ku, Ti: tu / 2, Td: tu / 8 }; break;
        }
        setPidParams(params);
    }, [inputs]);
    
    useEffect(() => {
        setSimulationData(runPIDSimulation(pidParams));
    }, [pidParams]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        if (!configName) { alert('Please enter a name for the configuration.'); return; }
        const newConfig: SavedConfig = { name: configName, ...inputs };
        const updatedConfigs = [...savedConfigs, newConfig];
        setSavedConfigs(updatedConfigs);
        localStorage.setItem('pid-configs', JSON.stringify(updatedConfigs));
        setConfigName('');
    };

    const handleLoad = (config: SavedConfig) => {
        setInputs({ ku: config.ku, tu: config.tu, rule: config.rule });
    };

    const handleDelete = (name: string) => {
        const updatedConfigs = savedConfigs.filter(c => c.name !== name);
        setSavedConfigs(updatedConfigs);
        localStorage.setItem('pid-configs', JSON.stringify(updatedConfigs));
    };
    
    const resetZoom = () => {
        setZoomDomain({});
    };

    const generatePrompt = () => {
        return `I am tuning a PID controller using the ${inputs.rule} method. My ultimate gain (Ku) is ${inputs.ku} and my ultimate period (Tu) is ${inputs.tu}.
This results in the following parameters: Kp=${pidParams.Kp.toFixed(3)}, Ti=${isFinite(pidParams.Ti) ? pidParams.Ti.toFixed(3) : 'N/A'}, Td=${pidParams.Td.toFixed(3)}.
Based on the simulated response graph, what can you tell me about the performance of this tuning? Are there signs of overshoot, oscillation, or slow response time? What might be the next step to fine-tune these parameters manually?`;
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1 space-y-6">
                <CalculatorCard title="PID Tuning Inputs">
                    <div className="space-y-4">
                        <InputField label="Ultimate Gain (Ku)" name="ku" value={inputs.ku} onChange={handleInputChange} />
                        <InputField label="Ultimate Period (Tu)" name="tu" value={inputs.tu} onChange={handleInputChange} />
                        <div>
                            <label htmlFor="rule" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tuning Rule</label>
                            <select name="rule" id="rule" value={inputs.rule} onChange={handleInputChange} className="w-full rounded-md bg-gray-100 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 text-gray-900 dark:text-white p-2.5">
                                <option>Z-N P</option>
                                <option>Z-N PI</option>
                                <option>Z-N PID</option>
                            </select>
                        </div>
                    </div>
                </CalculatorCard>

                <CalculatorCard title="Calculated Parameters">
                     <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Kp (Gain)</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{pidParams.Kp.toFixed(3)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Ti (Integral)</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{isFinite(pidParams.Ti) ? pidParams.Ti.toFixed(3) : '∞'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Td (Derivative)</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{pidParams.Td.toFixed(3)}</p>
                        </div>
                    </div>
                    <AiAssistant promptGenerator={generatePrompt} />
                </CalculatorCard>

                 <CalculatorCard title="Save/Load Configurations">
                    <div className="space-y-4">
                         <div className="flex space-x-2">
                             <InputField label="Config Name" name="configName" value={configName} onChange={(e) => setConfigName(e.target.value)} placeholder="e.g., Pump 1 Tuning"/>
                             <button onClick={handleSave} className="mt-6 self-end px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 h-fit">Save</button>
                         </div>
                         <div className="space-y-2 max-h-40 overflow-y-auto">
                            {savedConfigs.map(c => (
                                <div key={c.name} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700/50 rounded-md">
                                    <span className="text-sm font-medium">{c.name}</span>
                                    <div className="space-x-2">
                                        <button onClick={() => handleLoad(c)} className="text-xs text-cyan-600 hover:underline">Load</button>
                                        <button onClick={() => handleDelete(c.name)} className="text-xs text-red-500 hover:underline">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CalculatorCard>
            </div>
            
            <div className="xl:col-span-2">
                <CalculatorCard title="Process Response Simulation">
                    <div className="h-[600px] w-full relative">
                        <ResponsiveContainer>
                            <LineChart 
                                data={simulationData}
                                onMouseDown={(e: any) => { if(e) { setIsZooming(true); setZoomDomain({ x1: e.activeLabel }); }}}
                                onMouseMove={(e: any) => { if(isZooming && e) setZoomDomain(prev => ({ ...prev, x2: e.activeLabel })); }}
                                onMouseUp={() => { setIsZooming(false); }}
                            >
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                <XAxis dataKey="time" type="number" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} domain={zoomDomain.x1 && zoomDomain.x2 ? [Math.min(zoomDomain.x1, zoomDomain.x2), Math.max(zoomDomain.x1, zoomDomain.x2)] : ['dataMin', 'dataMax']} allowDataOverflow/>
                                <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft' }} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="pv" name="Process Variable" stroke="#8884d8" dot={false} strokeWidth={2} />
                                <Line type="step" dataKey="setpoint" name="Setpoint" stroke="#82ca9d" dot={false} strokeWidth={2} />
                                {zoomDomain.x1 && zoomDomain.x2 && (
                                    <ReferenceArea x1={zoomDomain.x1} x2={zoomDomain.x2} strokeOpacity={0.3} />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                        <button onClick={resetZoom} className="absolute top-2 right-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded-md">Reset Zoom</button>
                    </div>
                </CalculatorCard>
            </div>
        </div>
    );
};

export default PidCalculator;
