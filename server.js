import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Statische Dateien unter /public ausliefern
const PUBLIC_DIR = path.join(__dirname, "public");
app.use(cors());
app.use(express.static(PUBLIC_DIR));

// Healthcheck (für Render oder zum schnellen Prüfen)
app.get("/healthz", (_req, res) => res.status(200).send("ok"));

// ElevenLabs-WebRTC-Proxy (SDP als Klartext!)
app.use("/api/eleven/webrtc", express.text({ type: "application/sdp", limit: "5mb" }));
app.post("/api/eleven/webrtc", async (req, res) => {
  try {
    const agentId = req.query.agent_id;
    if (!agentId) return res.status(400).send("agent_id missing");

    const upstream = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/webrtc?agent_id=${encodeURIComponent(agentId)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/sdp" },
        body: req.body
      }
    );

    const answer = await upstream.text();
    res.status(upstream.status).set("Content-Type", "application/sdp").send(answer);
  } catch (e) {
    console.error("Proxy error:", e);
    res.status(500).send(String(e));
  }
});

// Root & Fallback → public/index.html
app.get("/", (_req, res) =>
  res.sendFile(path.join(PUBLIC_DIR, "index.html"), err => {
    if (err) {
      console.error("sendFile / error:", err);
      res.status(500).send("public/index.html not found");
    }
  })
);
app.get("*", (_req, res) => res.sendFile(path.join(PUBLIC_DIR, "index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
