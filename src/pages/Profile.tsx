import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Profile = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate('/auth');
        return;
      }

      const user = session.user;
      setEmail(user.email ?? '');
      setUserId(user.id);

      // Fetch profile from DB
    const { data, error } = await supabase
    .from('profiles')
    .select('avatar_url, username')
    .eq('id', user.id)
    .single();

    if (data) {
      if (data.avatar_url) setProfilePicUrl(data.avatar_url);
      if (data.username) setUsername(data.username);
}


      setLoading(false);
    };

    getUser();
  }, [navigate]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      return;
    }

    const publicUrl = supabase.storage.from('avatars').getPublicUrl(filePath).data.publicUrl;

    setProfilePicUrl(publicUrl);

    // Save to profiles table
    await supabase
      .from('profiles')
      .upsert({ id: userId, email, username, avatar_url: publicUrl });

    alert('Profile picture updated!');
  };

  const handleSave = async () => {
    if (!userId) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, email, username, avatar_url: profilePicUrl });

    if (!error) {
      alert('Profile updated!');
      navigate('/');
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>My Profile</h2>

      {profilePicUrl && <img src={profilePicUrl} alt="Profile" width={100} height={100} />}<br />

      <label>Email:</label><br />
      <input value={email} onChange={(e) => setEmail(e.target.value)} /><br /><br />

      <label>Username:</label><br />
      <input value={username} onChange={(e) => setUsername(e.target.value)} /><br /><br />

      <label>Profile Picture:</label><br />
      <input type="file" accept="image/*" onChange={handleFileChange} /><br /><br />

      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default Profile;
