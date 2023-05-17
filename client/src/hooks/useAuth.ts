import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = (): [string | null, React.Dispatch<React.SetStateAction<string | null>>] => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    token ? localStorage.setItem('token', token) : localStorage.removeItem('token');

    if (token) {
      navigate('/');
    } else {
      navigate('/register');
    }
  }, [token]);

  return [token, setToken];
};

export default useAuth;
