import React from 'react';

export default function ProductCard({ product, likeCount, comments, commentInput, onLike, onAddToGroup, onCommentInput, onAddComment, idx }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-5 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-violet-300 w-full min-w-[270px] max-w-[340px] mx-auto h-full min-h-[430px]">
      {/* Image & Price */}
      <div className="relative mb-4 w-full flex justify-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-40 h-40 object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105 shadow"
        />
        <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow border border-white">
          ₹{product.price}
        </span>
      </div>
      {/* Product Info */}
      <div className="text-center flex flex-col gap-1">
        <div className="font-semibold text-lg text-gray-800">{product.name}</div>
        <div className="text-xs text-gray-500">{product.description}</div>
      </div>
      {/* Actions */}
      <div className="flex gap-2 my-4">
        <button
          onClick={() => onLike(idx)}
          className="flex-1 flex items-center justify-center gap-1 bg-violet-100 text-violet-700 py-2 rounded-full text-sm font-medium hover:bg-violet-200 transition"
        >
          👍 Like ({likeCount})
        </button>
        <button
          onClick={() => onAddToGroup(idx)}
          className="flex-1 flex items-center justify-center gap-1 bg-green-100 text-green-700 py-2 rounded-full text-sm font-medium hover:bg-green-200 transition"
        >
          ➕ Add to Group
        </button>
      </div>
      {/* Comments */}
      <div className="w-full mt-auto">
        <div className="text-xs text-gray-500 mb-1">Comments:</div>
        <ul className="mb-2 max-h-16 overflow-y-auto pr-1">
          {comments.map((c, i) => (
            <li key={i} className="text-xs text-gray-700 mb-1 break-words">{c}</li>
          ))}
        </ul>
        {/* Input and Add button in a flex row */}
        <div className="flex gap-2 w-full items-center">
          <input
            type="text"
            value={commentInput}
            onChange={e => onCommentInput(idx, e.target.value)}
            placeholder="Add comment"
            className="flex-1 px-3 py-1 text-xs rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
          <button
            onClick={() => onAddComment(idx)}
            className="min-w-max px-4 py-1.5 bg-violet-600 text-white text-xs rounded-full hover:bg-violet-700 transition whitespace-nowrap shadow"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
