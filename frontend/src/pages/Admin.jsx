import { Link } from 'react-router-dom';
import AvailabilityForm from '../components/AvailabilityForm';
import AvailabilityTable from '../components/AvailabilityTable';

function Admin() {
  return (
    <div>
      <AvailabilityForm />
      <AvailabilityTable />
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
