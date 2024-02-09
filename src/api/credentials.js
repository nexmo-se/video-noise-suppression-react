export const getCredentials = async () => {
  const fetchURL = new URL(
    `/token`,
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_URL
      : 'http://localhost:3000',
  );
  const response = await fetch(fetchURL.href);
  const json = await response.json();
  return json;
};

