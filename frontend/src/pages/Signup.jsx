import { useState } from 'react';
import { useSignup } from '../hooks/useSignup';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(name, email, password, userRole);
  };

  return (
    <form className='signup' onSubmit={handleSubmit}>
      <h3>Sign Up</h3>

      <label>Name:</label>
      <input type='text' onChange={(e) => setName(e.target.value)} value={name} />
      <label>Email address:</label>
      <input type='email' onChange={(e) => setEmail(e.target.value)} value={email} />
      <label>Password:</label>
      <input type='password' onChange={(e) => setPassword(e.target.value)} value={password} />
      <label>User Role:</label>
      <input type='text' onChange={(e) => setUserRole(e.target.value)} value={userRole} />

      <button disabled={isLoading}>Sign up</button>
      {error && <div className='error'>{error}</div>}
    </form>
  );
}

export default Signup;