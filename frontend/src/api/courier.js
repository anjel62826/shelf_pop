// All requests to the backend go through this file
import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const http = axios.create({ baseURL: `${BASE}/api` });

// The backend answers { success, message, data }
const unwrap = (res) => res.data;

export const fetchTomes = (params) => http.get('/books', { params }).then(unwrap);
export const fetchTome = (id) => http.get(`/books/${id}`).then(unwrap);
export const addTome = (body) => http.post('/books', body).then(unwrap);
export const editTome = (id, body) => http.put(`/books/${id}`, body).then(unwrap);
export const removeTome = (id) => http.delete(`/books/${id}`).then(unwrap);
export const issueTome = (id, body) => http.post(`/books/${id}/issue`, body).then(unwrap);
export const fetchLoans = (id) => http.get(`/books/${id}/loans`).then(unwrap);
export const returnLoan = (loanId) => http.patch(`/loans/${loanId}/return`).then(unwrap);
export const fetchStats = () => http.get('/stats').then(unwrap);

export const errorText = (err) =>
  err.response?.data?.message || 'Cannot reach the server. Is the backend running?';
