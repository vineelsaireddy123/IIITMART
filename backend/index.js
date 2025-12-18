require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { GoogleGenerativeAI } = require('@google/generative-ai');

const userRoutes = require("./routes/Userroutes");
const itemRoutes = require("./routes/Items");
const orderRoutes = require("./routes/Orders");

const app = express();
const PORT = process.env.PORT || 5000;

// — Middlewares —
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// — MongoDB Connection —
mongoose
  .connect(process.env.MONGO_URI, { ssl: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// — Mount your other routes —
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/orders", orderRoutes);

// — Gemini Setup —
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ GOOGLE_GEMINI_API_KEY not set");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);

// — Chat Endpoint —
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Payload must be { messages: […] }" });
    }

    // Grab the last user turn
    const last = messages[messages.length - 1];
    if (last.role !== "user" || !last.content.trim()) {
      return res
        .status(400)
        .json({ error: "Last message must be a non-empty user message" });
    }

    // Use a valid Gemini model name (e.g., "gemini-1.5-flash")
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content and read response directly
    const result = await model.generateContent(last.content);
    const candidate = result.response.text();

    if (!candidate) {
      throw new Error("No valid response from Gemini");
    }

    return res.json({ role: "assistant", content: candidate });
  } catch (err) {
    console.error("🔴 /api/chat error", err);
    return res.status(500).json({
      role: "assistant",
      content: "Sorry, something went wrong. Please try again.",
    });
  }
});

// — Start Server —
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
