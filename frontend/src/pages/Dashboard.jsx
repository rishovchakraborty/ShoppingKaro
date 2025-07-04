import React, { useState, useEffect } from 'react';
import Navbar from '../components/Common/Navbar';
import { useNavigate } from 'react-router-dom';
import { getWishlists, createWishlist, addProduct } from '../services/api';
import { DUMMY_PRODUCTS } from '../data/dummyProducts';

export default function Dashboard() {
  const [wishlists, setWishlists] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [shareMsg, setShareMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likeCounts, setLikeCounts] = useState(Array(DUMMY_PRODUCTS.length).fill(0));
  const [comments, setComments] = useState(Array(DUMMY_PRODUCTS.length).fill([]));
  const [commentInputs, setCommentInputs] = useState(Array(DUMMY_PRODUCTS.length).fill(''));
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedProductIdx, setSelectedProductIdx] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [addToGroupMsg, setAddToGroupMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchWishlists() {
      setLoading(true);
      setError('');
      try {
        const res = await getWishlists();
        console.log('Fetched wishlists:', res.data); // Debug log
        setWishlists(res.data);
      } catch (err) {
        console.error('Error fetching wishlists:', err); // Debug log
        setError('Failed to load wishlists.');
      } finally {
        setLoading(false);
      }
    }
    fetchWishlists();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await createWishlist({ name: newName });
      setWishlists([...wishlists, res.data]);
      setShowAdd(false);
      setNewName('');
    } catch (err) {
      setError('Failed to create wishlist.');
    }
  };

  const handleLike = (idx) => {
    setLikeCounts(likeCounts.map((c, i) => (i === idx ? c + 1 : c)));
  };

  const handleComment = (idx) => {
    if (!commentInputs[idx]) return;
    setComments(comments.map((arr, i) => (i === idx ? [...arr, commentInputs[idx]] : arr)));
    setCommentInputs(commentInputs.map((v, i) => (i === idx ? '' : v)));
  };

  const handleAddToGroup = (idx) => {
    setSelectedProductIdx(idx);
    setShowGroupModal(true);
  };

  const handleConfirmAddToGroup = async () => {
    if (selectedProductIdx == null || !selectedGroupId) return;
    try {
      const prod = DUMMY_PRODUCTS[selectedProductIdx];
      await addProduct(selectedGroupId, {
        name: prod.name,
        imageUrl: prod.imageUrl,
        price: prod.price,
      });
      setAddToGroupMsg('✅ Product added to group!');
      const res = await getWishlists();
      setWishlists(res.data);
      setTimeout(() => setAddToGroupMsg(''), 2000);
    } catch (err) {
      setAddToGroupMsg('❌ Failed to add product.');
      setTimeout(() => setAddToGroupMsg(''), 2000);
    }
    setShowGroupModal(false);
    setSelectedProductIdx(null);
    setSelectedGroupId('');
  };

  const handleDelete = (id) => {
    setWishlists(wishlists.filter(w => w._id !== id));
  };

  const handleShare = (id) => {
    const url = `${window.location.origin}/wishlist/${id}`;
    navigator.clipboard.writeText(url);
    setShareMsg('Link copied!');
    setTimeout(() => setShareMsg(''), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-green-50 to-white">
      <Navbar />
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Demo E-Shopping Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {DUMMY_PRODUCTS.map((prod, idx) => (
            <div key={prod.name} className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center hover:shadow-xl transition">
              <img src={prod.imageUrl} alt={prod.name} className="w-32 h-32 object-cover rounded mb-2 border" />
              <div className="font-bold text-lg text-center mb-1">{prod.name}</div>
              <div className="text-green-700 font-semibold mb-1">₹{prod.price}</div>
              <div className="text-xs text-gray-500 mb-2 text-center">{prod.description}</div>
              <div className="flex gap-2 mb-2">
                <button onClick={() => handleLike(idx)} className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-semibold hover:bg-violet-200 transition">Like ({likeCounts[idx]})</button>
                <button onClick={() => handleAddToGroup(idx)} className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold hover:bg-green-200 transition">Add to Group</button>
              </div>
              <div className="w-full mt-2">
                <div className="text-xs text-gray-500 mb-1">Comments:</div>
                <ul className="mb-2">
                  {comments[idx].map((c, i) => (
                    <li key={i} className="text-xs text-gray-700 mb-1">{c}</li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input className="flex-1 p-1 border rounded text-xs" type="text" value={commentInputs[idx]} onChange={e => setCommentInputs(commentInputs.map((v, i) => i === idx ? e.target.value : v))} placeholder="Add comment" />
                  <button onClick={() => handleComment(idx)} className="bg-violet-600 text-white px-2 py-1 rounded-full text-xs">Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Group Add Modal */}
        {showGroupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative">
              <button type="button" onClick={() => setShowGroupModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
              <h3 className="text-xl font-bold mb-4 text-violet-700">Add Product to Group</h3>
              <select className="w-full mb-4 p-2 border rounded" value={selectedGroupId} onChange={e => setSelectedGroupId(e.target.value)}>
                <option value="">Select Group</option>
                {wishlists.map(w => (
                  <option key={w._id} value={w._id}>{w.name}</option>
                ))}
              </select>
              <button onClick={handleConfirmAddToGroup} className="w-full bg-green-600 text-white py-2 rounded-full font-semibold hover:bg-green-700 transition">Add to Group</button>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">Your Wishlists</h2>
          <button onClick={() => setShowAdd(true)} className="bg-violet-700 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-violet-800 transition">+ New Wishlist</button>
        </div>
        {showAdd && (
          <form onSubmit={handleAdd} className="mb-8 flex flex-col sm:flex-row gap-2 items-center bg-white rounded-xl shadow p-4">
            <input className="p-3 border rounded flex-1 text-lg" type="text" placeholder="Wishlist Name" value={newName} onChange={e => setNewName(e.target.value)} required />
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition">Add</button>
            <button type="button" onClick={() => setShowAdd(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition">Cancel</button>
          </form>
        )}
        {shareMsg && <div className="mb-4 text-green-600 text-center font-medium">{shareMsg}</div>}
        {error && <div className="mb-4 text-red-500 text-center font-medium">{error}</div>}
        {addToGroupMsg && <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white border border-green-400 text-green-700 px-6 py-3 rounded-xl shadow-lg z-50 text-lg font-semibold transition-all">{addToGroupMsg}</div>}
        {loading ? (
          <div className="text-center text-gray-400 py-24">Loading...</div>
        ) : wishlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-32 h-32 bg-gradient-to-tr from-violet-200 to-green-200 rounded-full flex items-center justify-center mb-6">
              <span className="text-6xl">🎁</span>
            </div>
            <div className="text-2xl font-semibold text-gray-600 mb-2">No wishlists yet</div>
            <div className="text-gray-400 mb-6">Start by creating your first wishlist!</div>
            <button onClick={() => setShowAdd(true)} className="bg-violet-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-violet-700 transition">+ New Wishlist</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {wishlists.map(w => (
              <div key={w._id} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-3 hover:shadow-xl transition relative">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-bold text-gray-700 cursor-pointer" onClick={() => navigate(`/wishlist/${w._id}`)}>{w.name}</h3>
                  <button onClick={() => handleDelete(w._id)} className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-semibold hover:bg-green-200 transition">Delete</button>
                </div>
                <div className="text-xs text-gray-500">Owner: {w.owner?.username || 'You'}</div>
                <div className="text-xs text-gray-400 mb-2">Members: {w.members?.length || 1}</div>
                <button onClick={() => handleShare(w._id)} className="bg-violet-100 text-violet-700 px-4 py-1 rounded-full font-semibold hover:bg-violet-200 transition">Share</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}