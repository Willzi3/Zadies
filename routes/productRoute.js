//import express
const express = require('express');
//import productController functionality
const productController = require('../controller/product.controller')

const router = express.Router();

//Product Routes (Crud functionality)
router.get('/:product_id', productController.showProduct);
router.get('/', productController.showAllProducts);
router.post('/', productController.createProduct);
router.patch('/:product_id', productController.updateProduct);
router.delete('/:product_id', productController.deleteProduct);

module.exports = router;