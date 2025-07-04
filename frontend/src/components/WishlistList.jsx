import React from "react";

export default function WishlistList({ wishlists, onView }) {
  return (
    <ul>
      {wishlists.map((w) => (
        <li
          key={w._id}
          className="bg-white rounded shadow p-4 mb-4 flex justify-between items-center"
        >
          <span className="font-semibold">{w.name}</span>
          <button
            className="text-blue-600 hover:underline"
            onClick={() => onView(w._id)}
          >
            View
          </button>
        </li>
      ))}
    </ul>
  );
}