import { useState, useEffect } from 'react';

const useUserDataFavorite = (movie) => {
    useEffect(() => {
        fetch('http://localhost:5000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ movieData: movie }),
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
    }, [movie]);
};

export default useUserDataFavorite;
