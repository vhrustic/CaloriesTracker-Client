import httpClient from '../config/http-client';

export const LOGIN_URL = 'auth/login';

export function login(data) {
  return httpClient.post(LOGIN_URL, data);
}
