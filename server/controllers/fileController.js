const crypto = require('crypto');
const multer = require('multer');
const File = require('../models/File'); // Adjust the path as needed


// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Generate a unique token
const generateToken = () => {
  return crypto.randomBytes(10).toString('hex');
};

const uploadFile = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file selected.');
  }
  const token = generateToken();

  try {
    const newFile = new File({
      filename: file.originalname,
      mimetype: file.mimetype,
      content: file.buffer,
      size: file.size,
      token: token
    });

    await newFile.save();
    res.status(200).send({ message: `File uploaded successfully with ID: ${newFile._id}`, downloadLink: `http://localhost:3001/api/files/download/${newFile._id}`, shareableLink: `http://localhost:3001/api/files/share/${token}` });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const downloadFile = async (req, res) => {
  const fileId = req.params.id;

  try {
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).send('File not found.');
    }

    res.setHeader('Content-Disposition', `attachment; filename=${file.filename}`);
    res.setHeader('Content-Type', file.mimetype);
    res.send(file.content);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const deleteFile = async (req, res) => {
  const fileId = req.params._id;

  try {
    const file = await File.findByIdAndDelete(fileId);

    if (!file) {
      return res.status(404).send('File not found.');
    }

    res.status(200).send({ message: `File with ID: ${fileId} deleted successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const fetchAllFiles = async (req, res) => {
  try {
    const files = await File.find().select('mimetype size createdAt filename token');
    res.status(200).json(files);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const shareFile = async (req, res) => {
  const token = req.params.token;

  try {
    const file = await File.findOne({ token });

    if (!file) {
      return res.status(404).send('File not found.');
    }

    res.setHeader('Content-Disposition', `attachment; filename=${file.filename}`);
    res.setHeader('Content-Type', file.mimetype);
    res.send(file.content);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile,
  fetchAllFiles,
  shareFile,
  upload
};