import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 🔁 Import your two pages
import Home from './pages/Home'; // Your existing main UI file
import SchemaEditor from './pages/SchemaEditor'; // Schema description page


function App() {
  return (
    <Router>
      <Routes>

        {/* ✅ Homepage with SQL generator */}
        <Route path="/" element={<Home />} />

        {/* ✅ New schema editor page */}
        <Route path="/schema" element={<SchemaEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
