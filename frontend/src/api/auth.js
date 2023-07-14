export const authorize = async (login, password) => {
  const loginRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: `${login}`,
        password: `${password}`,
      }),
  });

  const loginResponseData = await loginRes.json();

  return loginResponseData;
}