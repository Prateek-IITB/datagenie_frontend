export const getSidebarItems = (role, subMode = null) => {
  if (role === 'user') {
    return [
      { icon: '🧠', label: 'Model Selector' },
      { icon: '🆕', label: 'New Chat', path: '/' },
      { icon: '🔍', label: 'Search Chats' },
      { icon: '📥', label: 'My Reviews' },
      { icon: '⭐', label: 'Starred' },
      { icon: '⏱️', label: 'Daily Jobs' },
      { icon: '🕑', label: 'Previous Chats' },
      { icon: '🧬', label: 'Check Schema', path: '/schema' },
      { icon: '👤', label: 'User Account', bottom: true },
    ];
  }

  if (role === 'analyst') {
    return [
      { icon: '🧠', label: 'Model Selector' },
      { icon: '🆕', label: 'New Chat', path: '/' },
      { icon: '🧾', label: 'Reviews Requests', path: '/analyst/reviews' },
      { icon: '🧬', label: 'Models' },
      { icon: '⭐', label: 'Starred' },
      { icon: '⏱️', label: 'Daily Jobs' },
      { icon: '🕑', label: 'Previous Chats' },
      { icon: '🧬', label: 'Schema Editor', path: '/schema' },
      { icon: '👤', label: 'User Account', bottom: true },
    ];
  }

  if (role === 'admin') {
    if (subMode === 'query') {
      // Analyst-style sidebar with "Back to Admin Dashboard"
      return [
        { icon: '⬅️', label: 'Back to Admin Dashboard', path: '/admin' },
        { icon: '🧠', label: 'Model Selector' },
        { icon: '🆕', label: 'New Chat', path: '/' },
        { icon: '🧾', label: 'Reviews Requests', path: '/analyst/reviews' },
        { icon: '🧬', label: 'Models' },
        { icon: '⭐', label: 'Starred' },
        { icon: '⏱️', label: 'Daily Jobs' },
        { icon: '🕑', label: 'Previous Chats' },
        { icon: '🧬', label: 'Schema Editor', path: '/schema' },
        { icon: '👤', label: 'User Account', bottom: true },
      ];
    } else {
      // Admin dashboard sidebar with "Go to Query Page"
      return [
        { icon: '📊', label: 'Admin Dashboard', path: '/admin/home' },
        { icon: '🔐', label: 'Review Requests', path: '/admin/requests' },
        { icon: '🔐', label: 'Security', path: '/admin/security' },
        { icon: '🛡️', label: 'Manage Users', path: '/admin/manageUsers' },
        { icon: '💾', label: 'Data Sources', path: '/admin/datasources' },
        { icon: '📈', label: 'Billing', path: '/admin/billing' },
        // { icon: '➡️', label: 'Go to Query Page', path: '/' }, // or route that activates 'query' mode
        { icon: '👤', label: 'User Account', bottom: true },
      ];
    }
  }

  return [];
};
