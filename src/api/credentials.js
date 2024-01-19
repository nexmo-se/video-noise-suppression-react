const REACT_APP_URL = process.env.REACT_APP_URL || "http://localhost:3002";

export const getCredentials = async () => {
  const url = new URL('/token', REACT_APP_URL);
  const response = await fetch(url.href);
  
  if (!response.ok) {
    throw new Error("response not ok");
  }

  const data = await response.json();
  return data;
};
