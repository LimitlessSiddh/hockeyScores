import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const router = express.Router();

// 🏒 GET /api/stats/playoff-players
router.get('/playoff-players', async (_req, res) => {
  try {
    const url = 'https://www.hockey-reference.com/playoffs/NHL_2025.html';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const skaters: any[] = [];

    $('#stats tbody tr').each((_i, el) => {
      const cols = $(el).find('td');
      if (cols.length === 0) return;

      skaters.push({
        player: $(cols[0]).text(),
        team: $(cols[1]).text(),
        games: $(cols[2]).text(),
        goals: $(cols[3]).text(),
        assists: $(cols[4]).text(),
        points: $(cols[5]).text(),
        plusMinus: $(cols[7]).text(),
        pim: $(cols[8]).text()
      });
    });

    res.json(skaters);
  } catch (err: any) {
    console.error('❌ Error fetching playoff skater stats:', err.message);
    res.status(500).json({ error: 'Could not fetch playoff skater stats' });
  }
});

export default router;
