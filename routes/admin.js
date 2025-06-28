const express = require("express");
const adminController = require("../controllers/admin");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get("/add-product", adminController.getAddProduct);

router.get("/products", adminController.getProduct); 

router.post("/add-product", adminController.postAddProduct);

router.get("/edit-product/:prodId", adminController.getEditProduct);

router.post("/edit-product/", adminController.postEditProduct);

router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
// exports.routes = router;
// exports.products = products;
