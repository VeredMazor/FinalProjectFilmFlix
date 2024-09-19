import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Navbar from '../../components/Navbar';
import MediaCard from '../../components/MediaCard';
import Footer from '../../components/Footer';
import Cookies from 'js-cookie';
import './HomePage.css';

const CustomPagination = styled(Pagination)(({ theme }) => ({
    '& .MuiPaginationItem-root': {
        color: 'white',
    },
    '& .Mui-selected': {
        color: 'red',
        backgroundColor: 'black',
    },
    '& .MuiPaginationItem-page.Mui-selected': {
        backgroundColor: 'black',
    },
}));

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function Home() {
    const [imagesData, setImagesData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // State to track the total number of pages
    const cardsPerPage = 18;
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        
        fetch(`http://localhost:5000/?page=${currentPage}&page_size=${cardsPerPage}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched data:', data);
            setImagesData(data.movies);  // Assuming the backend sends { movies: [], total_pages: x }
            setTotalPages(data.total_pages);  // Set the total pages for pagination
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [currentPage]); // Re-fetch data whenever currentPage changes

    const handleCardClick = (movie) => {
        navigate(`/MovieInfo/${movie["Movie Id"]}`, { state: { movie } });
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <div className="home-background">
            <Navbar />
            <div style={{ backgroundColor: "rgba(0, 0, 0, 0.85)", margin: "1%" }}>
                <Box style={{ marginTop: '2%' }}>
                    <Grid container spacing={{ xs: 1 }} columns={{ xs: 2, sm: 4, md: 12 }}>
                        {imagesData.length > 0 ? (
                            imagesData.map((movie, index) => (
                                <Grid item xs={1} sm={1} md={2} key={index}>
                                    <Box style={{ marginTop: '5%', marginLeft: '4%', marginRight: '4%', cursor: 'pointer' }} onClick={() => handleCardClick(movie)}>
                                        <MediaCard movieInfo={movie} />
                                    </Box>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Item>No movies available</Item>
                            </Grid>
                        )}
                    </Grid>
                    <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <CustomPagination
                            style={{ textAlign: 'center' }}
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                        />
                    </Box>
                </Box>
            </div>
            <Footer />
        </div>
    );
}

export default Home;
