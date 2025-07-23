import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import QueryCard from '../components/QueryCard';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import thinkingAnimation from '../assets/thinkingAnimation.json';
import { toast, Toaster } from 'react-hot-toast';
import Sidebar from '../components/Sidebar/Sidebar';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

function Home() {
  const [prompt, setPrompt] = useState('');
  const [explanation, setExplanation] = useState('');
  const [sql, setSql] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingSqlMap, setEditingSqlMap] = useState({});
  const [history, setHistory] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [followUpContext, setFollowUpContext] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const endOfMessagesRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('datagenie_user') || '{}');
  console.log("use rin Home.jsx", user);

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

    const user_id = user?.id;

    const userMessage = {
      id: Date.now(),
      prompt,
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
        prompt,
        context: followUpContext,
        user_id: user_id,
      });

      const { requires_schema, needs_sql, intent, explanation, sql, message } = res.data;

      if (!requires_schema || (requires_schema && !needs_sql)) {
        const newContextEntry = { prompt, message };
        setFollowUpContext(intent === 'fresh' ? [newContextEntry] : [...followUpContext, newContextEntry]);
        setHistory((prev) =>
          prev.map((item) =>
            item.id === userMessage.id ? { ...item, explanation: message, generated_sql: '', rows: [], loading: false } : item
          )
        );
        setLoading(false);
        return;
      }

      const runRes = await axios.post(`${BASE_URL}/api/execute-sql`, {
        sql,
        user_id: user_id,
      });

      const newResult = {
        ...userMessage,
        explanation,
        generated_sql: sql,
        rows: runRes.data.rows || [],
        loading: false,
      };

      setHistory((prev) =>
        prev.map((item) => (item.id === userMessage.id ? newResult : item))
      );

      const newContextEntry = { prompt, sql, result: runRes.data.rows || [] };
      setFollowUpContext(intent === 'fresh' ? [newContextEntry] : [...followUpContext, newContextEntry]);
    } catch (err) {
      console.error('❌ Failed to process query:', err);
      setHistory((prev) =>
        prev.map((item) =>
          item.id === userMessage.id
            ? { ...item, loading: false, failed: true }
            : item
        )
      );
      toast.error('Failed to process query. Please try again.');
    }

    setLoading(false);
  };

  const handleReRun = async (editedSql, oldId) => {
    if (!editedSql.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/execute-sql`, {
        sql: editedSql,
        user_id: user?.id,
      });
      const newId = Date.now();
      const oldItem = history.find((item) => item.id === oldId);
      const newQuery = {
        id: newId,
        prompt: oldItem.prompt,
        explanation: oldItem.explanation,
        generated_sql: editedSql,
        rows: res.data.rows || [],
        loading: false,
        failed: false,
      };
      setHistory((prev) => [...prev, newQuery]);
      setTimeout(() => {
        document.getElementById(`query-card-${newId}`)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      toast.success('Query re-executed successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to execute query.');
    }
    setLoading(false);
  };

  return (
    <div className="dark hide-scrollbar h-screen flex relative overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userRole={user?.role} />

      {/* Main Content */}
      <div className={`hide-scrollbar overflow-auto flex-grow bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 px-6 py-10 font-sans text-gray-800 dark:text-gray-100 relative transition-all duration-300 ${sidebarOpen && window.innerWidth >= 768 ? 'ml-64' : 'ml-16'} md:ml-0`}>        
        <div className={`max-w-6xl mx-auto space-y-8 ${hasStarted ? 'pb-36 max-h-[80vh]' : 'h-[70vh] flex flex-col justify-center'}`}>
          {!hasStarted && (
            <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100">
              Ask me what do you want to know today?
            </h2>
          )}

          <div
            className={`transition-all px-6 py-6 backdrop-blur-md bg-transparent z-50 ${
              hasStarted ? 'fixed bottom-0 right-0' : 'mt-6 flex justify-center items-center w-full'
            }`}
            style={{
              left: hasStarted ? (sidebarOpen && window.innerWidth >= 768 ? '16rem' : '4rem') : undefined,
            }}
          >
            <div className="w-full max-w-6xl mx-auto px-6">
              <div className="relative w-full">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Ask me anything"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl shadow-sm focus:ring-gray-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {history.map((q, i) => (
              <div key={i} id={`query-card-${q.id}`} className="space-y-2">
                <div className="flex justify-end">
                  <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-5 py-3 text-[17px] rounded-xl max-w-xl">
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
                    <div className="bg-gray-800 text-gray-100 px-5 py-3 text-[17px] rounded-xl max-w-xl">
                      Unable to get your data, can you be more specific of what data do you want?
                    </div>
                  </div>
                ) : q.generated_sql ? (
                  <QueryCard
                    prompt={q.prompt}
                    explanation={q.explanation}
                    sql={editingSqlMap[q.id] ?? q.generated_sql}
                    rows={q.rows}
                    error={q.error}
                    editable={true}
                    onSqlChange={(newSql) => setEditingSqlMap({ ...editingSqlMap, [q.id]: newSql })}
                    expanded={editingSqlMap[q.id] !== undefined && editingSqlMap[q.id] !== q.generated_sql}
                    onReRun={() => handleReRun(editingSqlMap[q.id], q.id)}
                  />
                ) : (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-gray-100 px-5 py-3 rounded-xl shadow max-w-xl text-[17px]">
                      {q.explanation}
                    </div>
                  </div>
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
