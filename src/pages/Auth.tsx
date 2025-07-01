import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function AuthPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate('/home', { replace: true }); // ✅ use replace to avoid history jump
      } else {
        setLoading(false); // show login UI if not logged in
      }
    };

    checkSession();

    // ✅ Optional: Listen for real-time login events (avoids manual refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/home', { replace: true });
      }
    });

    return () => subscription?.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Checking your session...</h2>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="auth-container">
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
    </div>
  );
}
