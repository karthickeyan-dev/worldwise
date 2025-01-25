import { createContext, useContext, useEffect, useReducer } from 'react';

const BASE_URL = 'http://localhost:9000';
const citiesContext = createContext();

const initialState = {
  cities: [],
  currentCity: {},
  isLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };
    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payload };
    case 'city/added':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter(city => city.id !== action.payload),
      };
    case 'failed':
      return { ...state, isLoading: false };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export function CitiesProvider({ children }) {
  const [{ cities, currentCity, isLoading }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function getCities() {
      dispatch({ type: 'loading' });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: 'cities/loaded', payload: data });
      } catch {
        dispatch({ type: 'failed' });
      }
    }
    getCities();
  }, []);

  async function getCurrentCity(id) {
    if (id === currentCity.id) return;

    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: 'city/loaded', payload: data });
    } catch {
      dispatch({ type: 'failed' });
    }
  }

  async function addNewCity(newCity) {
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${BASE_URL}/cities/`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      dispatch({ type: 'city/added', payload: data });
    } catch {
      dispatch({ type: 'failed' });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: 'loading' });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });
      dispatch({ type: 'city/deleted', payload: id });
    } catch {
      dispatch({ type: 'failed' });
    }
  }

  return (
    <citiesContext.Provider
      value={{
        cities,
        currentCity,
        isLoading,
        getCurrentCity,
        addNewCity,
        deleteCity,
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
