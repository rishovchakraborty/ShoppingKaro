const express = require('express');
const router = express.Router({ mergeParams: true });
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

router.post('/', auth, productController.addProduct);
router.get('/', auth, productController.getProducts);
router.put('/:productId', auth, productController.updateProduct);
router.delete('/:productId', auth, productController.deleteProduct);
// Bonus
router.post('/:productId/comment', auth, productController.addComment);
router.post('/:productId/reaction', auth, productController.addReaction);

module.exports = router; 