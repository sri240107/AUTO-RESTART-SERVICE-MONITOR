import React from 'react';
import { Cpu, HardDrive, MemoryStick, Wifi } from 'lucide-react';

const icons = { cpu: Cpu, memory: MemoryStick, disk: HardDrive, network: Wifi };

const colorMap = {
  indigo:  { bar: 'bg-indigo-500',  ring: 'text-indigo-400',  bg: 'bg-indigo-500/10' },
  purple:  { bar: 'bg-purple-500',  ring: 'text-purple-400',  bg: 'bg-purple-500/10' },
  cyan:    { bar: 'bg-cyan-500',    ring: 'text-cyan-400',    bg: 'bg-cyan-500/10' },
  emerald: { bar: 'bg-emerald-500', ring: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  red:     { bar: 'bg-red-500',     ring: 'text-red-400',     bg: 'bg-red-500/10' },
  yellow:  { bar: 'bg-yellow-500',  ring: 'text-yellow-400',  bg: 'bg-yellow-500/10' },
};

const MetricCard = ({ label, value = 0, unit = '%', color = 'indigo', icon = 'cpu', warn = 70, crit = 90 }) => {
  const Icon = icons[icon] || Cpu;
  const clr  = value >= crit ? colorMap.red : value >= warn ? colorMap.yellow : colorMap[color] || colorMap.indigo;
  const pct  = unit === '%' ? Math.min(value, 100) : null;

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-sm font-medium">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${clr.bg}`}>
          <Icon className={`w-4 h-4 ${clr.ring}`} />
        </div>
      </div>

      <div>
        <span className={`text-3xl font-bold ${clr.ring}`}>{typeof value === 'number' ? value.toFixed(1) : value}</span>
        <span className="text-gray-500 text-sm ml-1">{unit}</span>
      </div>

      {pct !== null && (
        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${clr.bar}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default MetricCard;
