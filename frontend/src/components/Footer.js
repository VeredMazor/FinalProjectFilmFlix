import React from 'react';
import Typography from '@mui/material/Typography';

const Footer = (props) => {
  return (
    <Typography style={{backgroundColor: 'black', color: 'white'}} variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      FilmFlix <b />
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

export default Footer;


