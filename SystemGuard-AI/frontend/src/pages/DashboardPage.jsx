import React, { useEffect, useState, useCallback } from 'react';
import { useAuth }     from '../context/AuthContext';
import socket, { connectSocket, disconnectSocket } from '../api/socket';
import api             from '../api/axiosConfig';

import Sidebar         from '../components/Dashboard/Sidebar';
import Header          from '../components/Dashboard/Header';
import MetricCard      from '../components/Dashboard/MetricCard';
import LiveChart       from '../components/Charts/LiveChart';
import ServicesPanel   from '../components/Services/ServicesPanel';
import AlertsPanel     from '../components/Alerts/AlertsPanel';
import SecurityPanel   from '../components/Security/SecurityPanel';
import AIHealthScore   from '../components/AI/AIHealthScore';

const MAX_HISTORY = 30;

const DashboardPage = () => {
  const { user, logout } = useAuth();

  // ── Metrics state ─────────────────────────────────────────────────────────
  const [metrics,        setMetrics]        = useState({ cpu: 0, ram: 0, disk: 0, networkIn: 0, networkOut: 0, healthScore: 100 });
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [socketStatus,   setSocketStatus]   = useState('connecting');

  // ── Panel state ───────────────────────────────────────────────────────────
  const [services,  setServices]  = useState([]);
  const [alerts,    setAlerts]    = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // ── Initial data fetch ────────────────────────────────────────────────────
  const fetchInitialData = useCallback(async () => {
    try {
      const [svcRes, alertRes, historyRes] = await Promise.all([
        api.get('/api/services'),
        api.get('/api/alerts'),
        api.get('/api/system/history?limit=30'),
      ]);
      setServices(svcRes.data.data  || []);
      setAlerts(alertRes.data.data  || []);
      setMetricsHistory(historyRes.data.data || []);
    } catch (err) {
      console.error('Initial data fetch error:', err.message);
    }
  }, []);

  // ── Socket.io setup ───────────────────────────────────────────────────────
  useEffect(() => {
    fetchInitialData();

    connectSocket();

    socket.on('connect',    () => setSocketStatus('connected'));
    socket.on('disconnect', () => setSocketStatus('disconnected'));
    socket.on('connect_error', () => setSocketStatus('error'));

    socket.on('system:metrics', (data) => {
      setMetrics(data);
      setMetricsHistory(prev => {
        const updated = [...prev, { ...data, timestamp: new Date() }];
        return updated.slice(-MAX_HISTORY);
      });
    });

    socket.on('alert:new', (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 50));
    });

    socket.on('service:status', (updated) => {
      setServices(prev => prev.map(s => s._id === updated._id ? updated : s));
    });

    return () => {
      disconnectSocket();
      socket.off('system:metrics');
      socket.off('alert:new');
      socket.off('service:status');
    };
  }, [fetchInitialData]);

  const unreadAlerts = alerts.filter(a => !a.isRead).length;

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} unreadAlerts={unreadAlerts} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} logout={logout} socketStatus={socketStatus} />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {activeTab === 'overview' && (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="CPU Usage"    value={metrics.cpu}    unit="%" color="indigo" icon="cpu"     warn={80} crit={90} />
                <MetricCard label="RAM Usage"    value={metrics.ram}    unit="%" color="purple" icon="memory"  warn={80} crit={90} />
                <MetricCard label="Disk Usage"   value={metrics.disk}   unit="%" color="cyan"   icon="disk"    warn={85} crit={95} />
                <MetricCard label="Network In"   value={metrics.networkIn} unit="KB/s" color="emerald" icon="network" />
              </div>

              {/* AI Health + Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card">
                  <h3 className="text-lg font-semibold text-white mb-4">Live System Metrics</h3>
                  <LiveChart data={metricsHistory} />
                </div>
                <AIHealthScore score={metrics.healthScore} metrics={metrics} />
              </div>

              {/* Services + Alerts preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ServicesPanel services={services.slice(0, 5)} compact />
                <AlertsPanel   alerts={alerts.slice(0, 5)}     compact setAlerts={setAlerts} />
              </div>
            </>
          )}

          {activeTab === 'services' && (
            <ServicesPanel services={services} setServices={setServices} />
          )}

          {activeTab === 'alerts' && (
            <AlertsPanel alerts={alerts} setAlerts={setAlerts} />
          )}

          {activeTab === 'security' && (
            <SecurityPanel />
          )}

        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
