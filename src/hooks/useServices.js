import { useEffect, useState } from 'react';
import { apiGet } from '../utils/api';

export function useServices() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadServices() {
      try {
        const json = await apiGet('/api/services');

        if (isMounted) {
          setServices(Array.isArray(json.services) ? json.services : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  return { services, isLoading, error };
}
