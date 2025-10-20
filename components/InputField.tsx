import React from 'react';

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  unit?: string;
  onUnitChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  units?: string[];
  name: string;
  unitName?: string;
  type?: string;
  placeholder?: string;
  // FIX: Added optional id prop to fix type errors in SignalCalculator.
  id?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, value, onChange, unit, onUnitChange, units, name, unitName, type = 'number', placeholder, id
}) => {
  // FIX: Use id if provided, otherwise fallback to name for accessibility.
  const inputId = id || name;
  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="flex rounded-md shadow-sm">
        <input
          type={type}
          name={name}
          id={inputId}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 block w-full min-w-0 rounded-none rounded-l-md bg-gray-100 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm p-2.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        {units && onUnitChange && (
          <select
            name={unitName}
            value={unit}
            onChange={onUnitChange}
            className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm focus:ring-cyan-500 focus:border-cyan-500"
          >
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};