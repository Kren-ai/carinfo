import axios from 'axios'

// Base Axios instance pointing at the Laravel backend.
// All API modules import from here so the base URL is defined once.
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export default apiClient
