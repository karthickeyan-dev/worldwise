import styles from './CityList.module.css';

import { useCities } from '../contexts/citiesContext';

import Spinner from './Spinner';
import Message from './Message';
import CityItem from './CityItem';

export default function CityList() {
  const { cities, isLoading } = useCities();

  if (isLoading) {
    return <Spinner />;
  }
  if (!cities.length) {
    return <Message message="Try adding some cities by clicking on the map" />;
  }
  return (
    <ul className={styles.cityList}>
      {cities.map(city => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}
