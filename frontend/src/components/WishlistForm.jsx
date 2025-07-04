import React from "react";

export default function WishlistForm({ name, setName, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex mb-6 gap-2">
      <input
        className="flex-1 p-2 border rounded"
        placeholder="New wishlist name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add
      </button>
    </form>
  );
}