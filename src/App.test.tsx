import React, { useState, useEffect } from 'react';
import './App.css';
import { getLiveMatches, Match } from './data/matches';

type Bet = {
  matchId: number;
  team: string;
};

function App() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [betPlaced, setBetPlaced] = useState(false);

  useEffect(() => {
    // Load initial matches
    setMatches(getLiveMatches());

    // Update odds every 5 seconds
    const interval = setInterval(() => {
      setMatches(getLiveMatches());
    }, 5000);

    return () => clearInterval(interval); // Clean up when component unmounts
  }, []);

  const handleBet = (matchId: number, team: string) => {
    const alreadyBet = bets.some((bet) => bet.matchId === matchId);
    if (alreadyBet) return;
    setBets([...bets, { matchId, team }]);
    setBetPlaced(false);
  };

  const clearBets = () => {
    setBets([]);
    setBetPlaced(false);
  };

  const placeBets = () => {
    if (bets.length === 0) return;
    setBetPlaced(true);
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>⚽ Live Sports Betting</h1>

      <h2>Live Matches</h2>
      {matches.map((match) => (
        <div key={match.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
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
          <button onClick={placeBets} style={{ marginRight: '10px' }}>🟩 Place Bet</button>
          <button onClick={clearBets}>🗑️ Clear Bet Slip</button>
        </>
      )}

      {betPlaced && (
        <div style={{ marginTop: '20px', background: '#d4edda', padding: '10px', borderRadius: '5px' }}>
          ✅ Your bets have been placed!
        </div>
      )}
    </div>
  );
}

export default App;
