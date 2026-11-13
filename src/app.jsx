const { useState, useEffect, useRef, useMemo, useCallback } = React;
const DOTS = Object.assign({}, DOTS_FA1A, DOTS_FA1B, DOTS_FA2A, DOTS_FA2B);
const ALL_DOT_IDS = [...FOCUS_AREAS[0].dots, ...FOCUS_AREAS[1].dots];
const faOf = (id) => FOCUS_AREAS.find((f) => f.id === DOTS[id].fa);
const dotNum = (id) => faOf(id).dots.indexOf(id) + 1;
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const ALL_MCQ = ALL_DOT_IDS.flatMap((id) => DOTS[id].mcq.map((m, i) => ({ id: id + "-" + i, dot: id, q: m[0], o: m[1], a: m[2], why: m[3] })));
const ALL_CON = ALL_DOT_IDS.flatMap((id) => DOTS[id].con.map((c) => ({ term: c[0], def: c[1], eg: c[2], dot: id })));

/* ---------------- storage ---------------- */
const KEY = "srhs-hms-v1";
function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
function useStore() {
  const [s, setS] = useState(() => ({ seen: {}, reels: {}, quiz: {}, marks: [], hs: {}, drafts: {}, ...load() }));
  const update = useCallback((fn) => setS((prev) => { const n = fn({ ...prev }); save(n); return n; }), []);
  return [s, update];
}

/* ---------------- claude capabilities ---------------- */
const capCache = {};
function useCap(name) {
  const [cap, setCap] = useState(capCache[name] === undefined ? undefined : capCache[name]);
  useEffect(() => {
    let live = true;
    if (capCache[name] !== undefined) { setCap(capCache[name]); return; }
    if (!window.claude || !window.claude.use) { capCache[name] = null; setCap(null); return; }
    window.claude.use(name).then((c) => { capCache[name] = c || null; if (live) setCap(c || null); }).catch(() => { capCache[name] = null; if (live) setCap(null); });
    return () => { live = false; };
  }, [name]);
  return cap; // undefined = still checking, null = unavailable
}

/* ---------------- text helpers ---------------- */
function rich(t) { return t.split(/(\*\*[^*]+\*\*)/g).map((p, i) => p.startsWith("**") ? <b key={i}>{p.slice(2, -2)}</b> : p); }
const plain = (t) => t.replace(/\*+/g, "");
const wordCount = (t) => (t.trim().match(/\S+/g) || []).length;

/* ---------------- icons ---------------- */
const P = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
  book: "M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5zM4 21.5A2.5 2.5 0 0 1 6.5 19H20v3H6.5",
  play: "M7 4v16l13-8z",
  reel: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm3 7v6l5-3z",
  quiz: "M9 9a3 3 0 1 1 4.2 2.75c-.7.3-1.2.95-1.2 1.75V14M12 17.5v.5M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z",
  pen: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  game: "M6 8h12a4 4 0 0 1 4 4v1a4 4 0 0 1-7 2.6L14 15h-4l-1 .6A4 4 0 0 1 2 13v-1a4 4 0 0 1 4-4zM7 11v3M5.5 12.5h3M16 12h.01M18 14h.01",
  key: "M15 7a4 4 0 1 1-3.9 4.9L3 20v-3h2v-2h2l2-2M15 7h.01",
  check: "M5 12.5 10 17 19 7",
  back: "M15 5l-7 7 7 7",
  next: "M9 5l7 7-7 7",
  layers: "M12 3 2 8l10 5 10-5zM2 13l10 5 10-5M2 17.5l10 5 10-5",
  list: "M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
  pause: "M7 4h3v16H7zM14 4h3v16h-3z",
  vol: "M4 9v6h4l5 4V5L8 9zM16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12",
  mute: "M4 9v6h4l5 4V5L8 9zM17 9l5 5M22 9l-5 5",
  heart: "M12 20s-7-4.5-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5c-2.3 4.5-9.3 9-9.3 9z",
  restart: "M4 4v6h6M4.5 15a8 8 0 1 0 1.9-8.3L4 10",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z",
  trophy: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3",
  spark: "M12 2v6M12 16v6M2 12h6M16 12h6M5 5l3.5 3.5M15.5 15.5 19 19M19 5l-3.5 3.5M8.5 15.5 5 19",
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  stack: "M4 6h16M4 12h16M4 18h10",
  sort: "M3 6h7M3 12h5M3 18h3M17 4v16M13 16l4 4 4-4",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",
};
function I({ n, s }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s ? { width: s, height: s } : null} aria-hidden="true"><path d={P[n]} /></svg>; }
function Crest({ size }) { return <span className="crest-disc" style={size ? { width: size, height: size } : null}><img src={LOGO} alt="Sarah Redfern High School crest" /></span>; }

/* ---------------- router ---------------- */
function useRoute() {
  const get = () => (location.hash || "#home").slice(1);
  const [r, setR] = useState(get);
  useEffect(() => { const f = () => { setR(get()); window.scrollTo(0, 0); }; addEventListener("hashchange", f); return () => removeEventListener("hashchange", f); }, []);
  return r;
}
const go = (h) => { location.hash = h; };

const NAV = [["home", "Home", "home"], ["syllabus", "Syllabus", "book"], ["reels", "Reels", "reel"], ["quiz", "Quiz", "quiz"], ["marker", "Written Responses", "pen"], ["games", "Games", "game"], ["keywords", "Key words", "key"]];

/* ================= APP ================= */
function App() {
  const route = useRoute();
  const [store, update] = useStore();
  const [theme, setTheme] = useState(() => store.theme || "");
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light"); }, [theme]);
  const toggleTheme = () => { const dark = theme === "dark"; const n = dark ? "light" : "dark"; setTheme(n); update((s) => ({ ...s, theme: n })); };
  const [base, arg] = [route.split("-")[0], route.split("-").slice(1).join("-")];
  const section = base === "dot" ? "syllabus" : base === "reel" ? "reels" : base === "game" ? "games" : base;

  let view;
  if (base === "dot" && DOTS[arg]) view = <DotPage id={arg} store={store} update={update} />;
  else if (base === "syllabus") view = <Syllabus fa={arg || "fa1"} store={store} />;
  else if (base === "reels") view = <Reels store={store} update={update} />;
  else if (base === "reel" && DOTS[arg]) view = <ReelFeed start={arg} store={store} update={update} />;
  else if (base === "quiz") view = <QuizHub store={store} update={update} />;
  else if (base === "marker") view = <Marker store={store} update={update} initial={arg} />;
  else if (base === "games") view = <Games store={store} />;
  else if (base === "game") view = <GameHost id={arg} store={store} update={update} />;
  else if (base === "keywords") view = <Keywords />;
  else view = <Home store={store} />;

  return (
    <div className="app">
      <aside className="side">
        <button className="brand" onClick={() => go("home")}><Crest /><span><b>HMS Study Hub</b><small>Sarah Redfern HS · Year 12</small></span></button>
        {NAV.map(([h, label, ic]) => <button key={h} className={"nav-btn" + (section === h ? " on" : "")} onClick={() => go(h)}><I n={ic} />{label}</button>)}
        <div className="side-prog"><div className="lbl">Course progress<b>{Math.round(Object.keys(store.seen).length / 36 * 100)}%</b></div><div className="bar"><i style={{ width: Object.keys(store.seen).length / 36 * 100 + "%" }} /></div></div>
        <div className="side-foot">
          <button className="theme-tg" onClick={toggleTheme}><I n={theme === "dark" ? "sun" : "moon"} s={16} />{theme === "dark" ? "Light mode" : "Dark mode"}</button>
        </div>
      </aside>
      <header className="mob-head"><Crest /><div style={{ flex: 1 }}><b>HMS Study Hub</b><small>Sarah Redfern HS · Year 12</small></div>
        <button className="btn ghost sm" style={{ background: "rgba(255,255,255,.12)", color: "#fff" }} onClick={() => go("keywords")} aria-label="Key words"><I n="key" s={18} /></button>
        <button className="btn ghost sm" style={{ background: "rgba(255,255,255,.12)", color: "#fff" }} onClick={toggleTheme} aria-label="Switch theme"><I n="moon" s={18} /></button>
      </header>
      <main className="main"><div className="wrap" key={route}>{view}</div></main>
      <nav className="tabbar">{NAV.slice(0, 6).map(([h, label, ic]) => <button key={h} className={section === h ? "on" : ""} onClick={() => go(h)}><I n={ic} />{label === "Written Responses" ? "Writing" : label}</button>)}</nav>
    </div>
  );
}

/* ================= HOME ================= */
function Home({ store }) {
  const seen = Object.keys(store.seen).length, reels = Object.keys(store.reels).length;
  const qs = Object.values(store.quiz); const qavg = qs.length ? Math.round(qs.reduce((a, b) => a + b, 0) / qs.length) : 0;
  const lastMark = store.marks[store.marks.length - 1];
  const nextDot = ALL_DOT_IDS.find((d) => !store.seen[d]) || "h1";
  const nf = faOf(nextDot), nd = DOTS[nextDot];
  const pct = Math.round(seen / 36 * 100), R = 98, C = 2 * Math.PI * R;
  const hr = new Date().getHours(), greet = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
  const TOOLS = [["reels", "reel", "1-minute reels", "Narrated, animated revision clips for every dot point.", "#fdecec", "#bf2026"], ["quiz", "quiz", "Quizzes", "Section I style multiple choice, with the reasoning behind every answer.", "#e8effb", "#1d499f"], ["marker", "pen", "Written Responses", "Write short answers and extended responses, get a mark and band, and see a Band 6 answer.", "#fdf3dc", "#a86a00"], ["games", "game", "Revision games", "Rapid Fire, Sort Rush, Term Match and more.", "#e6f5ed", "#1f8a5b"]];
  return (<>
    <section className="hero">
      <div>
        <span className="eyebrow">{greet} · Year 12 Health and Movement Science</span>
        <h1>Revise every dot point.<br /><em>Write like a Band 6.</em></h1>
        <p>Big-text notes, 1-minute reels, quizzes and an HSC-style marker for all 36 dot points in Health and Movement Science.</p>
        <div className="row" style={{ marginTop: 26 }}>
          <button className="btn red lg" onClick={() => go("dot-" + nextDot)}><I n="book" s={18} />{seen ? "Continue revising" : "Start revising"}</button>
          <button className="btn line lg" onClick={() => go("reel-" + nextDot)}><I n="play" s={18} />Watch a reel</button>
        </div>
        <div className="hero-stats">
          <div><b>{seen}<small style={{ fontSize: 15, color: "var(--muted)" }}>/36</small></b><span>Dot points</span></div>
          <div><b>{reels}</b><span>Reels watched</span></div>
          <div><b>{qs.length ? qavg + "%" : "–"}</b><span>Quiz average</span></div>
          <div><b>{lastMark ? "B" + lastMark.band : "–"}</b><span>Last band</span></div>
        </div>
      </div>
      <div className="hero-ring">
        <svg viewBox="0 0 210 210">
          <circle cx="105" cy="105" r={R} fill="none" stroke="#d6e0f3" strokeWidth="8" />
          <circle cx="105" cy="105" r={R} fill="none" stroke="#1d499f" strokeWidth="8" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - Math.max(pct, 1.5) / 100)} style={{ transition: "stroke-dashoffset 1s ease" }} /></svg>
        <Crest /><span className="pct">{pct}% of the course</span>
      </div>
    </section>

    <button className="cont" style={{ "--c": `var(--${nf.id})` }} onClick={() => go("dot-" + nextDot)}>
      <span className="num">{dotNum(nextDot)}</span>
      <span style={{ minWidth: 0 }}><span className="eyebrow">{seen ? "Up next" : "Start here"} · Focus area {nf.n} · <span style={{ color: "var(--c)" }}>{nd.v}</span></span><b>{nd.t}</b></span>
      <span className="go"><I n="next" s={20} /></span>
    </button>

    <div className="sec-h"><div><span className="eyebrow">The course</span><h2>Focus areas</h2></div></div>
    <div className="grid g2">
      {FOCUS_AREAS.map((f) => { const done = f.dots.filter((d) => store.seen[d]).length; return (
        <button key={f.id} className="fa-card" data-n={f.n} style={{ "--c": `var(--${f.id})` }} onClick={() => go("syllabus-" + f.id)}>
          <span className={"chip " + f.id}>Focus area {f.n}</span>
          <h3>{f.name}</h3>
          <p className="muted" style={{ fontSize: 14.5 }}>{f.iqs.length} inquiry questions · 18 dot points · {f.outcomes.length} outcomes</p>
          <div className="foot"><div className="bar" style={{ flex: 1 }}><i style={{ width: (done / 18) * 100 + "%" }} /></div><b style={{ fontSize: 13, fontFamily: "var(--mono)" }}>{done}/18</b><span className="open">Open<I n="next" s={16} /></span></div>
        </button>); })}
    </div>

    <div className="sec-h"><div><span className="eyebrow">Study tools</span><h2>Four ways to lock it in</h2></div></div>
    <div className="grid g4">
      {TOOLS.map(([h, ic, t, d, g, c]) =>
        <button key={h} className="tool" style={{ "--tb": g, "--tc": c }} onClick={() => go(h)}><span className="ic"><I n={ic} /></span><span className="arr"><I n="next" s={18} /></span><h4>{t}</h4><p>{d}</p></button>)}
    </div>

    <div className="sec-h"><div><span className="eyebrow">Know the paper</span><h2>The HSC exam</h2></div><button className="btn line sm" onClick={() => go("keywords")}><I n="key" s={15} />Key words & bands</button></div>
    <div className="exam-strip">
      <div><span className="eyebrow">Section I</span><b>20 marks</b><span className="muted">Objective response (multiple choice)</span><span className="w"><i style={{ width: "20%" }} /></span></div>
      <div><span className="eyebrow">Section II</span><b>56 marks</b><span className="muted">9–12 short-answer items, at least 3 worth 6–8 marks</span><span className="w"><i style={{ width: "56%" }} /></span></div>
      <div><span className="eyebrow">Section III</span><b>24 marks</b><span className="muted">Two 12-mark extended responses, one per focus area</span><span className="w"><i style={{ width: "24%" }} /></span></div>
    </div>
    <p className="muted" style={{ fontSize: 13.5, marginTop: 12 }}>3 hours + 10 minutes reading time · 100 marks · roughly equal weighting of the two focus areas · Year 11 content is assumed knowledge.</p>
  </>);
}

/* ================= SYLLABUS ================= */
function Syllabus({ fa, store }) {
  const f = FOCUS_AREAS.find((x) => x.id === fa) || FOCUS_AREAS[0];
  return (<>
    <div className="page-h"><span className="eyebrow">Syllabus</span><h1>Every dot point, broken down</h1><p>Choose a dot point to open its revision notes, concept breakdown, summary, 1-minute reel, quiz and practice question.</p></div>
    <div className="tabs">{FOCUS_AREAS.map((x) => <button key={x.id} className={x.id === f.id ? "on" : ""} onClick={() => go("syllabus-" + x.id)}>Focus area {x.n}</button>)}</div>
    <h2 style={{ fontSize: 26, fontWeight: 900 }}>{f.name}</h2>
    <ul className="muted" style={{ fontSize: 14, margin: "8px 0 0", paddingLeft: 18 }}>{f.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
    {f.iqs.map((iq, qi) => (
      <div className="iq" key={qi}>
        <h3><span>IQ{qi + 1}</span>{iq}</h3>
        {f.dots.filter((d) => DOTS[d].iq === qi).map((d) => (
          <button key={d} className="dot-row" onClick={() => go("dot-" + d)}>
            <span className="verb">{DOTS[d].v}</span>
            <span className="t">{DOTS[d].t.replace(/^\w+ /, (m) => m)}</span>
            <span className={"tick" + (store.seen[d] ? " done" : "")}>{store.seen[d] && <I n="check" />}</span><span className="arr"><I n="next" s={18} /></span>
          </button>))}
      </div>))}
  </>);
}

/* ================= DOT PAGE ================= */
const DOT_TABS = [["revise", "Revise", "book"], ["break", "Break it down", "layers"], ["sum", "Summary", "list"], ["reel", "1-min reel", "play"], ["quiz", "Quiz", "quiz"], ["practice", "Practice", "pen"]];
function DotPage({ id, store, update }) {
  const d = DOTS[id], f = faOf(id);
  const [tab, setTab] = useState("revise");
  const [size, setSize] = useState(() => store.textSize || 2);
  useEffect(() => { setTab("revise"); update((s) => ({ ...s, seen: { ...s.seen, [id]: true } })); }, [id]);
  const i = ALL_DOT_IDS.indexOf(id), prev = ALL_DOT_IDS[i - 1], next = ALL_DOT_IDS[i + 1];
  const c = `var(--${f.id})`;
  return (<div style={{ "--c": c }}>
    <button className="back" onClick={() => go("syllabus-" + f.id)}><I n="back" s={16} />Focus area {f.n} · IQ{d.iq + 1}</button>
    <div className="dp-head">
      <div className="row"><span className={"chip " + f.id}>FA{f.n} · Dot point {dotNum(id)}</span><span className="verb">{d.v}</span></div>
      <h1>{d.t}</h1>
      {d.inc.length > 0 && <ul className="inc">{d.inc.map((x) => <li key={x}>{x}</li>)}</ul>}
      <div className="bigidea"><small>The big idea</small>{d.big}</div>
    </div>
    <div className="tabs" role="tablist">{DOT_TABS.map(([k, l, ic]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}><I n={ic} />{l}</button>)}</div>

    {tab === "revise" && <div>
      <div className="spread" style={{ marginBottom: 16 }}><span className="eyebrow">Revision notes · large text</span>
        <div className="textsize" aria-label="Text size">{[1, 2, 3].map((n) => <button key={n} className={size === n ? "on" : ""} style={{ fontSize: 11 + n * 3 }} onClick={() => { setSize(n); update((s) => ({ ...s, textSize: n })); }}>A</button>)}</div></div>
      <article className={"read s" + size}>{d.notes.map(([h, p]) => <section key={h}><h2>{h}</h2><p>{rich(p)}</p></section>)}</article>
      <div className="tipbox read"><b>Marker's tip</b><p>{d.tip}</p></div>
    </div>}

    {tab === "break" && <div>
      {d.flow && <div className="card pad" style={{ marginBottom: 16 }}><span className="eyebrow">How it connects</span>
        <div className="flow">{d.flow.map((x, k) => <React.Fragment key={k}>{k > 0 && <i>→</i>}<span>{x}</span></React.Fragment>)}</div></div>}
      <div className="grid g2">{d.con.map(([t, m, e]) => <div className="concept" key={t}><h4>{t}</h4><p>{m}</p><div className="eg"><b>Example</b>{e}</div></div>)}</div>
    </div>}

    {tab === "sum" && <div className="read" style={{ maxWidth: 820 }}>
      <ol className="sumlist">{d.sum.map((x, k) => <li key={k}><i>{k + 1}</i><span>{x}</span></li>)}</ol>
      <div className="tipbox"><b>Key word: {d.v}</b><p>{(VERBS.find((v) => v.w === d.v) || {}).d}. {(VERBS.find((v) => v.w === d.v) || {}).how}</p></div>
    </div>}

    {tab === "reel" && <div className="reel-stage"><Reel id={id} store={store} update={update} />
      <div className="reel-side"><span className="eyebrow">Up next</span>{next && <ReelThumb id={next} store={store} onClick={() => go("reel-" + next)} />}<button className="btn ghost" onClick={() => go("reel-" + id)}>Open in reel feed</button></div></div>}

    {tab === "quiz" && <Quiz key={id} items={ALL_MCQ.filter((m) => m.dot === id)} title={"Dot point " + dotNum(id) + " quiz"} onDone={(pct) => update((s) => ({ ...s, quiz: { ...s.quiz, [id]: Math.max(pct, s.quiz[id] || 0) } }))} />}

    {tab === "practice" && <MarkPanel key={id} q={{ id: "sa-" + id, q: d.sa.q, m: d.sa.m, verb: d.v, guide: d.sa.c, pts: d.sa.pts, dots: [id] }} store={store} update={update} />}

    <div className="spread" style={{ marginTop: 34 }}>
      {prev ? <button className="btn line" onClick={() => go("dot-" + prev)}><I n="back" s={16} />Previous</button> : <span />}
      {next && <button className="btn" onClick={() => go("dot-" + next)}>Next dot point<I n="next" s={16} /></button>}
    </div>
  </div>);
}

/* ================= REELS ================= */
function parseBeat(s) {
  const t = s[0], b = s.slice(2);
  if (t === "h") return { t: "hook", k: b, say: plain(b) };
  if (t === "p") { const [h, x] = b.split("|"); return { t: "point", k: h, body: x, say: h + ". " + x }; }
  if (t === "s") { const [n, l] = b.split("|"); return { t: "stat", n, l, say: n.replace("≈", "about ").replace("↓", " down").replace("%", " percent") + ". " + l }; }
  if (t === "l") { const [h, x] = b.split("|"); const items = x.split(";"); return { t: "list", k: h, items, say: h + ": " + items.join(", ") + "." }; }
  if (t === "c") { const [L, R] = b.split("||").map((side) => { const [h, x] = side.split("|"); return { h, items: x.split(";") }; }); return { t: "vs", L, R, say: L.h + ": " + L.items.join(", ") + ". Versus " + R.h + ": " + R.items.join(", ") + "." }; }
  if (t === "r") return { t: "remember", k: b, say: "Lock it in. " + b.replace(/→/g, ", then ").replace(/\+/g, " plus ") };
  return { t: "point", k: b, say: b };
}
const beatMs = (b) => Math.max(3800, b.say.split(/\s+/).length * 400 + 1200);

function Words({ text, delay = 0 }) {
  const parts = text.split(/(\*[^*]+\*)/g).flatMap((p) => p.startsWith("*") ? [{ w: p.slice(1, -1), m: true }] : p.split(/\s+/).filter(Boolean).map((w) => ({ w })));
  let k = 0;
  return <>{parts.map((p, i) => { const d = delay + (k++) * 0.07; const el = <span className="w" style={{ animationDelay: d + "s" }}>{p.m ? <mark>{p.w}</mark> : p.w}</span>; return <React.Fragment key={i}>{el} </React.Fragment>; })}</>;
}

function Beat({ b }) {
  if (b.t === "hook") return <div className="beat"><span className="tag">Revise in 60s</span><div className="k"><Words text={b.k} /></div></div>;
  if (b.t === "stat") return <div className="beat"><div className="stat">{b.n}</div><div className="k" style={{ fontSize: 24 }}><Words text={b.l} delay={0.3} /></div></div>;
  if (b.t === "list") return <div className="beat"><div className="k"><Words text={b.k} /></div><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{b.items.map((x, i) => <div className="li" key={i} style={{ animationDelay: 0.35 + i * 0.32 + "s" }}><i>{i + 1}</i>{x}</div>)}</div></div>;
  if (b.t === "vs") return <div className="beat"><div className="vs">{[b.L, b.R].map((s, i) => <div key={i}><h5>{s.h}</h5>{s.items.map((x) => <p key={x}>{x}</p>)}</div>)}</div></div>;
  if (b.t === "remember") return <div className="beat"><div className="remember"><span className="tag" style={{ background: "var(--gold)", color: "var(--ink)", margin: "0 auto 10px", display: "inline-block" }}>Lock it in</span><div className="k" style={{ fontSize: 25 }}><Words text={b.k} /></div></div></div>;
  return <div className="beat"><div className="k"><Words text={b.k} /></div>{b.body && <div className="body">{b.body}</div>}</div>;
}

const REEL_THEMES = [["#1d499f", "#bf2026"], ["#2a5cc0", "#9aaed4"], ["#962B30", "#1d499f"], ["#1f8a5b", "#1d499f"], ["#bf2026", "#e0a526"], ["#9aaed4", "#962B30"]];

function getCap(name) {
  if (capCache[name] !== undefined) return Promise.resolve(capCache[name]);
  if (!window.claude || !window.claude.use) { capCache[name] = null; return Promise.resolve(null); }
  return Promise.race([window.claude.use(name).then((c) => c || null).catch(() => null), new Promise((r) => setTimeout(() => r(null), 4000))]).then((c) => { capCache[name] = c; return c; });
}
let bestVoice;
function pickVoice() {
  if (bestVoice !== undefined && bestVoice) return bestVoice;
  const vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
  const score = (v) => {
    const n = v.name, l = (v.lang || "").toLowerCase(); let s = 0;
    if (!l.startsWith("en")) return -1;
    // Chrome's streamed "Google …" voices often fail silently: last resort only.
    if (!v.localService && !/microsoft.*(natural|online)/i.test(n)) s -= 200;
    if (/natural|neural/i.test(n)) s += 60; if (/premium/i.test(n)) s += 50; if (/enhanced/i.test(n)) s += 40;
    if (/online/i.test(n)) s += 15; if (/^google/i.test(n)) s += 20; if (/siri/i.test(n)) s += 25;
    if (/\b(ava|andrew|emma|brian|natasha|william|libby|sonia|ryan|jenny|aria|guy|samantha|karen|lee|catherine|serena|daniel|matilda)\b/i.test(n)) s += 10;
    if (/en-au/.test(l)) s += 8; else if (/en-gb/.test(l)) s += 5; else if (/en-us/.test(l)) s += 4;
    if (/compact|eloquence|espeak|zarvox|albert|bad news|good news|bahh|bells|boing|bubbles|cellos|trinoids|whisper|wobble|organ|jester|superstar|grandma|grandpa|rocko|shelley|flo|reed|sandy|eddy|fred|junior|kathy|ralph/i.test(n)) s -= 80;
    return s;
  };
  bestVoice = vs.filter((v) => (v.lang || "").toLowerCase().startsWith("en")).sort((a, b) => score(b) - score(a))[0] || null;
  return bestVoice;
}
if (window.speechSynthesis) { try { speechSynthesis.addEventListener("voiceschanged", () => { bestVoice = undefined; }); } catch (e) {} }
// Pre-recorded narration (audio/<dot>-<beat>.mp3), played through one shared element so a single tap unlocks it on iOS.
const reelAudio = typeof Audio !== "undefined" ? new Audio() : null;
const SILENT = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
const recordedFor = (id) => (typeof AUDIO !== "undefined" && AUDIO && AUDIO.files && AUDIO.files[id]) || null;
function unlockAudio() { try { if (reelAudio && !reelAudio.dataset.unlocked) { reelAudio.src = SILENT; const p = reelAudio.play(); p && p.catch(() => {}); reelAudio.dataset.unlocked = "1"; } } catch (e) {} }
function stopRecorded() { try { reelAudio && reelAudio.pause(); } catch (e) {} }
function playRecorded(file, ms) {
  return new Promise((res) => {
    if (!reelAudio) return res(false);
    let done = false; const end = (ok) => { if (!done) { done = true; reelAudio.onended = reelAudio.onerror = null; res(ok); } };
    reelAudio.onended = () => end(true); reelAudio.onerror = () => end(false);
    reelAudio.src = "audio/" + file;
    const p = reelAudio.play(); if (p) p.catch(() => end(false));
    setTimeout(() => end(true), (ms || 8000) + 4000);
  });
}
let speechStuck = false;
const liveUtterances = []; // Chrome drops callbacks if utterances are garbage-collected
let lastCancel = 0;
function cancelSpeech() { try { if (window.speechSynthesis) { speechSynthesis.cancel(); lastCancel = performance.now(); } } catch (e) {} }
function voicesReady() {
  return new Promise((res) => {
    if (!window.speechSynthesis || speechSynthesis.getVoices().length) return res();
    const done = () => { try { speechSynthesis.removeEventListener("voiceschanged", done); } catch (e) {} res(); };
    try { speechSynthesis.addEventListener("voiceschanged", done); } catch (e) {}
    setTimeout(done, 1200);
  });
}
// Called synchronously inside the tap handler so browsers that need a gesture (Chrome, iOS Safari) unlock speech.
function unlockSpeech() { try { if (window.speechSynthesis) { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; liveUtterances.push(u); speechSynthesis.resume(); speechSynthesis.speak(u); } } catch (e) {} }
async function deviceSay(text) {
  await voicesReady();
  const wait = 120 - (performance.now() - lastCancel); if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  return new Promise((res) => {
    let settled = false; const end = () => { if (!settled) { settled = true; const i = liveUtterances.indexOf(u); if (i >= 0) liveUtterances.splice(i, 1); res(); } };
    let u;
    try {
      u = new SpeechSynthesisUtterance(text); const v = pickVoice(); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "en-AU"; u.rate = 1; u.pitch = 1;
      let started = false;
      u.onstart = () => { started = true; if (speechStuck) { speechStuck = false; window.dispatchEvent(new Event("hms-speech")); } };
      u.onend = end; u.onerror = end; liveUtterances.push(u);
      speechSynthesis.resume(); speechSynthesis.speak(u);
      // Chrome sometimes jams its speech engine (it reports speaking but never starts). Detect it and tell the viewer.
      setTimeout(() => { if (!started && !settled) { speechStuck = true; window.dispatchEvent(new Event("hms-speech")); try { speechSynthesis.cancel(); } catch (e) {} end(); } }, 3500);
      setTimeout(end, Math.max(6000, text.length * 120));
    } catch (e) { end(); }
  });
}
function Reel({ id, store, update, autoplay, onEnd, compact }) {
  const d = DOTS[id], f = faOf(id);
  const beats = useMemo(() => d.reel.map(parseBeat), [id]);
  const tts = useCap("tts");
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(() => !!store.muted);
  const mutedRef = useRef(!!store.muted);
  const [stuck, setStuck] = useState(speechStuck);
  useEffect(() => { const h = () => setStuck(speechStuck); window.addEventListener("hms-speech", h); return () => window.removeEventListener("hms-speech", h); }, []);
  const [prog, setProg] = useState(0);
  const run = useRef(0);
  const liked = !!(store.liked || {})[id];
  const th = REEL_THEMES[ALL_DOT_IDS.indexOf(id) % REEL_THEMES.length];

  const stopAll = () => { run.current++; try { const t = tts || capCache.tts; t && t.stop(); } catch (e) {} cancelSpeech(); stopRecorded(); };
  useEffect(() => () => stopAll(), []);
  useEffect(() => { stopAll(); setI(0); setPlaying(false); setStarted(false); setDone(false); setProg(0); if (autoplay) setTimeout(() => playFrom(0), 300); }, [id]);

  const finish = () => { setPlaying(false); setDone(true); update((s) => ({ ...s, reels: { ...s.reels, [id]: true } })); onEnd && onEnd(); };

  async function playFrom(start) {
    stopAll(); const my = run.current; setStarted(true); setDone(false); setPlaying(true); setI(start); setProg(0);
    const isMuted = mutedRef.current;
    const voice = isMuted ? null : await getCap("tts");
    if (run.current !== my) return;
    if (voice) {
      // One continuous Claude-voice reading; each line advances the slide as it starts.
      let tick = null;
      const startBeat = (k) => { if (run.current !== my) return; clearInterval(tick); setI(k); setProg(0); const ms = beatMs(beats[k]), t0 = performance.now(); tick = setInterval(() => setProg(Math.min(0.97, (performance.now() - t0) / ms)), 100); };
      let off = null;
      try { off = voice.onLine(({ id: lid }) => { const k = parseInt(String(lid).split(":")[1], 10); if (lid && String(lid).startsWith(my + ":") && !isNaN(k)) startBeat(k); }); } catch (e) {}
      startBeat(start);
      const lines = beats.slice(start).map((b, j) => ({ text: b.say, voice: "buttery", language: "en", id: my + ":" + (start + j) }));
      let ok = true;
      try { await voice.speak(lines, { voice: "buttery", rate: 1 }); } catch (e) { ok = false; if (e && (e.code === "not_granted" || e.code === "unavailable")) capCache.tts = null; }
      clearInterval(tick); try { typeof off === "function" && off(); } catch (e) {}
      if (run.current !== my) return;
      if (ok) { setProg(1); await new Promise((r) => setTimeout(r, 500)); if (run.current === my) finish(); return; }
      // Claude voice refused (e.g. turned off): carry on with recordings or the device voice.
    }
    const rec = !isMuted && recordedFor(id);
    if (rec) {
      for (let k = start; k < beats.length; k++) {
        if (run.current !== my) return;
        const [file, ms] = rec[k] || [];
        setI(k); setProg(0);
        const t0 = performance.now(), dur = Math.max(ms || beatMs(beats[k]), 1200);
        const tick = setInterval(() => setProg(Math.min(1, (performance.now() - t0) / dur)), 100);
        const ok = file ? await playRecorded(file, ms) : false;
        if (!ok && run.current === my) await deviceSay(beats[k].say);
        clearInterval(tick); setProg(1);
        if (run.current !== my) return;
        await new Promise((r) => setTimeout(r, 350));
      }
      if (run.current === my) finish();
      return;
    }
    for (let k = start; k < beats.length; k++) {
      if (run.current !== my) return;
      setI(k); setProg(0);
      const b = beats[k], ms = beatMs(b), t0 = performance.now();
      const tick = setInterval(() => setProg(Math.min(1, (performance.now() - t0) / ms)), 100);
      const spoken = !isMuted && window.speechSynthesis ? deviceSay(b.say) : Promise.resolve();
      await Promise.all([spoken, new Promise((r) => setTimeout(r, isMuted ? ms : 1600))]);
      clearInterval(tick); setProg(1);
      if (run.current !== my) return;
      await new Promise((r) => setTimeout(r, 450));
    }
    if (run.current === my) finish();
  }
  const pause = () => { stopAll(); setPlaying(false); };
  const jump = (k) => { const n = Math.max(0, Math.min(beats.length - 1, k)); setI(n); if (playing) playFrom(n); else { setStarted(true); setProg(0); } };
  const toggleMute = () => { const m = !muted; mutedRef.current = m; setMuted(m); update((s) => ({ ...s, muted: m })); if (!m) { unlockSpeech(); unlockAudio(); } if (playing) { stopAll(); setTimeout(() => playFrom(i), 50); } };

  return (
    <div className="reel" style={{ "--b1": th[0], "--b2": th[1] }}>
      <div className="bg" style={{ background: "linear-gradient(170deg,#0F1A3D 0%,#132651 60%,#0b1330 100%)" }} /><div className="grain" />
      <div className="prog">{beats.map((_, k) => <span key={k} className={k < i || done ? "done" : ""}><i style={k === i && !done ? { width: prog * 100 + "%" } : null} /></span>)}</div>
      <div className="who"><Crest /><div>SRHS HMS<small>FA{f.n} · Dot point {dotNum(id)} · {d.v}</small></div></div>
      {!done && <Beat key={i + "-" + started} b={beats[i]} />}
      {done && <div className="beat"><div className="end">
        <span className="tag" style={{ alignSelf: "center" }}>Reel complete</span>
        <div className="k" style={{ fontSize: 26 }}>Now test yourself</div>
        <button className="btn red" onClick={() => go("dot-" + id)}>Quiz and practice</button>
        <button className="btn ghost" style={{ background: "rgba(255,255,255,.15)", color: "#fff" }} onClick={() => { if (!mutedRef.current) { unlockSpeech(); unlockAudio(); } playFrom(0); }}><I n="restart" s={16} />Watch again</button>
      </div></div>}
      <button className="tapzone l" aria-label="Previous beat" onClick={() => jump(i - 1)} />
      <button className="tapzone r" aria-label="Next beat" onClick={() => jump(i + 1)} />
      <div className="cap"><b>{d.v}: {d.t.split(" ").slice(1, 9).join(" ")}…</b>{started && !done ? beats[i].say : "#HSC #HMS #Year12 #SRHS"}</div>
      <div className="rail">
        <button className={liked ? "on" : ""} aria-label="Save reel" onClick={() => update((s) => ({ ...s, liked: { ...(s.liked || {}), [id]: !liked } }))}><I n="heart" /></button><small>{liked ? "Saved" : "Save"}</small>
        <button aria-label={muted ? "Unmute" : "Mute"} onClick={toggleMute}><I n={muted ? "mute" : "vol"} /></button><small>{muted ? "Muted" : "Voice"}</small>
        <button aria-label={playing ? "Pause" : "Play"} onClick={() => { if (playing) return pause(); if (!mutedRef.current) { unlockSpeech(); unlockAudio(); } playFrom(done ? 0 : i); }}><I n={playing ? "pause" : "play"} /></button><small>{playing ? "Pause" : "Play"}</small>
      </div>
      {stuck && !muted && <div className="voice-stuck"><b>No sound?</b> Your browser's voice isn't responding. Fully quit and reopen the browser (on a Mac: ⌘Q), then try again. Captions keep playing below.</div>}
      {!started && <button className="playov" onClick={() => { if (!mutedRef.current) { unlockSpeech(); unlockAudio(); } playFrom(0); }} aria-label="Play reel"><span><I n="play" /></span></button>}
    </div>
  );
}
function ReelThumb({ id, store, onClick }) {
  const d = DOTS[id], f = faOf(id);
  return <button className={"thumb" + (store.reels[id] ? " seen" : "")} style={{ "--c": REEL_THEMES[ALL_DOT_IDS.indexOf(id) % REEL_THEMES.length][1] }} onClick={onClick}>
    <small>FA{f.n} · {dotNum(id)} · {d.v}</small><b>{plain(d.reel[0].slice(2))}</b><span className="pl"><I n="play" /></span></button>;
}
function Reels({ store }) {
  const [fa, setFa] = useState("fa1");
  const f = FOCUS_AREAS.find((x) => x.id === fa);
  const tts = useCap("tts");
  return (<>
    <div className="page-h"><span className="eyebrow">Reels</span><h1>1-minute revisors</h1><p>One short reel for every dot point, with a hook, the key facts and a lock-in line at the end. Tap the sides of a reel to skip back or forward. Play the feed and they run one after another.</p></div>
    <div className="spread" style={{ marginBottom: 18 }}>
      <div className="tabs" style={{ margin: 0 }}>{FOCUS_AREAS.map((x) => <button key={x.id} className={x.id === fa ? "on" : ""} onClick={() => setFa(x.id)}>Focus area {x.n}</button>)}</div>
      <button className="btn red" onClick={() => go("reel-" + f.dots[0])}><I n="play" s={18} />Play the feed</button>
    </div>
    <p className="muted" style={{ fontSize: 13.5, marginBottom: 14 }}>{tts ? "Narrated in a Claude voice." : tts === null ? (typeof AUDIO !== "undefined" && AUDIO ? "Narrated by " + AUDIO.voice.replace(/\s*\(.*\)/, "") + ". Turn the voice off for captions only." : "Narrated with your device's voice. Turn the voice off for captions only.") : "Checking for a narration voice…"}</p>
    <div className="reel-pick">{f.dots.map((d) => <ReelThumb key={d} id={d} store={store} onClick={() => go("reel-" + d)} />)}</div>
  </>);
}
function ReelFeed({ start, store, update }) {
  const [id, setId] = useState(start);
  const [auto, setAuto] = useState(false);
  useEffect(() => setId(start), [start]);
  const k = ALL_DOT_IDS.indexOf(id);
  const nextId = ALL_DOT_IDS[k + 1], prevId = ALL_DOT_IDS[k - 1];
  const onEnd = () => { if (nextId) setTimeout(() => { setAuto(true); setId(nextId); history.replaceState(null, "", "#reel-" + nextId); }, 2200); };
  return (<div>
    <button className="back" onClick={() => go("reels")}><I n="back" s={16} />All reels</button>
    <div className="feed">
      <div className="reel-stage">
        <Reel id={id} store={store} update={update} autoplay={auto} onEnd={onEnd} />
        <div className="reel-side">
          <span className="eyebrow">Now playing</span><b style={{ fontFamily: "var(--display)" }}>{DOTS[id].t}</b>
          <button className="btn" onClick={() => go("dot-" + id)}>Open revision notes</button>
          {nextId && <><span className="eyebrow" style={{ marginTop: 10 }}>Up next</span><ReelThumb id={nextId} store={store} onClick={() => { setAuto(true); setId(nextId); }} /></>}
        </div>
      </div>
      <div className="row">{prevId && <button className="btn line sm" onClick={() => { setAuto(true); setId(prevId); }}><I n="back" s={14} />Previous</button>}{nextId && <button className="btn sm" onClick={() => { setAuto(true); setId(nextId); }}>Next reel<I n="next" s={14} /></button>}</div>
    </div>
  </div>);
}

/* ================= QUIZ ================= */
function Quiz({ items, title, onDone, onExit }) {
  const [order] = useState(() => shuffle(items));
  const [n, setN] = useState(0), [pick, setPick] = useState(null), [score, setScore] = useState(0), [wrong, setWrong] = useState([]);
  if (!order.length) return <div className="empty">No questions.</div>;
  if (n >= order.length) { const pct = Math.round((score / order.length) * 100); return (
    <div className="card q-card" style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center" }}><div className="score-ring"><svg viewBox="0 0 150 150"><circle cx="75" cy="75" r="64" fill="none" stroke="var(--surface-2)" strokeWidth="12" /><circle cx="75" cy="75" r="64" fill="none" stroke={pct >= 80 ? "var(--good)" : pct >= 50 ? "var(--warn)" : "var(--bad)"} strokeWidth="12" strokeLinecap="round" strokeDasharray={402} strokeDashoffset={402 - 402 * pct / 100} /></svg><b>{pct}%</b></div></div>
      <h2 style={{ margin: "14px 0 6px" }}>{score} / {order.length} correct</h2>
      <p className="muted">{pct >= 90 ? "Band 6 recall. Now try a question in Written Responses." : pct >= 70 ? "Solid. Re-read the summary for the ones you missed." : "Revisit the revision notes and the reel, then try again."}</p>
      {wrong.length > 0 && <div style={{ textAlign: "left", marginTop: 18 }}><span className="eyebrow">Review your misses</span>{wrong.map((w) => <div className="why" key={w.id}><b>{w.q}</b>{w.o[w.a]}. {w.why} <a href={"#dot-" + w.dot} style={{ color: "var(--crest-2)", fontWeight: 700 }}>Revise dot point →</a></div>)}</div>}
      <div className="row" style={{ justifyContent: "center", marginTop: 18 }}><button className="btn" onClick={() => { setN(0); setScore(0); setWrong([]); setPick(null); }}>Try again</button>{onExit && <button className="btn ghost" onClick={onExit}>Back to quizzes</button>}</div>
    </div>); }
  const q = order[n];
  const choose = (k) => { if (pick !== null) return; setPick(k); if (k === q.a) setScore((s) => s + 1); else setWrong((w) => [...w, q]); if (n === order.length - 1) { const final = score + (k === q.a ? 1 : 0); onDone && onDone(Math.round(final / order.length * 100)); } };
  return (<div className="card q-card">
    <div className="spread"><span className="eyebrow">{title} · Question {n + 1} of {order.length}</span><span className="chip">{score} correct</span></div>
    <div className="bar" style={{ marginTop: 10 }}><i style={{ width: (n / order.length) * 100 + "%" }} /></div>
    <h2>{q.q}</h2>
    {q.o.map((o, k) => <button key={k} disabled={pick !== null} className={"opt" + (pick !== null && k === q.a ? " right" : "") + (pick === k && k !== q.a ? " wrong" : "")} onClick={() => choose(k)}><i>{"ABCD"[k]}</i><span>{o}</span></button>)}
    {pick !== null && <><div className="why"><b>{pick === q.a ? "Correct." : "Not quite. The answer is " + "ABCD"[q.a] + "."}</b>{q.why}</div>
      <div className="row" style={{ justifyContent: "flex-end", marginTop: 14 }}><button className="btn" onClick={() => { setN(n + 1); setPick(null); }}>{n === order.length - 1 ? "See results" : "Next question"}<I n="next" s={16} /></button></div></>}
  </div>);
}
function QuizHub({ store, update }) {
  const [run, setRun] = useState(null);
  if (run) return <><button className="back" onClick={() => setRun(null)}><I n="back" s={16} />All quizzes</button><Quiz items={run.items} title={run.title} onExit={() => setRun(null)} onDone={(p) => update((s) => ({ ...s, quiz: { ...s.quiz, [run.key]: Math.max(p, s.quiz[run.key] || 0) } }))} /></>;
  const start = (key, title, items) => setRun({ key, title, items });
  return (<>
    <div className="page-h"><span className="eyebrow">Quiz</span><h1>Multiple-choice practice</h1><p>Every question comes with a marker's explanation. Run the 20-question mock to rehearse Section I, or drill one focus area or dot point.</p></div>
    <div className="grid g3">
      <button className="tool" onClick={() => start("mock", "Section I mock", shuffle(ALL_MCQ).slice(0, 20))}><span className="ic" style={{ background: "var(--red)", color: "#fff" }}><I n="target" /></span><h4>Section I mock</h4><p>20 questions mixed across both focus areas, the same as the HSC paper.</p>{store.quiz.mock !== undefined && <span className="chip">Best {store.quiz.mock}%</span>}</button>
      {FOCUS_AREAS.map((f) => <button key={f.id} className="tool" onClick={() => start("q" + f.id, "Focus area " + f.n, shuffle(ALL_MCQ.filter((m) => DOTS[m.dot].fa === f.id)).slice(0, 15))}><span className="ic" style={{ background: `var(--${f.id}-soft)`, color: `var(--${f.id})` }}><I n="quiz" /></span><h4>Focus area {f.n}</h4><p>15 random questions on {f.short.toLowerCase()}.</p>{store.quiz["q" + f.id] !== undefined && <span className="chip">Best {store.quiz["q" + f.id]}%</span>}</button>)}
    </div>
    {FOCUS_AREAS.map((f) => <div key={f.id} className="iq"><h3><span>FA{f.n}</span>Quiz by dot point</h3>
      <div className="grid g3">{f.dots.map((d) => <button key={d} className="dot-row" style={{ gridTemplateColumns: "1fr auto", marginBottom: 0 }} onClick={() => start(d, "Dot point " + dotNum(d), ALL_MCQ.filter((m) => m.dot === d))}><span className="t" style={{ fontSize: 14 }}><b>{dotNum(d)}.</b> {DOTS[d].t.slice(0, 64)}…</span>{store.quiz[d] !== undefined ? <span className="chip" style={{ background: store.quiz[d] === 100 ? "var(--good-soft)" : undefined, color: store.quiz[d] === 100 ? "var(--good)" : undefined }}>{store.quiz[d]}%</span> : <span className="chip">3 Q</span>}</button>)}</div></div>)}
  </>);
}

/* ================= BAND MARKER ================= */
const MODELS = Object.assign({}, MODELS_FA1, MODELS_FA2, MODELS_ER);
const modelFor = (q) => MODELS[q.id.replace(/^sa-/, "")] || null;
function ModelAnswer({ q, wc }) {
  const text = modelFor(q);
  const [open, setOpen] = useState(false), [marks, setMarks] = useState(true);
  const r = useMemo(() => text ? readerMark(q, text) : null, [q.id]);
  const qv = VERBS.find((v) => v.w.toLowerCase() === (q.verb || "").toLowerCase()) || VERBS.find((v) => new RegExp("\\b" + v.w + "\\b", "i").test(q.q));
  const vt = /to what extent/i.test(q.q) ? "judge" : rdVerbType(qv);
  if (!text) return null;
  return (<div className="card pad model">
    <div className="spread"><div><span className="eyebrow">Model response</span><h4 style={{ fontSize: 18, marginTop: 4 }}>Band 6 answer · {q.m} marks</h4></div>
      <button className={"btn " + (open ? "ghost" : "") + " sm"} onClick={() => setOpen(!open)}><I n={open ? "back" : "bulb"} s={15} />{open ? "Hide" : "Show the Band 6 answer"}</button></div>
    {!open && <p className="muted" style={{ fontSize: 14.5, marginTop: 10 }}>{wc < 20 ? "Have a go yourself first. You'll learn far more by comparing your answer with this one than by reading it cold." : "Compare it with yours: look at how every point links back to the key word."}</p>}
    {open && <>
      <div className="row" style={{ margin: "14px 0 10px", justifyContent: "space-between" }}>
        {marks ? <div className="legend" style={{ margin: 0 }}><span><mark className="hl-t">syllabus content</mark></span><span><mark className="hl-c">key-word language</mark></span><span><mark className="hl-e">evidence & data</mark></span></div> : <span />}
        <label className="row" style={{ gap: 6, fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}><input type="checkbox" checked={marks} onChange={(e) => setMarks(e.target.checked)} style={{ accentColor: "var(--crest)" }} />Show markup</label></div>
      {marks ? <Annotated text={text} hl={r.hl} /> : <div className="annot plain">{text.split(/\n+/).map((p, k) => <p key={k}>{p}</p>)}</div>}
      <div className="why6"><b>Why this is Band 6</b><ul>
        <li>{q.m >= 8 ? "It opens with a clear position that answers the question, and returns to it in the conclusion." : "It answers the question directly from the first sentence."}</li>
        <li>{{ judge: "It makes explicit judgements using criteria words (highly effective, limited, to a large extent), weighs both sides, and gives a verdict.", explain: "Every point has a cause-and-effect link (because, which leads to, as a result) — the HOW and WHY that Explain demands.", analyse: "It breaks the issue into parts, shows how they connect (in turn, therefore), and states the implications.", compare: "It deals with similarities and differences side by side, using whereas, similarly and in contrast throughout.", discuss: "It presents points for and against, then reaches a reasoned position.", propose: "It puts forward clear suggestions and explains why each would work.", describe: "It gives the key characteristics and features clearly, with an example for each." }[vt]}</li>
        <li>It supports points with specific evidence: statistics, named programs and real examples.</li>
        <li>It uses precise HMS terminology and stays relevant to the question throughout.</li>
      </ul></div>
      <p className="muted" style={{ fontSize: 12.5, marginTop: 10 }}>One way to reach Band 6, not the only way. Markers reward any accurate, relevant content that answers the key word. Statistics are approximate national trends; check current figures in your class notes.</p>
    </>}
  </div>);
}
function MarkPanel({ q, store, update }) {
  const sample = useCap("sample");
  const [ans, setAns] = useState(() => (store.drafts || {})[q.id] || "");
  const [state, setState] = useState("idle"); // idle | marking | done | error
  const [res, setRes] = useState(null), [err, setErr] = useState("");
  const [self, setSelf] = useState({});
  const [model, setModel] = useState(""), [modelBusy, setModelBusy] = useState(false);
  const ctl = useRef(null);
  useEffect(() => () => clearTimeout(ctl.current), []);
  useEffect(() => { const t = setTimeout(() => update((s) => ({ ...s, drafts: { ...(s.drafts || {}), [q.id]: ans } })), 500); return () => clearTimeout(t); }, [ans]);
  const wc = wordCount(ans), target = q.m <= 4 ? q.m * 30 : q.m <= 8 ? q.m * 35 : q.m >= 12 ? 700 : q.m * 55;
  const mins = Math.round(q.m * 1.8);

  function mark() {
    if (wc < 5) return;
    setState("marking");
    ctl.current = setTimeout(() => {
      const r = readerMark(q, ans);
      setRes({ ...r, answer: ans }); setState("done");
      update((s) => ({ ...s, marks: [...(s.marks || []).slice(-49), { id: q.id, mark: r.mark, outOf: q.m, band: r.band, at: Date.now() }] }));
    }, 1100);
  }
  async function genModel() {
    if (!sample) return; setModelBusy(true); setModel("");
    try {
      await sample(`You are an expert NSW HSC Health and Movement Science teacher. Write a model Band 6 response to this ${q.m}-mark question. It should fit roughly ${target} words, follow the key word precisely, use HMS terminology, and include specific examples and data. Use Australian spelling and plain paragraphs (no markdown headings).\n\nQUESTION: ${q.q}\n\nMarking guidelines:\n${(q.guide || ER_GUIDE).map(([r, t]) => r + ": " + t).join("\n")}`, { onText: ({ text }) => setModel(text), modelTier: "default" });
    } catch (e) { setModel((m) => m || "A model answer couldn't be generated just now. Try again in a minute."); }
    setModelBusy(false);
  }
  const verb = VERBS.find((v) => v.w.toLowerCase() === (q.verb || "").toLowerCase()) || VERBS.find((v) => new RegExp("\\b" + v.w + "\\b", "i").test(q.q));
  const guide = q.guide || ER_GUIDE;
  const selfScore = q.pts ? Object.values(self).filter(Boolean).length : 0;

  return (<div className="grid" style={{ gap: 18 }}>
    <div className="card qbox">
      <div className="row"><span className="marks-pill">{q.m} marks</span>{verb && <span className="verb">{verb.w}</span>}<span className="muted" style={{ fontSize: 13 }}>Suggested time ≈ {mins} min · ≈ {target} words</span></div>
      <p className="qtext">{q.q}</p>
      {verb && <p className="muted" style={{ fontSize: 14, marginTop: 10 }}><b>{verb.w}</b>: {verb.d}. {verb.how}</p>}
    </div>
    <div>
      <label htmlFor={"ans-" + q.id} className="eyebrow">Your response</label>
      <textarea id={"ans-" + q.id} className="answer" style={{ marginTop: 8 }} placeholder="Write your answer as you would in the exam. Use the key word, give specific examples, and link every point back to the question." value={ans} onChange={(e) => setAns(e.target.value)} />
      <div className="spread" style={{ marginTop: 10 }}>
        <span className="wc">{wc} words{wc > 0 && wc < target * 0.5 ? " · probably too brief for " + q.m + " marks" : ""}</span>
        <div className="row">
          <button className="btn red" disabled={wc < 5 || state === "marking"} onClick={mark}><I n="pen" s={17} />{state === "done" ? "Re-mark" : "Mark my response"}</button>
        </div>
      </div>
    </div>

    {state === "marking" && <div className="thinking"><span className="spin" />Reading your response against the marking guidelines…</div>}
    {state === "done" && res && <MarkResult res={res} q={q} guide={guide} />}

    <div className="grid g2" style={{ alignItems: "start" }}>
      <div className="card pad">
        <h4 style={{ fontSize: 16, marginBottom: 10 }}>Marking guidelines</h4>
        <div className="ladder">{guide.map(([r, t]) => <div key={r} className={res && res.range && res.range.replace(/\s/g, "") === r.replace(/\s/g, "") ? "on" : ""}><b>{r}</b><span>{t}</span></div>)}</div>
      </div>
      <div className="card pad">
        <h4 style={{ fontSize: 16, marginBottom: 10 }}>{q.pts ? "Self-check: did you include…" : "Content to include"}</h4>
        {(q.pts || (q.dots || []).flatMap((d) => DOTS[d].sum).slice(0, 8)).map((p, k) => <label key={k} className="check"><input type="checkbox" checked={!!self[k]} onChange={(e) => setSelf({ ...self, [k]: e.target.checked })} /><span>{p}</span></label>)}
        {q.pts && <p className="muted" style={{ fontSize: 13.5, marginTop: 8 }}>You've ticked {selfScore} of {q.pts.length}. Covering content is only half of it. The top range needs every point linked back to the key word.</p>}
      </div>
    </div>

    <ModelAnswer q={q} wc={wc} />
    {sample && !modelFor(q) && <div className="card pad">
      <div className="spread"><h4 style={{ fontSize: 16 }}>Band 6 model response</h4><button className="btn ghost sm" disabled={modelBusy} onClick={genModel}><I n="bulb" s={15} />{model ? "Write another" : "Write one with Claude"}</button></div>
      {modelBusy && !model && <div className="thinking" style={{ marginTop: 12 }}><span className="spin" />Writing a model response…</div>}
      {model && <div className="read" style={{ marginTop: 14 }}>{model.split(/\n+/).map((p, k) => <p key={k} style={{ fontSize: 17 }}>{p}</p>)}</div>}
      {!model && !modelBusy && <p className="muted" style={{ fontSize: 14, marginTop: 6 }}>Write your own response first, then compare it with a model answer.</p>}
    </div>}
  </div>);
}
function Annotated({ text, hl }) {
  const phrases = hl.cause.filter(Boolean).sort((a, b) => b.length - a.length).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp("(" + (phrases.length ? "\\b(?:" + phrases.join("|") + ")[a-z]*" + "|" : "") + "\\b\\d+(?:\\.\\d+)?\\s?(?:%|per cent|years?|million|billion|times)?)", "gi");
  const terms = new Set(hl.terms);
  const words = (seg, key) => seg.split(/(\b[A-Za-z][A-Za-z'’-]*\b)/).map((w, i) => /^[A-Za-z]/.test(w) && w.length > 2 && terms.has(rdStem(w)) ? <mark key={key + "-" + i} className="hl-t">{w}</mark> : w);
  return <div className="annot">{text.split(/\n+/).filter((p) => p.trim()).map((para, pi) => <p key={pi}>{para.split(re).map((seg, i) => i % 2 === 1 ? <mark key={i} className={/\d/.test(seg) ? "hl-e" : "hl-c"}>{seg}</mark> : words(seg, pi + "-" + i))}</p>)}</div>;
}
function MarkResult({ res, q }) {
  const L = (a) => Array.isArray(a) ? a.filter(Boolean) : [];
  return (<div className="card result">
    <div className="result-top">
      <div className="band-badge"><small>Band</small><b>{res.band}</b></div>
      <div><div className="mk">{res.mark} / {q.m}</div><p>{res.verdict}</p>
        <div className="row" style={{ marginTop: 10 }}><span className="chip">Range {res.range}</span><span className={"chip " + (res.keyword_met ? "ok" : "no")}>{res.keyword_met ? "Key word addressed" : "Key word not fully addressed"}</span></div></div>
    </div>
    <div className="fb-sec"><h4>How your response read</h4>
      <div className="scores">{res.scores.map(([k, v]) => <div key={k}><span>{k}</span><div className="bar"><i style={{ width: Math.round(v * 100) + "%", background: v >= 0.7 ? "var(--good)" : v >= 0.4 ? "var(--gold)" : "var(--red)" }} /></div><b>{Math.round(v * 100)}%</b></div>)}</div>
      <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>{res.wc} words · about {res.target} expected for {q.m} marks{res.capNote.length ? " · mark capped because the " + res.capNote.join(" and ") + " wasn't fully addressed" : ""}</p></div>
    {L(res.strengths).length > 0 && <div className="fb-sec good"><h4><I n="check" s={17} />What earned marks</h4><ul>{L(res.strengths).map((x, k) => <li key={k}>{x}</li>)}</ul></div>}
    {L(res.improvements).length > 0 && <div className="fb-sec bad"><h4><I n="target" s={17} />Fix these</h4><ul>{L(res.improvements).map((x, k) => <li key={k}>{x}</li>)}</ul></div>}
    {L(res.missing).length > 0 && <div className="fb-sec"><h4><I n="list" s={17} />Content to add</h4><ul>{L(res.missing).map((x, k) => <li key={k}>{x}</li>)}</ul></div>}
    <div className="fb-sec up"><h4><I n="key" s={17} />The key word</h4><p style={{ fontSize: 16 }}>{res.keyword_feedback}</p></div>
    <div className="fb-sec up"><h4><I n="bolt" s={17} />To reach the next level</h4><p style={{ fontSize: 16 }}>{res.next_level}</p></div>
    <div className="fb-sec"><h4><I n="pen" s={17} />Your response, marked up</h4>
      <div className="legend"><span><mark className="hl-t">syllabus content</mark></span><span><mark className="hl-c">key-word language</mark></span><span><mark className="hl-e">evidence & data</mark></span></div>
      <Annotated text={res.answer || ""} hl={res.hl} /></div>
    <div className="fb-sec"><h4><I n="bulb" s={17} />Sentence starters for this key word</h4><ul>{res.starters.map((x, k) => <li key={k}>{x}</li>)}</ul></div>
    <div className="fb-sec"><p className="muted" style={{ fontSize: 13 }}>Marked by the Study Hub reader, which runs on your device. It checks your response against the marker notes, the key word, your evidence, terminology and length. It can't fully judge accuracy or the quality of an argument like a human marker can, so treat the mark as a practice guide and check with your teacher. The band is your mark as a share of {q.m}. In the HSC, bands are awarded on the whole exam.</p></div>
  </div>);
}

function Marker({ store, update, initial }) {
  const [tab, setTab] = useState("sa");
  const saList = ALL_DOT_IDS.map((d) => ({ id: "sa-" + d, q: DOTS[d].sa.q, m: DOTS[d].sa.m, verb: DOTS[d].v, guide: DOTS[d].sa.c, pts: DOTS[d].sa.pts, dots: [d], fa: DOTS[d].fa }));
  const erList = ER_BANK.map((e) => ({ ...e, guide: ER_GUIDE, pts: null }));
  const [sel, setSel] = useState(() => (initial && saList.find((x) => x.id === "sa-" + initial)) || saList[0]);
  const [faF, setFaF] = useState("all");
  const [cq, setCq] = useState({ q: "", m: 6 }), [customOn, setCustomOn] = useState(false);
  const list = (tab === "sa" ? saList : erList).filter((x) => faF === "all" || x.fa === faF);
  const history = (store.marks || []).slice(-6).reverse();
  return (<>
    <div className="page-h"><span className="eyebrow">Written Responses</span><h1>Write it. Get it marked.</h1><p>Answer short-answer (Section II) and extended-response (Section III) questions. Each one is marked instantly on your device against NESA-style guidelines: you get a mark, a band equivalent, feedback on the key word, the content you missed, and your response marked up.</p></div>
    <div className="tabs" style={{ marginTop: 0 }}>
      <button className={tab === "sa" && !customOn ? "on" : ""} onClick={() => { setTab("sa"); setCustomOn(false); setSel(saList[0]); }}>Short answer · Section II</button>
      <button className={tab === "er" && !customOn ? "on" : ""} onClick={() => { setTab("er"); setCustomOn(false); setSel(erList[0]); }}>Extended response · 12 marks</button>
      <button className={customOn ? "on" : ""} onClick={() => setCustomOn(true)}>Your own question</button>
    </div>
    {customOn ? <div className="grid" style={{ gap: 16 }}>
      <div className="card pad grid" style={{ gap: 12 }}>
        <label className="eyebrow" htmlFor="cq">Paste a question from a past paper, trial or your teacher</label>
        <textarea id="cq" className="answer" style={{ minHeight: 100 }} value={cq.q} onChange={(e) => setCq({ ...cq, q: e.target.value })} placeholder="e.g. Analyse the impact of an ageing population on Australia's healthcare system." />
        <div className="row"><label htmlFor="cqm" className="eyebrow">Marks</label><select id="cqm" className="txt" style={{ width: 110 }} value={cq.m} onChange={(e) => setCq({ ...cq, m: +e.target.value })}>{[2, 3, 4, 5, 6, 7, 8, 10, 12, 15].map((m) => <option key={m}>{m}</option>)}</select></div>
      </div>
      {cq.q.trim().length > 15 && <MarkPanel key={"custom-" + cq.m + cq.q.length} q={{ id: "custom", q: cq.q, m: cq.m, guide: null, pts: null, dots: [] }} store={store} update={update} />}
    </div> :
    <div className="marker-layout">
      <div>
        <div className="row" style={{ marginBottom: 10 }}>{[["all", "All"], ["fa1", "FA1"], ["fa2", "FA2"]].map(([k, l]) => <button key={k} className={"chip" + (faF === k ? " on" : "")} onClick={() => setFaF(k)}>{l}</button>)}</div>
        <div className="qpick">{list.map((x) => <button key={x.id} className={sel && sel.id === x.id ? "on" : ""} onClick={() => setSel(x)}><span className="meta"><span className="marks-pill" style={{ fontSize: 11, padding: "3px 7px" }}>{x.m}</span><span className={"chip " + x.fa} style={{ padding: "2px 8px", fontSize: 11 }}>FA{x.fa === "fa1" ? 1 : 2}</span>{(store.marks || []).filter((h) => h.id === x.id).slice(-1).map((h) => <span key="h" className="chip" style={{ padding: "2px 8px", fontSize: 11 }}>Last: Band {h.band}</span>)}</span>{x.q.length > 120 ? x.q.slice(0, 118) + "…" : x.q}</button>)}</div>
        {history.length > 0 && <div className="card pad" style={{ marginTop: 14 }}><span className="eyebrow">Recent marks</span>{history.map((h, k) => <div key={k} className="spread" style={{ fontSize: 14, marginTop: 8 }}><span>{h.id === "custom" ? "Your own question" : h.id.startsWith("sa-") ? "Dot point " + dotNum(h.id.slice(3)) + " (FA" + (DOTS[h.id.slice(3)].fa === "fa1" ? 1 : 2) + ")" : "Extended response"}</span><b>{h.mark}/{h.outOf} · B{h.band}</b></div>)}</div>}
      </div>
      <div style={{ minWidth: 0 }}>{sel && <MarkPanel key={sel.id} q={sel} store={store} update={update} />}</div>
    </div>}
  </>);
}

/* ================= KEY WORDS ================= */
function Keywords() {
  return (<>
    <div className="page-h"><span className="eyebrow">Key words</span><h1>Answer the verb, earn the marks</h1><p>The directive verb tells the marker what kind of thinking to reward. Describing when the question says evaluate is the most common way students lose marks in HMS.</p></div>
    <div className="card" style={{ overflow: "hidden" }}>{VERBS.map((v) => <div className="kw" key={v.w}><b>{v.w}<span className={"tier t" + v.tier}>{["", "Recall", "Relate", "Judge"][v.tier]}</span></b><div><p>{v.d}</p><small>{v.how}</small></div></div>)}</div>
    <h2 style={{ fontSize: 22, margin: "30px 0 12px" }}>What each band looks like</h2>
    <div className="ladder">{BANDS.map((b) => <div key={b.b}><b>Band {b.b}</b><span>{b.d}</span></div>)}</div>
    <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>Summarised from the NESA course performance descriptors. In Written Responses, a question's band equivalent comes from its mark as a percentage: 90%+ is Band 6, 80% Band 5, 70% Band 4, 60% Band 3, 50% Band 2.</p>
    <h2 style={{ fontSize: 22, margin: "30px 0 12px" }}>Structuring a 12-mark extended response</h2>
    <div className="grid g2">{[["Introduction", "Answer the question straight away. Define the key terms, give your judgement or position, and outline your argument."], ["Body paragraphs (3–4)", "Use PEEL for each: Point → Explain (cause and effect) → Evidence (data, named programs, examples) → Link back to the question and the key word."], ["Integrate both sides", "For discuss, assess and evaluate, weigh strengths against limitations within each paragraph rather than leaving them all to the end."], ["Conclusion", "Restate your judgement, now justified by the evidence. Don't introduce new information."]].map(([h, p]) => <div className="concept" key={h} style={{ "--c": "var(--crest-2)" }}><h4>{h}</h4><p>{p}</p></div>)}</div>
  </>);
}

/* ================= GAMES ================= */
const GAMES = [
  { id: "board", name: "The Big Board", d: "Pick a category and a value, answer, win the points. Find the Double Down and bet big. Play solo or with up to 4 teams.", g: "#1d499f", ic: "layers", big: true },
  { id: "climb", name: "The Climb", d: "12 questions to the top of the ladder. Three lifelines, two safe points, and you can walk away at any time.", g: "#0F1A3D", ic: "trophy", big: true },
  { id: "mystery", name: "Mystery Term", d: "Crack the HMS term from the clues. The fewer clues you need, the more points you score.", g: "#bf2026", ic: "bulb", big: true },
  { id: "rapid", name: "Rapid Fire", d: "60 seconds of multiple choice. Build a streak to multiply your points.", g: "#d48a0f", ic: "bolt", big: true },
  { id: "sort", name: "Sort Rush", d: "Sort each card into the right bin.", g: "#1f8a5b", ic: "sort" },
  { id: "match", name: "Term Match", d: "Pair each term with its meaning.", g: "#2a5cc0", ic: "layers" },
  { id: "seq", name: "Sequence Stack", d: "Put processes in the right order.", g: "#962B30", ic: "stack" },
  { id: "verb", name: "Key Word Clash", d: "Match NESA definitions to key words.", g: "#132651", ic: "key" }
];
function Games({ store }) {
  const tile = (g, k, small) => <button key={g.id} className={"game-tile" + (small ? " sm" : "")} style={{ "--g": g.g }} onClick={() => go("game-" + g.id)}>
    <GameArt seed={k} icon={g.ic} />{store.hs[g.id] !== undefined && <span className="hs">BEST {g.id === "climb" ? store.hs[g.id].toLocaleString("en-AU") : store.hs[g.id]}</span>}<h3>{g.name}</h3><p>{g.d}</p>{!small && <span className="play"><I n="play" s={13} />Play</span>}</button>;
  return (<>
    <div className="page-h"><span className="eyebrow">Revision games</span><h1>Play your way to Band 6</h1><p>Game-show style revision built from the syllabus. Play solo, or put The Big Board on the projector and play in teams. High scores are saved on this device.</p></div>
    <div className="grid g2">{GAMES.filter((g) => g.big).map((g, k) => tile(g, k))}</div>
    <div className="sec-h"><div><span className="eyebrow">Quick drills</span><h2>Two-minute warm-ups</h2></div></div>
    <div className="grid g4">{GAMES.filter((g) => !g.big).map((g, k) => tile(g, k + 4, true))}</div>
  </>);
}
function GameArt({ seed, icon }) {
  return <svg className="art" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    {[...Array(9)].map((_, i) => <circle key={i} cx={(seed * 70 + i * 53) % 400} cy={(i * 37 + seed * 29) % 180} r={6 + ((i * 7 + seed) % 22)} fill="#fff" opacity={0.05 + (i % 3) * 0.03} />)}
    <circle cx="330" cy="70" r="80" fill="none" stroke="#fff" strokeOpacity=".14" strokeWidth="18" />
    <g transform="translate(290,30) scale(3.4)" stroke="#fff" strokeOpacity=".5" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={P[icon]} /></g>
  </svg>;
}
function burst(text, e) { const el = document.createElement("div"); el.className = "burst"; el.textContent = text; const x = e && e.clientX ? e.clientX : innerWidth / 2, y = e && e.clientY ? e.clientY : innerHeight / 2; el.style.left = x - 20 + "px"; el.style.top = y - 30 + "px"; document.body.appendChild(el); setTimeout(() => el.remove(), 900); }
function useCountdown(secs, running, onEnd) {
  const [left, setLeft] = useState(secs);
  useEffect(() => { if (!running) return; const t0 = Date.now(); const start = left; const iv = setInterval(() => { const l = Math.max(0, start - (Date.now() - t0) / 1000); setLeft(l); if (l <= 0) { clearInterval(iv); onEnd(); } }, 100); return () => clearInterval(iv); }, [running]);
  return [left, setLeft];
}
function GameOver({ title, score, best, isBest, onAgain, children }) {
  return <div className="over"><span className="eyebrow" style={{ color: "var(--sky)" }}>{title}</span><div className="big">{score}</div><h2>{isBest ? "New high score!" : "Game over"}</h2><p style={{ color: "#c9d4ec" }}>Best: {best}</p>{children}<div className="row" style={{ justifyContent: "center" }}><button className="btn red" onClick={onAgain}><I n="restart" s={16} />Play again</button><button className="btn ghost" style={{ background: "rgba(255,255,255,.12)", color: "#fff" }} onClick={() => go("games")}>All games</button></div></div>;
}
function GameHost({ id, store, update }) {
  const g = GAMES.find((x) => x.id === id);
  if (!g) return <div className="empty">Game not found.</div>;
  const record = (score) => { const best = store.hs[id] || 0; if (score > best) update((s) => ({ ...s, hs: { ...s.hs, [id]: score } })); return score > best; };
  const props = { best: store.hs[id] || 0, record };
  return (<><button className="back" onClick={() => go("games")}><I n="back" s={16} />All games</button>
    <div className="arena">
      <div className="spread" style={{ marginBottom: 16 }}><h2 style={{ fontSize: 28, fontWeight: 900 }}>{g.name}</h2><div className="row" style={{ gap: 8 }}><SfxToggle /><span className="chip" style={{ background: "rgba(255,255,255,.1)", color: "#fff" }}>Best {id === "climb" ? (store.hs[id] || 0).toLocaleString("en-AU") : store.hs[id] || 0}</span></div></div>
      {id === "board" && <BigBoard {...props} />}{id === "climb" && <TheClimb {...props} />}{id === "mystery" && <MysteryTerm {...props} />}{id === "rapid" && <RapidFire {...props} />}{id === "sort" && <SortRush {...props} />}{id === "match" && <TermMatch {...props} />}{id === "seq" && <SeqStack {...props} />}{id === "verb" && <VerbClash {...props} />}
    </div></>);
}
function StartScreen({ text, onStart, children }) {
  return <div className="over"><p style={{ color: "#c9d4ec", maxWidth: 480, fontSize: 16.5 }}>{text}</p>{children}<button className="btn red" onClick={onStart}><I n="play" s={16} />Start</button></div>;
}

function RapidFire({ best, record }) {
  const [phase, setPhase] = useState("start"); const [qs, setQs] = useState([]); const [n, setN] = useState(0);
  const [score, setScore] = useState(0), [streak, setStreak] = useState(0), [pick, setPick] = useState(null), [nb, setNb] = useState(false), [right, setRight] = useState(0);
  const end = () => setPhase("over");
  const [left] = useCountdown(60, phase === "play", end);
  useEffect(() => { if (phase === "over") setNb(record(score)); }, [phase]);
  if (phase === "start") return <StartScreen text="Answer as many questions as you can in 60 seconds. Each correct answer in a row adds to your multiplier, up to ×5." onStart={() => { setQs(shuffle(ALL_MCQ)); setN(0); setScore(0); setStreak(0); setRight(0); setPick(null); setPhase("play"); }} />;
  if (phase === "over") return <GameOver title="Rapid Fire" score={score} best={Math.max(best, score)} isBest={nb} onAgain={() => setPhase("start")}><p style={{ color: "#c9d4ec" }}>{right} correct answers</p></GameOver>;
  const q = qs[n % qs.length], mult = Math.min(5, 1 + Math.floor(streak / 2));
  const choose = (k, e) => { if (pick !== null) return; setPick(k); if (k === q.a) { const pts = 100 * mult; setScore((s) => s + pts); setStreak((s) => s + 1); setRight((r) => r + 1); burst("+" + pts, e); } else setStreak(0); setTimeout(() => { setPick(null); setN((x) => x + 1); }, k === q.a ? 450 : 1100); };
  return <div>
    <div className="timer"><i style={{ width: (left / 60) * 100 + "%" }} /></div>
    <div className="hud"><div><small>Score</small><b>{score}</b></div><div><small>Streak</small><b>{streak}</b></div><div><small>Multiplier</small><b className="combo">×{mult}</b></div><div><small>Time</small><b>{Math.ceil(left)}</b></div></div>
    <h3 style={{ fontFamily: "var(--body)", fontWeight: 700, fontSize: 20, lineHeight: 1.4, marginBottom: 16 }}>{q.q}</h3>
    {q.o.map((o, k) => <button key={k} className={"rf-opt" + (pick !== null && k === q.a ? " right" : "") + (pick === k && k !== q.a ? " wrong" : "")} onClick={(e) => choose(k, e)}>{"ABCD"[k]}. {o}</button>)}
  </div>;
}

function SortRush({ best, record }) {
  const [phase, setPhase] = useState("start"); const [set, setSet] = useState(SORT_SETS[0]); const [items, setItems] = useState([]); const [n, setN] = useState(0);
  const [score, setScore] = useState(0), [combo, setCombo] = useState(0), [flash, setFlash] = useState(null), [nb, setNb] = useState(false), [miss, setMiss] = useState([]);
  const [left] = useCountdown(45, phase === "play", () => setPhase("over"));
  useEffect(() => { if (phase === "over") setNb(record(score)); }, [phase]);
  if (phase === "start") return <StartScreen text="A card appears. Tap the bin it belongs in. Correct answers in a row build a combo; wrong answers cost points. You have 45 seconds." onStart={() => { setItems(shuffle(set.items)); setN(0); setScore(0); setCombo(0); setMiss([]); setPhase("play"); }}>
    <div className="row" style={{ justifyContent: "center" }}>{SORT_SETS.map((s) => <button key={s.id} className={"chip" + (s.id === set.id ? " on" : "")} style={s.id === set.id ? null : { background: "rgba(255,255,255,.1)", color: "#fff" }} onClick={() => setSet(s)}>{s.name}</button>)}</div></StartScreen>;
  if (phase === "over") return <GameOver title={"Sort Rush · " + set.name} score={score} best={Math.max(best, score)} isBest={nb} onAgain={() => setPhase("start")}>
    {miss.length > 0 && <div style={{ textAlign: "left", maxWidth: 480 }}>{miss.map(([it, b]) => <p key={it} style={{ color: "#c9d4ec", fontSize: 14.5 }}><b style={{ color: "#fff" }}>{it}</b> → {b}</p>)}</div>}</GameOver>;
  const it = items[n];
  const drop = (bin, e) => { if (flash) return; const ok = it[1] === bin; setFlash({ bin, ok }); if (ok) { const pts = 50 + combo * 10; setScore((s) => s + pts); setCombo((c) => c + 1); burst("+" + pts, e); } else { setScore((s) => Math.max(0, s - 25)); setCombo(0); setMiss((m) => [...m, it]); } setTimeout(() => { setFlash(null); if (n + 1 >= items.length) setPhase("over"); else setN(n + 1); }, ok ? 300 : 700); };
  return <div>
    <div className="timer"><i style={{ width: (left / 45) * 100 + "%" }} /></div>
    <div className="hud"><div><small>Score</small><b>{score}</b></div><div><small>Combo</small><b className="combo">×{combo}</b></div><div><small>Card</small><b>{n + 1}/{items.length}</b></div><div><small>Time</small><b>{Math.ceil(left)}</b></div></div>
    <div className="falling" key={n}>{it[0]}</div>
    <div className="bins" style={{ gridTemplateColumns: `repeat(${Math.min(set.bins.length, 5)},minmax(0,1fr))` }}>{set.bins.map((b) => <button key={b} className={"bin" + (flash && flash.bin === b ? (flash.ok ? " ok" : " no") : "") + (flash && !flash.ok && it[1] === b ? " ok" : "")} onClick={(e) => drop(b, e)}>{b}</button>)}</div>
    <style>{"@media (max-width:620px){.bins{grid-template-columns:repeat(2,minmax(0,1fr))!important}}"}</style>
  </div>;
}

function TermMatch({ best, record }) {
  const [phase, setPhase] = useState("start"); const [cards, setCards] = useState([]); const [open, setOpen] = useState([]); const [got, setGot] = useState({});
  const [moves, setMoves] = useState(0), [t0, setT0] = useState(0), [score, setScore] = useState(0), [nb, setNb] = useState(false), [pairs, setPairs] = useState([]);
  const start = () => { const pick = shuffle(ALL_CON).slice(0, 6); setPairs(pick); setCards(shuffle(pick.flatMap((c, i) => [{ k: i, text: c.term, term: true }, { k: i, text: c.def.length > 78 ? c.def.slice(0, 76) + "…" : c.def }]))); setOpen([]); setGot({}); setMoves(0); setT0(Date.now()); setPhase("play"); };
  if (phase === "start") return <StartScreen text="There are 12 cards: 6 terms and 6 meanings. Flip two at a time to find the matching pairs. Fewer moves and a faster time score more points." onStart={start} />;
  if (phase === "over") return <GameOver title="Term Match" score={score} best={Math.max(best, score)} isBest={nb} onAgain={start}>
    <div style={{ textAlign: "left", maxWidth: 560 }}>{pairs.map((p) => <p key={p.term} style={{ color: "#c9d4ec", fontSize: 14.5, marginBottom: 6 }}><b style={{ color: "#fff" }}>{p.term}</b>: {p.def}</p>)}</div></GameOver>;
  const flip = (i, e) => {
    if (open.length === 2 || open.includes(i) || got[cards[i].k]) return;
    const o = [...open, i]; setOpen(o);
    if (o.length === 2) { setMoves((m) => m + 1); const [a, b] = o.map((x) => cards[x]);
      if (a.k === b.k && a.term !== b.term) { burst("Match!", e); const g = { ...got, [a.k]: true }; setTimeout(() => { setGot(g); setOpen([]); if (Object.keys(g).length === 6) { const secs = (Date.now() - t0) / 1000; const sc = Math.max(100, Math.round(1500 - (moves + 1 - 6) * 60 - secs * 6)); setScore(sc); setNb(record(sc)); setPhase("over"); } }, 500); }
      else setTimeout(() => setOpen([]), 1000); }
  };
  return <div>
    <div className="hud"><div><small>Moves</small><b>{moves}</b></div><div><small>Pairs</small><b>{Object.keys(got).length}/6</b></div></div>
    <div className="mem-grid">{cards.map((c, i) => <button key={i} className={"mem" + (open.includes(i) || got[c.k] ? " flip" : "") + (got[c.k] ? " got" : "")} onClick={(e) => flip(i, e)} aria-label={open.includes(i) || got[c.k] ? c.text : "Hidden card"}><div className="in"><div className="f" /><div className={"b" + (c.term ? " term" : "")}>{c.text}</div></div></button>)}</div>
  </div>;
}

function SeqStack({ best, record }) {
  const [phase, setPhase] = useState("start"); const [set, setSet] = useState(SEQ_SETS[0]); const [pool, setPool] = useState([]); const [placed, setPlaced] = useState([]);
  const [errors, setErrors] = useState(0), [t0, setT0] = useState(0), [score, setScore] = useState(0), [nb, setNb] = useState(false), [shake, setShake] = useState(null), [round, setRound] = useState(0);
  const begin = (s) => { setSet(s); setPool(shuffle(s.steps)); setPlaced([]); setErrors(0); setT0(Date.now()); setPhase("play"); };
  if (phase === "start") return <StartScreen text="Tap the steps in the correct order. Wrong taps cost points, and the clock is running." onStart={() => { setScore(0); setRound(0); begin(set); }}>
    <div className="row" style={{ justifyContent: "center" }}>{SEQ_SETS.map((s) => <button key={s.id} className={"chip" + (s.id === set.id ? " on" : "")} style={s.id === set.id ? null : { background: "rgba(255,255,255,.1)", color: "#fff" }} onClick={() => setSet(s)}>{s.name}</button>)}</div></StartScreen>;
  if (phase === "over") return <GameOver title="Sequence Stack" score={score} best={Math.max(best, score)} isBest={nb} onAgain={() => setPhase("start")} />;
  if (phase === "between") return <div className="over"><h2>Nailed it!</h2><div className="row" style={{ justifyContent: "center", flexDirection: "column" }}>{set.steps.map((s, k) => <div key={k} className="seq-item ok" style={{ maxWidth: 460 }}><i>{k + 1}</i>{s}</div>)}</div>
    <div className="row" style={{ justifyContent: "center" }}>{round < 2 ? <button className="btn red" onClick={() => { const others = SEQ_SETS.filter((s) => s.id !== set.id); begin(others[Math.floor(Math.random() * others.length)]); setRound(round + 1); }}>Next sequence ({round + 2}/3)</button> : <button className="btn red" onClick={() => { setNb(record(score)); setPhase("over"); }}>See final score</button>}</div></div>;
  const tap = (s, e) => { const want = set.steps[placed.length]; if (s === want) { const p = [...placed, s]; setPlaced(p); setPool(pool.filter((x) => x !== s)); burst("✓", e); if (p.length === set.steps.length) { const secs = (Date.now() - t0) / 1000; setScore((sc) => sc + Math.max(50, Math.round(600 - secs * 8 - errors * 60))); setPhase("between"); } } else { setErrors((x) => x + 1); setShake(s); setTimeout(() => setShake(null), 400); } };
  return <div>
    <div className="hud"><div><small>Sequence</small><b style={{ fontSize: 16 }}>{set.name}</b></div><div><small>Round</small><b>{round + 1}/3</b></div><div><small>Errors</small><b>{errors}</b></div><div><small>Score</small><b>{score}</b></div></div>
    <div className="grid g2">
      <div><span className="eyebrow" style={{ color: "var(--sky)" }}>Your order</span><div style={{ marginTop: 8 }}>{placed.map((s, k) => <div key={k} className="seq-item ok"><i>{k + 1}</i>{s}</div>)}{placed.length < set.steps.length && <div className="seq-item" style={{ border: "2px dashed rgba(154,174,212,.5)", background: "transparent" }}><i>{placed.length + 1}</i>What comes next?</div>}</div></div>
      <div><span className="eyebrow" style={{ color: "var(--sky)" }}>Tap the next step</span><div style={{ marginTop: 8 }}>{pool.map((s) => <button key={s} className="seq-item" style={shake === s ? { background: "#bf2026", animation: "shake .35s" } : null} onClick={(e) => tap(s, e)}><i>?</i>{s}</button>)}</div></div>
    </div>
  </div>;
}

function VerbClash({ best, record }) {
  const [phase, setPhase] = useState("start"); const [rounds, setRounds] = useState([]); const [n, setN] = useState(0);
  const [score, setScore] = useState(0), [pick, setPick] = useState(null), [nb, setNb] = useState(false), [qt, setQt] = useState(0);
  const start = () => { const rs = shuffle(VERBS).slice(0, 10).map((v) => { const mode = Math.random() < 0.5 ? "d" : "how"; return { v, mode, opts: shuffle([v, ...shuffle(VERBS.filter((x) => x.w !== v.w)).slice(0, 3)]) }; }); setRounds(rs); setN(0); setScore(0); setPick(null); setQt(Date.now()); setPhase("play"); };
  if (phase === "start") return <StartScreen text="You'll see a NESA definition or a marker's description of what a key word demands. Pick the matching verb. Faster answers score more points. There are 10 rounds." onStart={start} />;
  if (phase === "over") return <GameOver title="Key Word Clash" score={score} best={Math.max(best, score)} isBest={nb} onAgain={start}><button className="btn ghost sm" style={{ background: "rgba(255,255,255,.12)", color: "#fff" }} onClick={() => go("keywords")}>Study the key words</button></GameOver>;
  const r = rounds[n];
  const choose = (o, e) => { if (pick) return; setPick(o.w); if (o.w === r.v.w) { const secs = (Date.now() - qt) / 1000; const pts = Math.max(20, Math.round(150 - secs * 12)); setScore((s) => s + pts); burst("+" + pts, e); } setTimeout(() => { setPick(null); if (n + 1 >= rounds.length) { setPhase("over"); setNb(record(score + (o.w === r.v.w ? Math.max(20, Math.round(150 - (Date.now() - qt) / 1000 * 12)) : 0))); } else { setN(n + 1); setQt(Date.now()); } }, o.w === r.v.w ? 500 : 1200); };
  return <div>
    <div className="hud"><div><small>Round</small><b>{n + 1}/10</b></div><div><small>Score</small><b>{score}</b></div></div>
    <span className="eyebrow" style={{ color: "var(--sky)" }}>{r.mode === "d" ? "NESA definition" : "What the marker wants"}</span>
    <div className="falling" key={n} style={{ margin: "12px 0 22px", maxWidth: "none", fontFamily: "var(--body)", fontWeight: 700 }}>"{r.mode === "d" ? r.v.d : r.v.how}"</div>
    <div className="grid g2">{r.opts.map((o) => <button key={o.w} className={"rf-opt" + (pick && o.w === r.v.w ? " right" : "") + (pick === o.w && o.w !== r.v.w ? " wrong" : "")} style={{ textAlign: "center", fontFamily: "var(--display)", fontWeight: 900, fontSize: 20 }} onClick={(e) => choose(o, e)}>{o.w}</button>)}</div>
  </div>;
}


