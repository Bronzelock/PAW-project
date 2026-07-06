const express = require('express');
const router = express.Router();
const multer = require('multer');
const vaultModelController = require('../controllers/vaultModelController');
const {verifyToken} = require('../controllers/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {fileSize: 50 * 1024 * 1024}
});

router.get('/', vaultModelController.viewModels);
router.post('/', verifyToken, upload.single('file'), vaultModelController.addModel);
router.delete('/:id', verifyToken, vaultModelController.deleteModel);
router.get('/:id', vaultModelController.viewModelById);

module.exports = router;