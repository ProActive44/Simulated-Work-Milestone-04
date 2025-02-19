const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

let JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  const { username, email, password, fullname } = req.body;

  try {
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return res
        .status(422)
        .json({ error: 'User already exists with that email' });
    }
    const existingUserByUsername = await User.findOne({ where: { username } });
    if (existingUserByUsername) {
      return res
        .status(422)
        .json({ error: 'User already exists with that username' });
    }

    const hashPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      username,
      fullname,
      email,
      password: hashPassword,
    });
    return res
      .status(200)
      .json({ user: newUser, message: 'Registered Successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User Not Found with Given email' });
    }

    let isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    let token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(200).json({ token, message: 'Login Successfully' });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

module.exports = { registerUser, loginUser };
