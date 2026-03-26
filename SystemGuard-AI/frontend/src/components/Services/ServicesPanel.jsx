import React, { useState } from 'react';
import { Server, RefreshCw, Plus, Trash2, CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const StatusBadge = ({ status }) => {
  const cfg = {
    online:      { icon: CheckCircle2, label: 'Online',      cls: 'badge-online' },
    offline:     { icon: XCircle,      label: 'Offline',     cls: 'badge-offline' },
    restarting:  { icon: Loader2,      label: 'Restarting',  cls: 'badge-warning', spin: true },
    unknown:     { icon: Clock,        label: 'Unknown',     cls: 'badge-warning' },
  }[status] || { icon: Clock, label: status, cls: 'badge-warning' };

  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.cls}`}>
      <Icon className={`w-3 h-3 ${cfg.spin ? 'animate-spin' : ''}`} />
      {cfg.label}
    </span>
  );
};

const ServicesPanel = ({ services = [], setServices, compact = false }) => {
  const { isAdmin }   = useAuth();
  const [loading, setLoading] = useState({});

  const handleRestart = async (id) => {
    setLoading(l => ({ ...l, [id]: true }));
    try {
      const { data } = await api.put(`/api/services/${id}/restart`);
      if (setServices) setServices(prev => prev.map(s => s._id === id ? data.data : s));
    } catch (err) {
      console.error('Restart error:', err.message);
    } finally {
      setLoading(l => ({ ...l, [id]: false }));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this service?')) return;
    try {
      await api.delete(`/api/services/${id}`);
      if (setServices) setServices(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error('Delete error:', err.message);
    }
  };

  return (
    <div className={compact ? 'card' : 'card'}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-400" />
          <h3 className="text-white font-semibold">Services {compact ? '' : `(${services.length})`}</h3>
        </div>
        {!compact && isAdmin && (
          <button className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        )}
      </div>

      {services.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">No services configured.</p>
      ) : (
        <div className="space-y-2">
          {services.map((svc) => (
            <div key={svc._id} className="flex items-center justify-between bg-gray-800/50 rounded-xl px-4 py-3 border border-gray-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${svc.status === 'online' ? 'bg-emerald-400' : svc.status === 'restarting' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'}`} />
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{svc.name}</p>
                  {!compact && <p className="text-gray-500 text-xs truncate">{svc.endpoint || svc.processName || svc.type}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={svc.status} />
                {!compact && isAdmin && (
                  <>
                    <button onClick={() => handleRestart(svc._id)} disabled={loading[svc._id]}
                      className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition" title="Restart">
                      <RefreshCw className={`w-4 h-4 ${loading[svc._id] ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={() => handleDelete(svc._id)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition" title="Remove">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPanel;
