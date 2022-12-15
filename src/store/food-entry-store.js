import {
  addFoodEntry,
  getAllFoodEntries,
  getAverageCaloriesReportData,
  getFoodEntries,
  getFoodEntriesTotals,
  getTotalEntriesReportData
} from '../api/food-entry-api';

export const initialFoodEntriesState = {
  foodEntries: null,
  allFoodEntries: null,
  averageCaloriesReport: null,
  totalEntriesReport: null
};

export const createFoodEntrySlice = (set) => ({
  ...initialFoodEntriesState,
  getFoodEntries: async () => {
    const { data } = await getFoodEntries();
    set({ foodEntries: data });
  },
  getAllFoodEntries: async (pagination) => {
    const { data } = await getAllFoodEntries(pagination);
    set({ allFoodEntries: data });
  },
  getFoodEntriesTotals: async () => {
    const { data } = await getFoodEntriesTotals();
    set({ foodEntries: data });
  },
  addEntry: async (payload) => {
    const { data } = await addFoodEntry(payload);
    set((state) => ({
      foodEntries: [data, ...state.foodEntries]
    }));
  },
  getTotalEntriesReportData: async () => {
    const { data } = await getTotalEntriesReportData();
    set({ totalEntriesReport: data });
  },
  getAverageCaloriesReportData: async () => {
    const { data } = await getAverageCaloriesReportData();
    set({ averageCaloriesReport: data });
  }
});
