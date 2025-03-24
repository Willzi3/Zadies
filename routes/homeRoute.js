// Import express
const express = require('express');
 
const router = express.Router();

router.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the Homepage</h1><p>Server is working!</p>`
    );
});

module.exports = router;