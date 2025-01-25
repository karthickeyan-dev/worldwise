import { createContext, useContext, useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:9000';
const citiesContext = createContext();

export function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [currentCity, setCurrentCity] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getCities() {
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

    getCities();
  }, []);

  async function getCurrentCity(id) {
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

  async function addNewCity(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setCities(cities => [...cities, data]);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });
      setCities(cities => cities.filter(city => city.id !== id));
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
      value={{
        cities,
        currentCity,
        getCurrentCity,
        addNewCity,
        deleteCity,
        isLoading,
      }}
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
