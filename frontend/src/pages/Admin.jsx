import { Link } from 'react-router-dom';
import AvailabilityForm from '../components/AvailabilityForm';
import HoursDetails from '../components/HourDetails';

function Admin({ user }) {
  return (
    <div>
      <AvailabilityForm />
      <HoursDetails user={user} />
      <div style={{ width: '100%', textAlign: 'center' }}>
        <Link to='/user/all'>
          <button className='availabilitybutton' type='submit'>
            Check Other Users Availability
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Admin;
