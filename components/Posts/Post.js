import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import styled from '@emotion/styled';

const PostContainer = styled.div(() => ({
  width: '300px',
  margin: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  overflow: 'hidden',
}));

const CarouselContainer = styled.div(() => ({
  position: 'relative',
}));

const Carousel = styled.div(() => ({
  display: 'flex',
  overflowX: 'scroll',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  position: 'relative',
}));

const CarouselItem = styled.div(() => ({
  flex: '0 0 auto',
  scrollSnapAlign: 'start',
  display: 'flex',
  alignItems: 'center',
}));

const Image = styled.img(() => ({
  width: '280px',
  height: 'auto',
  maxHeight: '300px',
  padding: '10px',
}));

const Content = styled.div(() => ({
  padding: '10px',
  '& > h2': {
    marginBottom: '16px',
  },
}));

const Button = styled.button(() => ({
  position: 'absolute',
  top: '50%', // For centering the carousel navigation buttons vertically relative to the image.
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  border: 'none',
  color: '#000',
  fontSize: '20px',
  cursor: 'pointer',
  height: '50px',
}));

const PrevButton = styled(Button)`
  left: 10px;
`;

const NextButton = styled(Button)`
  right: 10px;
`;

// Added this new styled component for displaying user data
const UserDataContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 0px solid #ccc; // for a visual separation
`;

const ProfileCircle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: grey;
  color: white;
  border-radius: 50%;
  font-size: 18px;
  font-weight: 700;
`;

const Post = ({ post, userData }) => {
  const carouselRef = useRef(null);

  const itemWidth = 300;

  // Find the user data for each post
  const usrData = userData.find(user => user.id === post.userId);

  // Modified this
  const handleNextClick = () => {
    if (carouselRef.current) {
      const scrollAmount = itemWidth;
      const currentScroll = carouselRef.current.scrollLeft;
      const targetScroll =
        Math.round(currentScroll / itemWidth) * itemWidth + scrollAmount;

      carouselRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  // Modified this
  const handlePrevClick = () => {
    if (carouselRef.current) {
      const scrollAmount = itemWidth;
      const currentScroll = carouselRef.current.scrollLeft;
      const targetScroll =
        Math.round(currentScroll / itemWidth) * itemWidth - scrollAmount;

      carouselRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  // for getting the initials from a full name, ignoring honorifics
  const getInitials = fullName => {
    // List of common honorifics to ignore
    const honorifics = [
      'mr.',
      'mrs.',
      'ms.',
      'miss',
      'dr.',
      'prof.',
      'rev',
      'hon',
      'sir',
      'madam',
    ];

    // Split the full name into words
    const names = fullName.toLowerCase().split(' ');

    // Filter out honorifics
    const filteredNames = names.filter(name => !honorifics.includes(name));

    // If no valid names remain after filtering, return 'NN'
    if (filteredNames.length === 0) return 'NN';

    // Get the first and last name initials
    const firstInitial = filteredNames[0]?.charAt(0).toUpperCase();
    const lastInitial =
      filteredNames.length > 1
        ? filteredNames[filteredNames.length - 1]?.charAt(0).toUpperCase()
        : '';

    return firstInitial + lastInitial || 'NN';
  };

  return (
    <PostContainer>
      {
        // Display the user's name and email in each post.
        // Show the first letter for both the first and last names.
      }

      {userData && (
        <UserDataContainer>
          <ProfileCircle>{getInitials(usrData.name)}</ProfileCircle>
          <div>
            <h4>{usrData.name}</h4>
            <p style={{ fontSize: '14px' }}>{usrData.email}</p>
          </div>
        </UserDataContainer>
      )}
      <CarouselContainer>
        <Carousel ref={carouselRef}>
          {post.images?.length > 0 &&
            post.images.map((image, index) => (
              <CarouselItem key={index}>
                <Image src={image.url} alt={post.title} />
              </CarouselItem>
            ))}
        </Carousel>
        <PrevButton onClick={handlePrevClick}>&#10094;</PrevButton>
        <NextButton onClick={handleNextClick}>&#10095;</NextButton>
      </CarouselContainer>
      <Content>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </Content>
    </PostContainer>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    content: PropTypes.any,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        id: PropTypes.number,
        altText: PropTypes.string,
      }),
    ),
    title: PropTypes.any,
  }),
  userData: PropTypes.array, // added this for type checking errors found in the browser console
};

export default Post;
