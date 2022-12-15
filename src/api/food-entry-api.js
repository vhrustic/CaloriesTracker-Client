import httpClient from '../config/http-client';

const FOOD_ENTRIES_URL = 'food-entry';
const FOOD_ENTRIES_TOTALS_URL = 'food-entry/totals';
const SEARCH_FOOD_URL = 'food-entry/search';
const ADD_NEW_ENTRY_URL = 'food-entry/add';
const ADMIN_FOOD_ENTRIES_ALL_URL = 'food-entry/admin/all';
const ADMIN_GET_ENTRY_URL = 'food-entry/admin';
const ADMIN_ADD_NEW_ENTRY_URL = 'food-entry/admin/add';
const ADMIN_DELETE_ENTRY_URL = 'food-entry/admin/delete';
const ADMIN_UPDATE_ENTRY_URL = 'food-entry/admin';
const ADMIN_TOTAL_ENTRIES_REPORT_URL = 'food-entry/admin/report/total-entries';
const ADMIN_AVERAGE_CALORIES_REPORT_URL = 'food-entry/admin/report/average-calories';

export function getFoodEntries() {
  return httpClient.get(FOOD_ENTRIES_URL);
}

export function getAllFoodEntries({ page }) {
  return httpClient.get(`${ADMIN_FOOD_ENTRIES_ALL_URL}?page=${page}`);
}

export function getFoodEntriesTotals() {
  return httpClient.get(FOOD_ENTRIES_TOTALS_URL);
}

export function searchFood(query) {
  return httpClient.get(`${SEARCH_FOOD_URL}?query=${query}`);
}

export function addFoodEntry(data) {
  return httpClient.post(ADD_NEW_ENTRY_URL, data);
}

export function adminAddFoodEntry(data) {
  return httpClient.post(ADMIN_ADD_NEW_ENTRY_URL, data);
}

export function adminGetFoodEntry(id) {
  return httpClient.get(`${ADMIN_GET_ENTRY_URL}/${id}`);
}

export function adminDeleteFoodEntry(id) {
  return httpClient.delete(`${ADMIN_DELETE_ENTRY_URL}/${id}`);
}

export function adminUpdateFoodEntry(id, data) {
  return httpClient.patch(`${ADMIN_UPDATE_ENTRY_URL}/${id}`, data);
}

export function getTotalEntriesReportData() {
  return httpClient.get(ADMIN_TOTAL_ENTRIES_REPORT_URL);
}

export function getAverageCaloriesReportData() {
  return httpClient.get(ADMIN_AVERAGE_CALORIES_REPORT_URL);
}
