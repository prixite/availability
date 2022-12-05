import Developer from './Developer';
import Admin from './Admin';
import useAuthContext from '../hooks/useAuthContext';

function User() {
  const { user } = useAuthContext();
  if (user.userRole === 'Developer') {
    return <Developer />;
  }
  return <Admin />;
}

export default User;
