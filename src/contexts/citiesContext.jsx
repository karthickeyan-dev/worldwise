import { createContext, useContext, useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:9000';
const citiesContext = createContext();

export function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [currentCity, setCurrentCity] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.log(error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  async function fetchCurrentCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <citiesContext.Provider
      value={{ cities, currentCity, fetchCurrentCity, isLoading }}
    >
      {children}
    </citiesContext.Provider>
  );
}

export function useCities() {
  const context = useContext(citiesContext);
  if (context === undefined) {
    throw new Error('useCities is placed outside CitiesProvider');
  }
  return context;
}
