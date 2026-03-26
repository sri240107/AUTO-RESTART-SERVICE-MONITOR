import React from 'react';
import { LogOut, Wifi, WifiOff, Loader2 } from 'lucide-react';

const statusConfig = {
  connected:    { icon: Wifi,    color: 'text-emerald-400', label: 'Live' },
  disconnected: { icon: WifiOff, color: 'text-red-400',     label: 'Offline' },
  connecting:   { icon: Loader2, color: 'text-yellow-400',  label: 'Connecting', spin: true },
  error:        { icon: WifiOff, color: 'text-red-400',     label: 'Error' },
};

const Header = ({ user, logout, socketStatus }) => {
  const cfg = statusConfig[socketStatus] || statusConfig.connecting;
  const Icon = cfg.icon;

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
      <div>
        <h2 className="text-white font-semibold">Dashboard</h2>
        <p className="text-gray-500 text-xs">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Socket status */}
        <div className={`flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
          <Icon className={`w-3.5 h-3.5 ${cfg.spin ? 'animate-spin' : ''}`} />
          {cfg.label}
        </div>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
          <div className="w-8 h-8 bg-indigo-600/30 rounded-full flex items-center justify-center border border-indigo-500/30 text-indigo-400 font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
          </div>
          <button onClick={logout} title="Logout"
            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
