import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [changeType, setChangeType] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('user');
 
  const user = JSON.parse(localStorage.getItem('datagenie_user') || '{}');
  const companyId = user.company_id;

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/users?companyId=${companyId}`);
      console.log("result from fetch users", res) ;
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };



  const handleRoleChange = (user, newRole) => {
    setSelectedUser({ ...user, newRole });
    setChangeType('role');
    setShowConfirmModal(true);
  };

  const handleStatusChange = (user, newStatus) => {
    setSelectedUser({ ...user, newStatus });
    setChangeType('status');
    setShowConfirmModal(true);
  };

  const confirmChange = async () => {
    try {
      if (changeType === 'role') {
        await axios.put(`${BASE_URL}/api/admin/update-role`, {
          userId: selectedUser.id,
          newRole: selectedUser.newRole,
        });
      } else if (changeType === 'status') {
        await axios.put(`${BASE_URL}/api/admin/update-status`, {
          userId: selectedUser.id,
          isActive: selectedUser.newStatus ? 1 : 0,
        });
      }
      setShowConfirmModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleInvite = async () => {
    try {
      await axios.post(`${BASE_URL}/api/admin/invite-user`, {
        email: inviteEmail,
        role: inviteRole,
        companyId: companyId,
      });
      alert('Invitation sent!');
      setInviteEmail('');
      setInviteRole('user');
      fetchUsers();
    } catch (error) {
      console.error('Failed to invite user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Invite New User */}
      <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Invite New User</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="px-4 py-2 rounded w-full sm:w-1/2 text-black"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="px-4 py-2 rounded text-black"
          >
            <option value="user">User</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleInvite}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Send Invite
          </button>
        </div>
      </div>

      {/* Manage Active Users */}
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Manage Active Users</h2>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-600 py-3"
            >
              <span className="w-full sm:w-1/3">{user.email}</span>
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user, e.target.value)}
                className="px-2 py-1 rounded text-black"
              >
                <option value="user">User</option>
                <option value="analyst">Analyst</option>
                <option value="admin">Admin</option>
              </select>
              <label className="flex items-center gap-2">
                <span>Active</span>
                <input
                  type="checkbox"
                  checked={user.is_active}
                  onChange={(e) => handleStatusChange(user, e.target.checked)}
                  className="w-4 h-4"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">
              Confirm {changeType === 'role' ? 'Role Change' : 'Status Change'}
            </h3>
            <p className="mb-4">
              Are you sure you want to{' '}
              {changeType === 'role'
                ? `change role to ${selectedUser.newRole}`
                : selectedUser.newStatus
                ? 'activate'
                : 'deactivate'}{' '}
              this user?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmChange}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
