const loadEnv = require("./config/env");
// Load environment variables
loadEnv();

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pool = require("./database/connection");
const crypto = require('crypto');




const app = express();
const port = 3001;

// Enable CORS
app.use(cors());



// Middleware
app.use(express.json());



// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Generate a unique token
const generateToken = () => {
  return crypto.randomBytes(10).toString('hex');
};


// Endpoint to upload files
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }
  const token = generateToken();

  const client = await pool.connect();
  try {
    const query = 'INSERT INTO files (filename, mimetype, content, token) VALUES ($1, $2, $3, $4) RETURNING id';
    const values = [file.originalname, file.mimetype, file.buffer, token];

    const result = await client.query(query, values);
    const fileId = result.rows[0].id;
    res.status(200).send({ message: `File uploaded successfully with ID: ${fileId}`, downloadLink: `http://localhost:3001/download/${fileId}`, shareableLink: `http://localhost:3001/share/${token}` });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  } finally {
    client.release();
  }
});

// Endpoint to download files
app.get('/download/:id', async (req, res) => {
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
});

// Endpoint to delete files
app.delete('/delete/:id', async (req, res) => {
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
});

// Endpoint to fetch all files
app.get('/files', async (req, res) => {
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
});

// Endpoint to download files via shareable link
app.get('/share/:token', async (req, res) => {
  const token = req.params.token;
  // console.log(req)

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
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
