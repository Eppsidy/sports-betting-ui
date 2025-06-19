import React, { useState, useEffect } from 'react';
import './App.css';
import { getLiveMatches, Match } from './data/matches';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

type Bet = {
  matchId: number;
  team: string;
};

function App() {
  const isLoggedIn = !!localStorage.getItem("currentUser");
  const [matches, setMatches] = useState<Match[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [stake, setStake] = useState<number>(100); 
  const [betPlaced, setBetPlaced] = useState(false);

 useEffect(() => {
  setMatches(getLiveMatches());

  // Update odds every 5 seconds
  const interval = setInterval(() => {
    setMatches(getLiveMatches());
  }, 5000);

  // Load saved bets from localStorage on start
  const savedBets = localStorage.getItem('bets');
  if (savedBets) {
    setBets(JSON.parse(savedBets));
  }

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  localStorage.setItem('bets', JSON.stringify(bets));
}, [bets]);


  const handleBet = (matchId: number, team: string) => {
    const alreadyBet = bets.some((bet) => bet.matchId === matchId);
    if (alreadyBet) return;
    setBets([...bets, { matchId, team }]);
    setBetPlaced(false);
  };

 const clearBets = () => {
  setBets([]);
  setBetPlaced(false);
  localStorage.removeItem('bets'); // also clear from storage
};


  const placeBets = () => {
    if (bets.length === 0) return;
    setBetPlaced(true);
  };

  const calculateWinnings = () => {
  let total = 0;
  bets.forEach((bet) => {
    const match = matches.find((m) => m.id === bet.matchId);
    if (match) {
      const odds = bet.team === match.teamA ? match.oddsA : match.oddsB;
      total += 100 * odds;
    }
  });
  return total.toFixed(2);
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
        <div className="success-massage">
          ✅ Your bets have been placed!
        </div>
      )}
    </div>
    </div>
  );
}

export default App;
