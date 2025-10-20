import React, { useState, useEffect } from 'react';
import { CalculatorCard } from '../CalculatorCard';
import { InputField } from '../InputField';

const SignalCalculator: React.FC = () => {
  const [lrv, setLrv] = useState('0');
  const [urv, setUrv] = useState('100');
  const [value, setValue] = useState('');
  const [mA, setMA] = useState('');
  const [percent, setPercent] = useState('');

  useEffect(() => {
    const lrvNum = parseFloat(lrv);
    const urvNum = parseFloat(urv);
    if (isNaN(lrvNum) || isNaN(urvNum) || lrvNum >= urvNum) {
      return;
    }
    const span = urvNum - lrvNum;

    if (document.activeElement?.id === 'value') {
        const valNum = parseFloat(value);
        if(isNaN(valNum)) return;
        const p = ((valNum - lrvNum) / span) * 100;
        setPercent(p.toFixed(2));
        setMA((4 + (p / 100) * 16).toFixed(2));
    } else if (document.activeElement?.id === 'mA') {
        const mANum = parseFloat(mA);
        if(isNaN(mANum) || mANum < 4 || mANum > 20) return;
        const p = ((mANum - 4) / 16) * 100;
        setPercent(p.toFixed(2));
        setValue((lrvNum + (p/100) * span).toFixed(2));
    } else if (document.activeElement?.id === 'percent') {
        const pNum = parseFloat(percent);
        if(isNaN(pNum) || pNum < 0 || pNum > 100) return;
        setMA((4 + (pNum / 100) * 16).toFixed(2));
        setValue((lrvNum + (pNum/100) * span).toFixed(2));
    }

  }, [lrv, urv, value, mA, percent]);

  return (
    <CalculatorCard title="4-20mA Analog Signal Conversion">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Lower Range Value (LRV)" name="lrv" value={lrv} onChange={(e) => setLrv(e.target.value)} />
          <InputField label="Upper Range Value (URV)" name="urv" value={urv} onChange={(e) => setUrv(e.target.value)} />
        </div>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Enter a value in any field to calculate the others.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Process Value" name="value" id="value" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 50" />
                <InputField label="Percentage (%)" name="percent" id="percent" value={percent} onChange={(e) => setPercent(e.target.value)} placeholder="e.g. 50" />
                <InputField label="Current (mA)" name="mA" id="mA" value={mA} onChange={(e) => setMA(e.target.value)} placeholder="e.g. 12" />
            </div>
        </div>
      </div>
    </CalculatorCard>
  );
};

export default SignalCalculator;