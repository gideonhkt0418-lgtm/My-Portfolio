// Mini game: dodge asteroids, collect stars. Includes a Top 5 leaderboard.
import { useEffect, useRef, useState } from "react";
import { load, save } from "../hooks.js";

const W = 300, H = 340;

export default function AsteroidRun() {
  const canvasRef = useRef(null);
  const scoreRef = useRef(null);       // the live score number (updated every frame, without re-rendering)
  const gameRef = useRef(null);        // holds the game's start() function

  const [status, setStatus] = useState("ready");      // "ready" | "playing" | "over"
  const [result, setResult] = useState(null);         // { score, newBest, qualifies, saved }
  const [board, setBoard] = useState(() => load("asteroidBoard", []));
  const [best, setBest] = useState(() => Math.max(load("asteroidBest", 0), board[0]?.score || 0));
  const [name, setName] = useState(() => load("asteroidName", ""));
  const [highlight, setHighlight] = useState(null);

  // The game loop calls this when you crash. A ref keeps it up to date with the latest board/best.
  const onGameOver = useRef(null);
  onGameOver.current = (score) => {
    const qualifies = score > 0 && (board.length < 5 || score > board[board.length - 1].score);
    const newBest = score > best;
    if (newBest) { setBest(score); save("asteroidBest", score); }
    setTimeout(() => {
      setResult({ score, newBest, qualifies, saved: false });
      setStatus("over");
    }, 500);
  };

  // ===== The game itself (runs on a <canvas>) =====
  useEffect(() => {
    const cv = canvasRef.current, ctx = cv.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const bg = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H, s: Math.random() * 1.2 + 0.3, v: Math.random() * 0.4 + 0.15,
    }));
    let ship, rocks, gems, sparks = [], score, t, spawnT, gemT, targetX = null;
    let playing = false, keys = {}, last = 0, raf = 0;

    const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    function reset() {
      ship = { x: W / 2, y: H - 46, vx: 0 };
      rocks = []; gems = []; sparks = []; score = 0; t = 0; spawnT = 0; gemT = 1.5; targetX = null;
      if (scoreRef.current) scoreRef.current.textContent = 0;
    }
    function makeRock() {
      const r = 9 + Math.random() * 13, pts = [];
      const n = 7 + ((Math.random() * 3) | 0);
      for (let k = 0; k < n; k++) pts.push(0.72 + Math.random() * 0.38);
      rocks.push({
        x: r + Math.random() * (W - 2 * r), y: -r, r, pts,
        vy: 90 + Math.random() * 60 + t * 4, vx: (Math.random() - 0.5) * 30, rot: 0, vr: (Math.random() - 0.5) * 2,
      });
    }
    function burst(x, y, color, n) {
      for (let k = 0; k < n; k++) {
        const a = Math.random() * Math.PI * 2, s = 40 + Math.random() * 120;
        sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.6, color });
      }
    }
    function moveSparks(dt) {
      sparks.forEach((s) => { s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt; });
      sparks = sparks.filter((s) => s.life > 0);
    }

    function update(dt) {
      t += dt;
      // controls
      if (keys.ArrowLeft || keys.a) ship.vx = -260;
      else if (keys.ArrowRight || keys.d) ship.vx = 260;
      else ship.vx = 0;
      if (ship.vx) { ship.x += ship.vx * dt; targetX = null; }
      else if (targetX !== null) ship.x += (targetX - ship.x) * Math.min(1, dt * 12);
      ship.x = Math.max(14, Math.min(W - 14, ship.x));

      // spawn asteroids (faster over time) and stars
      spawnT -= dt;
      if (spawnT <= 0) { makeRock(); spawnT = Math.max(0.28, 0.9 - t * 0.02); }
      gemT -= dt;
      if (gemT <= 0) { gems.push({ x: 16 + Math.random() * (W - 32), y: -10, vy: 110, a: 0 }); gemT = 1.6 + Math.random() * 1.4; }

      rocks.forEach((r) => { r.y += r.vy * dt; r.x += r.vx * dt; r.rot += r.vr * dt; });
      gems.forEach((g) => { g.y += g.vy * dt; g.a += dt * 4; });
      rocks = rocks.filter((r) => r.y < H + 30);
      gems = gems.filter((g) => g.y < H + 20 && !g.got);
      moveSparks(dt);
      bg.forEach((s) => { s.y += s.v * 60 * dt * (1 + t * 0.03); if (s.y > H) { s.y = 0; s.x = Math.random() * W; } });

      // score: survival time + collected stars
      score += dt * 10;
      gems.forEach((g) => {
        if (Math.hypot(g.x - ship.x, g.y - ship.y) < 20) { g.got = true; score += 50; burst(g.x, g.y, "#ffd166", 12); }
      });
      if (scoreRef.current) scoreRef.current.textContent = score | 0;

      // crash?
      for (const r of rocks) {
        if (Math.hypot(r.x - ship.x, r.y - (ship.y + 2)) < r.r * 0.85 + 9) { gameOver(); break; }
      }
    }

    function draw() {
      const text = css("--text"), icon = css("--icon"), muted = css("--muted");
      ctx.clearRect(0, 0, W, H);
      // background stars
      ctx.fillStyle = text; ctx.globalAlpha = 0.35;
      bg.forEach((s) => ctx.fillRect(s.x, s.y, s.s, s.s));
      ctx.globalAlpha = 1;
      // collectible stars
      gems.forEach((g) => {
        ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(Math.sin(g.a) * 0.3);
        ctx.fillStyle = "#ffd166"; ctx.shadowColor = "#ffd166"; ctx.shadowBlur = 10;
        ctx.beginPath();
        for (let k = 0; k < 8; k++) {
          const rr = k % 2 ? 3 : 8, a = (k * Math.PI) / 4 - Math.PI / 2;
          ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
        }
        ctx.closePath(); ctx.fill(); ctx.restore();
      });
      // asteroids
      ctx.lineWidth = 1.6; ctx.strokeStyle = muted;
      rocks.forEach((r) => {
        ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(r.rot);
        ctx.beginPath();
        r.pts.forEach((p, k) => {
          const a = (k / r.pts.length) * Math.PI * 2;
          ctx.lineTo(Math.cos(a) * r.r * p, Math.sin(a) * r.r * p);
        });
        ctx.closePath();
        ctx.fillStyle = muted; ctx.globalAlpha = 0.18; ctx.fill();
        ctx.globalAlpha = 1; ctx.stroke(); ctx.restore();
      });
      // rocket
      if (ship) {
        ctx.save(); ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.vx / 2600 || (targetX !== null ? (targetX - ship.x) / 400 : 0));
        const f = 8 + Math.random() * 6; // flickering flame
        ctx.fillStyle = "#f72585"; ctx.beginPath(); ctx.moveTo(-4, 12); ctx.lineTo(0, 12 + f); ctx.lineTo(4, 12); ctx.fill();
        ctx.fillStyle = "#ffd166"; ctx.beginPath(); ctx.moveTo(-2, 12); ctx.lineTo(0, 12 + f * 0.6); ctx.lineTo(2, 12); ctx.fill();
        ctx.strokeStyle = icon; ctx.lineWidth = 1.8; ctx.lineJoin = "round";
        ctx.beginPath(); ctx.moveTo(0, -16); ctx.quadraticCurveTo(8, -6, 6, 12); ctx.lineTo(-6, 12); ctx.quadraticCurveTo(-8, -6, 0, -16); ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-6, 4); ctx.lineTo(-12, 14); ctx.lineTo(-6, 12); ctx.moveTo(6, 4); ctx.lineTo(12, 14); ctx.lineTo(6, 12); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, -3, 2.6, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      // explosion sparks
      sparks.forEach((s) => {
        ctx.globalAlpha = Math.max(0, s.life / 0.6); ctx.fillStyle = s.color;
        ctx.fillRect(s.x - 1.5, s.y - 1.5, 3, 3);
      });
      ctx.globalAlpha = 1;
    }

    function loop(now) {
      const dt = Math.min(0.033, (now - last) / 1000 || 0);
      last = now;
      if (playing) update(dt); else moveSparks(dt);
      draw();
      if (playing || sparks.length) raf = requestAnimationFrame(loop);
    }

    function start() {
      reset(); playing = true;
      last = performance.now();
      cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
    }
    function gameOver() {
      playing = false;
      burst(ship.x, ship.y, "#f72585", 26); burst(ship.x, ship.y, "#4cc9f0", 14);
      ship = null;
      onGameOver.current(score | 0);
    }

    const onMove = (e) => {
      if (!playing) return;
      const r = cv.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width) * W;
    };
    const onDown = (e) => cv.setPointerCapture(e.pointerId);
    const onKeyDown = (e) => {
      if (!playing) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") e.preventDefault();
      keys[e.key] = true;
    };
    const onKeyUp = (e) => { keys[e.key] = false; };
    const onHide = () => { if (document.hidden && playing) gameOver(); };

    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    document.addEventListener("visibilitychange", onHide);

    gameRef.current = { start };
    reset(); draw();

    return () => {
      cancelAnimationFrame(raf);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  function play() {
    setResult(null);
    setStatus("playing");
    gameRef.current.start();
  }

  function saveScore(e) {
    e.preventDefault();
    const clean = name.trim().slice(0, 12) || "Player";
    const row = { name: clean, score: result.score };
    const next = [...board, row].sort((a, b) => b.score - a.score).slice(0, 5);
    setBoard(next);
    save("asteroidBoard", next);
    save("asteroidName", clean);
    setName(clean);
    setHighlight(row);
    setResult({ ...result, saved: true });
  }

  const askName = status === "over" && result?.qualifies && !result.saved;

  return (
    <div className="game" id="game">
      <div className="game-top">
        <span className="title">Asteroid Run</span>
        <span>Score <b ref={scoreRef}>0</b> · Best <b>{best}</b></span>
      </div>

      <div className="g-stage">
        <canvas ref={canvasRef} id="gc" aria-label="Asteroid Run mini game" />
        {status !== "playing" && (
          <div className="g-overlay">
            <span className="big">
              {status === "ready" ? "Asteroid Run" : result?.newBest ? "New best!" : "Game over"}
            </span>
            <span className="muted">
              {status === "ready"
                ? "Dodge asteroids. Collect stars."
                : askName
                  ? `Score: ${result.score}. You made the leaderboard!`
                  : `Score: ${result?.score ?? 0}`}
            </span>
            {askName ? (
              <form id="gForm" onSubmit={saveScore}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={12}
                  placeholder="Your name"
                  autoComplete="off"
                  autoFocus
                  aria-label="Your name for the leaderboard"
                />
                <button type="submit">Save</button>
              </form>
            ) : (
              <button className="play" type="button" onClick={play}>
                {status === "ready" ? "Play" : "Play again"}
              </button>
            )}
          </div>
        )}
      </div>

      <p className="game-hint">Move with your mouse, finger or ← → keys</p>

      <div className="board">
        <div className="board-head"><span>Leaderboard</span><span>Top 5</span></div>
        <ol id="gBoard">
          {board.length === 0 ? (
            <li style={{ display: "block" }}><span className="empty">No scores yet. Be the first!</span></li>
          ) : (
            board.map((row, k) => (
              <li key={k + row.name + row.score} className={row === highlight ? "new" : ""}>
                <span className="rank">{k + 1}</span>
                <span className="name">{row.name}</span>
                <span className="pts">{row.score}</span>
              </li>
            ))
          )}
        </ol>
      </div>
    </div>
  );
}
