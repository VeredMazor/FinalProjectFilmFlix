import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate} from "react-router-dom";


const defaultTheme = createTheme();

function Copyright(props) {

    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
            FilmFlix <b/>
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

function SignUp(){

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});


  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userData = {
        username: formData.get('username') || username,
        email: formData.get('email') || email,
        password: formData.get('password') || password
    };

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    fetch('http://localhost:5000/sign_up/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userData: userData }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    navigate('/');
  };



    
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container style={{ backgroundColor: "rgba(0, 0, 0, 0.85)"}} component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <LiveTvIcon style={{color: 'red', margin: '4%'}} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

          <Typography style={{color: 'white'}} component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              InputLabelProps={{
                style: { color: 'white' }, // Label color
              }}
              InputProps={{
                  style: { color: 'white' }, // Input text color
              }}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'gray', // Border color
                    },
                    '&:hover fieldset': {
                        borderColor: 'white', // Border color on hover
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'white', // Border color when focused
                    },
                },
              }}
            />
            <TextField
              InputLabelProps={{
                style: { color: 'white' }, // Label color
              }}
              InputProps={{
                  style: { color: 'white' }, // Input text color
              }}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'gray', // Border color
                    },
                    '&:hover fieldset': {
                        borderColor: 'white', // Border color on hover
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'white', // Border color when focused
                    },
                },
              }}
            />
            <TextField
              InputLabelProps={{
                style: { color: 'white' }, // Label color
              }}
              InputProps={{
                  style: { color: 'white' }, // Input text color
              }}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'gray', // Border color
                    },
                    '&:hover fieldset': {
                        borderColor: 'white', // Border color on hover
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'white', // Border color when focused
                    },
                },
              }}
            />
            <TextField
              InputLabelProps={{
                style: { color: 'white' }, // Label color
              }}
              InputProps={{
                  style: { color: 'white' }, // Input text color
              }}
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="current-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'gray', // Border color
                    },
                    '&:hover fieldset': {
                        borderColor: 'white', // Border color on hover
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'white', // Border color when focused
                    },
                },
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              style={{backgroundColor: 'red'}}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/" variant="body2" sx={{ color: 'white' }}>
                  Have account? sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );


}


export default SignUp