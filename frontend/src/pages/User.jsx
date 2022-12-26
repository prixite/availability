import Developer from './Developer';
import Admin from './Admin';
import useAuthContext from '../hooks/useAuthContext';

function User() {
  const { user } = useAuthContext();
  if (user.userRole === 'Developer') {
    return <Developer user={user} />;
  }
  return <Admin user={user} />;
}

export default User;
