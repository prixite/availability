import { useState } from 'react';
import { useSetAvailability } from '../hooks/useSetAvailability';

function AvailabilityForm() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const { setAvailability, error, isLoading } = useSetAvailability();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    const { userId } = user;

    await setAvailability(userId, startTime, endTime);

    alert(`Your availability has been set from ${startTime} to ${endTime}`);
  };

  return (
    <form className='availability_form' onSubmit={handleSubmit}>
      <h3>Select Your Availability for Today</h3>

      <label htmlFor='start-Time'> Start Time </label>
      <input
        type='time'
        onChange={(e) => setStartTime(e.target.value)}
        id='start-Time'
        value={startTime}
      />

      <label htmlFor='end-Time'> End Time </label>
      <input
        type='time'
        onChange={(e) => setEndTime(e.target.value)}
        id='end-Time'
        value={endTime}
      />

      <button disabled={isLoading} type='submit'>
        Set Your Availability
      </button>
      {error && <div className='error'>{error}</div>}
    </form>
  );
}

export default AvailabilityForm;
