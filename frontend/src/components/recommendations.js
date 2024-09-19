import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Cookies from 'js-cookie';
import MediaCard from '../components/MediaCard'

function Recommendation({ customersId }) {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const token = Cookies.get('token'); // Get the token from cookies

    fetch('http://localhost:5000/user_recommendation/', {
      method: 'GET',
      credentials: 'include', // Make sure cookies are sent with the request
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Recommended Movies:', data);
        setRecommendedMovies(data.top_5_user_recommendation || []); // Set the data to recommendedMovies state
      })
      .catch((error) => {
        console.error('Error fetching recommendations:', error);
      });
  }, [customersId]);

  const handleCardClick = (movie) => {
    navigate(`/MovieInfo/${movie["Movie Id"]}`, { state: { movie } });
  };

  console.log(recommendedMovies)

  if (recommendedMovies.length === 0) {
    return <Typography sx={{ color: 'white' }}>No recommendations available.</Typography>;
  }

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Typography variant="h5" sx={{ color: 'white', marginBottom: '10px', marginTop: '4%' }}>
        Recommended Movies:
      </Typography>
      <Grid container spacing={2}>
        {recommendedMovies.map((movie) => (
          <Grid item xs={12} sm={5} md={2.4} key={movie['Movie Id']}>
            <Box style={{ marginTop: '6%', cursor: 'pointer' }} onClick={() => handleCardClick(movie)}>
              <MediaCard movieInfo={movie} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Recommendation;

