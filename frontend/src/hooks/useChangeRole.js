import { useState } from 'react';

const useChangeRole = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const setUserRole = async (user_id, userRole) => {// eslint-disable-line
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, userRole }),// eslint-disable-line
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      setIsLoading(false);
    }
  };

  return { setUserRole, isLoading, error };
};

export default useChangeRole;