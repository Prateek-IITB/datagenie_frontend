import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
const user = JSON.parse(localStorage.getItem("datagenie_user"));
const isViewer = user?.role === "viewer";


const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const currentUser = JSON.parse(localStorage.getItem('datagenie_user'));
const user_id = currentUser?.id;


function SchemaEditor() {
  const [schema, setSchema] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const refreshThenFetch = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('datagenie_user'));
        if (!user) return;

        await axios.post(`${BASE_URL}/api/schema/refresh`, {
          user_id: user.id,
        });

        await fetchSchema(user.id);
      } catch (err) {
        console.error('Error refreshing schema:', err);
        alert('Failed to refresh schema');
      }
    };

    refreshThenFetch();
  }, []);


  const fetchSchema = async (user_id) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/schema`, {
      params: { user_id },
    });
    setSchema(res.data.schema || []);
  } catch (err) {
    console.error('Error fetching schema:', err);
  }
};


  const handleDescriptionChange = (table_name, column_name, value) => {
    setSchema(prev =>
      prev.map(col =>
        col.table_name === table_name && col.column_name === column_name
          ? { ...col, description: value }
          : col
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = schema.map(({ table_name, column_name, description }) => ({
        table_name,
        column_name,
        description: description || '',
      }));

      await axios.post(`${BASE_URL}/api/schema/save-descriptions`, {
        params: {user_id},
        data: payload,
      });
      alert('Descriptions saved!');
    } catch (err) {
      console.error('Failed to save schema descriptions:', err);
      alert('Error saving descriptions');
    }
    setSaving(false);
  };

  const grouped = schema.reduce((acc, col) => {
    if (!acc[col.table_name]) acc[col.table_name] = [];
    acc[col.table_name].push(col);
    return acc;
  }, {});

  return (
    <div className="dark">
      {/* Sticky Header */}
 
      <Header />

      {/* Body */}
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 px-6 py-10 font-sans text-gray-800 dark:text-gray-100">
        <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
  📝    Schema Annotation
        </h1>


          {Object.entries(grouped).map(([table, columns]) => (
            <div key={table} className="mb-8 border rounded-xl p-4 shadow bg-white dark:bg-gray-800">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">📦 {table}</h2>
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 text-left text-xs uppercase text-gray-700 dark:text-gray-200">
                    <th className="p-2">Column</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {columns.map(col => (
                    <tr key={col.column_name} className="border-t dark:border-gray-700">
                      <td className="p-2 font-medium text-gray-900 dark:text-white">{col.column_name}</td>
                      <td className="p-2 text-gray-500 dark:text-gray-300">{col.data_type}</td>
                      <td className="p-2">
                        <input
                          type="text"
                          className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                          placeholder="Describe this column..."
                          value={col.description || ''}
                          onChange={(e) =>
                            handleDescriptionChange(col.table_name, col.column_name, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

           {!isViewer && (
            <div className="text-right">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-md"
              >
                {saving ? 'Saving...' : 'Save Descriptions'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SchemaEditor;
