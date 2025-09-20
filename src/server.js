require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:3002'], // Allow frontend on different ports and direct access
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Serve static files from the React app build directory
const clientBuildPath = path.join(__dirname, '../client/build');
app.use(express.static(clientBuildPath));

// Simple catch-all route for React app
app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ success: false, message: 'API endpoint not found' });
    }
    
    // Serve React app for all other routes
    const indexPath = path.join(clientBuildPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            // If build doesn't exist, serve a simple fallback page
            res.status(200).send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>E-Commerce App</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            margin: 0; 
                            padding: 20px; 
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            min-height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .container { 
                            text-align: center; 
                            max-width: 600px;
                        }
                        h1 { 
                            font-size: 2.5rem; 
                            margin-bottom: 1rem;
                        }
                        p { 
                            font-size: 1.2rem; 
                            margin-bottom: 2rem;
                        }
                        .btn {
                            display: inline-block;
                            padding: 12px 24px;
                            background: rgba(255,255,255,0.2);
                            border: 2px solid rgba(255,255,255,0.3);
                            border-radius: 8px;
                            color: white;
                            text-decoration: none;
                            font-weight: bold;
                            margin: 0 10px;
                            transition: all 0.3s ease;
                        }
                        .btn:hover {
                            background: rgba(255,255,255,0.3);
                            border-color: rgba(255,255,255,0.5);
                        }
                        .api-info {
                            margin-top: 2rem;
                            padding: 20px;
                            background: rgba(255,255,255,0.1);
                            border-radius: 8px;
                            backdrop-filter: blur(10px);
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🚀 E-Commerce API Server</h1>
                        <p>Welcome to the E-Commerce Professional API!</p>
                        <p>The React frontend is not built yet. To start the full application:</p>
                        
                        <div style="margin: 20px 0;">
                            <a href="/api/products/external" class="btn">View Products API</a>
                            <a href="/health" class="btn">Health Check</a>
                        </div>
                        
                        <div class="api-info">
                            <h3>📋 Available API Endpoints:</h3>
                            <ul style="text-align: left; display: inline-block;">
                                <li><strong>POST</strong> /api/auth/register - User registration</li>
                                <li><strong>POST</strong> /api/auth/login - User login</li>
                                <li><strong>GET</strong> /api/products - Get all products</li>
                                <li><strong>GET</strong> /api/products/external - Get external products</li>
                                <li><strong>GET</strong> /api/users/profile - Get user profile</li>
                                <li><strong>POST</strong> /api/orders - Create order</li>
                            </ul>
                        </div>
                        
                        <p style="margin-top: 2rem; font-size: 0.9rem; opacity: 0.8;">
                            To build and run the React frontend, navigate to the client directory and run: <br>
                            <code style="background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 4px;">npm install && npm start</code>
                        </p>
                    </div>
                </body>
                </html>
            `);
        }
    });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;