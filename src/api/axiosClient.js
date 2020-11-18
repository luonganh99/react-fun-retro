import axios from 'axios';

export const axiosFunRetro = axios.create({
    baseURL: 'http://localhost:4000/',
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
