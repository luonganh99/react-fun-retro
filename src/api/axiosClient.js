import axios from 'axios';

export const axiosFunRetro = axios.create({
    baseURL: 'http://localhost:4000/',
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
});

// axiosFunRetro.interceptors.response.use(
//     (response: ServerResponse) => {
//         if (response && response.data) {
//             return response.data;
//         }
//         return response;
//     },
//     (error) => {
//         throw error;
//     }
// );
