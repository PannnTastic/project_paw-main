const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const authController = require('../controller/authController');

router.use(bodyParser.urlencoded({ extended: true }));

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Error logging out');
    }
    
    // Clear the session cookie
    res.clearCookie('connect.sid'); // Name might be different based on your session setup
    
    // Redirect to login page
    res.redirect('/login');
  });
});

module.exports = router;