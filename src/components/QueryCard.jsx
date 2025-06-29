import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const QueryCard = ({ prompt, explanation, sql, rows = [], error }) => {
  const downloadExcel = () => {
    if (!rows || rows.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Query Output');
    XLSX.writeFile(workbook, 'query_output.xlsx');
  };

   const [editableRows, setEditableRows] = useState([]);

    useEffect(() => {
        // Copy rows into local state to allow editing
        setEditableRows(rows);
    }, [rows]);

    const handleCellChange = (rowIndex, columnKey, newValue) => {
    setEditableRows((prevRows) => {
      const updated = [...prevRows];
      updated[rowIndex] = { ...updated[rowIndex], [columnKey]: newValue };
      return updated;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700 space-y-4">
      {/* Prompt */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2">💬 Prompt</h2>
        <p className="text-gray-800 dark:text-gray-200">{prompt}</p>
      </div>

      {/* Explanation */}
      {explanation && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2">🧾 Explanation</h2>
          <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-300">{explanation}</p>
        </div>
      )}

      {/* SQL */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2">📝 Generated SQL</h2>
        <pre className="bg-gray-100 dark:bg-gray-700 dark:text-white p-3 rounded font-mono text-sm overflow-auto border border-gray-300 dark:border-gray-600">
          {sql}
        </pre>
      </div>

      {/* Output + Download Icon */}
<div className="relative">
  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2">📊 Output</h2>

  {/* ⬇️ Download Icon */}
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
    <div className="overflow-x-auto mt-2">
      <table className="min-w-full text-sm text-left border border-gray-200 dark:border-gray-600">
        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
          <tr>
            {Object.keys(editableRows[0]).map((col) => (
              <th key={col} className="px-4 py-2 border-b dark:border-gray-600">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {editableRows.map((row, i) => (
            <tr key={i} className="border-t dark:border-gray-700">
              {Object.entries(row).map(([key, val], j) => (
                <td key={j} className="px-4 py-2">
                 <input
                    key={`${i}-${key}`}
                    type="text"
                    value={val === null ? '' : val}
                    onChange={(e) => handleCellChange(i, key, e.target.value)}
                    className="bg-transparent border-b border-dashed border-gray-300 dark:border-gray-600 w-full text-sm text-gray-800 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
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



    </div>
  );
};

export default QueryCard;
