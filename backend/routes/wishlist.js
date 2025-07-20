const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const auth = require('../middleware/auth');

router.post('/', auth, wishlistController.createWishlist);
router.get('/', auth, wishlistController.getWishlists);
router.get('/:id', auth, wishlistController.getWishlist);
router.put('/:id', auth, wishlistController.updateWishlist);
router.delete('/:id', auth, wishlistController.deleteWishlist);
router.post('/:id/invite', auth, wishlistController.inviteMember);
// Accept invite to join wishlist
router.post('/:id/accept-invite', auth, wishlistController.acceptInvite);
router.post('/:id/leave', auth, wishlistController.leaveWishlist);

module.exports = router; 