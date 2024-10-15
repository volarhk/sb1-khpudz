const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// In-memory storage (replace with a database in a real application)
let posts = [];

router.post('/', (req, res) => {
  const newPost = { id: uuidv4(), ...req.body };
  posts.push(newPost);
  res.status(201).json(newPost);
});

router.get('/', (req, res) => {
  res.json(posts);
});

router.get('/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

module.exports = router;