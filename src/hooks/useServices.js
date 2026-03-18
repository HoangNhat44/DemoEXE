import { useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from '../utils/api';

export function useServices() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadServices() {
    try {
      setError('');
      const json = await apiGet('/api/services');
      setServices(Array.isArray(json.services) ? json.services : []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const json = await apiGet('/api/services');

        if (isMounted) {
          setServices(Array.isArray(json.services) ? json.services : []);
          setError('');
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

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  async function createPartnerService(payload) {
    const data = await apiPost('/api/partner/services', payload);

    if (data.service) {
      setServices((currentServices) => {
        const withoutDuplicate = currentServices.filter(
          (service) => Number(service.id) !== Number(data.service.id)
        );

        return [...withoutDuplicate, data.service];
      });
    }

    return data;
  }

  async function updatePartnerService(serviceId, payload) {
    const data = await apiPut(`/api/partner/services/${serviceId}`, payload);

    if (data.service) {
      setServices((currentServices) =>
        currentServices.map((service) =>
          Number(service.id) === Number(data.service.id) ? data.service : service
        )
      );
    }

    return data;
  }

  async function deletePartnerService(serviceId, payload) {
    const data = await apiDelete(`/api/partner/services/${serviceId}`, payload);

    setServices((currentServices) =>
      currentServices.filter((service) => Number(service.id) !== Number(serviceId))
    );

    return data;
  }

  return {
    services,
    isLoading,
    error,
    reloadServices: loadServices,
    createPartnerService,
    updatePartnerService,
    deletePartnerService,
  };
}
