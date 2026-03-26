import React from 'react';
import { Shield, LayoutDashboard, Server, Bell, Lock, Activity } from 'lucide-react';

const NAV = [
  { id: 'overview',  label: 'Overview',  icon: LayoutDashboard },
  { id: 'services',  label: 'Services',  icon: Server },
  { id: 'alerts',    label: 'Alerts',    icon: Bell },
  { id: 'security',  label: 'Security',  icon: Lock },
];

const Sidebar = ({ activeTab, setActiveTab, unreadAlerts }) => (
  <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col py-6 px-3 shrink-0">
    {/* Logo */}
    <div className="flex items-center gap-3 px-3 mb-8">
      <div className="w-9 h-9 bg-indigo-600/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
        <Shield className="w-5 h-5 text-indigo-400" />
      </div>
      <div>
        <p className="text-white font-bold text-sm leading-none">SystemGuard</p>
        <p className="text-indigo-400 text-xs font-semibold">AI Platform</p>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 space-y-1">
      {NAV.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${active
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
            {id === 'alerts' && unreadAlerts > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {unreadAlerts > 99 ? '99+' : unreadAlerts}
              </span>
            )}
          </button>
        );
      })}
    </nav>

    {/* Status dot */}
    <div className="px-3 pt-4 border-t border-gray-800">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Activity className="w-3 h-3 text-emerald-400" />
        <span>Monitoring Active</span>
      </div>
    </div>
  </aside>
);

export default Sidebar;
