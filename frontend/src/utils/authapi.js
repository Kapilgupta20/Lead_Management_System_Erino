import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function handleResponse(promise) {
  try {
    const res = await promise;
    return res.data || {};
  } catch (err) {
    const res = err.response;
    const data = res?.data || { message: err.message };
    const error = new Error(data.message || 'API error');
    error.status = res?.status;
    error.data = data;
    throw error;
  }
}

export async function registerApi({ name, email, password }) {
  return handleResponse(
    axios.post(
      `${VITE_API_URL}/auth/register`,
      { name, email, password },
      { withCredentials: true }
    )
  );
}

export async function loginApi({ email, password }) {
  return handleResponse(
    axios.post(
      `${VITE_API_URL}/auth/login`,
      { email, password },
      { withCredentials: true }
    )
  );
}

export async function logoutApi() {
  return handleResponse(
    axios.post(`${VITE_API_URL}/auth/logout`, {}, { withCredentials: true })
  );
}

export async function fetchMeApi() {
  return handleResponse(
    axios.get(`${VITE_API_URL}/auth/me`, { withCredentials: true })
  );
}
