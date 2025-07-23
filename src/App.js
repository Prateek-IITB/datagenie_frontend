import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 🔁 Import your pages
import Home from './pages/Home';
import SchemaEditor from './pages/SchemaEditor';
import Login from './pages/Login';
import Settings from './pages/Settings'; // Adjust the path if it's different


// ✅ NEW: Import ProtectedRoute
import ProtectedRoute from './components/ProtectedRoute';



function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Protected: Main query UI */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* ✅ Protected: Schema description */}
        <Route
          path="/schema"
          element={
            <ProtectedRoute>
              <SchemaEditor />
            </ProtectedRoute>
          }
        />

        {/* ✅ Public: Login page */}
        <Route path="/login" element={<Login />} />
        
        
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
