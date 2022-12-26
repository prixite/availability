import AvailabilityForm from '../components/AvailabilityForm';
import HoursDetails from '../components/HourDetails';

function Developer({ user }) {
  return (
    <div>
      <AvailabilityForm />
      <HoursDetails user={user} />
    </div>
  );
}

export default Developer;
