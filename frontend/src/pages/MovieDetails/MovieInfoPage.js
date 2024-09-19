import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Cookies from 'js-cookie'; // Import js-cookie
import NoImage from '../../assets/images/NoImageAvailable.jpg'; // Import fallback image

import Navbar from '../../components/Navbar';
import Recommendation from '../../components/recommendations'

function MovieInfo() {
  const [moviesRecommendation, setMoviesRecommendation] = useState(null);
  const location = useLocation();
  let { id } = useParams();
  const movie = location.state?.movie;
  const customersId = localStorage.getItem("customersId");

  const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
      color: 'red', // Make filled heart icon transparent
    },
    '& .MuiRating-iconHover': {
      color: 'red', // Make hovered heart icon transparent
    },
    '& .MuiRating-iconEmpty': {
      color: 'red', // Make empty heart icon transparent
    },
    '& .MuiRating-icon': {
      color: 'red', // Make hovered heart icon transparent
    },
  });

  console.log('Movie ID:', id);
  console.log('Movie Data:', movie);
  console.log(movie)

  const handleRatingChange = (event, newRating) => {
    const token = Cookies.get('token'); // Get the token from cookies
    console.log('New Rating:', newRating);

    const movieId = Math.trunc(Number(id)); // Use a new variable for movieId
    const customerID = Math.trunc(Number(customersId)); // Use a new variable for customersId

    fetch('http://localhost:5000/user_rating', {
      method: 'POST',
      credentials: 'include', // Make sure cookies are sent with the request
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify({ userRating: newRating, movieId: movieId, customersId: customerID }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  if (!movie) {
    return <div>Movie data not available.</div>;
  }

  return (
    <>
      <Navbar />
      <Box sx={{ flexGrow: 1, p: 2 }} style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', margin: '1%' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <img
                src={movie['Image URL']}
                alt={movie['Movie Name']}
                style={{ maxWidth: '100%', height: '500px' }}
                onError={(e) => {
                  e.target.src = NoImage;
                }} // Set fallback image on error
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                textAlign: 'center',
                paddingLeft: '10%',
                paddingRight: '10%',
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
                {movie['Movie Name']}
              </Typography>
              <Typography sx={{ color: 'white', textAlign: 'left', direction: 'ltr' }}>
                Pellentesque nec auctor arcu. Mauris commodo, nisi a cursus cursus, elit arcu fringilla mauris, nec ultricies
                nisl velit ac nulla. Etiam in purus viverra nisi rutrum elementum. Etiam sed sem ornare, aliquet justo ac,
                vulputate nisl. Aenean mollis dapibus lorem eleifend ultricies. Sed vitae tempor sapien. Cras imperdiet vitae
                mauris sit amet cursus. Vestibulum justo enim, interdum ac dolor ut, sodales pharetra massa. Aliquam vitae
                hendrerit mi. Curabitur sit amet mollis diam, nec vulputate est.
              </Typography>

              <Typography variant="body1" gutterBottom sx={{ color: 'white' }}>
                Release Date: {movie['Release Date']}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <StyledRating
                  name="customized-color"
                  value={movie['Average Rating']}
                  onChange={handleRatingChange}
                  getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                  precision={0.5}
                  icon={<FavoriteIcon fontSize="inherit" />}
                  emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Recommendation Component */}
        <Recommendation customersId={customersId} />
      </Box>
    </>
  );
}

export default MovieInfo;
