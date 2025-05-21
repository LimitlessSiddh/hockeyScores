import express from 'express';
import axios from 'axios';

const router = express.Router();

// 🧠 Safely extract player names from various API formats
function extractPlayerName(p: any): string {
  if (p.playerName) return p.playerName;
  if (p.skaterFullName) return p.skaterFullName;
  if (p.goalieFullName) return p.goalieFullName;
  if (p.fullName) return p.fullName;
  if (p.player?.fullName) return p.player.fullName;
  if (p.firstName?.default && p.lastName?.default) return `${p.firstName.default} ${p.lastName.default}`;
  if (p.firstName && p.lastName) return `${p.firstName} ${p.lastName}`;
  return 'Unknown';
}

// ✅ Regular season skater stats
router.get('/players', async (req, res) => {
  const { sort = 'points', page = 1, limit = 10 } = req.query;
  const start = (Number(page) - 1) * Number(limit);

  try {
    const response = await axios.get('https://api.nhle.com/stats/rest/en/skater/summary', {
      params: {
        isAggregate: false,
        isGame: false,
        sort: JSON.stringify([{ property: sort, direction: 'DESC' }]),
        start,
        limit
      }
    });

    const formatted = response.data.data.map((p: any) => ({
      name: extractPlayerName(p),
      team: p.teamAbbrevs,
      goals: p.goals,
      assists: p.assists,
      points: p.points
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Failed to fetch /players:', err);
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
});

// ✅ Regular season goalie stats
router.get('/goalies', async (req, res) => {
  const { sort = 'savePct', page = 1, limit = 10 } = req.query;
  const start = (Number(page) - 1) * Number(limit);

  try {
    const response = await axios.get('https://api.nhle.com/stats/rest/en/goalie/summary', {
      params: {
        isAggregate: false,
        isGame: false,
        sort: JSON.stringify([{ property: sort, direction: 'DESC' }]),
        start,
        limit
      }
    });

    const formatted = response.data.data.map((g: any) => ({
      name: extractPlayerName(g),
      team: g.teamAbbrevs,
      savePercentage: g.savePct,
      goalsAgainstAverage: g.goalsAgainstAverage,
      wins: g.wins
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Failed to fetch /goalies:', err);
    res.status(500).json({ error: 'Failed to fetch goalie stats' });
  }
});

// ✅ 2024 Playoff skater stats
router.get('/playoff-players', async (_req, res) => {
  try {
    const response = await axios.get('https://api.nhle.com/stats/rest/en/skater/summary', {
      params: {
        isAggregate: false,
        isGame: false,
        start: 0,
        limit: 100,
        sort: JSON.stringify([{ property: 'points', direction: 'DESC' }]),
        cayenneExp: 'gameTypeId=3 and seasonId=20232024'
      }
    });

    // 🔍 Log the first object for debugging name structure
    console.log('Sample player object:', JSON.stringify(response.data.data?.[0], null, 2));

    const formatted = response.data.data.map((p: any) => ({
      name: extractPlayerName(p),
      team: p.teamAbbrevs,
      goals: p.goals,
      assists: p.assists,
      points: p.points
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Failed to fetch /playoff-players:', err);
    res.status(500).json({ error: 'Failed to fetch playoff player stats' });
  }
});

// ✅ 2024 Playoff goalie stats
router.get('/playoff-goalies', async (_req, res) => {
  try {
    const response = await axios.get('https://api.nhle.com/stats/rest/en/goalie/summary', {
      params: {
        isAggregate: false,
        isGame: false,
        start: 0,
        limit: 100,
        sort: JSON.stringify([{ property: 'savePct', direction: 'DESC' }]),
        cayenneExp: 'gameTypeId=3 and seasonId=20232024'
      }
    });

    // 🔍 Log the first object for debugging name structure
    console.log('Sample goalie object:', JSON.stringify(response.data.data?.[0], null, 2));

    const formatted = response.data.data.map((g: any) => ({
      name: extractPlayerName(g),
      team: g.teamAbbrevs,
      shotsAgainst: g.shotsAgainst,
      goalsAgainst: g.goalsAgainst,
      savePct: g.savePct !== undefined ? (g.savePct * 100).toFixed(1) + '%' : '—'
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Failed to fetch /playoff-goalies:', err);
    res.status(500).json({ error: 'Failed to fetch playoff goalie stats' });
  }
});

export default router;
