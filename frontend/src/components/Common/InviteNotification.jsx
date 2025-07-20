import React from 'react';

/**
 * InviteNotification component
 * Props:
 * - invites: array of pending invites [{ wishlistId, wishlistName, invitedByName, createdAt }]
 * - onAccept: function to call when accepting an invite (wishlistId)
 * - onClose: function to call to dismiss the notification (optional)
 * - show: boolean to control visibility
 */
export default function InviteNotification({ invites, onAccept, onClose, show }) {
  if (!show || !invites || invites.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-violet-300 rounded-xl shadow-lg p-4 w-80 animate-fadeIn">
      <div className="font-bold text-violet-700 mb-2">Invitations</div>
      <ul className="mb-2 max-h-60 overflow-y-auto">
        {invites.map((invite, idx) => (
          <li key={invite.wishlistId + idx} className="mb-3 p-2 bg-violet-50 rounded-lg flex flex-col gap-1">
            <span className="text-gray-800 font-semibold">{invite.wishlistName}</span>
            <span className="text-xs text-gray-500">Invited by: {invite.invitedByName || 'Someone'}</span>
            <span className="text-xs text-gray-400">{new Date(invite.createdAt).toLocaleString()}</span>
            <button
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-green-700 transition"
              onClick={() => onAccept(invite.wishlistId)}
            >
              Accept Invite
            </button>
          </li>
        ))}
      </ul>
      {onClose && (
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose}>&times;</button>
      )}
    </div>
  );
} 