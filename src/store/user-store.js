import { login } from '../api/auth-api';
import { loadSession, saveSession } from '../utils/helpers';

const { user } = loadSession();

export const initialUserState = {
  userInfo: user
};

export const createUserSlice = (set) => ({
  ...initialUserState,
  login: async (payload) => {
    const { data } = await login(payload);
    set({ userInfo: data.user });
    saveSession({ user: data.user, accessToken: data.token.accessToken });
  }
});
