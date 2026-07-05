const express = require('express');
const router = express.Router();
const vaultModelController = require('../controllers/vaultModelController');
const {verifyToken} = require('../controllers/authMiddleware');

router.get('/', vaultModelController.viewModels);
router.post('/', verifyToken, vaultModelController.addModel);

module.exports = router;