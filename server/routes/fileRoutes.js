const express = require('express');
const fileController = require('../controllers/fileController');
const router = express.Router();

// Multer middleware for file upload
const upload = fileController.upload;

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/download/:id', fileController.downloadFile);
router.delete('/delete/:_id', fileController.deleteFile);
router.get('/', fileController.fetchAllFiles);
router.get('/share/:token', fileController.shareFile);

module.exports = router;
