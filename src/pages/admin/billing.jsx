import React from 'react';
import { useNavigate } from 'react-router-dom';

const Billing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 text-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">Billing Page Under Construction</h2>
        <p className="mb-6">
          We are working on this page. You will be able to check your current billing
          along with past invoices here.
        </p>
        <button
          onClick={() => navigate('/admin/home')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl transition duration-200"
        >
          Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
};

export default Billing;
