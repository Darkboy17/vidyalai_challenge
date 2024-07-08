const express = require('express');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');

const axios = require('axios'); // Ensure axios is required

const router = express.Router();

router.get('/', async (req, res) => {
  /*
     Replace dummy images by fetching each album of post using 
     "https://jsonplaceholder.typicode.com/albums/1/photos" in /api/v1/posts route.
  */

  const start = parseInt(req.query.start) || 0;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const posts = await fetchPosts({ start, limit });

    const postsWithImagesPromises = posts.map(async post => {
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/albums/${post.id}/photos`,
        );

        const images = response.data.map(photo => ({ url: photo.url }));

        return {
          ...post,
          images,
        };
      } catch (error) {
        console.error(`Failed to fetch photos for post ${post.id}:`, error);
        return {
          ...post,
          images: [],
        };
      }
    });

    const postsWithImages = await Promise.all(postsWithImagesPromises);
    res.json(postsWithImages);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

module.exports = router;
