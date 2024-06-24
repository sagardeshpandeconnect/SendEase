const pool = require("../database/connection");
const crypto = require('crypto');
const multer = require('multer');

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
    return res.status(400).send('No file uploaded.');
  }
  const token = generateToken();

  const client = await pool.connect();
  try {
    const query = 'INSERT INTO files (filename, mimetype, content, size, token) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    const values = [file.originalname, file.mimetype, file.buffer, file.size, token];

    const result = await client.query(query, values);
    const fileId = result.rows[0].id;
    res.status(200).send({ message: `File uploaded successfully with ID: ${fileId}`, downloadLink: `http://localhost:3001/api/files/download/${fileId}`, shareableLink: `http://localhost:3001/api/files/share/${token}` });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  } finally {
    client.release();
  }
};

const downloadFile = async (req, res) => {
  const fileId = req.params.id;

  const client = await pool.connect();
  try {
    const query = 'SELECT filename, mimetype, content FROM files WHERE id = $1';
    const result = await client.query(query, [fileId]);

    if (result.rows.length === 0) {
      return res.status(404).send('File not found.');
    }

    const file = result.rows[0];
    res.setHeader('Content-Disposition', `attachment; filename=${file.filename}`);
    res.setHeader('Content-Type', file.mimetype);
    res.send(file.content);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  } finally {
    client.release();
  }
};

const deleteFile = async (req, res) => {
  const fileId = req.params.id;

  const client = await pool.connect();
  try {
    const query = 'DELETE FROM files WHERE id = $1 RETURNING id';
    const result = await client.query(query, [fileId]);

    if (result.rows.length === 0) {
      return res.status(404).send('File not found.');
    }

    res.status(200).send({ message: `File with ID: ${fileId} deleted successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  } finally {
    client.release();
  }
};

const fetchAllFiles = async (req, res) => {
  const client = await pool.connect();
  try {
    const query = 'SELECT * FROM files';
    const result = await client.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  } finally {
    client.release();
  }
};

const shareFile = async (req, res) => {
  const token = req.params.token;

  const client = await pool.connect();
  try {
    const query = 'SELECT filename, mimetype, content FROM files WHERE token = $1';
    const result = await client.query(query, [token]);

    if (result.rows.length === 0) {
      return res.status(404).send('File not found.');
    }

    const file = result.rows[0];
    res.setHeader('Content-Disposition', `attachment; filename=${file.filename}`);
    res.setHeader('Content-Type', file.mimetype);
    res.send(file.content);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  } finally {
    client.release();
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
