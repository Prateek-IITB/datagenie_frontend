import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditableDescription from '../components/EditableDescription';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const SchemaEditor = () => {
  const [schemaData, setSchemaData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEndpointType, setSelectedEndpointType] = useState();
  const [selectedHostUrl, setSelectedHostUrl] = useState();

  const [databases, setDatabases] = useState([]);
  const [tables, setTables] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState();
  const [selectedTable, setSelectedTable] = useState(); 

  const user = JSON.parse(localStorage.getItem('datagenie_user') || '{}');
  const userId = user.id;
  const userRole = user.role;
  const canEdit = userRole === 'admin' || userRole === 'analyst';

  useEffect(() => {
    fetchSchema();
  }, []);

  useEffect(() => {
    if(selectedHostUrl == undefined || selectedEndpointType == undefined) return;
    let dbs = schemaData[selectedEndpointType].find((val) => val.host_url == selectedHostUrl).databases;
    setDatabases(dbs);
    setSelectedDatabase(dbs[0]);
  }, [selectedEndpointType, selectedHostUrl]);

  useEffect(() => {
    if(selectedHostUrl == undefined || selectedEndpointType == undefined || selectedDatabase == undefined) return;
    let tbs = selectedDatabase.tables;
    setTables(tbs);
    setSelectedTable(tbs[0]);
  }, [selectedDatabase]);

  useEffect(() => {
    if(selectedTable == undefined) return;
    setTableColumns(selectedTable.columns);
  }, [selectedTable]);

  const fetchSchema = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/schema`, {
        params: { user_id: userId },
      });

      const groupByEndpointType = (endpoints) => {
        return endpoints.reduce((acc, endpoint) => {
          const key = endpoint?.type || 'undefined';
          if (!acc[key]) acc[key] = [];
          acc[key].push(endpoint);
          return acc;
        }, {});
      };

      const groupedData = groupByEndpointType(response.data);
      setSchemaData(groupedData);
      setSelectedEndpointType(Object.keys(groupedData)[0] || '');
      setSelectedHostUrl(groupedData[Object.keys(groupedData)[0]][0].host_url);
      setError('');
    } catch (err) {
      console.error('Error fetching schema:', err);
      setError('Failed to load schema. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSchema = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/schema/refresh`, {
        user_id: userId,
      });

      if (res.data && res.data.success) {
        toast.success('Schema refreshed from company database');
        await fetchSchema();
      } else {
        throw new Error(res.data?.error || 'Failed to refresh schema');
      }
    } catch (err) {
      console.error(err);
      toast.error(`Refresh failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDescriptions = async (updates) => {
    try {
      await axios.post(`${BASE_URL}/api/schema/save-descriptions`, { descriptions: updates });
      toast.success('Description saved!');
      fetchSchema();
    } catch (err) {
      console.error('Error saving descriptions:', err);
      toast.error('Failed to save description.');
    }
  };

  const currentData = schemaData[selectedEndpointType] || [];

  return (
    <div className="flex h-screen relative overflow-hidden bg-gray-900 text-white">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Schema Editor</h2>
          <button
            onClick={handleRefreshSchema}
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded"
          >
            🔄 Refresh Schema
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading schema...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <>
            <div className="mb-6">
              <label className="mr-2">Connected to:</label>
              <select
                value={`${selectedEndpointType}: ${selectedHostUrl}`}
                onChange={(e) => {
                  const [type, host] = e.target.value.split(': ');
                  setSelectedEndpointType(type);
                  setSelectedHostUrl(host);
                }}
                className="bg-gray-800 text-white p-2 rounded border border-gray-600"
              >
                {Object.keys(schemaData).flatMap((type) =>
                  schemaData[type].map((val) => (
                    <option key={`${type}: ${val.host_url}`} value={`${type}: ${val.host_url}`}>
                      {type}: {val.host_url}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex w-full gap-x-4">
              {/* Databases Table */}
              <div className="min-w-[300px] w-auto">
                <div className="text-sm font-semibold mb-1">Databases</div>
                <table className="border border-gray-700 text-sm w-full">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="px-4 py-2 border border-gray-700 text-left">Name</th>
                      <th className="px-4 py-2 border border-gray-700 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {databases.map((val) => (
                      <tr
                        key={val.name}
                        className={`hover:bg-gray-800 cursor-pointer ${
                          selectedDatabase?.name === val.name ? 'bg-gray-800' : ''
                        }`}
                        onClick={() => setSelectedDatabase(val)}
                      >
                        <td className="px-4 py-2 border border-gray-700">{val.name}</td>
                        <td className="px-4 py-2 border border-gray-700">
                          <EditableDescription
                            value={val.description}
                            editable={canEdit}
                            onSave={(desc) => handleSaveDescriptions([{ type: 'database', id: val.id, description: desc }])}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tables Table */}
              <div className="min-w-[300px] w-auto">
                <div className="text-sm font-semibold mb-1">Tables</div>
                <table className="border border-gray-700 text-sm w-full">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="px-4 py-2 border border-gray-700 text-left">Name</th>
                      <th className="px-4 py-2 border border-gray-700 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.map((val) => (
                      <tr
                        key={val.name}
                        className={`hover:bg-gray-800 cursor-pointer ${
                          selectedTable?.name === val.name ? 'bg-gray-800' : ''
                        }`}
                        onClick={() => setSelectedTable(val)}
                      >
                        <td className="px-4 py-2 border border-gray-700">{val.name}</td>
                        <td className="px-4 py-2 border border-gray-700">
                          <EditableDescription
                            value={val.description}
                            editable={canEdit}
                            onSave={(desc) => handleSaveDescriptions([{ type: 'table', id: val.id, description: desc }])}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Columns Table */}
              <div className="flex-1">
                <div className="text-sm font-semibold mb-1">Columns</div>
                <table className="w-full border border-gray-700 text-sm">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="px-4 py-2 border border-gray-700 text-left">Column Name</th>
                      <th className="px-4 py-2 border border-gray-700 text-left">Datatype</th>
                      <th className="px-4 py-2 border border-gray-700 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableColumns.map((val) => (
                      <tr key={val.id} className="hover:bg-gray-800">
                        <td className="px-4 py-2 border border-gray-700">{val.name}</td>
                        <td className="px-4 py-2 border border-gray-700">{val.data_type}</td>
                        <td className="px-4 py-2 border border-gray-700">
                          <EditableDescription
                            value={val.description}
                            editable={canEdit}
                            onSave={(desc) => handleSaveDescriptions([{ type: 'column', id: val.id, description: desc }])}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SchemaEditor;