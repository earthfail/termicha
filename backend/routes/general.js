const express = require('express');
const jwt = require('jsonwebtoken');
const general_routes = express.Router();
const {
  getUserById,
  getUsers,
  usernameExists,
  verifyPassword,
  registerNewUser,
  hashPassword
} = require('../db/basic.js');




general_routes.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (! (await usernameExists(username))) {
    return res.status(208).json({ message: "Username or password are not correct" });
  }

  if (await verifyPassword(username, password)) {
    try {
      const accessToken = jwt.sign({ data: username }, 'siuuu', { expiresIn: '1h' });

      req.session.authorization = {
        accessToken,
        username
      };

      return res.status(200).send("User successfully logged in");
    } catch (err) {
      console.error('Error creating JWT token:', err);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(208).json({ message: "Username or password are not correct" });
  }
});



general_routes.post('/register', async (req, res) => {
  const { username, password, confirmedPassword } = req.body;
  console.log(req.body);
  // Check if username or email is missing
  if (!username || !password) {
    return res.status(400).json({ message: 'Username, password are required' });
  }

  if (password !== confirmedPassword) {
    return res.status(400).json({ message: 'Make sure to confirm the password correctly' });
  }
  // Check if the username or email already exists in the database
  if (await usernameExists(username)) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  try {
    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Save the user to the database (replace this with your actual database logic)
    await registerNewUser(username, hashedPassword);

    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error creating user:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = general_routes;