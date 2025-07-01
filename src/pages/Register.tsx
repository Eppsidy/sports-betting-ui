import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Registered successfully! Please check your email to confirm.');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-20 shadow-md rounded-xl bg-white">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <input
        className="w-full p-2 mb-2 border rounded"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="w-full p-2 mb-2 border rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}
      <button
        className="w-full bg-blue-500 text-white p-2 rounded"
        onClick={handleRegister}
      >
        Register
      </button>
      <p className="text-sm mt-4 text-center">
        Already have an account?{' '}
        <button
          className="text-blue-500 underline"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;
