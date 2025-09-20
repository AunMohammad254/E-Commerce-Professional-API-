const Product = require('../models/Product');

// Create Product
const createProduct = async (req, res) => {
    try {
        const productData = {
            ...req.body,
            createdBy: req.user.id
        };

        const product = await Product.create(productData);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message
        });
    }
};

// Get All Products
const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, brand, search } = req.query;
        const query = { isDeleted: false };

        // Build query
        if (category) query.category = category;
        if (brand) query.brand = brand;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        const count = await Product.countDocuments(query);

        // Log access
        const productIds = products.map(p => p._id);
        await Product.updateMany(
            { _id: { $in: productIds } },
            { 
                $push: { 
                    accessedBy: {
                        user: req.user.id,
                        timestamp: Date.now()
                    }
                }
            }
        );

        res.status(200).json({
            success: true,
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
};

// Get Single Product
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!product || product.isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Log access
        product.accessedBy.push({
            user: req.user.id,
            timestamp: Date.now()
        });
        await product.save();

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: error.message
        });
    }
};

// Update Product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product || product.isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check ownership
        if (product.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this product'
            });
        }

        // Update product
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                product[key] = req.body[key];
            }
        });
        product.updatedBy = req.user.id;

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update product',
            error: error.message
        });
    }
};

// Delete Product (Soft Delete)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product || product.isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check ownership
        if (product.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this product'
            });
        }

        // Soft delete
        product.isDeleted = true;
        product.deletedBy = req.user.id;
        product.deletedAt = Date.now();
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
};

// Fetch External Products (from DummyJSON)
const fetchExternalProducts = async (req, res) => {
    try {
        console.log('Fetching external products from DummyJSON...');
        
        // Use node-fetch to make the API call
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('https://dummyjson.com/products', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'E-Commerce-API/1.0'
            },
            timeout: 10000 // 10 second timeout
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('External API response received:', data.products ? data.products.length : 0, 'products');

        // Validate response structure
        if (!data || !data.products || !Array.isArray(data.products)) {
            throw new Error('Invalid response structure from external API');
        }

        res.status(200).json({
            success: true,
            products: data.products,
            total: data.total || data.products.length,
            message: `Successfully fetched ${data.products.length} products from external API`
        });
    } catch (error) {
        console.error('External API Error:', error);
        
        // Fallback: return sample products if external API fails
        const fallbackProducts = [
            {
                id: 1,
                title: "Sample Product 1",
                description: "This is a sample product for testing purposes",
                price: 29.99,
                discountPercentage: 10,
                rating: 4.5,
                stock: 100,
                brand: "Sample Brand",
                category: "electronics",
                thumbnail: "https://via.placeholder.com/300x300?text=Sample+Product+1"
            },
            {
                id: 2,
                title: "Sample Product 2",
                description: "Another sample product for testing",
                price: 49.99,
                discountPercentage: 15,
                rating: 4.2,
                stock: 50,
                brand: "Test Brand",
                category: "clothing",
                thumbnail: "https://via.placeholder.com/300x300?text=Sample+Product+2"
            }
        ];

        res.status(200).json({
            success: true,
            products: fallbackProducts,
            total: fallbackProducts.length,
            message: 'Using fallback products due to external API error',
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    fetchExternalProducts
};