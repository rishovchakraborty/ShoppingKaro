const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');

exports.addProduct = async (req, res, next) => {
  try {
    const { name, imageUrl, price } = req.body;
    const wishlist = await Wishlist.findById(req.params.wishlistId);
    if (!wishlist) {
      const err = new Error('Wishlist not found');
      err.status = 404;
      return next(err);
    }
    if (!wishlist.members.includes(req.user.userId)) {
      const err = new Error('Not authorized');
      err.status = 403;
      return next(err);
    }
    const product = new Product({
      name,
      imageUrl,
      price,
      addedBy: req.user.userId,
      wishlist: wishlist._id
    });
    await product.save();
    wishlist.products.push(product._id);
    await wishlist.save();
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { name, imageUrl, price } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      return next(err);
    }
    const wishlist = await Wishlist.findById(product.wishlist);
    if (!wishlist) {
      const err = new Error('Wishlist not found');
      err.status = 404;
      return next(err);
    }
    if (!wishlist.members.includes(req.user.userId)) {
      const err = new Error('Not authorized');
      err.status = 403;
      return next(err);
    }
    product.name = name || product.name;
    product.imageUrl = imageUrl || product.imageUrl;
    product.price = price || product.price;
    product.editedBy = req.user.userId;
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      return next(err);
    }
    const wishlist = await Wishlist.findById(product.wishlist);
    if (!wishlist) {
      const err = new Error('Wishlist not found');
      err.status = 404;
      return next(err);
    }
    if (!wishlist.members.includes(req.user.userId)) {
      const err = new Error('Not authorized');
      err.status = 403;
      return next(err);
    }
    await Product.deleteOne({ _id: product._id });
    wishlist.products.pull(product._id);
    await wishlist.save();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findById(req.params.wishlistId).populate({
      path: 'products',
      populate: { path: 'addedBy editedBy', select: 'username email' }
    });
    if (!wishlist) {
      const err = new Error('Wishlist not found');
      err.status = 404;
      return next(err);
    }
    if (!wishlist.members.includes(req.user.userId)) {
      const err = new Error('Not authorized');
      err.status = 403;
      return next(err);
    }
    res.json(wishlist.products);
  } catch (err) {
    next(err);
  }
};

// Bonus: Add comment to product
exports.addComment = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      return next(err);
    }
    product.comments.push({ user: req.user.userId, text: req.body.text });
    await product.save();
    res.json(product.comments);
  } catch (err) {
    next(err);
  }
};

// Bonus: Add emoji reaction to product
exports.addReaction = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      return next(err);
    }
    product.reactions.push({ user: req.user.userId, emoji: req.body.emoji });
    await product.save();
    res.json(product.reactions);
  } catch (err) {
    next(err);
  }
}; 