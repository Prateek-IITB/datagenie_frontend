import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import QueryCard from '../components/QueryCard';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import thinkingAnimation from '../assets/thinkingAnimation.json';
const BASE_URL = process.env.REACT_APP_BACKEND_URL;


function Home() {
  const [prompt, setPrompt] = useState('');
  const [explanation, setExplanation] = useState('');
  const [sql, setSql] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingSql, setEditingSql] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (hasStarted) {
      scrollToBottom();
    }
  }, [history, hasStarted]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setHasStarted(true);
    setLoading(true);

    const userMessage = {
      id: Date.now(),
      prompt: prompt,
      explanation: '',
      generated_sql: '',
      rows: [],
      loading: true,
      failed: false,
    };

    setHistory((prev) => [...prev, userMessage]);
    setPrompt('');

    try {
      const res = await axios.post(`${BASE_URL}/api/generate-sql`, {
        prompt: userMessage.prompt,
      });

      const runRes = await axios.post(`${BASE_URL}/api/execute-sql`, {
        sql: res.data.sql,
      });

      setHistory((prev) =>
        prev.map((item) =>
          item.id === userMessage.id
            ? {
                ...item,
                explanation: res.data.explanation,
                generated_sql: res.data.sql,
                rows: runRes.data.rows || [],
                loading: false,
              }
            : item
        )
      );
    }  catch (err) {
        setHistory((prev) =>
          prev.map((item) =>
            item.id === userMessage.id
              ? { ...item, loading: false, failed: true }
              : item
          )
        );
        console.error('Failed to process query:', err);
      }


    setLoading(false);
  };

  const handleReRun = async () => {
    if (!editingSql.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/execute-sql`, {
        sql: editingSql,
      });
      setRows(res.data.rows || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const loadHistory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/query-history/?offset=${offset}&limit=5`);

      const newHistory = await Promise.all(
        res.data.history.map(async (item) => {
          try {
            const result = await axios.post(`${BASE_URL}/api/execute-sql`, {
              sql: item.generated_sql,
            });
            return { ...item, rows: result.data.rows };
          } catch (err) {
            console.error('Error executing history SQL:', err);
            return { ...item, rows: [], error: true };
          }
        })
      );
      setHistory((prev) => [...newHistory, ...prev]);
      setOffset(offset + 5);
      if (res.data.length < 5) setShowLoadMore(false);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <header className="sticky top-0 bg-white dark:bg-gray-900 shadow-md z-50 flex justify-between items-center px-6 py-4">
        <div className="text-xl font-bold text-gray-800 dark:text-gray-100">DataGenie</div>

        <div className="flex items-center space-x-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-300 rounded-full peer-checked:bg-gray-700 transition duration-300 relative">
              <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-6 flex items-center justify-center text-sm">
                {darkMode ? '🌙' : '🌞'}
              </span>
            </div>
          </label>

          <a
            href="/schema"
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Check Schema
          </a>
        </div>
      </header>

      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 px-6 py-10 font-sans text-gray-800 dark:text-gray-100 relative">
        <div className={`max-w-6xl mx-auto space-y-8 ${hasStarted ? 'pb-36' : 'h-[70vh] flex flex-col justify-center'}`}>
          {!hasStarted && (
            <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100">
              Ask me what do you want to know today?
            </h1>
          )}

            <div
              className={`${
                hasStarted
                  ? 'fixed bottom-0 left-0 w-full px-6 py-6 backdrop-blur-md bg-transparent z-50'
                  : 'mt-6 flex justify-center items-center'
              }`}
            >

            <div className="w-full max-w-6xl mx-auto px-6">
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Ask me anything"
                  className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl shadow-sm focus:ring-gray-500 focus:outline-none"
                />
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gray-700 hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-xl transition"
                >
                  {loading ? 'Thinking...' : 'Submit'}
                </button>
              </div>
            </div>
          


          </div>

          <div className="space-y-6">
            {history.map((q, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-end">
                  <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-xl max-w-xl">
                    {q.prompt}
                  </div>
                </div>

                {q.loading ? (
                  <div className="flex justify-start">
                    <Lottie
                      animationData={thinkingAnimation}
                      loop
                      autoplay
                      style={{ width: 200, height: 200 }}
                    />
                  </div>

                ) : q.failed ? (
                  <div className="flex justify-start">
                    <div className="bg-slate-200 dark:bg-slate-700 text-gray-900 dark:text-white px-4 py-2 rounded-xl max-w-xl">
                      Unable to get your data, can you be more specific of what data do you want?
                    </div>
                  </div>
                ) : (
                  <QueryCard
                    prompt={q.prompt}
                    explanation={q.explanation}
                    sql={q.generated_sql}
                    rows={q.rows}
                    error={q.error}
                  />
                )}
              </div>
            ))}
            <div className="pb-32" ref={endOfMessagesRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
