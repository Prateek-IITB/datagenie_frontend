// src/components/EditableDescription.jsx
import React, { useState, useEffect } from 'react';

const EditableDescription = ({ value, onSave, editable }) => {
  const [editMode, setEditMode] = useState(false);
  const [text, setText] = useState(value || '');

  useEffect(() => {
    setText(value || '');
  }, [value]);

  const handleSave = () => {
    const trimmedText = text.trim();
    const trimmedOriginal = (value || '').trim();
    if (trimmedText !== trimmedOriginal) {
      onSave(trimmedText);
    }
    setEditMode(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  if (!editable) {
    return <span>{value || '—'}</span>;
  }

  return (
    <div className="relative group w-full">
      {editMode ? (
        <>
          <input
            type="text"
            className="w-full bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 pr-8"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button
            onClick={handleSave}
            className="absolute right-1 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-300"
            title="Save"
          >
            💾
          </button>
        </>
      ) : (
        <div
          onClick={() => setEditMode(true)}
          className="cursor-pointer hover:underline"
          title="Click to edit"
        >
          {value || '—'}
        </div>
      )}
    </div>
  );
};

export default EditableDescription;
