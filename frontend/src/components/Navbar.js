import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const pages = {
    'Products': '/products',
    'Pricing': '/pricing',
    'Blog': '/blog'
};

const settings = {
    'Profile': '/profile',
    'Account': '/account',
    'Dashboard': '/dashboard',
    'Logout': '/'
};

function Navbar() {
    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
  
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
  
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
  
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        // Clear username and other related data from localStorage
        localStorage.removeItem("customersId");
        localStorage.removeItem("username");
        localStorage.removeItem("isValied");
        Cookies.remove("token"); // If you're storing token in cookies

        // Redirect to the sign-in page
        navigate('/');
    };

    const username = localStorage.getItem("username");
  
    return (
        <AppBar position="sticky" style={{ backgroundColor: 'black' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <LiveTvIcon style={{ color: 'red' }} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        style={{ color: 'red' }}
                        variant="h6"
                        noWrap
                        component="a"
                        href="/home"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        FilmFlix
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {Object.entries(pages).map(([page, url]) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography
                                        component="a"
                                        href={url}
                                        textAlign="center"
                                        sx={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        {page}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <LiveTvIcon style={{ color: 'red' }} sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        style={{ color: 'red' }}
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        FilmFlix
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {Object.entries(pages).map(([page, url]) => (
                            <Button
                                key={page}
                                href={url}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <h4>{"Hello " + username}</h4>
                            {Object.entries(settings).map(([setting, url]) => (
                                <MenuItem key={setting} 
                                    onClick={() => {
                                        handleCloseNavMenu();
                                        if (setting === 'Logout') handleLogout(); // Handle logout on click
                                    }}
                                >
                                    <Typography
                                        component="a"
                                        href={url}
                                        textAlign="center"
                                        sx={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        {setting}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;
