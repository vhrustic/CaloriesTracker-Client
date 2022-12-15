import { TOKEN_KEY, USER_KEY } from '../config/constants';

export function loadSession() {
  let user;
  try {
    user = JSON.parse(localStorage.getItem(USER_KEY));
  } catch (err) {
    user = null;
  }
  const token = localStorage.getItem(TOKEN_KEY) || null;

  return { user, token };
}

export function saveSession(data) {
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  localStorage.setItem(TOKEN_KEY, data.accessToken);
}

export function clearSession() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}
