import useChangeRole from "../hooks/useChangeRole";

function UserDetails({ user }) {
  const { setUserRole, error, isLoading } = useChangeRole();
  const handleRoleChange = async (e) => {
    e.preventDefault();
    const user_id = user._id // eslint-disable-line
    const userRole = user.userRole === 'Developer' ? 'Admin' : 'Developer';
    await setUserRole(user_id, userRole);
    alert(`Role of ${user.name} has been changed to ${userRole}`);// eslint-disable-line
  };

  return (
    <div className='user-details'>
      <h4>{user.name}</h4>
      <p>{user.email}</p>
      <p>
        <strong>Availabilty Hours : </strong>
        {user.startTime}
        -
        {user.endTime}
      </p>
      <p>
        <strong>Role : </strong>
        {user.userRole}
      </p>
      <p>
        <strong>Weekly Hours : </strong>
        {user.weekAvailableHours}
      </p>
      <p>
        <strong>Monthly Hours : </strong>
        {user.monthAvailableHours}
      </p>
      <p>
        <strong> Last Message :</strong>
        {user.lastMessage}
      </p>
      <form onSubmit={handleRoleChange}>
        <button type='submit' disabled={isLoading}>Change Role</button>
        {error && <div className='error'>{error}</div>}
      </form>
    </div>
  );
}

export default UserDetails;
