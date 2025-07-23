export const getSidebarItems = (role) => {
  if (role === 'user') {
    return [
      { icon: '🧠', label: 'Model Selector' },
      { icon: '🆕', label: 'New Chat', path: '/' },
      { icon: '🔍', label: 'Search Chats' },
      { icon: '📥', label: 'My Reviews' },
      { icon: '⭐', label: 'Starred' },
      { icon: '⏱️', label: 'Daily Jobs' },
      { icon: '📊', label: 'Dashboards' },
      { icon: '🕑', label: 'Previous Chats' },
      { icon: '🧬', label: 'Check Schema', path: '/schema' },
      { icon: '👤', label: 'User Account', bottom: true },
    ];
  }

  return []; // default if role not matched
};
