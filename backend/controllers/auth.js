require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET ?? 'jwt-secret-sauce';

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.send({ token });
  } catch (err) {
    res
      .status(500)
      .send(Object.keys(err.errors).map((key) => err.errors[key].message));
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      bcrypt.compare(password, user.password, (error, same) => {
        if (same) {
          const token = jwt.sign({ id: user._id }, JWT_SECRET);
          res.send({ token });
        } else {
          res.status(401).send({ message: 'Unauthorized' });
        }
      });
    } else {
      res.status(401).send({ message: 'Unauthorized' });
    }
  } catch (err) {
    res.status(500).send('Could not login!');
  }
};
