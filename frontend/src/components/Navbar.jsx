import { Link } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import useAuthContext from '../hooks/useAuthContext';

function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <header>
      <div className='container'>
        <Link to='/'>
          <h1>Availability App</h1>
        </Link>
        <nav>
          {user && (
            <div>
              <span>{user.email}</span>
              <button onClick={handleClick} type='submit'>
                Log out
              </button>
            </div>
          )}
          {!user && (
            <div>
              <Link to='/user/login'>Login</Link>
              <Link to='/user/signup'>Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
