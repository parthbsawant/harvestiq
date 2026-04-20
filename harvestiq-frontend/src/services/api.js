import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

export const getData = () => axios.get(`${BASE_URL}/data`);

export const getFilteredData = (params) =>
  axios.get(`${BASE_URL}/filter`, { params });

export const getAvgYield = () =>
  axios.get(`${BASE_URL}/avg_yield_per_crop`);

export const getTrend = () =>
  axios.get(`${BASE_URL}/yield_trend`);

export const getTopCrops = () =>
  axios.get(`${BASE_URL}/top_crops`);

export const predictYield = (data) =>
  axios.post(`${BASE_URL}/predict`, data);

export const recommendCrops = (data) =>
  axios.post(`${BASE_URL}/recommend`, data);
