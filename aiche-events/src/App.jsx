import { useState, useEffect } from "react";
import EventCard from "./components/EventCard";
import SkeletonCard from "./components/SkeletonCard";
import events from "./data/events";

const ALL_TAGS = ["All", ...new Set(events.map((e) => e.tag))];

function App() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // Chemical background canvas animation
  useEffect(() => {
    const canvas = document.getElementById("chem-canvas");
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });

    const SYMBOLS = ["H₂O", "CO₂", "NH₃", "CH₄", "O₂", "NaCl", "H₂SO₄", "C₆H₆", "⚗", "⚛", "HCl", "KOH"];

    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 10 + 11,
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      opacity: Math.random() * 0.25 + 0.1,
      isHex: Math.random() > 0.6,
      hexSize: Math.random() * 18 + 14,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008,
    }));

    function drawHex(x, y, r, rotation, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = r * Math.cos(angle);
        const py = r * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    let animId;
    function animate() {
      ctx.clearRect(0, 0, W, H);
      const baseColor = darkMode ? "255,255,255" : "99,102,241";

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        if (p.x < -50) p.x = W + 50;
        if (p.x > W + 50) p.x = -50;
        if (p.y < -50) p.y = H + 50;
        if (p.y > H + 50) p.y = -50;

        const color = `rgba(${baseColor},${p.opacity})`;

        if (p.isHex) {
          drawHex(p.x, p.y, p.hexSize, p.rotation, color);
        } else {
          ctx.font = `${p.size}px monospace`;
          ctx.fillStyle = color;
          ctx.fillText(p.symbol, p.x, p.y);
        }
      });

      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animId);
  }, [darkMode]);

  const filtered = events
    .filter((e) => activeTag === "All" || e.tag === activeTag)
    .filter(
      (e) =>
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.description.toLowerCase().includes(query.toLowerCase()) ||
        e.tag.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark dark-bg" : "light-bg"}`}>

      {/* Chemical background canvas */}
      <canvas id="chem-canvas" />

      {/* Sticky Header */}
      <header className="sticky-header bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-gray-100">
              AIChE NITR — Upcoming Events
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Chemical Engineering Chapter · NIT Rourkela
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search events…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           placeholder-gray-400 focus:outline-none focus:border-indigo-400 transition-colors w-44"
              />
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                         text-gray-700 dark:text-gray-200 rounded-lg px-3 py-2 text-sm
                         hover:border-indigo-400 transition-all duration-200 hover:scale-105"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="max-w-5xl mx-auto mt-3 flex gap-2 flex-wrap">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                ${activeTag === tag
                  ? "bg-indigo-600 text-white scale-105 shadow-md shadow-indigo-200 dark:shadow-indigo-900"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400 dark:text-gray-500">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-base font-medium text-gray-500 dark:text-gray-400">No events found</p>
            <p className="text-sm mt-1">Try a different search or filter</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
