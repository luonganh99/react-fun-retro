import axios from 'axios';

export const axiosFunRetro = axios.create({
    baseURL: 'https://api-fun-retro.herokuapp.com/',
});

axiosFunRetro.interceptors.request.use(
    (request) => {
        const token = localStorage.getItem('token');
        if (token) {
            request.headers['Authorization'] = 'Bearer ' + token;
        }
        return request;
    },
    (error) => {
        throw error;
    }
);
