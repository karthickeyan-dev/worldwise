import { Link } from 'react-router-dom';
import styles from './CityItem.module.css';
import { useCities } from '../contexts/citiesContext';

export default function CityItem({ city }) {
  const { emoji, cityName, date, id, position } = city;
  const { currentCity, deleteCity } = useCities();

  const formatDate = date =>
    new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    }).format(new Date(date));

  function handleClick(e) {
    e.preventDefault();
    deleteCity(id);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles['cityItem--active'] : ''
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <p className={styles.name}>{cityName}</p>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}
