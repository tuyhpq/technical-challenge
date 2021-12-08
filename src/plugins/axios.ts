import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://covid-19-statistics.p.rapidapi.com',
  validateStatus: (status) => status < 500,
  headers: {
    'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
    'x-rapidapi-key': '781806ab89msh5ee09e045af5e38p1321d1jsn349570dd1648',
  },
});

export default instance;
