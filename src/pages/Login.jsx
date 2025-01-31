import { useLayoutEffect, useState } from 'react';
import styles from './Login.module.css';
import PageNav from '../components/PageNav';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function Login() {
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('qwerty');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (isAuthenticated) navigate('/app', { replace: true });
  }, [isAuthenticated, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) login(email, password);
  }

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
