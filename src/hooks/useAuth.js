import { useEffect, useState } from 'react';
import { apiPost } from '../utils/api';

const STORAGE_KEY = 'matcha_user_session';

function readStoredUser() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

export function useAuth() {
  const [customer, setCustomer] = useState(() => readStoredUser());

  useEffect(() => {
    if (customer) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, [customer]);

  async function login(credentials) {
    const data = await apiPost('/api/users/login', credentials);
    setCustomer(data.user);
    return data;
  }

  async function register(payload) {
    const data = await apiPost('/api/users/register', payload);
    setCustomer(data.user);
    return data;
  }

  function logout() {
    setCustomer(null);
  }

  return {
    customer,
    isAuthenticated: Boolean(customer),
    login,
    logout,
    register,
  };
}
