import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Applications from './pages/Applications';
import Comptes from './pages/Comptes';
import Tests from './pages/Tests';
import Profile from './pages/Profile';
import Todos from './pages/Todos';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import ThemeToggle from './components/ThemeToggle';
import Layout from './components/Layout';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <ThemeToggle />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><Layout><Users /></Layout></PrivateRoute>} />
        <Route path="/applications" element={<PrivateRoute><Layout><Applications /></Layout></PrivateRoute>} />
        <Route path="/comptes" element={<PrivateRoute><Layout><Comptes /></Layout></PrivateRoute>} />
        <Route path="/tests" element={<PrivateRoute><Layout><Tests /></Layout></PrivateRoute>} />
        <Route path="/todos" element={<PrivateRoute><Layout><Todos /></Layout></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><Layout><Reports /></Layout></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Layout><Notifications /></Layout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
