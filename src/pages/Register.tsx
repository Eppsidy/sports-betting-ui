import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const exists = users.find((u: any) => u.email === email);
    if (exists) {
      alert('User already exists');
      return;
    }

    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registered successfully!');
    navigate('/login');
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      /><br /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      /><br /><br />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
