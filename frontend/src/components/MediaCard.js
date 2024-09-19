import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export default function MediaCard({ movieInfo }) {
  const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
      color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
      color: '#ff3d47',
    },
  });
  console.log(movieInfo["Image URL"])
  console.log(movieInfo["Rating"])
  return (
    <Card style={{margin: '2%'}}>
      <CardMedia 
        sx={{ height: 250}}
        image={movieInfo["Image URL"]}
        title={movieInfo["Movie Name"]}
      />
    </Card>
  );
}
