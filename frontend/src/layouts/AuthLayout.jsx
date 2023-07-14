import { useState } from 'react';
import { Outlet } from 'react-router';

import { authorize } from '../api/auth';

export default function AuthLayout() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(!!localStorage.getItem('USER_JWT'));

  const handleLogin = async () => {
    if(login.length > 0 && password.length > 0) {
      const loginRes = await authorize(login, password);

      if(loginRes.jwt) {
        localStorage.setItem('USER_JWT', loginRes.jwt);
        setSuccess(true);
      }
    }
  }

  return (
    <>
      {!success &&
        <div>
          <h1>Auth</h1>
          <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Отправить</button>
        </div>
      }
      {success &&
        <div>
          <Outlet />
        </div>
      }
    </>
  );
} 