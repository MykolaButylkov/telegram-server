
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.json());

app.post("/send", async (req, res) => {
  const data = req.body;

  const message = `
🚚 Новая заявка на переезд:
👤 Имя: ${data.name}
📍 Откуда: ${data.from}
📍 Куда: ${data.to}
📅 Дата: ${data.date}
🏢 Этаж: ${data.floor}, Лифт: ${data.elevator}
📦 Объем: ${data.volume}
📝 Комментарий: ${data.comment}
  `.trim();

  try {
    const telegramRes = await fetch("https://api.telegram.org/bot" + process.env.BOT_TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.CHAT_ID,
        text: message,
      }),
    });

    const result = await telegramRes.json();
    res.json({ ok: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to send message." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started on port " + PORT));
