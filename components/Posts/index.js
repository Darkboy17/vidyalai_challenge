import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import { useWindowWidth } from '../hooks/useWindowWidth';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isSmallerDevice } = useWindowWidth();

  const [start, setStart] = useState(0); // Track the start index
  const limit = isSmallerDevice ? 5 : 10; // Adjust limit based on device size
  const [hasMore, setHasMore] = useState(true);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchPosts(); // Fetch initial posts when component mounts
    fetchUserData();
  }, [isSmallerDevice]); // Update posts when device size changes

  const fetchUserData = async () => {
    try {
      const { data: users } = await axios.get('/api/v1/users');
      setUserData(users);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data: posts } = await axios.get('/api/v1/posts', {
        params: { start: 0, limit },
      });
      setPosts(posts); // Update posts state with fetched posts
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load more post when a user clicks 'Load More'
  const handleClick = async () => {
    setIsLoading(true);
    try {
      const nextStart = start + limit;

      // console.log('Requesting posts with start:', nextStart, 'and limit:',limit);

      const { data: newPosts } = await axios.get('/api/v1/posts', {
        params: { start: nextStart, limit },
      });

      // In the handleClick function, after fetching new posts:
      if (newPosts.length < limit) {
        setHasMore(false);
      }

      setPosts(prevPosts => [...prevPosts, ...newPosts]); // Append new posts
      setStart(nextStart); // Update start index for next fetch
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map((post, index) => (
          <Post key={index} post={post} userData={userData} />
        ))}
      </PostListContainer>

      {/*
      Implemented functionality to load more posts upon clicking the "Load More" button and
      also to hide the "Load More" button if no posts exist.
      */}

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {hasMore && (
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More'}
          </LoadMoreButton>
        )}
      </div>
    </Container>
  );
}
