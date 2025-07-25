import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';

const QueryCard = ({ prompt, explanation, sql, rows = [], error, editable = false, onSqlChange, expanded = false, onReRun, userType = 'business_user', isSqlQuery = true }) => {
  const [editableRows, setEditableRows] = useState([]);
  const [showReRun, setShowReRun] = useState(false);
  const [sqlRows, setSqlRows] = useState(4);
  const [activeTab, setActiveTab] = useState('answer');

  useEffect(() => {
    setEditableRows(rows);
  }, [rows]);

  const handleCellChange = (rowIndex, columnKey, newValue) => {
    setEditableRows((prevRows) => {
      const updated = [...prevRows];
      updated[rowIndex] = { ...updated[rowIndex], [columnKey]: newValue };
      return updated;
    });
  };

  const downloadExcel = () => {
    if (!rows || rows.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Query Output');
    XLSX.writeFile(workbook, 'query_output.xlsx');
  };

  const showSQLTab = isSqlQuery && userType !== 'analyst';

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700 space-y-4">
      {/* Tab Selector */}
      <div className="flex space-x-4 border-b border-gray-300 dark:border-gray-700 mb-4">
        <button
          className={`pb-2 text-sm font-medium ${activeTab === 'answer' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 dark:text-gray-300'}`}
          onClick={() => setActiveTab('answer')}
        >
          Answer
        </button>
        {showSQLTab && (
          <button
            className={`pb-2 text-sm font-medium ${activeTab === 'sql' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 dark:text-gray-300'}`}
            onClick={() => setActiveTab('sql')}
          >
            SQL
          </button>
        )}
        <button
          className={`pb-2 text-sm font-medium ${activeTab === 'steps' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 dark:text-gray-300'}`}
          onClick={() => setActiveTab('steps')}
        >
          Steps
        </button>
      </div>

      {/* Answer Tab */}
      {activeTab === 'answer' && (
        <>
          {explanation && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2">🧾 Approach</h2>
              <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-300">{explanation}</p>
            </div>
          )}

          {/* Inline SQL for analysts */}
          {userType === 'analyst' && sql && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2">📝 Generated SQL</h2>
              <pre className="bg-gray-100 dark:bg-gray-700 dark:text-white p-3 rounded font-mono text-sm overflow-auto border border-gray-300 dark:border-gray-600">
                {sql}
              </pre>
            </div>
          )}

          {/* Output */}
          <div className="relative">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2">📊 Output</h2>
            {rows.length > 0 && (
              <button
                onClick={downloadExcel}
                title="Download Excel"
                className="absolute top-0 right-0 text-gray-500 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition"
              >
                ⬇️
              </button>
            )}

            {error ? (
              <p className="text-red-500 mt-2">❌ Failed to execute SQL</p>
            ) : editableRows && editableRows.length > 0 ? (
              <div className="w-full overflow-auto mt-2">
                <table className="table-auto max-w-full whitespace-nowrap text-sm text-left border border-gray-200 dark:border-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
                    <tr>
                      {Object.keys(editableRows[0]).map((col) => (
                        <th
                          key={col}
                          className="px-4 py-2 border-r border-b border-gray-200 dark:border-gray-600 whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {editableRows.map((row, i) => (
                      <tr key={i} className="border-t dark:border-gray-700">
                        {Object.entries(row).map(([key, val], j) => (
                          <td
                            key={j}
                            className="px-4 py-2 border-r border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white whitespace-nowrap"
                          >
                            {val === null ? '' : val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mt-2">No rows returned</p>
            )}
          </div>
        </>
      )}

      {/* SQL Tab */}
      {activeTab === 'sql' && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2">📝 Generated SQL</h2>
          {editable ? (
            <div className="relative">
              <textarea
                value={sql}
                onChange={(e) => onSqlChange(e.target.value)}
                onFocus={() => {
                  setShowReRun(true);
                  setSqlRows(8);
                }}
                onBlur={() => {
                  setShowReRun(false);
                  setSqlRows(4);
                }}
                rows={sqlRows}
                className="w-full bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 p-3 rounded font-mono text-sm focus:outline-none resize-none transition-all duration-200 ease-in-out hide-scrollbar"
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
              />
              {showReRun && (
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={onReRun}
                  className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1 rounded shadow transition"
                >
                  🔄 Re-run
                </button>
              )}
            </div>
          ) : (
            <pre className="bg-gray-100 dark:bg-gray-700 dark:text-white p-3 rounded font-mono text-sm overflow-auto border border-gray-300 dark:border-gray-600">
              {sql}
            </pre>
          )}
        </div>
      )}

      {/* Steps Tab */}
      {activeTab === 'steps' && (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p>This section will show the detailed steps taken to generate the answer.</p>
        </div>
      )}
    </div>
  );
};

export default QueryCard;