import { useState } from 'react';
// import { useAuthContext } from './useAuthContext'

const useSetAvailability = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  // const { dispatch } = useAuthContext()

  const setAvailability = async (userId, startTime, endTime) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, startTime, endTime }),
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

  return { setAvailability, isLoading, error };
};

export default useSetAvailability;
