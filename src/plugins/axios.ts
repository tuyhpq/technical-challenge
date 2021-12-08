import axios from 'axios';

const instance = axios.create({
  maxRedirects: 0,
  validateStatus: (status) => status < 500,
});

export default instance;
