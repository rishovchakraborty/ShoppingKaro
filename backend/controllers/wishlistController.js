const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const User = require('../models/User');

exports.createWishlist = async (req, res, next) => {
  try {
    const { name } = req.body;
    const wishlist = new Wishlist({
      name,
      owner: req.user.userId,
      members: [req.user.userId],
      products: []
    });
    await wishlist.save();
    res.status(201).json(wishlist);
  } catch (err) {
    next(err);
  }
};

exports.getWishlists = async (req, res, next) => {
  try {
    const wishlists = await Wishlist.find({ members: req.user.userId })
      .populate('owner', 'username email')
      .populate({ path: 'products', populate: { path: 'addedBy', select: 'username email' } });
    res.json(wishlists);
  } catch (err) {
    next(err);
  }
};

exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id)
      .populate('owner', 'username email')
      .populate({ path: 'products', populate: { path: 'addedBy', select: 'username email' } });
    if (!wishlist) {
      const err = new Error('Wishlist not found');
      err.status = 404;
      return next(err);
    }
    if (!wishlist.members.includes(req.user.userId)) {
      const err = new Error('Access denied');
      err.status = 403;
      return next(err);
    }
    res.json(wishlist);
  } catch (err) {
    next(err);
  }
};

exports.updateWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist) {
      const err = new Error('Wishlist not found');
      err.status = 404;
      return next(err);
    }
    if (wishlist.owner.toString() !== req.user.userId) {
      const err = new Error('Not authorized');
      err.status = 403;
      return next(err);
    }
    wishlist.name = req.body.name || wishlist.name;
    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    next(err);
  }
};

exports.deleteWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist) {
      const err = new Error('Wishlist not found');
      err.status = 404;
      return next(err);
    }
    if (wishlist.owner.toString() !== req.user.userId) {
      const err = new Error('Not authorized');
      err.status = 403;
      return next(err);
    }
    await Product.deleteMany({ wishlist: wishlist._id });
    await wishlist.deleteOne();
    res.json({ message: 'Wishlist deleted' });
  } catch (err) {
    next(err);
  }
};

// Update inviteMember to support email/username
exports.inviteMember = async (req, res, next) => {
  try {
    let { userId, email, username } = req.body;
    let user;
    if (!userId && (email || username)) {
      user = await User.findOne(email ? { email } : { username });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      userId = user._id;
    }
    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist) {
      const err = new Error('Wishlist not found');
      err.status = 404;
      return next(err);
    }
    if (wishlist.owner.toString() !== req.user.userId) {
      const err = new Error('Not authorized');
      err.status = 403;
      return next(err);
    }
    if (!wishlist.members.includes(userId)) {
      wishlist.members.push(userId);
      await wishlist.save();
    }
    res.json({ message: 'User invited' });
  } catch (err) {
    next(err);
  }
};

// Add leaveWishlist endpoint
exports.leaveWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    // Owner cannot leave their own wishlist
    if (wishlist.owner.toString() === req.user.userId) {
      return res.status(400).json({ error: 'Owner cannot leave their own wishlist' });
    }
    wishlist.members = wishlist.members.filter(
      m => m.toString() !== req.user.userId
    );
    await wishlist.save();
    res.json({ message: 'Left wishlist' });
  } catch (err) {
    next(err);
  }
}; 