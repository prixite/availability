import { useEffect, useState } from 'react';
import UserDetails from '../components/UserDetails';
import useAuthContext from '../hooks/useAuthContext';

function Users() {
  const [users, setUsers] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/all`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        setUsers(json);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  return (
    <div className='home'>
      <div className='users'>
        {users && users.map((user) => <UserDetails key={user.id} user={user} />)}
      </div>
    </div>
  );
}

export default Users;
