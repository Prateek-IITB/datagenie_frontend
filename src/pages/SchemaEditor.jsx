import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SchemaEditor = () => {
  const [schemaData, setSchemaData] = useState({});
  const [editedDescriptions, setEditedDescriptions] = useState({});

  useEffect(() => {
    fetchSchema();
  }, []);

  const fetchSchema = async () => {
    try {
      const response = await axios.get('/api/schema/fetch-schema');
      const groupedData = groupColumnsByTable(response.data);
      setSchemaData(groupedData);
    } catch (error) {
      console.error('Error fetching schema:', error);
    }
  };

  const groupColumnsByTable = (data) => {
    return data.reduce((acc, column) => {
      const { table_name } = column;
      if (!acc[table_name]) {
        acc[table_name] = [];
      }
      acc[table_name].push(column);
      return acc;
    }, {});
  };

  const handleDescriptionChange = (columnId, description) => {
    setEditedDescriptions((prev) => ({
      ...prev,
      [columnId]: description,
    }));
  };

  const handleSaveDescriptions = async () => {
    try {
      const updates = Object.entries(editedDescriptions).map(([columnId, description]) => ({
        column_id: columnId,
        description,
      }));

      await axios.post('/api/schema/save-descriptions', { updates });
      alert('Descriptions saved successfully!');
      fetchSchema(); // refresh
    } catch (error) {
      console.error('Error saving descriptions:', error);
      alert('Failed to save descriptions.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 h-screen p-6">
        <h1 className="text-2xl font-bold mb-8">DataGenie</h1>
        <nav className="space-y-4">
          <Link
            to="/"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Query
          </Link>
          <Link
            to="/schema"
            className="block px-4 py-2 rounded bg-gray-700 font-semibold"
          >
            Schema
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Schema Editor</h2>

        {Object.keys(schemaData).map((tableName) => (
          <div key={tableName} className="mb-8">
            <h3 className="text-xl font-semibold mb-3">{tableName}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-700 text-sm">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="px-4 py-2 border border-gray-700 text-left">Column Name</th>
                    <th className="px-4 py-2 border border-gray-700 text-left">Data Type</th>
                    <th className="px-4 py-2 border border-gray-700 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {schemaData[tableName].map((column) => (
                    <tr key={column.id} className="hover:bg-gray-800">
                      <td className="px-4 py-2 border border-gray-700">{column.column_name}</td>
                      <td className="px-4 py-2 border border-gray-700">{column.data_type}</td>
                      <td className="px-4 py-2 border border-gray-700">
                        <input
                          type="text"
                          className="w-full bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none"
                          value={editedDescriptions[column.id] ?? column.description ?? ''}
                          onChange={(e) =>
                            handleDescriptionChange(column.id, e.target.value)
                          }
                          placeholder="Enter description"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div className="mt-6">
          <button
            onClick={handleSaveDescriptions}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Save Descriptions
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchemaEditor;
