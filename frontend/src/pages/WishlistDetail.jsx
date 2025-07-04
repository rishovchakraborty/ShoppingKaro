import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Common/Navbar';
import { getWishlist, addProduct, updateProduct, deleteProduct, addComment, addReaction, inviteMember, leaveWishlist } from '../services/api';

export default function WishlistDetail() {
  const { id } = useParams();
  console.log('WishlistDetail mounted, id:', id); // Debug log
  const [wishlist, setWishlist] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', imageUrl: '', price: '' });
  const [editingId, setEditingId] = useState(null);
  const [editProduct, setEditProduct] = useState({ name: '', imageUrl: '', price: '' });
  const [commentText, setCommentText] = useState('');
  const [commentingId, setCommentingId] = useState(null);
  const [reactionEmoji, setReactionEmoji] = useState('');
  const [reactingId, setReactingId] = useState(null);
  const [inviteInput, setInviteInput] = useState('');
  const [inviteType, setInviteType] = useState('email');
  const [inviteStatus, setInviteStatus] = useState('');
  const [leaveStatus, setLeaveStatus] = useState('');
  const [shareMsg, setShareMsg] = useState('');
  const [likeCounts, setLikeCounts] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [mockMembers, setMockMembers] = useState([]); // For mock invite

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const res = await getWishlist(id);
        console.log('Fetched wishlist:', res.data);
        setWishlist(res.data);
        setProducts(res.data.products || []);
        // Initialize likeCounts and commentInputs
        const likes = {};
        const comments = {};
        (res.data.products || []).forEach(p => {
          likes[p._id] = p.likes ? p.likes.length : 0;
          comments[p._id] = '';
        });
        setLikeCounts(likes);
        setCommentInputs(comments);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load wishlist.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await addProduct(id, { ...newProduct, price: Number(newProduct.price) });
      // Refresh product list after adding
      const prodRes = await getProducts(id);
      setProducts(prodRes.data);
      setShowAdd(false);
      setNewProduct({ name: '', imageUrl: '', price: '' });
    } catch (err) {
      setError('Failed to add product.');
    }
  };

  const handleEditProduct = (product) => {
    setEditingId(product._id);
    setEditProduct({ name: product.name, imageUrl: product.imageUrl, price: product.price });
  };

  const handleUpdateProduct = async (e, productId) => {
    e.preventDefault();
    try {
      const res = await updateProduct(id, productId, { ...editProduct, price: Number(editProduct.price) });
      setProducts(products.map(p => (p._id === productId ? res.data : p)));
      setEditingId(null);
    } catch (err) {
      setError('Failed to update product.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(id, productId);
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      setError('Failed to delete product.');
    }
  };

  const handleComment = async (e, productId) => {
    e.preventDefault();
    try {
      const res = await addComment(id, productId, { text: commentText });
      setProducts(products.map(p => (p._id === productId ? { ...p, comments: res.data } : p)));
      setCommentingId(null);
      setCommentText('');
    } catch (err) {
      setError('Failed to add comment.');
    }
  };

  const handleReaction = async (emoji, productId) => {
    try {
      const res = await addReaction(id, productId, { emoji });
      setProducts(products.map(p => (p._id === productId ? { ...p, reactions: res.data } : p)));
      setReactingId(null);
      setReactionEmoji('');
    } catch (err) {
      setError('Failed to add reaction.');
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteStatus('');
    try {
      const data = inviteType === 'email' ? { email: inviteInput } : { username: inviteInput };
      await inviteMember(id, data);
      setInviteStatus('Invite sent!');
      setInviteInput('');
    } catch (err) {
      setInviteStatus('Invite failed.');
    }
  };

  const handleLeave = async () => {
    setLeaveStatus('');
    try {
      await leaveWishlist(id);
      setLeaveStatus('You left the wishlist.');
      setTimeout(() => window.location = '/', 1200);
    } catch (err) {
      setLeaveStatus('Failed to leave.');
    }
  };

  const handleLikeProduct = (productId) => {
    setLikeCounts({ ...likeCounts, [productId]: (likeCounts[productId] || 0) + 1 });
    // TODO: Optionally call backend to persist like
  };

  const handleCommentProduct = (productId) => {
    if (!commentInputs[productId]) return;
    // TODO: Optionally call backend to persist comment
    setProducts(products.map(p => p._id === productId ? { ...p, comments: [...(p.comments || []), { text: commentInputs[productId], user: { username: 'You' } }] } : p));
    setCommentInputs({ ...commentInputs, [productId]: '' });
  };

  // Mock invite handler
  const handleMockInvite = (e) => {
    e.preventDefault();
    setInviteStatus('');
    if (!inviteInput) return;
    // Add mock member to UI
    setMockMembers((prev) => [
      ...prev,
      inviteType === 'email' ? { email: inviteInput } : { username: inviteInput },
    ]);
    setInviteStatus('Invite sent! (mocked)');
    setInviteInput('');
  };

  // In the render, merge real and mock members for display
  const allMembers = [
    ...(wishlist?.members || []),
    ...mockMembers,
  ];

  // Helper to get display name
  const getDisplayName = (m) => m.username || m.email || '';
  const getAvatar = (m) => (m.username ? m.username[0] : (m.email ? m.email[0] : '?')).toUpperCase();

  // Add a render log
  console.log('Render: wishlist:', wishlist, 'error:', error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-purple-50">
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-4">
        {/* Group Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">{wishlist?.name}</h2>
              <div className="text-sm text-gray-500 mb-1">Owner: {wishlist?.owner?.username || wishlist?.owner?.email || 'You'}</div>
              <div className="flex flex-wrap gap-2 items-center mb-2">
                {allMembers.map((m, i) => (
                  getDisplayName(m) && (
                    <span key={i} className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {getDisplayName(m)}
                    </span>
                  )
                ))}
              </div>
              <form onSubmit={handleMockInvite} className="flex gap-2 items-center mt-2">
                <select value={inviteType} onChange={e => setInviteType(e.target.value)} className="border rounded p-1 text-xs">
                  <option value="email">Email</option>
                  <option value="username">Username</option>
                </select>
                <input
                  type="text"
                  className="border rounded p-1 text-xs"
                  placeholder={inviteType === 'email' ? 'Enter email' : 'Enter username'}
                  value={inviteInput}
                  onChange={e => setInviteInput(e.target.value)}
                />
                <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Invite</button>
              </form>
              {inviteStatus && <span className="text-green-600 text-xs mt-1 block">{inviteStatus}</span>}
            </div>
            <div className="flex flex-col gap-2 items-end md:items-center md:flex-row md:gap-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShareMsg('Link copied!');
                  setTimeout(() => setShareMsg(''), 1500);
                }}
                className="bg-violet-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-violet-700 transition"
              >
                Share
              </button>
              <button
                onClick={handleLeave}
                className="bg-green-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-600 transition"
              >
                Leave Group
              </button>
              {shareMsg && <span className="text-green-600 text-xs mt-1">{shareMsg}</span>}
              {leaveStatus && <span className="text-green-600 text-xs mt-1">{leaveStatus}</span>}
            </div>
          </div>
        </div>
        {/* Add Product Button */}
        <div className="flex justify-end mb-6">
          <button onClick={() => setShowAdd(true)} className="bg-violet-700 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-violet-800 transition">Add Product</button>
        </div>
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          {products.map(product => (
            <div key={product._id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition relative">
              <img src={product.imageUrl} alt={product.name} className="w-28 h-28 object-cover rounded mb-2 border" />
              <div className="font-bold text-lg text-center mb-1">{product.name}</div>
              <div className="text-green-700 font-semibold mb-1">₹{product.price}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-violet-200 text-violet-700 rounded-full font-bold text-xs">
                  {getAvatar(product.addedBy || {})}
                </span>
                <span className="text-xs text-gray-500">{getDisplayName(product.addedBy || {}) || 'Unknown'}</span>
              </div>
              <div className="flex gap-2 mb-2">
                <button onClick={() => handleLikeProduct(product._id)} className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-semibold hover:bg-violet-200 transition">Like ({likeCounts[product._id] || 0})</button>
                <button onClick={() => handleEditProduct(product)} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold hover:bg-yellow-200 transition">Edit</button>
                <button onClick={() => handleDeleteProduct(product._id)} className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold hover:bg-green-200 transition">Delete</button>
              </div>
              <div className="w-full mt-2">
                <div className="text-xs text-gray-500 mb-1">Comments:</div>
                <ul className="mb-2">
                  {(product.comments || []).map((c, i) => (
                    <li key={i} className="text-xs text-gray-700 mb-1">{c.text} {c.user ? <span className="text-gray-400">- {getDisplayName(c.user)}</span> : null}</li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input className="flex-1 p-1 border rounded text-xs" type="text" value={commentInputs[product._id] || ''} onChange={e => setCommentInputs({ ...commentInputs, [product._id]: e.target.value })} placeholder="Add comment" />
                  <button onClick={() => handleCommentProduct(product._id)} className="bg-violet-600 text-white px-2 py-1 rounded-full text-xs">Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Add Product Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form onSubmit={handleAddProduct} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative">
              <button type="button" onClick={() => setShowAdd(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
              <h3 className="text-xl font-bold mb-4 text-purple-700">Add Product</h3>
              <input className="w-full mb-3 p-2 border rounded" type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
              <input className="w-full mb-3 p-2 border rounded" type="text" placeholder="Image URL" value={newProduct.imageUrl} onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })} required />
              <input className="w-full mb-4 p-2 border rounded" type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required />
              <button type="submit" className="w-full bg-purple-700 text-white py-2 rounded-full font-semibold hover:bg-purple-800 transition">Add</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}