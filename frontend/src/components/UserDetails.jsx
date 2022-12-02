function UserDetails({ user }) {
  return (
    <div className='user-details'>
      <h4>{user.name}</h4>
      <p>{user.email}</p>
      <p>
        <strong>Availabilty Hours : </strong> {user.startTime} - {user.endTime}
      </p>
      <p>
        <strong>Role : </strong>
        {user.userRole}
      </p>
    </div>
  );
}

export default UserDetails;
