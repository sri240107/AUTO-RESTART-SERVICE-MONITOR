import React, { useEffect, useState } from 'react';
import { Lock, Shield, Unlock, RefreshCw, AlertTriangle } from 'lucide-react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const timeAgo = (date) => {
  const secs = Math.floor((Date.now() - new Date(date)) / 1000);
  if (secs < 60)    return `${secs}s ago`;
  if (secs < 3600)  return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
};

const eventColor = {
  failed_login:        'text-yellow-400',
  ip_blocked:          'text-red-400',
  ip_unblocked:        'text-emerald-400',
  suspicious_activity: 'text-orange-400',
  brute_force:         'text-red-400',
};

const SecurityPanel = () => {
  const { isAdmin }  = useAuth();
  const [logs,       setLogs]       = useState([]);
  const [blocked,    setBlocked]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [activeView, setActiveView] = useState('logs');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logsRes, blockedRes] = await Promise.all([
        api.get('/api/security/logs'),
        api.get('/api/security/blocked-ips'),
      ]);
      setLogs(logsRes.data.data       || []);
      setBlocked(blockedRes.data.data || []);
    } catch (err) {
      console.error('Security fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUnblock = async (ip) => {
    try {
      await api.delete(`/api/security/unblock/${ip}`);
      setBlocked(prev => prev.filter(b => b.ip !== ip));
    } catch (err) {
      console.error('Unblock error:', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
            <Lock className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{blocked.length}</p>
            <p className="text-gray-400 text-xs">Blocked IPs</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center border border-yellow-500/20">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{logs.filter(l => l.event === 'failed_login').length}</p>
            <p className="text-gray-400 text-xs">Failed Logins</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{logs.length}</p>
            <p className="text-gray-400 text-xs">Total Events</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {['logs', 'blocked'].map(v => (
              <button key={v} onClick={() => setActiveView(v)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition capitalize
                  ${activeView === v ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                {v === 'blocked' ? `Blocked IPs (${blocked.length})` : 'Security Logs'}
              </button>
            ))}
          </div>
          <button onClick={fetchData} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : activeView === 'logs' ? (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">No security events recorded.</p>
            ) : logs.map((log, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-800/40 rounded-xl px-4 py-3 border border-gray-800">
                <Lock className={`w-4 h-4 mt-0.5 shrink-0 ${eventColor[log.event] || 'text-gray-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-medium capitalize ${eventColor[log.event] || 'text-gray-300'}`}>
                      {log.event.replace(/_/g, ' ')}
                    </span>
                    <span className="text-gray-500 text-xs">·</span>
                    <span className="text-gray-400 text-xs font-mono">{log.ip}</span>
                  </div>
                  {log.email && <p className="text-gray-500 text-xs mt-0.5">Email: {log.email}</p>}
                  {log.attempts > 1 && <p className="text-gray-500 text-xs">Attempts: {log.attempts}</p>}
                </div>
                <span className="text-gray-600 text-xs shrink-0">{timeAgo(log.createdAt)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {blocked.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">No IPs currently blocked. ✅</p>
            ) : blocked.map((b, i) => (
              <div key={i} className="flex items-center justify-between bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">
                <div>
                  <p className="text-white font-mono text-sm">{b.ip}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {b.attempts} attempts · Blocked until {new Date(b.blockedUntil).toLocaleTimeString()}
                  </p>
                </div>
                {isAdmin && (
                  <button onClick={() => handleUnblock(b.ip)}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition border border-emerald-500/20">
                    <Unlock className="w-3.5 h-3.5" /> Unblock
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityPanel;
