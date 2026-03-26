import React from 'react';
import { Bell, CheckCheck, XCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import api from '../../api/axiosConfig';

const typeConfig = {
  critical: { icon: XCircle,        color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20' },
  warning:  { icon: AlertTriangle,  color: 'text-yellow-400',  bg: 'bg-yellow-500/10 border-yellow-500/20' },
  success:  { icon: CheckCircle2,   color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  info:     { icon: Info,           color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20' },
};

const timeAgo = (date) => {
  const secs = Math.floor((Date.now() - new Date(date)) / 1000);
  if (secs < 60)   return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
};

const AlertsPanel = ({ alerts = [], setAlerts, compact = false }) => {
  const markAllRead = async () => {
    try {
      await api.put('/api/alerts/read-all');
      if (setAlerts) setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
    } catch (err) {
      console.error(err.message);
    }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/api/alerts/${id}/read`);
      if (setAlerts) setAlerts(prev => prev.map(a => a._id === id ? { ...a, isRead: true } : a));
    } catch (err) {
      console.error(err.message);
    }
  };

  const unread = alerts.filter(a => !a.isRead).length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-400" />
          <h3 className="text-white font-semibold">Alerts</h3>
          {unread > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{unread}</span>
          )}
        </div>
        {!compact && unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-400 transition">
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">No alerts yet.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {alerts.map((alert) => {
            const cfg  = typeConfig[alert.type] || typeConfig.info;
            const Icon = cfg.icon;
            return (
              <div
                key={alert._id}
                onClick={() => !alert.isRead && markRead(alert._id)}
                className={`flex gap-3 p-3 rounded-xl border text-sm cursor-pointer transition ${cfg.bg} ${alert.isRead ? 'opacity-50' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${cfg.color}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium truncate">{alert.title}</p>
                  {!compact && <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{alert.message}</p>}
                  <p className="text-gray-600 text-xs mt-1">{timeAgo(alert.createdAt)}</p>
                </div>
                {!alert.isRead && <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-1.5" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
