import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Pages
import Home from './pages/Home';
import SchemaEditor from './pages/SchemaEditor';
import Settings from './pages/Settings';
import Login from './pages/Login';

//Admin Pages
import AdminDashboard from './pages/admin/home';
import ReviewRequests from './pages/admin/requests';
import Security from './pages/admin/security';
import ManageUsers from './pages/admin/manageUsers';
import DataSources from './pages/admin/datasources';
import Billing from './pages/admin/billing';



// Components
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const userRole = localStorage.getItem("userRole");

  return (
    <Router>

      {/* 👇 Paste ToastContainer here */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>

  {/* ✅ Public Route */}
  <Route path="/login" element={<Login />} />

  {/* ✅ Protected + All Pages Inside MainLayout */}
  <Route
    path="/"
    element={
      <ProtectedRoute>
        <MainLayout
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userRole={userRole}
        />
      </ProtectedRoute>
    }
  >
    {/* Business / Analyst Routes */}
    <Route index element={<Home />} />
    <Route path="schema" element={<SchemaEditor />} />
    <Route path="settings" element={<Settings />} />

    {/* Admin Routes */}
    <Route path="admin/home" element={<AdminDashboard />} />
    <Route path="admin/requests" element={<ReviewRequests />} />
    <Route path="admin/security" element={<Security />} />
    <Route path="admin/manageUsers" element={<ManageUsers />} />
    <Route path="admin/datasources" element={<DataSources />} />
    <Route path="admin/billing" element={<Billing />} />
  </Route>

</Routes>
    </Router>
  );
}


export default App;
