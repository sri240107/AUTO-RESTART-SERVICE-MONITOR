import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user
    ? children
    : <Navigate to="/login" replace />;
};

// Public route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user
    ? children
    : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route
      path="/login"
      element={<PublicRoute><LoginPage /></PublicRoute>}
    />
    <Route
      path="/register"
      element={<PublicRoute><RegisterPage /></PublicRoute>}
    />
    <Route
      path="/dashboard"
      element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
    />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
