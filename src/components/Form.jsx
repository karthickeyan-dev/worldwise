// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { UseUrlPosition } from '../hooks/useUrlPosition';

import styles from './Form.module.css';
import Button from './Button';
import BackButton from './BackButton';
import Message from './Message';
import Spinner from './Spinner';
import { useCities } from '../contexts/citiesContext';
import { useNavigate } from 'react-router-dom';

function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = `https://api.bigdatacloud.net/data/reverse-geocode-client`;

export default function Form() {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [emoji, setEmoji] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [lat, lng] = UseUrlPosition();
  const [isLoadingGeoCode, setIsLoadingGeoCode] = useState(false);
  const [geoCodeError, setGeoCodeError] = useState('');
  const { addNewCity, isLoading } = useCities();
  const navigate = useNavigate();

  useEffect(() => {
    async function getGeoCode() {
      try {
        if (!lat && !lng) return;

        setIsLoadingGeoCode(true);
        setGeoCodeError('');
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (!data.countryCode) {
          throw new Error(
            `This doesn't seem like a country. Please click somewhere else`
          );
        }
        setCity(data.city || data.locality || '');
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (error) {
        setGeoCodeError(error.message);
      } finally {
        setIsLoadingGeoCode(false);
      }
    }
    getGeoCode();
  }, [lat, lng]);

  async function handleSubmit(e) {
    e.preventDefault();

    const newCity = {
      cityName: city,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    await addNewCity(newCity);
    navigate('/app/cities');
  }

  if (geoCodeError) return <Message message={geoCodeError} />;

  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the map" />;

  if (isLoadingGeoCode) return <Spinner />;

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ''}`}>
      <div className={styles.row}>
        <label htmlFor="city">City name</label>
        <input id="city" onChange={e => setCity(e.target.value)} value={city} />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {city}?</label>
        {/* <input id="date" onChange={e => setDate(e.target.value)} value={date} /> */}
        <DatePicker
          id="date"
          dateFormat="dd/MM/yyy"
          selected={date}
          onChange={date => setDate(date)}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {city}</label>
        <textarea
          id="notes"
          onChange={e => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary" onClick={handleSubmit}>
          Add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}
