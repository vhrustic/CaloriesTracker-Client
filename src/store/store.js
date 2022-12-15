import create from 'zustand';

import { clearSession } from '../utils/helpers';
import { createFoodEntrySlice, initialFoodEntriesState } from './food-entry-store';
import { createUserSlice, initialUserState } from './user-store';

export const useBoundStore = create((...set) => ({
  ...createUserSlice(...set),
  ...createFoodEntrySlice(...set),
  logout: () => {
    set[0]({ ...initialUserState, ...initialFoodEntriesState });
    clearSession();
  }
}));
