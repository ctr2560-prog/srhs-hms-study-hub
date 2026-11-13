/* ================= HEADLINE GAMES: The Big Board, The Climb, Mystery Term ================= */

// ---- sound effects (WebAudio, no files) ----
let sfxOff = false, actx = null;
function sfx(kind) {
  if (sfxOff) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    const t = actx.currentTime;
    const tone = (f, d, s = 0, type = "sine", v = 0.14) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = type; o.frequency.setValueAtTime(f, t + s); g.gain.setValueAtTime(0.0001, t + s); g.gain.exponentialRampToValueAtTime(v, t + s + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + s + d); o.connect(g); g.connect(actx.destination); o.start(t + s); o.stop(t + s + d + 0.05); };
    if (kind === "right") { tone(659, 0.14); tone(988, 0.3, 0.11); }
    else if (kind === "wrong") { tone(196, 0.3, 0, "square", 0.06); tone(147, 0.45, 0.16, "square", 0.06); }
    else if (kind === "lock") { tone(392, 0.12, 0, "triangle"); tone(523, 0.5, 0.1, "triangle", 0.1); }
    else if (kind === "tick") tone(1200, 0.04, 0, "sine", 0.04);
    else if (kind === "pick") tone(740, 0.06, 0, "triangle", 0.08);
    else if (kind === "win") [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.35, i * 0.11, "triangle", 0.12));
    else if (kind === "reveal") { tone(523, 0.1); tone(784, 0.22, 0.09); }
    else if (kind === "bigwin") [392, 523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, 0.4, i * 0.12, "triangle", 0.12));
  } catch (e) {}
}

// ---- shared question pools ----
const CATS = [
  { fa: "fa1", iq: 0, name: "Health status" }, { fa: "fa1", iq: 1, name: "Healthcare system" }, { fa: "fa1", iq: 2, name: "Tech & data" }, { fa: "fa1", iq: 3, name: "Taking action" },
  { fa: "fa2", iq: 0, name: "Assessment" }, { fa: "fa2", iq: 1, name: "Training & adaptation" }, { fa: "fa2", iq: 2, name: "Individual vs group" }, { fa: "fa2", iq: 3, name: "Fuel & recovery" }, { fa: "fa2", iq: 4, name: "Sustaining performance" }
];
const catQs = (c) => ALL_MCQ.filter((m) => DOTS[m.dot].fa === c.fa && DOTS[m.dot].iq === c.iq);
function verbQs() {
  return VERBS.map((v) => {
    const others = shuffle(VERBS.filter((x) => x.w !== v.w)).slice(0, 3).map((x) => x.w);
    const o = shuffle([v.w, ...others]);
    return { id: "kw-" + v.w, q: "Which NESA key word means: “" + v.d + "”?", o, a: o.indexOf(v.w), why: v.w + ": " + v.d + ". " + v.how, dot: null };
  });
}
const catOf = (dot) => dot ? (CATS.find((c) => c.fa === DOTS[dot].fa && c.iq === DOTS[dot].iq) || {}).name : "Key words";

function SfxToggle() {
  const [off, setOff] = useState(sfxOff);
  return <button className="sfx-tg" aria-label={off ? "Turn sound effects on" : "Turn sound effects off"} onClick={() => { sfxOff = !off; setOff(!off); try { localStorage.setItem("srhs-hms-sfx", sfxOff ? "off" : "on"); } catch (e) {} }}><I n={off ? "mute" : "vol"} s={16} />{off ? "Sound off" : "Sound on"}</button>;
}
try { sfxOff = localStorage.getItem("srhs-hms-sfx") === "off"; } catch (e) {}

/* ---------------- THE BIG BOARD ---------------- */
const BB_VALUES = [100, 200, 300, 400, 500];
function BigBoard({ best, record }) {
  const [phase, setPhase] = useState("setup");
  const [nTeams, setNTeams] = useState(1), [names, setNames] = useState(["Team 1", "Team 2", "Team 3", "Team 4"]);
  const [boardKind, setBoardKind] = useState("mixed");
  const [teams, setTeams] = useState([]), [turn, setTurn] = useState(0);
  const [board, setBoard] = useState([]), [used, setUsed] = useState({}), [dd, setDd] = useState(null);
  const [cur, setCur] = useState(null), [pick, setPick] = useState(null), [wager, setWager] = useState(0);
  const [finalQ, setFinalQ] = useState(null), [finalWagers, setFinalWagers] = useState([]), [finalRight, setFinalRight] = useState([]), [finalShown, setFinalShown] = useState(false);
  const [nb, setNb] = useState(false);
  const solo = nTeams === 1;

  function start() {
    let cats;
    const kw = { name: "Key words", qs: verbQs() };
    if (boardKind === "fa1") cats = CATS.filter((c) => c.fa === "fa1").map((c) => ({ name: c.name, qs: catQs(c) })).concat([kw]);
    else if (boardKind === "fa2") cats = CATS.filter((c) => c.fa === "fa2").map((c) => ({ name: c.name, qs: catQs(c) }));
    else cats = shuffle(CATS).slice(0, 4).map((c) => ({ name: c.name, qs: catQs(c) })).concat([kw]);
    cats = shuffle(cats).map((c) => ({ name: c.name, qs: shuffle(c.qs).slice(0, 5), spare: shuffle(c.qs).slice(5) }));
    setBoard(cats); setUsed({}); setDd([Math.floor(Math.random() * 5), 2 + Math.floor(Math.random() * 3)]);
    setTeams(names.slice(0, nTeams).map((n, i) => ({ name: (n || "").trim() || "Team " + (i + 1), score: 0 }))); setTurn(0);
    setCur(null); setPick(null); setFinalQ(null); setFinalShown(false); setPhase("board");
  }
  const left = 25 - Object.keys(used).length;
  function openTile(c, r) {
    if (used[c + "-" + r]) return;
    const isDd = dd && dd[0] === c && dd[1] === r;
    setCur({ c, r, value: BB_VALUES[r], q: board[c].qs[r], dd: isDd }); setPick(null);
    if (isDd) { setWager(Math.min(BB_VALUES[r], Math.max(teams[turn].score, 500))); setPhase("wager"); sfx("bigwin"); }
    else { setPhase("q"); sfx("reveal"); }
  }
  function answer(k) {
    if (pick !== null) return; setPick(k);
    const ok = k === cur.q.a, amt = cur.dd ? wager : cur.value;
    sfx(ok ? "right" : "wrong");
    setTeams((ts) => ts.map((t, i) => i === turn ? { ...t, score: t.score + (ok ? amt : cur.dd ? -amt : 0) } : t));
  }
  function backToBoard() {
    const u = { ...used, [cur.c + "-" + cur.r]: true }; setUsed(u); setCur(null); setPick(null);
    setTurn((t) => (t + 1) % teams.length);
    setPhase(Object.keys(u).length >= 25 ? "finalintro" : "board");
  }
  function goFinal() {
    const pool = board.flatMap((c) => c.spare || []);
    const q = pool.length ? shuffle(pool)[0] : shuffle(ALL_MCQ)[0];
    setFinalQ(q); setFinalWagers(teams.map((t) => Math.max(0, Math.min(t.score, Math.round(t.score / 2))))); setFinalRight(teams.map(() => false)); setFinalShown(false); setPick(null); setPhase("finalwager");
  }
  function finishFinal() {
    const ts = teams.map((t, i) => ({ ...t, score: t.score + (finalRight[i] ? finalWagers[i] : -finalWagers[i]) }));
    setTeams(ts); setPhase("over"); sfx("win");
    if (solo) setNb(record(Math.max(0, ts[0].score)));
  }

  const Scores = () => <div className="bb-scores">{teams.map((t, i) => <div key={i} className={i === turn && !["over", "finalwager", "finalq"].includes(phase) ? "on" : ""}><small>{t.name}</small><b>{t.score}</b></div>)}</div>;

  if (phase === "setup") return <div className="bb-setup">
    <p className="g-intro">Pick a tile, answer the question, win the points. Harder tiles are worth more. One tile hides a <b>Double Down</b>, where you choose how much to wager. Finish with a final question where you bet on yourself. Put it on the projector and play in teams.</p>
    <div className="g-field"><span>Players</span><div className="seg">{[1, 2, 3, 4].map((n) => <button key={n} className={nTeams === n ? "on" : ""} onClick={() => setNTeams(n)}>{n === 1 ? "Solo" : n + " teams"}</button>)}</div></div>
    {!solo && <div className="g-field"><span>Team names</span><div className="team-names">{names.slice(0, nTeams).map((n, i) => <input key={i} className="g-input" value={n} maxLength={20} onChange={(e) => setNames(names.map((x, j) => j === i ? e.target.value : x))} aria-label={"Team " + (i + 1) + " name"} />)}</div></div>}
    <div className="g-field"><span>Board</span><div className="seg">{[["mixed", "Mixed"], ["fa1", "Focus area 1"], ["fa2", "Focus area 2"]].map(([k, l]) => <button key={k} className={boardKind === k ? "on" : ""} onClick={() => setBoardKind(k)}>{l}</button>)}</div></div>
    <button className="btn red lg" onClick={start}><I n="play" s={16} />Start the board</button>
  </div>;

  if (phase === "board") return <div>
    <Scores />
    {!solo && <p className="bb-turn">{teams[turn].name}, pick a tile</p>}
    <div className="bb-grid">
      {board.map((c, ci) => <div key={"h" + ci} className="bb-cat" style={{ gridColumn: ci + 1, gridRow: 1 }}>{c.name}</div>)}
      {board.map((c, ci) => BB_VALUES.map((v, ri) => <button key={ci + "-" + ri} className={"bb-tile" + (used[ci + "-" + ri] ? " used" : "")} style={{ gridColumn: ci + 1, gridRow: ri + 2 }} disabled={!!used[ci + "-" + ri]} onClick={() => openTile(ci, ri)}>{used[ci + "-" + ri] ? "" : v}</button>))}
    </div>
    <div className="spread" style={{ marginTop: 16 }}><span className="g-note">{left} tiles left</span><button className="btn ghost sm g-ghost" onClick={goFinal}>Skip to the final question</button></div>
  </div>;

  if (phase === "wager") { const max = Math.max(teams[turn].score, 500); return <div className="bb-card dd">
    <div className="dd-badge">Double Down!</div>
    <p className="g-intro">{solo ? "You've" : teams[turn].name + " has"} found the hidden tile. Choose a wager from 0 to {max}. Get it right to win it, or lose it if you're wrong.</p>
    <div className="wager"><input type="range" min="0" max={max} step="50" value={wager} onChange={(e) => setWager(+e.target.value)} aria-label="Wager" /><b>{wager}</b></div>
    <button className="btn red lg" onClick={() => { setPhase("q"); sfx("reveal"); }}>Lock in wager</button>
  </div>; }

  if (phase === "q") { const q = cur.q, ok = pick === q.a; return <div className="bb-card">
    <div className="spread"><span className="bb-tag">{board[cur.c].name} · {cur.dd ? "Double Down " + wager : cur.value}</span>{!solo && <span className="g-note">{teams[turn].name}</span>}</div>
    <h3 className="g-q">{q.q}</h3>
    <div className="g-opts">{q.o.map((o, k) => <button key={k} className={"g-opt" + (pick !== null && k === q.a ? " right" : "") + (pick === k && k !== q.a ? " wrong" : "")} disabled={pick !== null} onClick={() => answer(k)}><i>{"ABCD"[k]}</i>{o}</button>)}</div>
    {pick !== null && <div className={"g-result " + (ok ? "ok" : "no")}><b>{ok ? "Correct! +" + (cur.dd ? wager : cur.value) : cur.dd ? "Not this time. −" + wager : "Not this time."}</b><p>{q.why}</p></div>}
    {pick !== null && <button className="btn red" style={{ marginTop: 14 }} onClick={backToBoard}>Back to the board<I n="next" s={16} /></button>}
  </div>; }

  if (phase === "finalintro") return <div className="bb-card center"><div className="dd-badge">Board cleared</div><Scores /><p className="g-intro">Time for the final question. You'll see the category first, then bet on yourself.</p><button className="btn red lg" onClick={goFinal}>Final question</button></div>;

  if (phase === "finalwager") return <div className="bb-card">
    <div className="dd-badge">Final question</div>
    <p className="g-intro">Category: <b>{catOf(finalQ.dot)}</b>. {solo ? "How much of your score will you bet?" : "Each team chooses how much of its score to bet."}</p>
    <div className="final-wagers">{teams.map((t, i) => <div key={i} className="fw"><span>{t.name} <small>({t.score})</small></span><input type="range" min="0" max={Math.max(0, t.score)} step="50" value={finalWagers[i]} disabled={t.score <= 0} onChange={(e) => setFinalWagers(finalWagers.map((w, j) => j === i ? +e.target.value : w))} aria-label={t.name + " wager"} /><b>{finalWagers[i]}</b></div>)}</div>
    <button className="btn red lg" onClick={() => { setPhase("finalq"); sfx("reveal"); }}>Show the question</button>
  </div>;

  if (phase === "finalq") return <div className="bb-card">
    <span className="bb-tag">Final question · {catOf(finalQ.dot)}</span>
    <h3 className="g-q">{finalQ.q}</h3>
    <div className="g-opts">{finalQ.o.map((o, k) => <button key={k} className={"g-opt" + ((solo ? pick !== null : finalShown) && k === finalQ.a ? " right" : "") + (solo && pick === k && k !== finalQ.a ? " wrong" : "")} disabled={!solo || pick !== null} onClick={() => { if (!solo) return; setPick(k); setFinalShown(true); setFinalRight([k === finalQ.a]); sfx(k === finalQ.a ? "right" : "wrong"); }}><i>{"ABCD"[k]}</i>{o}</button>)}</div>
    {!solo && !finalShown && <><p className="g-note" style={{ marginTop: 12 }}>Teams write down their answer. When everyone's ready, reveal it.</p><button className="btn red" style={{ marginTop: 10 }} onClick={() => { setFinalShown(true); sfx("reveal"); }}>Reveal the answer</button></>}
    {finalShown && <div className="g-result ok"><b>Answer: {"ABCD"[finalQ.a]}. {finalQ.o[finalQ.a]}</b><p>{finalQ.why}</p></div>}
    {finalShown && !solo && <div className="final-marks"><span className="g-note">Tick the teams that got it right:</span>{teams.map((t, i) => <label key={i} className={"fm" + (finalRight[i] ? " on" : "")}><input type="checkbox" checked={finalRight[i]} onChange={(e) => setFinalRight(finalRight.map((x, j) => j === i ? e.target.checked : x))} />{t.name}</label>)}</div>}
    {finalShown && <button className="btn red" style={{ marginTop: 14 }} onClick={finishFinal}>See the final scores</button>}
  </div>;

  // over
  const ranked = teams.map((t, i) => ({ ...t, i })).sort((a, b) => b.score - a.score);
  return <div className="over">
    <span className="eyebrow" style={{ color: "var(--sky)" }}>The Big Board</span>
    {solo ? <><div className="big">{teams[0].score}</div><h2>{nb ? "New high score!" : "Final score"}</h2><p style={{ color: "#c9d4ec" }}>Best: {Math.max(best, teams[0].score)}</p></> :
      <><h2>{ranked[0].name} wins!</h2><div className="podium">{ranked.map((t, k) => <div key={t.i} className={"pod p" + (k + 1)}><b>{t.score}</b><span>{t.name}</span><i>{k + 1}</i></div>)}</div></>}
    <div className="row" style={{ justifyContent: "center" }}><button className="btn red" onClick={() => setPhase("setup")}><I n="restart" s={16} />Play again</button><button className="btn g-ghost" onClick={() => go("games")}>All games</button></div>
  </div>;
}

/* ---------------- THE CLIMB ---------------- */
const CLIMB = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000];
const CLIMB_SAFE = [4, 9]; // indexes of safe rungs (1,000 and 32,000)
const fmt = (n) => n.toLocaleString("en-AU");
function TheClimb({ best, record }) {
  const [phase, setPhase] = useState("start");
  const [qs, setQs] = useState([]), [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null), [state, setState] = useState("choose"); // choose | locked | right | wrong
  const [life, setLife] = useState({ fifty: true, poll: true, hint: true });
  const [hidden, setHidden] = useState([]), [poll, setPoll] = useState(null), [hint, setHint] = useState(null);
  const [final, setFinal] = useState(0), [nb, setNb] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  function begin() { setQs(shuffle(ALL_MCQ).slice(0, 12)); setIdx(0); setSel(null); setState("choose"); setLife({ fifty: true, poll: true, hint: true }); setHidden([]); setPoll(null); setHint(null); setPhase("play"); }
  const q = qs[idx];
  const banked = idx > 0 ? CLIMB[idx - 1] : 0;
  const safeNow = () => { let s = 0; CLIMB_SAFE.forEach((r) => { if (idx > r) s = CLIMB[r]; }); return s; };
  function end(points, how) { setFinal(points); setPhase(how); setNb(record(points)); sfx(how === "won" ? "bigwin" : how === "walked" ? "win" : "wrong"); }
  function lock() {
    if (sel === null || state !== "choose") return;
    setState("locked"); sfx("lock");
    timer.current = setTimeout(() => {
      if (sel === q.a) { setState("right"); sfx("right"); }
      else { setState("wrong"); sfx("wrong"); }
    }, 1800);
  }
  function next() {
    if (state === "right") {
      if (idx === 11) return end(CLIMB[11], "won");
      setIdx(idx + 1); setSel(null); setState("choose"); setHidden([]); setPoll(null); setHint(null);
    } else end(safeNow(), "lost");
  }
  function useFifty() { if (!life.fifty || state !== "choose") return; const wrong = shuffle([0, 1, 2, 3].filter((k) => k !== q.a)).slice(0, 2); setHidden(wrong); if (wrong.includes(sel)) setSel(null); setLife({ ...life, fifty: false }); sfx("pick"); }
  function usePoll() {
    if (!life.poll || state !== "choose") return;
    const live = [0, 1, 2, 3].filter((k) => !hidden.includes(k));
    const right = 40 + Math.floor(Math.random() * 35); let rest = 100 - right; const p = {};
    const others = shuffle(live.filter((k) => k !== q.a));
    others.forEach((k, i) => { const v = i === others.length - 1 ? rest : Math.floor(Math.random() * (rest + 1)); p[k] = v; rest -= v; });
    p[q.a] = right; setPoll(p); setLife({ ...life, poll: false }); sfx("pick");
  }
  function useHint() { if (!life.hint || state !== "choose") return; const d = q.dot && DOTS[q.dot]; setHint(d ? d.big : "Think about what the key word asks you to do."); setLife({ ...life, hint: false }); sfx("pick"); }

  if (phase === "start") return <div className="over">
    <p className="g-intro" style={{ maxWidth: 520 }}>Twelve questions stand between you and the top of the ladder. Each one doubles (roughly) your points. Reach a <b>safe point</b> and you keep it even if you fall. You get three lifelines, and you can walk away with what you've banked at any time.</p>
    <div className="climb-life-preview"><span><b>50:50</b>removes two wrong answers</span><span><b>Ask the class</b>shows how the class voted</span><span><b>Hint</b>gives the big idea behind the question</span></div>
    <button className="btn red lg" onClick={begin}><I n="play" s={16} />Start climbing</button>
  </div>;

  if (phase !== "play") return <div className="over">
    <span className="eyebrow" style={{ color: "var(--sky)" }}>The Climb</span>
    <div className="big">{fmt(final)}</div>
    <h2>{phase === "won" ? "You reached the top!" : phase === "walked" ? "Smart move. Points banked." : "So close!"}</h2>
    {phase === "lost" && q && <div className="g-result no" style={{ maxWidth: 560, textAlign: "left" }}><b>The answer was {"ABCD"[q.a]}. {q.o[q.a]}</b><p>{q.why}</p></div>}
    <p style={{ color: "#c9d4ec" }}>{nb ? "New high score! " : ""}Best: {fmt(Math.max(best, final))}</p>
    <div className="row" style={{ justifyContent: "center" }}><button className="btn red" onClick={begin}><I n="restart" s={16} />Climb again</button><button className="btn g-ghost" onClick={() => go("games")}>All games</button></div>
  </div>;

  return <div className="climb">
    <div className="climb-main">
      <div className="climb-top">
        <div className="lifelines">
          <button className={life.fifty ? "" : "spent"} disabled={!life.fifty || state !== "choose"} onClick={useFifty}>50:50</button>
          <button className={life.poll ? "" : "spent"} disabled={!life.poll || state !== "choose"} onClick={usePoll}>Ask the class</button>
          <button className={life.hint ? "" : "spent"} disabled={!life.hint || state !== "choose"} onClick={useHint}>Hint</button>
        </div>
        <span className="g-note">Question {idx + 1} of 12 · for {fmt(CLIMB[idx])}</span>
      </div>
      <div className="climb-q"><span className="bb-tag">{catOf(q.dot)}</span><h3 className="g-q">{q.q}</h3></div>
      {hint && <div className="climb-hint"><b>Hint</b>{hint}</div>}
      <div className="g-opts two">{q.o.map((o, k) => {
        const gone = hidden.includes(k);
        const cls = "g-opt" + (gone ? " gone" : "") + (sel === k && state === "choose" ? " sel" : "") + (sel === k && state === "locked" ? " locked" : "") + ((state === "right" || state === "wrong") && k === q.a ? " right" : "") + (state === "wrong" && sel === k ? " wrong" : "");
        return <button key={k} className={cls} disabled={gone || state !== "choose"} onClick={() => { setSel(k); sfx("pick"); }}><i>{"ABCD"[k]}</i><span style={{ flex: 1 }}>{gone ? "" : o}</span>{poll && !gone && <em className="pollbar"><u style={{ width: (poll[k] || 0) + "%" }} />{poll[k] || 0}%</em>}</button>;
      })}</div>
      {(state === "right" || state === "wrong") && <div className={"g-result " + (state === "right" ? "ok" : "no")}><b>{state === "right" ? "Correct! You've reached " + fmt(CLIMB[idx]) + (CLIMB_SAFE.includes(idx) ? " — a safe point!" : "") : "Wrong answer. You fall to " + fmt(safeNow()) + "."}</b><p>{q.why}</p></div>}
      <div className="row climb-actions">
        {state === "choose" && <><button className="btn red lg" disabled={sel === null} onClick={lock}>{sel === null ? "Choose an answer" : "Lock in " + "ABCD"[sel]}</button>{idx > 0 && <button className="btn g-ghost" onClick={() => end(banked, "walked")}>Walk away with {fmt(banked)}</button>}</>}
        {state === "locked" && <div className="suspense"><span className="spin" />Checking…</div>}
        {state === "right" && <button className="btn red lg" onClick={next}>{idx === 11 ? "Claim the top prize" : "Next question"}<I n="next" s={16} /></button>}
        {state === "wrong" && <button className="btn red lg" onClick={next}>See your result</button>}
      </div>
    </div>
    <ol className="ladder-x" aria-label="Points ladder">{CLIMB.map((v, k) => k).reverse().map((k) => <li key={k} className={(k === idx ? "now " : "") + (k < idx ? "done " : "") + (CLIMB_SAFE.includes(k) ? "safe" : "")}><span>{k + 1}</span><b>{fmt(CLIMB[k])}</b></li>)}</ol>
  </div>;
}

/* ---------------- MYSTERY TERM ---------------- */
const MT_ROUNDS = 8, MT_POINTS = [300, 200, 100];
const mtBase = (t) => t.replace(/\s*\(.*?\)\s*/g, " ").trim();
const mtAlt = (t) => ((t.match(/\(([^)]+)\)/) || [])[1] || "").trim();
const mtNorm = (s) => s.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]/g, "");
function lev(a, b) { const m = a.length, n = b.length; if (!m) return n; if (!n) return m; let p = Array.from({ length: n + 1 }, (_, j) => j); for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; } return p[n]; }
function mtRedact(text, term) {
  let out = text;
  const words = mtBase(term).split(/[\s/-]+/).filter((w) => w.length >= 4);
  const alt = mtAlt(term);
  for (const w of words) out = out.replace(new RegExp("\\b" + w.slice(0, Math.max(4, w.length - 2)).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[a-z]*", "gi"), "▇▇▇");
  if (alt) out = out.replace(new RegExp("\\b" + alt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "g"), "▇▇▇");
  return out;
}
const mtPattern = (term) => mtBase(term).split(" ").map((w) => w.split("").map((ch, i) => /[a-z0-9]/i.test(ch) ? (i === 0 ? ch.toUpperCase() : "_") : ch).join(" ")).join("     ");
function MysteryTerm({ best, record }) {
  const [phase, setPhase] = useState("start");
  const [items, setItems] = useState([]), [round, setRound] = useState(0), [clue, setClue] = useState(0);
  const [guess, setGuess] = useState(""), [score, setScore] = useState(0), [streak, setStreak] = useState(0), [solved, setSolved] = useState(0);
  const [result, setResult] = useState(null), [shake, setShake] = useState(false), [nb, setNb] = useState(false);
  const inputRef = useRef(null);
  function begin() {
    const pool = ALL_CON.filter((c) => mtBase(c.term).length <= 28 && mtBase(c.term).split(" ").length <= 4 && !/[\/;]/.test(c.term));
    const seen = new Set(), pick = [];
    for (const c of shuffle(pool)) { const k = mtNorm(c.term); if (!seen.has(k)) { seen.add(k); pick.push(c); } if (pick.length === MT_ROUNDS) break; }
    setItems(pick); setRound(0); setClue(0); setGuess(""); setScore(0); setStreak(0); setSolved(0); setResult(null); setPhase("play");
  }
  useEffect(() => { if (phase === "play" && !result && inputRef.current) inputRef.current.focus(); }, [phase, round, result]);
  const it = items[round];
  function check(e) {
    e && e.preventDefault(); if (result || !guess.trim()) return;
    const g = mtNorm(guess), base = mtNorm(mtBase(it.term)), alt = mtNorm(mtAlt(it.term));
    const ok = g === base || (alt && g === alt) || (base.length >= 6 && lev(g, base) <= Math.max(1, Math.floor(base.length / 7)));
    if (ok) { const pts = MT_POINTS[clue] + streak * 50; setScore((s) => s + pts); setStreak((s) => s + 1); setSolved((s) => s + 1); setResult({ ok: true, pts }); sfx("right"); burst("+" + pts); }
    else { sfx("wrong"); setShake(true); setTimeout(() => setShake(false), 400); setGuess(""); if (clue < 2) setClue(clue + 1); else { setResult({ ok: false }); setStreak(0); } }
  }
  function moreClue() { if (clue < 2) { setClue(clue + 1); sfx("tick"); } else { setResult({ ok: false }); setStreak(0); sfx("wrong"); } }
  function nextRound() { if (round + 1 >= items.length) { setPhase("over"); setNb(record(score)); sfx("win"); return; } setRound(round + 1); setClue(0); setGuess(""); setResult(null); }

  if (phase === "start") return <StartScreen text={"Work out the HMS term from the clues. You start with an example, then get the definition, then the letters. Solve it on the first clue for 300 points, the second for 200, or the third for 100. Keep a streak going for bonus points. " + MT_ROUNDS + " terms per game."} onStart={begin} />;
  if (phase === "over") return <GameOver title="Mystery Term" score={score} best={Math.max(best, score)} isBest={nb} onAgain={begin}><p style={{ color: "#c9d4ec" }}>{solved} of {items.length} terms solved</p></GameOver>;

  const clues = [["Example", mtRedact(it.eg, it.term)], ["Definition", mtRedact(it.def, it.term)], ["Letters", mtPattern(it.term)]];
  return <div className="mt">
    <div className="hud"><div><small>Score</small><b>{score}</b></div><div><small>Term</small><b>{round + 1}/{items.length}</b></div><div><small>Streak</small><b className="combo">{streak}</b></div><div><small>Worth</small><b>{result ? "–" : MT_POINTS[clue] + streak * 50}</b></div></div>
    <span className="bb-tag">{catOf(it.dot)}</span>
    <div className="mt-clues">{clues.map(([l, t], k) => <div key={k} className={"mt-clue" + (k <= clue || result ? " show" : "") + (k === 2 ? " letters" : "")}><small>Clue {k + 1} · {l}</small>{k <= clue || result ? <p>{t}</p> : <p className="locked">Locked: {MT_POINTS[k]} points if you solve it before this clue</p>}</div>)}</div>
    {!result ? <form className={"mt-guess" + (shake ? " shake" : "")} onSubmit={check}>
      <input ref={inputRef} className="g-input" value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Type the term…" aria-label="Your guess" autoComplete="off" autoCapitalize="off" spellCheck="false" />
      <button className="btn red" type="submit" disabled={!guess.trim()}>Guess</button>
      <button className="btn g-ghost" type="button" onClick={moreClue}>{clue < 2 ? "Next clue" : "Give up"}</button>
    </form> : <div className={"g-result " + (result.ok ? "ok" : "no")}><b>{result.ok ? "Solved! +" + result.pts : "The term was:"} {mtBase(it.term)}{mtAlt(it.term) ? " (" + mtAlt(it.term) + ")" : ""}</b><p>{it.def}</p><button className="btn red" style={{ marginTop: 12 }} onClick={nextRound}>{round + 1 >= items.length ? "See your score" : "Next term"}<I n="next" s={16} /></button></div>}
  </div>;
}
