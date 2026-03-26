import React from 'react';
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="text-gray-400 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-gray-300 capitalize">{p.name}:</span>
          <span className="text-white font-semibold">{p.value?.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
};

const LiveChart = ({ data = [] }) => {
  const chartData = data.map((d, i) => ({
    time: i === data.length - 1 ? 'Now' : `-${data.length - 1 - i}s`,
    cpu:  d.cpu,
    ram:  d.ram,
    disk: d.disk,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '12px', color: '#9ca3af', paddingTop: '8px' }}
          formatter={(value) => <span className="capitalize">{value}</span>}
        />
        <Line type="monotone" dataKey="cpu"  stroke="#6366f1" strokeWidth={2} dot={false} name="CPU"  isAnimationActive={false} />
        <Line type="monotone" dataKey="ram"  stroke="#a855f7" strokeWidth={2} dot={false} name="RAM"  isAnimationActive={false} />
        <Line type="monotone" dataKey="disk" stroke="#06b6d4" strokeWidth={2} dot={false} name="Disk" isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LiveChart;
