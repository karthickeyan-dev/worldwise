import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';

import { CitiesProvider } from './contexts/citiesContext';

import Homepage from './pages/Homepage';
import AppLayout from './pages/AppLayout';
import Pricing from './pages/Pricing';
import Product from './pages/Product';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import CityList from './components/CityList';
import City from './components/City';
import CountryList from './components/CountryList';
import Form from './components/Form';
import { AuthProvider } from './contexts/AuthContext';

polyfillCountryFlagEmojis();

export default function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Homepage />} />
            <Route path="app" element={<AppLayout />}>
              <Route index element={<Navigate replace to="cities" />} />
              <Route path="cities" element={<CityList />} />
              <Route path="cities/:id" element={<City />} />
              <Route path="countries" element={<CountryList />} />
              <Route path="form" element={<Form />} />
            </Route>
            <Route path="product" element={<Product />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}
