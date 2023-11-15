const apiKey = import.meta.env.VITE_API_KEY;
const apiSecret = import.meta.env.VITE_API_SECRET;

let accessToken;

export const Petfinder = {
    async getAccessToken() {
        const requestUrl = `https://api.petfinder.com/v2/oauth2/token`;
        const response = await fetch(requestUrl, {
            method: 'POST',
            body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const jsonResponse = await response.json();
        accessToken = jsonResponse.access_token;
        const expiresIn = jsonResponse.expires_in;
        window.setTimeout(() => accessToken = '', expiresIn);
    },
    async getPets(page=1) {
        await Petfinder.getAccessToken()
        const requestURL = `https://api.petfinder.com/v2/animals?page=${page}`;
        console.log("URL:" + requestURL)
        return fetch(requestURL, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        .then(response => {
            if(!response.ok) {
                throw new Error('Request failed!');
            }
            return response.json();
        })
        .then(data => {
            const petsWithImages = data.animals.filter(pet => pet.photos.length > 0);
            return petsWithImages;
        })
        .catch(error => {
            console.error('Error fetching pets: ', error);
            return [];
        });
    }
}

export default Petfinder