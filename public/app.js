// public/app.js
const log = (msg) => {
  const el = document.getElementById('log');
  if (el) el.textContent += `${msg}\n`;
};

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('startBtn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    try {
      // *** WICHTIG: POST (nicht GET) auf /start ***
      const res = await fetch('/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ts: Date.now() })
      });

      if (!res.ok) {
        const text = await res.text();
        alert(`Start fehlgeschlagen:\n${text}`);
        return;
      }

      const data = await res.json();
      log(`Server: ${JSON.stringify(data)}`);

      // einfache TTS-Demo
      const utter = new SpeechSynthesisUtterance(data.message || 'Session started');
      speechSynthesis.speak(utter);

    } catch (e) {
      alert(`Start fehlgeschlagen:\n${e.message}`);
    }
  });
});
