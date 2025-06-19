// src/data/matches.ts

export type Match = {
  id: number;
  teamA: string;
  teamB: string;
  oddsA: number;
  oddsB: number;
};

const baseMatches: Match[] = [
  { id: 1, teamA: 'Manchester United', teamB: 'Chelsea', oddsA: 2.5, oddsB: 2.8 },
  { id: 2, teamA: 'Barcelona', teamB: 'Real Madrid', oddsA: 2.2, oddsB: 2.6 },
  { id: 3, teamA: 'Kaizer Chiefs', teamB: 'Orlando Pirates', oddsA: 1.9, oddsB: 2.4 },
];

// Randomly adjust odds slightly
function getLiveMatches(): Match[] {
  return baseMatches.map((match) => ({
    ...match,
    oddsA: +(match.oddsA + (Math.random() * 0.2 - 0.1)).toFixed(2),
    oddsB: +(match.oddsB + (Math.random() * 0.2 - 0.1)).toFixed(2),
  }));
}

export { getLiveMatches };
