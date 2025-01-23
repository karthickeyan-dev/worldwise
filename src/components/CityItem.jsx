import styles from './CityItem.module.css';

export default function CityItem({ city }) {
  const { emoji, cityName, date } = city;

  const formatDate = date =>
    new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    }).format(new Date(date));

  return (
    <li className={styles.cityItem}>
      <span className={styles.emoji}>{emoji}</span>
      <p className={styles.name}>{cityName}</p>
      <time className={styles.date}>({formatDate(date)})</time>
      <button className={styles.deleteBtn}>&times;</button>
    </li>
  );
}
