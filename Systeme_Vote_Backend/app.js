const express = require("express");
const path = require("path");
require("dotenv").config();

const indexRouter = require("./routes/index");
const authRoutes = require("./routes/auth.routes");
const sondageRoutes = require("./routes/sondageRoutes");
const voteRoutes = require("./routes/voteRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");

const pollCtrl = require("./controllers/pollController");

const app = express();


/* =====================
   Middlewares de base
===================== */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

/* =====================
   CORS HTTP
===================== */
const allowed = (origin) => {
  if (!origin) return true;
  if (origin === "http://localhost:3000") return true;
  if (origin === "http://localhost:3001") return true;
  if (origin === "http://localhost:3002") return true;
  if (/^https:\/\/systeme-vote-frontend-.*\.vercel\.app$/.test(origin)) return true;
  return false;
};

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowed(origin)) {
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  }

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

/* =====================
   Routes
===================== */
app.get("/health", (req, res) => res.send("ok"));

app.use("/", indexRouter);
app.use("/users", authRoutes);
app.use("/sondage", sondageRoutes);
app.use("/vote", voteRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/user", userRoutes);

/* =====================
   Auto-finish sondages
===================== */
setInterval(async () => {
  try {
    const io = app.get("io");
    if (!io) return; // 👈 sécurité
    const updated = await pollCtrl.runAutoFinish(io);
    if (updated > 0) console.log("✅ auto-finish updated:", updated);
  } catch (e) {
    console.log("❌ auto-finish error:", e.message);
  }
}, 30_000);

module.exports = app;
