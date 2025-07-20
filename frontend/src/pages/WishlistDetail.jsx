import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Common/Navbar';
import { getWishlist, addProduct, updateProduct, deleteProduct, addComment, addReaction, inviteMember, leaveWishlist, getAllUsers } from '../services/api';
import {
  connectSocket,
  disconnectSocket,
  joinWishlistRoom,
  leaveWishlistRoom,
  sendProductUpdate,
  onProductUpdated,
  sendChatMessage,
  onChatMessage,
} from '../services/socket';

export default function WishlistDetail({ onLogout }) {
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
  const [allUsers, setAllUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userFetchError, setUserFetchError] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatBoxRef = useRef(null); // Ref for chat box scrolling

  useEffect(() => {
    // Get userId from localStorage (assumes it's stored after login)
    const userId = localStorage.getItem('userId');
    connectSocket(userId);
    joinWishlistRoom(id);

    // Listen for real-time product updates
    onProductUpdated(({ product, action }) => {
      setProducts(prevProducts => {
        if (action === 'add') return [...prevProducts, product];
        if (action === 'edit') return prevProducts.map(p => p._id === product._id ? product : p);
        if (action === 'delete') return prevProducts.filter(p => p._id !== product._id);
        return prevProducts;
      });
    });

    // Listen for real-time chat messages (register only once, clean up)
    const chatHandler = ({ message, user, timestamp }) => {
      setChatMessages(prev => [...prev, { sender: user, text: message, time: new Date(timestamp) }]);
    };
    onChatMessage(chatHandler);

    // Cleanup: remove only this chat handler
    return () => {
      import('../services/socket').then(({ default: socket }) => {
        socket.off('chatMessage', chatHandler);
      });
      leaveWishlistRoom(id);
      disconnectSocket();
    };
  }, [id]);

  // Scroll chat to bottom when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const res = await getWishlist(id);
        console.log('Fetched wishlist:', res.data);
        setWishlist(res.data);
        setProducts(res.data.products || []);
        // Show chat history from backend
        setChatMessages(
          (res.data.messages || []).map(m => ({
            sender: m.username || (m.user && (m.user.username || m.user.email)) || 'Unknown',
            text: m.text,
            time: new Date(m.timestamp)
          }))
        );
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

  useEffect(() => {
    if (inviteType === 'username') {
      getAllUsers()
        .then(res => {
          setAllUsers(res.data);
          setUserFetchError('');
        })
        .catch(() => {
          setAllUsers([]);
          setUserFetchError('Failed to fetch users');
        });
    }
  }, [inviteType]);

  useEffect(() => {
    if (inviteType === 'username' && userSearch) {
      setFilteredUsers(allUsers.filter(u => u.username && u.username.toLowerCase().includes(userSearch.toLowerCase())));
    } else {
      setFilteredUsers([]);
    }
  }, [userSearch, allUsers, inviteType]);

  // Update handleAddProduct to emit real-time event
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await addProduct(id, { ...newProduct, price: Number(newProduct.price) });
      // Emit real-time product add event
      sendProductUpdate({ wishlistId: id, product: res.data, action: 'add' });
      setProducts(prev => [...prev, res.data]);
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

  // Update handleUpdateProduct to emit real-time event
  const handleUpdateProduct = async (e, productId) => {
    e.preventDefault();
    try {
      const res = await updateProduct(id, productId, { ...editProduct, price: Number(editProduct.price) });
      // Emit real-time product edit event
      sendProductUpdate({ wishlistId: id, product: res.data, action: 'edit' });
      setProducts(products.map(p => (p._id === productId ? res.data : p)));
      setEditingId(null);
    } catch (err) {
      setError('Failed to update product.');
    }
  };

  // Update handleDeleteProduct to emit real-time event
  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(id, productId);
      // Emit real-time product delete event
      sendProductUpdate({ wishlistId: id, product: { _id: productId }, action: 'delete' });
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

  // Helper to get current user info
  const currentUsername = localStorage.getItem('username');
  const currentEmail = localStorage.getItem('email');
  const displaySender = (sender) =>
    sender === currentUsername || sender === currentEmail ? 'You' : sender;

  // Update handleSendChat to send real username/email
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    // Send actual username/email
    sendChatMessage({
      wishlistId: id,
      message: chatInput,
      user: currentUsername || currentEmail || 'Unknown'
    });
    setChatInput('');
  };

  // In the render, merge real and mock members for display
  const allMembers = [
    ...(wishlist?.members || [])
  ];

  // Helper to get display name
  const getDisplayName = (m) => m?.username || m?.email || 'Unknown';
  const getAvatar = (m) => {
    if (m?.username && m.username.length > 0) return m.username[0].toUpperCase();
    if (m?.email && m.email.length > 0) return m.email[0].toUpperCase();
    return '?';
  };
  // Debug log for members
  console.log('Members:', wishlist?.members);

  // Add a render log
  console.log('Render: wishlist:', wishlist, 'error:', error);

  // Add a fallback image URL
  const fallbackImage = '/public/placeholder.png'; // You can use a local placeholder image

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-purple-50 to-purple-200">
      <Navbar onLogout={onLogout} />
      <div className="max-w-3xl mx-auto py-12 px-4">
        {/* Group Info Card */}
        <div className="bg-white/90 rounded-3xl shadow-2xl p-10 mb-10 flex flex-col gap-6 border border-purple-100 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">{wishlist?.name}</h2>
              <div className="text-sm text-gray-500 mb-1">Owner: {wishlist?.owner?.username || wishlist?.owner?.email || 'You'}</div>
              {/* Remove the group member display from the group info card */}
              {/* <div className="flex flex-wrap gap-2 items-center mb-2">
                {(wishlist?.members || []).map((m, i) => (
                  <span key={i} className="flex items-center gap-1 bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-semibold">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-violet-200 text-violet-700 rounded-full font-bold text-xs">
                      {getAvatar(m)}
                    </span>
                    {getDisplayName(m)}
                  </span>
                ))}
              </div> */}
              {/* Use real invite handler */}
              <form onSubmit={handleInvite} className="flex gap-2 items-center mt-2 relative">
                <select value={inviteType} onChange={e => setInviteType(e.target.value)} className="border rounded p-1 text-xs">
                  <option value="email">Email</option>
                  <option value="username">Username</option>
                </select>
                {inviteType === 'email' ? (
                  <input
                    type="text"
                    className="border rounded p-1 text-xs"
                    placeholder="Enter email"
                    value={inviteInput}
                    onChange={e => setInviteInput(e.target.value)}
                  />
                ) : (
                  <div className="relative w-48">
                    <input
                      type="text"
                      className="border rounded p-1 text-xs w-full"
                      placeholder="Search username"
                      value={userSearch}
                      onChange={e => {
                        setUserSearch(e.target.value);
                        setInviteInput(e.target.value);
                      }}
                      autoComplete="off"
                    />
                    {userSearch && (filteredUsers.length > 0 || userSearch !== inviteInput) && (
                      <ul className="absolute z-20 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto shadow-lg">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map(u => (
                            <li
                              key={u._id}
                              className="px-3 py-1 hover:bg-violet-100 cursor-pointer text-xs"
                              onClick={() => {
                                setInviteInput(u.username);
                                setUserSearch(u.username); // Keep input field text
                                setFilteredUsers([]); // Hide dropdown
                              }}
                            >
                              {u.username} <span className="text-gray-400">({u.email})</span>
                            </li>
                          ))
                        ) : (
                          <li className="px-3 py-2 text-xs text-gray-400 select-none">No users found</li>
                        )}
                        {userFetchError && (
                          <li className="px-3 py-2 text-xs text-red-500 select-none">{userFetchError}</li>
                        )}
                      </ul>
                    )}
                  </div>
                )}
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
          {/* Dummy Chat Box */}
          <div className="mt-6">
            <div className="font-bold text-purple-700 mb-2">Group Chat (Dummy)</div>
            <div className="bg-gray-50 rounded-lg p-3 h-40 overflow-y-auto mb-2 border border-purple-100" ref={chatBoxRef}>
              {chatMessages.length === 0 ? (
                <div className="text-gray-400 text-sm text-center">No messages yet. Start the conversation!</div>
              ) : (
                chatMessages.map((msg, i) => (
                  <div key={i} className="mb-2 flex flex-col">
                    <span className="text-xs text-purple-600 font-bold">
                      {displaySender(msg.sender)}{' '}
                      <span className="text-gray-400 font-normal">{msg.time.toLocaleTimeString()}</span>
                    </span>
                    <span className="text-sm text-gray-800 ml-2">{msg.text}</span>
                  </div>
                ))
              )}
            </div>
            <form className="flex gap-2" onSubmit={handleSendChat}>
              <input
                type="text"
                className="flex-1 border rounded p-2 text-sm"
                placeholder="Type a message..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
              />
              <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-full font-bold hover:bg-purple-800 transition">Send</button>
            </form>
          </div>
        </div>
        {/* Add Product Button */}
        <div className="flex justify-end mb-8">
          <button onClick={() => setShowAdd(true)} className="bg-gradient-to-r from-violet-700 to-purple-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:from-violet-800 hover:to-purple-700 transition text-lg">Add Product</button>
        </div>
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">
          {products.map(product => (
            <div key={product._id} className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center hover:shadow-2xl transition-all duration-200 min-w-[320px] w-full max-w-xl mx-auto border border-purple-100">
              <img
                src={product.imageUrl || fallbackImage}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-xl mb-3 border bg-gray-100 shadow-sm"
                onError={e => { e.target.onerror = null; e.target.src = fallbackImage; }}
              />
              <div className="font-bold text-xl text-center mb-2 text-gray-800">{product.name}</div>
              <div className="text-green-700 font-bold mb-2 text-lg">₹{product.price}</div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-violet-200 text-violet-700 rounded-full font-bold text-base">
                  {getAvatar(product.addedBy || {})}
                </span>
                <span className="text-sm text-gray-500">{getDisplayName(product.addedBy || {}) || 'Unknown'}</span>
              </div>
              <div className="flex gap-3 mb-3">
                <button onClick={() => handleLikeProduct(product._id)} className="bg-violet-100 text-violet-700 px-4 py-1 rounded-full font-semibold hover:bg-violet-200 transition">Like ({likeCounts[product._id] || 0})</button>
                <button onClick={() => handleEditProduct(product)} className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full font-semibold hover:bg-yellow-200 transition">Edit</button>
                <button onClick={() => handleDeleteProduct(product._id)} className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-semibold hover:bg-green-200 transition">Delete</button>
              </div>
              <div className="w-full mt-2">
                <div className="text-xs text-gray-500 mb-1">Comments:</div>
                <ul className="mb-2">
                  {(product.comments || []).map((c, i) => (
                    <li key={i} className="text-xs text-gray-700 mb-1">{c.text} {c.user ? <span className="text-gray-400">- {getDisplayName(c.user)}</span> : null}</li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input className="flex-1 p-2 border rounded text-xs" type="text" value={commentInputs[product._id] || ''} onChange={e => setCommentInputs({ ...commentInputs, [product._id]: e.target.value })} placeholder="Add comment" />
                  <button onClick={() => handleCommentProduct(product._id)} className="bg-violet-600 text-white px-3 py-1 rounded-full text-xs">Add</button>
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