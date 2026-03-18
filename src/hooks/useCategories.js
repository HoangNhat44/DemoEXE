import { useEffect, useState } from 'react';
import { apiGet } from '../utils/api';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        const json = await apiGet('/api/categories');

        if (isMounted) {
          setCategories(Array.isArray(json.categories) ? json.categories : []);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, isLoading, error };
}
