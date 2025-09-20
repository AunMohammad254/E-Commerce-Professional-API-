const express = require('express');
const router = express.Router();
const { 
    createProduct, 
    getAllProducts, 
    getProduct, 
    updateProduct, 
    deleteProduct,
    fetchExternalProducts 
} = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');

router.get('/external', fetchExternalProducts);
router.post('/', authenticate, createProduct);
router.get('/', authenticate, getAllProducts);
router.get('/:id', authenticate, getProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

module.exports = router;