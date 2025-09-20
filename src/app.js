const express = require('express');
const { connectDB } = require('./config/database');
const { User } = require('./model/user');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middleware/user');
connectDB();

const app = express();
const port = 3000;
app.use(express.json());
app.use(cookieParser());

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ message: 'Password is not strong enough' });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: 'User registered successfully' });    
});

