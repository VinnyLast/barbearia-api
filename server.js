require("dotenv").config();
console.log("🔥 SERVER CERTO RODANDO");

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ================= CONEXÃO MYSQL =================
const mysql = require('mysql2');

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.connect(err => {
  if (err) {
    console.error("❌ Erro ao conectar no MySQL:", err);
  } else {
    console.log("✅ MySQL conectado");
  }
});

// ================= ROTA TESTE =================
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// ================= AGENDAR =================
app.post("/agendar", (req, res) => {
  console.log("📩 POST /agendar recebido");

  const { barbeiro, servico, data, hora, nome, telefone } = req.body;

  // validação básica
  if (!barbeiro || !servico || !data || !hora || !nome || !telefone) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }

  const sql = `
    INSERT INTO agendamentos (barbeiro, servico, data, hora, nome, telefone)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [barbeiro, servico, data, hora, nome, telefone], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erro ao salvar");
    }

    res.json({ sucesso: true });
  });
});

// ================= HORÁRIOS =================
app.get("/horarios", (req, res) => {
  const { data, barbeiro } = req.query;

  if (!data || !barbeiro) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }

  const sql = `
    SELECT hora FROM agendamentos 
    WHERE data = ? AND barbeiro = ?
  `;

  db.query(sql, [data, barbeiro], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erro no banco");
    }

    res.json(results);
  });
});

// ================= LISTAR =================
app.get("/agendamentos", (req, res) => {
  const sql = "SELECT * FROM agendamentos ORDER BY data, hora";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erro ao buscar");
    }

    res.json(results);
  });
});

// ================= DELETAR =================
app.delete("/agendamentos/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM agendamentos WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erro ao deletar");
    }

    res.json({ sucesso: true });
  });
});

// ================= SERVIDOR =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Servidor rodando");
});
app.use(cors());