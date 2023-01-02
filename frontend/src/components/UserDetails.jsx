function UserDetails({ user }) {
  return (
    <div className='user-details'>
      <h4>{user.name}</h4>
      <p>{user.email}</p>
      <p>
        <strong>Availabilty Hours : </strong>
        {user.startTime}-{user.endTime}
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
    </div>
  );
}

export default UserDetails;
