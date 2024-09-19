import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LiveTvIcon from '@mui/icons-material/LiveTv';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


import './SignInPage.css'

const defaultTheme = createTheme();

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            FilmFlix <b />
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function Login() {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const userData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        fetch('http://localhost:5000/sign_in/', {
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
                // Save the access token in localStorage
                Cookies.set('token', data.token, { expires: 7, secure: true });
                localStorage.setItem('username', data.username);
                localStorage.setItem('customersId', data.customersId);
                localStorage.setItem('isValied', data.isvalied);
                navigate('/home');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container style={{ backgroundColor: "rgba(0, 0, 0, 0.85)"}} component="main" maxWidth="xs">
                <CssBaseline />
                  <Box style={{ margin: '6%'}} 
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                  >
                    <LiveTvIcon style={{color: 'red', margin: '4%'}} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

                    <Typography style={{color: 'white'}} component="h1" variant="h5">
                        Sign In
                    </Typography>
                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      noValidate
                      sx={{ mt: 1 }}
                      >
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
                          sx={{ color: 'white' }} // Label color
                      />
                      <Button style={{backgroundColor: 'red'}}
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                      >
                          Sign In
                      </Button>
                      <Grid container>
                          <Grid item>
                              <Link href="/signup" variant="body2" sx={{ color: 'white' }}>
                                  {"Don't have an account? Sign Up"}
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

export default Login;
