import React from 'react';
import { Bot, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const getScoreConfig = (score) => {
  if (score >= 80) return { label: 'Excellent',  color: 'text-emerald-400', ring: 'stroke-emerald-500', bg: 'bg-emerald-500/10' };
  if (score >= 60) return { label: 'Good',       color: 'text-yellow-400',  ring: 'stroke-yellow-500',  bg: 'bg-yellow-500/10' };
  if (score >= 40) return { label: 'Warning',    color: 'text-orange-400',  ring: 'stroke-orange-500',  bg: 'bg-orange-500/10' };
  return              { label: 'Critical',   color: 'text-red-400',     ring: 'stroke-red-500',     bg: 'bg-red-500/10' };
};

const getInsights = (metrics) => {
  const insights = [];
  if (metrics.cpu  > 85) insights.push({ msg: 'CPU under heavy load',   icon: TrendingUp,   color: 'text-red-400' });
  if (metrics.ram  > 80) insights.push({ msg: 'RAM usage is high',      icon: TrendingUp,   color: 'text-orange-400' });
  if (metrics.disk > 90) insights.push({ msg: 'Disk almost full',       icon: TrendingUp,   color: 'text-red-400' });
  if (metrics.cpu  < 30) insights.push({ msg: 'CPU running efficiently', icon: TrendingDown, color: 'text-emerald-400' });
  if (!insights.length)  insights.push({ msg: 'All systems nominal',    icon: Minus,        color: 'text-gray-400' });
  return insights.slice(0, 3);
};

const AIHealthScore = ({ score = 100, metrics = {} }) => {
  const cfg      = getScoreConfig(score);
  const insights = getInsights(metrics);

  // SVG ring
  const r   = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Bot className="w-5 h-5 text-indigo-400" />
        <h3 className="text-white font-semibold">AI Health Score</h3>
      </div>

      {/* Ring gauge */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r={r} fill="none" stroke="#1f2937" strokeWidth="10" />
            <circle
              cx="64" cy="64" r={r} fill="none"
              className={cfg.ring}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-black ${cfg.color}`}>{score}</span>
            <span className="text-gray-500 text-xs">/ 100</span>
          </div>
        </div>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
          {cfg.label}
        </span>
      </div>

      {/* Insights */}
      <div className="space-y-2 pt-2 border-t border-gray-800">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">AI Insights</p>
        {insights.map((ins, i) => {
          const Icon = ins.icon;
          return (
            <div key={i} className="flex items-center gap-2 text-xs">
              <Icon className={`w-3.5 h-3.5 shrink-0 ${ins.color}`} />
              <span className="text-gray-300">{ins.msg}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIHealthScore;
