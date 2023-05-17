import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from '../../utils/axios';
import styles from './Auth.module.css';

export enum EAuthType {
  Register = 'Register',
  Login = 'Login',
}

interface IProps {
  authType: EAuthType;
}

const Auth = (props: IProps) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [invalidReason, setInvalidReason] = useState('');
  const [token, setToken] = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response: any = await axios.post(`/auth/${props.authType == EAuthType.Register ? 'register' : 'sign-in'}`, {
        login,
        password,
      });

      setToken(response.data.token);
    } catch (error: any) {
      setInvalidReason(error.response.data.message ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='card-container'>
      <h1>{props.authType}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          onInput={(e) => setLogin(e.currentTarget.value)}
          value={login}
          className={styles.input}
          type='text'
          placeholder='Login'
          required
          min={3}
        />
        <input
          onInput={(e) => setPassword(e.currentTarget.value)}
          value={password}
          className={styles.input}
          type='password'
          placeholder='Password'
          required
          min={6}
        />
        <button disabled={isLoading} className={styles.submit} type='submit'>
          {props.authType}
        </button>
      </form>
      {invalidReason && <span className={styles.error}>{invalidReason}</span>}
      <Link className={styles['alternative-auth']} to={props.authType == EAuthType.Register ? '/login' : '/register'}>
        {props.authType == EAuthType.Register ? 'Already have an account?' : "Don't have an account?"}
      </Link>
    </div>
  );
};

export default Auth;
