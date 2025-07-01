import React, { useState, useEffect } from 'react';
import '../App.css';
import { getLiveMatches, Match } from '../data/matches';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

type Bet = {
  matchId: number;
  team: string;
};

function Home() {
  const [userEmail, setUserEmail] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [stake, setStake] = useState<number>(100); 
  const [betPlaced, setBetPlaced] = useState(false);
  const navigate = useNavigate();

  // Fetch user session and redirect if not logged in
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email || '');
        // Optionally fetch profile pic from a 'profiles' table
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url, username')
        .eq('id', session.user.id)
        .single();

      setProfilePic(profile?.avatar_url || null);
      setUsername(profile?.username || '');

      }
    };
    getSession();
  }, [navigate]);

  // Fetch bets from Supabase
  useEffect(() => {
    const fetchBets = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase
        .from('bets')
        .select('*')
        .eq('user_id', session.user.id);
      if (!error && data) {
        setBets(data.map((bet: any) => ({
          matchId: bet.match_id,
          team: bet.team
        })));
      }
    };
    fetchBets();
  }, []);

  // Save bets to Supabase whenever bets change
  useEffect(() => {
    const saveBets = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      // Remove old bets for this user
      await supabase.from('bets').delete().eq('user_id', session.user.id);
      // Insert new bets
      if (bets.length > 0) {
        const insertData = bets.map(bet => ({
          user_id: session.user.id,
          match_id: bet.matchId,
          team: bet.team
        }));
        await supabase.from('bets').insert(insertData);
      }
    };
    saveBets();
  }, [bets]);

  // Fetch live matches and update odds every 5 seconds
  useEffect(() => {
    setMatches(getLiveMatches());
    const interval = setInterval(() => {
      setMatches(getLiveMatches());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleBet = (matchId: number, team: string) => {
    const alreadyBet = bets.some((bet) => bet.matchId === matchId);
    if (alreadyBet) return;
    setBets([...bets, { matchId, team }]);
    setBetPlaced(false);
  };

  const clearBets = async () => {
    setBets([]);
    setBetPlaced(false);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('bets').delete().eq('user_id', session.user.id);
    }
  };

  const placeBets = () => {
    if (bets.length === 0) return;
    setBetPlaced(true);
  };

  const calculatePayout = (stake: number): number => {
    let totalOdds = 1;
    for (const bet of bets) {
      const match = matches.find((m) => m.id === bet.matchId);
      if (!match) continue;
      const selectedOdds =
        bet.team === match.teamA ? match.oddsA : match.oddsB;
      totalOdds *= selectedOdds;
    }
    return +(stake * totalOdds).toFixed(2); // round to 2 decimal places
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>⚽ Live Sports Betting</h1>
      <div>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
        Welcome back, {username || userEmail} 👋
        {profilePic && <img src={profilePic} alt="Profile" width={50} height={50} />}
        </p>
        <button onClick={() => navigate('/profile')} style={{ marginLeft: '10px', marginRight: '10px' }}>My Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <h2>Sports Betting App</h2>
      <h2>Live Matches</h2>
      {matches.map((match) => (
        <div key={match.id} className="match-card" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h3>{match.teamA} vs {match.teamB}</h3>
          <p>
            <strong>{match.teamA}</strong> Odds: {match.oddsA.toFixed(2)} | 
            <strong> {match.teamB}</strong> Odds: {match.oddsB.toFixed(2)}
          </p>
          <button onClick={() => handleBet(match.id, match.teamA)}>Bet on {match.teamA}</button>
          <button onClick={() => handleBet(match.id, match.teamB)} style={{ marginLeft: '10px' }}>
            Bet on {match.teamB}
          </button>
        </div>
      ))}

      <div className="bet-slip">
        <h2>Your Bet Slip</h2>
        {bets.length === 0 ? (
          <p>No bets placed yet.</p>
        ) : (
          <>
            <ul>
              {bets.map((bet, index) => {
                const match = matches.find((m) => m.id === bet.matchId);
                return (
                  <li key={index}>
                    {match?.teamA} vs {match?.teamB} — <strong>{bet.team}</strong>
                  </li>
                );
              })}
            </ul>
            <div style={{ margin: '10px 0' }}>
              <label><strong>Stake (R): </strong></label>
              <input
                type="number"
                value={stake}
                min={1}
                onChange={(e) => setStake(Number(e.target.value))}
                style={{ width: '80px', marginLeft: '10px' }}
              />
            </div>
            <p><strong>Potential Payout:</strong> R{calculatePayout(stake)}</p>
            <button onClick={placeBets} style={{ marginRight: '10px' }}>
              🟩 Place Bet
            </button>
            <button onClick={clearBets}>🗑️ Clear Bet Slip</button>
          </>
        )}

        {betPlaced && (
          <div className="success-message">
            ✅ Your bets have been placed!
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
