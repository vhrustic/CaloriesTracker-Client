import axios from 'axios';

import { LOGIN_URL } from '../api/auth-api';
import { useBoundStore } from '../store/store';
import { loadSession } from '../utils/helpers';
import config from './config';
import routes from './routes';

const httpClient = axios.create({
  baseURL: process.env.APP_API_BASE_URL
});

httpClient.defaults.baseURL = config.apiUrl;

httpClient.interceptors.request.use((reqConfig) => {
  const { token } = loadSession();
  if (!reqConfig.url.includes(LOGIN_URL)) {
    reqConfig.headers.Authorization = token ? `Bearer ${token}` : '';
  }

  return reqConfig;
});

httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const logout = useBoundStore.getState().logout;
    if (error.response.status === 401 && !error.response.config.url.includes(LOGIN_URL)) {
      logout();
      window.location.href = routes().login.path;
    }
    return Promise.reject(error);
  }
);

export default httpClient;
