const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Quan ly dai ly' });
});

module.exports = router;