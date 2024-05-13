import express from 'express';
import "dotenv/config.js";
import path from 'path';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { pool } from './modules/db.js'

const app = express();
const PORT = process.env.SERVER_PORT || 3000
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(morgan('dev')); // 'dev' is a predefined log format
app.use(express.static(path.join(__dirname, "public")))
app.set('view engine', 'ejs'); // Sets view engine
app.use(express.urlencoded({ extended: false })) // Parse URL-encoded data i.e. name=John&age=30&city=New+York
app.use(express.json()); // Parse JSON and put it into req.body

// Routes
app.get('/', (_, res) => {
  res.render('index')
})

app.post('/analyze', async (req, res) => {
  try {
    // Get Data
    const team1Picks = req.body.team1;
    const team2Picks = req.body.team2;
    let placeholders1 = "(" + team1Picks.map((_, index) => `$${index + 1}`).join(", ") + ")"
    let placeholders2 = "(" + team2Picks.map((_, index) => `$${index + 1}`).join(", ") + ")"

    let valueTeam1 = await pool.query(`SELECT SUM(fs_points) FROM draft_2024 WHERE ID IN ${placeholders1}`, team1Picks);
    valueTeam1 = valueTeam1.rows[0].sum;
    let valueTeam2 = await pool.query(`SELECT SUM(fs_points) FROM draft_2024 WHERE ID IN ${placeholders2}`, team2Picks);
    valueTeam2 = valueTeam2.rows[0].sum;

    let surplus = Math.abs(valueTeam1 - valueTeam2);
    let outcome;
    if (valueTeam1 > valueTeam2) {
      outcome = "Team 2 Wins";
    } else if (valueTeam2 > valueTeam1) {
      outcome = "Team 1 Wins";
    } else {
      outcome = "Fair Trade";
    }
    res.status(200).json( { outcome, surplus })
  } catch (error) {
    res.status(401)
  }
})

// Initiate Server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
