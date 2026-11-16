/* ================= ATOMI-STYLE EXPLAINER VIDEOS ================= */
const EXI = {
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  cross: "M9 3h6v6h6v6h-6v6H9v-6H3V9h6z",
  pulse: "M3 12h4l3-8 4 16 3-8h4",
  scale: "M12 3v18M7 21h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z",
  brain: "M9.5 3A3 3 0 0 0 6.6 6.8 3 3 0 0 0 4.5 12a3 3 0 0 0 1.8 5.1A3 3 0 0 0 9.5 21h1V3zM14.5 3a3 3 0 0 1 2.9 3.8 3 3 0 0 1 2.1 5.2 3 3 0 0 1-1.8 5.1 3 3 0 0 1-3.2 3.9h-1V3z",
  lungs: "M12 3v9M12 12l-3 2M12 12l3 2M8 7C5 8 3 12 3 17c0 2 1 3 3 3s3-1 3-3V9a2 2 0 0 0-1-2zM16 7c3 1 5 5 5 10 0 2-1 3-3 3s-3-1-3-3V9a2 2 0 0 1 1-2z",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1M16 3.1a4 4 0 0 1 0 7.8M22 21v-1a6 6 0 0 0-4-5.7",
  user: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21v-1a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7v1",
  alert: "M12 3 2 20h20zM12 10v4M12 17h.01",
  dollar: "M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  pin: "M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  trend: "M3 17l6-6 4 4 8-8M15 7h6v6",
  drop: "M12 2.5S5 10 5 15a7 7 0 0 0 14 0c0-5-7-12.5-7-12.5z",
  weight: "M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12",
  run: "M13 4.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zM7 21l3-6 3 2v5M10 15l1-5 4 3h4M11 10l-4 1-2 3",
  cc: "M3 5h18v14H3zM10 10a2 2 0 1 0 0 4M17 10a2 2 0 1 0 0 4",
  shield: "M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z",
  hospital: "M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16M2 21h20M12 7v6M9 10h6M10 21v-4h4v4",
  phone: "M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 18h2",
  globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20",
  pill: "M10.5 3.5a5 5 0 0 1 7 7l-7 7a5 5 0 0 1-7-7zM7 7l7 7",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5",
  apple: "M12 7c-2-2-7-2-7 4 0 5 3 10 5 10 1 0 1.5-.5 2-.5s1 .5 2 .5c2 0 5-5 5-10 0-6-5-6-7-4zM12 7c0-2 1-4 3-4",
  chart: "M3 3v18h18M7 15v3M12 10v8M17 6v12",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  dna: "M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12M8 7h8M8 17h8",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  leaf: "M5 21c0-9 5-15 15-16-1 10-7 15-15 16zM5 21l8-8",
};
function ExIcon({ n }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={EXI[n] || P[n] || P.bulb} /></svg>; }

// Flatten scenes into timed narration segments.
function exSegments(scenes) {
  const segs = [];
  scenes.forEach((sc, si) => {
    let shown = 0;
    sc.say.forEach((s, j) => { const [text, n] = Array.isArray(s) ? s : [s, 1]; shown += n; segs.push({ scene: si, shown: j === sc.say.length - 1 ? 99 : shown, text }); });
  });
  return segs;
}
const exEstMs = (text) => Math.max(1800, text.split(/\s+/).length * 390 + 300);
const fmtT = (ms) => { const s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
const explainRec = (id) => (typeof EXPLAIN_AUDIO !== "undefined" && EXPLAIN_AUDIO && EXPLAIN_AUDIO.files && EXPLAIN_AUDIO.files[id]) || null;

function CountUp({ to, ms = 900, suffix = "" }) {
  const [v, setV] = useState(0);
  const dp = (String(to).split(".")[1] || "").length;
  useEffect(() => { let raf, t0 = performance.now(); const f = (t) => { const p = Math.min(1, (t - t0) / ms); setV(to * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf); }, [to]);
  return <>{v.toFixed(dp)}{suffix}</>;
}
function StatNum({ n }) {
  const m = String(n).match(/^([^\d]*)(\d+)(.*)$/);
  return m ? <>{m[1]}<CountUp to={+m[2]} />{m[3]}</> : n;
}

function ExScene({ sc, shown }) {
  const on = (k) => (k < shown ? " on" : "");
  if (sc.v === "title") return <div className="ex-title">
    <span className={"ex-kicker" + on(0)}>{sc.kicker}</span>
    <h2 className={on(0)}>{sc.title}</h2>
    {sc.sub && <p className={on(1)}>{sc.sub}</p>}
  </div>;
  const head = sc.title && <h3 className="ex-h">{sc.title}</h3>;
  if (sc.v === "list") return <div className="ex-body">{head}
    <div className={"ex-list" + (sc.items.length > 4 ? " two" : "")}>{sc.items.map(([ic, t, dt], k) => <div key={k} className={"ex-li" + on(k)}><span className={"ex-ic t" + (k % 4)}><ExIcon n={ic} /></span><div><b>{t}</b>{dt && <small>{dt}</small>}</div></div>)}</div>
  </div>;
  if (sc.v === "bars") return <div className="ex-body">{head}
    <div className="ex-bars">{sc.items.map(([l, val, tone], k) => <div key={k} className={"ex-brow" + on(k)}><span className="lab">{l}</span><div className="track"><i className={"t-" + tone} style={{ width: k < shown ? (val / sc.max) * 100 + "%" : 0 }} /></div><b className="val">{k < shown ? <CountUp to={val} suffix={sc.unit} /> : ""}</b></div>)}</div>
  </div>;
  if (sc.v === "stat") return <div className="ex-stat">
    <div className={"n" + on(0)}>{shown > 0 ? <StatNum n={sc.n} /> : ""}</div>
    <p className={on(0)}>{sc.label}</p>
    {sc.note && <small className={on(1)}>{sc.note}</small>}
  </div>;
  if (sc.v === "flow") return <div className="ex-body">{head}
    <div className="ex-flow">{sc.steps.map(([ic, l, dt], k) => <React.Fragment key={k}>
      {k > 0 && <svg className={"ex-arrow" + on(k)} viewBox="0 0 40 20" aria-hidden="true"><path d="M2 10h32M27 3l8 7-8 7" /></svg>}
      <div className={"ex-step" + on(k)}><span className={"ex-ic big t" + (k % 4)}><ExIcon n={ic} /></span><b>{l}</b>{dt && <small>{dt}</small>}</div>
    </React.Fragment>)}</div>
  </div>;
  if (sc.v === "eq") return <div className="ex-body">{head}
    <div className="ex-eq">{sc.parts.map(([sym, l, dt], k) => <React.Fragment key={k}>
      {k > 0 && <span className={"op" + on(k)}>{sc.ops[k - 1]}</span>}
      <div className={"part t" + k + on(k)}><span className="sym">{sym}</span><b>{l}</b>{dt && <small>{dt}</small>}</div>
    </React.Fragment>)}</div>
  </div>;
  if (sc.v === "split") return <div className="ex-body">{head}
    <div className="ex-split">{[sc.L, sc.R].map((s, k) => <div key={k} className={"ex-side s" + k + on(k)}><div className="sh"><span className={"ex-ic t" + (k ? 1 : 0)}><ExIcon n={s.icon} /></span><b>{s.h}</b></div><ul>{s.items.map((x) => <li key={x}>{x}</li>)}</ul></div>)}</div>
  </div>;
  if (sc.v === "recap") return <div className="ex-body">{head}
    <div className="ex-recap">{sc.items.map(([l, dt], k) => <div key={k} className={"rc" + on(k)}><i>{k + 1}</i><b>{l}</b><small>{dt}</small></div>)}</div>
    {sc.tip && <div className={"ex-tip" + on(sc.items.length)}><b>Exam tip</b>{sc.tip}</div>}
  </div>;
  return null;
}

function Explainer({ id, store, update, autoplay, onEnd }) {
  const d = DOTS[id], f = faOf(id), scenes = EXPLAIN[id];
  const segs = useMemo(() => exSegments(scenes), [id]);
  const rec = explainRec(id);
  // Start time of each segment, from the recording if there is one.
  const cues = useMemo(() => { if (rec && rec.cues && rec.cues.length === segs.length) return rec.cues; let t = 0; return segs.map((s) => { const c = t; t += exEstMs(s.text) + 250; return c; }); }, [id]);
  const total = rec && rec.cues && rec.cues.length === segs.length ? rec.ms : cues[cues.length - 1] + exEstMs(segs[segs.length - 1].text);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [cc, setCc] = useState(() => store.cc !== false);
  const [muted, setMuted] = useState(() => !!store.muted);
  const mutedRef = useRef(!!store.muted);
  const run = useRef(0), clock = useRef({ t: 0 });
  const k = Math.max(0, cues.reduce((a, c, j) => (c <= t + 1 ? j : a), 0));
  const seg = segs[k], sc = scenes[seg.scene];

  const stopAll = () => { run.current++; try { const v = capCache.tts; v && v.stop(); } catch (e) {} cancelSpeech(); stopRecorded(); };
  useEffect(() => () => stopAll(), []);
  useEffect(() => { stopAll(); setT(0); clock.current.t = 0; setPlaying(false); setStarted(false); setDone(false); if (autoplay) setTimeout(() => playFrom(0), 300); }, [id]);
  const finish = () => { setPlaying(false); setDone(true); setT(total); update((s) => ({ ...s, reels: { ...s.reels, [id]: true } })); onEnd && onEnd(); };

  async function playFrom(ms) {
    stopAll(); const my = run.current; ms = Math.max(0, Math.min(ms, total - 50));
    setStarted(true); setDone(false); setPlaying(true); setT(ms); clock.current.t = ms;
    const live = () => run.current === my;
    // 1. Recorded narration: the audio element is the clock, so scrubbing is exact.
    if (!mutedRef.current && rec && reelAudio) {
      const ok = await new Promise((res) => {
        reelAudio.onended = null; reelAudio.onerror = () => res(false);
        reelAudio.src = "audio/" + rec.f;
        const seek = () => { try { reelAudio.currentTime = ms / 1000; } catch (e) {} const p = reelAudio.play(); if (p) p.then(() => res(true), () => res(false)); else res(true); };
        if (reelAudio.readyState >= 1) seek(); else { reelAudio.onloadedmetadata = () => { reelAudio.onloadedmetadata = null; seek(); }; reelAudio.load(); }
        setTimeout(() => res(!reelAudio.paused), 5000);
      });
      if (!live()) return;
      if (ok) {
        reelAudio.onended = () => { if (live()) finish(); };
        const loop = () => { if (!live()) return; setT(reelAudio.currentTime * 1000); requestAnimationFrame(loop); };
        requestAnimationFrame(loop);
        return;
      }
    }
    // 2. A voice reads the segments one after another (Claude voice, then the device voice).
    const start = Math.max(0, cues.reduce((a, c, j) => (c <= ms + 1 ? j : a), 0));
    const voice = mutedRef.current ? null : await getCap("tts");
    if (!live()) return;
    const useDevice = !mutedRef.current && !voice && window.speechSynthesis;
    for (let j = start; j < segs.length; j++) {
      if (!live()) return;
      const from = cues[j], to = j + 1 < segs.length ? cues[j + 1] : total, t0 = performance.now();
      setT(from);
      let ticking = true; const tick = () => { if (!ticking || !live()) return; setT(Math.min(to - 30, from + (performance.now() - t0))); requestAnimationFrame(tick); }; requestAnimationFrame(tick);
      let spoken;
      if (voice) spoken = voice.speak(segs[j].text, { voice: "buttery", language: "en" }).catch((e) => { if (e && (e.code === "not_granted" || e.code === "unavailable")) capCache.tts = null; });
      else if (useDevice) spoken = deviceSay(segs[j].text);
      else spoken = Promise.resolve();
      await Promise.all([spoken, new Promise((r) => setTimeout(r, mutedRef.current || (!voice && !useDevice) ? to - from : 600))]);
      ticking = false;
      if (!live()) return;
      if (voice || useDevice) await new Promise((r) => setTimeout(r, 220));
    }
    if (live()) finish();
  }
  const pause = () => { stopAll(); setPlaying(false); };
  const toggle = () => { if (playing) return pause(); if (!mutedRef.current) { unlockSpeech(); unlockAudio(); } playFrom(done ? 0 : t); };
  const seekTo = (ms) => { if (playing) playFrom(ms); else { setStarted(true); setDone(false); setT(ms); } };
  const toggleMute = () => { const m = !muted; mutedRef.current = m; setMuted(m); update((s) => ({ ...s, muted: m })); if (!m) { unlockSpeech(); unlockAudio(); } if (playing) setTimeout(() => playFrom(t), 30); };
  const toggleCc = () => { const c = !cc; setCc(c); update((s) => ({ ...s, cc: c })); };
  const barRef = useRef(null);
  const onBar = (e) => { const r = barRef.current.getBoundingClientRect(); const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); seekTo(x * total); };
  const sceneStarts = scenes.map((_, si) => cues[segs.findIndex((s) => s.scene === si)]);

  return (
    <div className="ex-wrap" onKeyDown={(e) => { if (e.key === " " && e.target === e.currentTarget) { e.preventDefault(); toggle(); } }} tabIndex={0}>
      <div className="ex-stage" onClick={toggle}>
        <div className="ex-top"><span className="ex-chip">FA{f.n} · Dot {dotNum(id)} · {d.v}</span><Crest /></div>
        {!done && <div className="ex-scene" key={seg.scene}><ExScene sc={sc} shown={started ? seg.shown : sc.v === "title" ? 9 : 0} /></div>}
        {done && <div className="ex-scene"><div className="ex-end">
          <span className="ex-kicker on">Explainer complete</span><h2 className="on">Now test yourself</h2>
          <div className="row" style={{ justifyContent: "center" }}>
            <button className="btn red" onClick={(e) => { e.stopPropagation(); go("dot-" + id); }}>Quiz and practice</button>
            <button className="btn line" onClick={(e) => { e.stopPropagation(); if (!mutedRef.current) { unlockSpeech(); unlockAudio(); } playFrom(0); }}><I n="restart" s={16} />Watch again</button>
          </div></div></div>}
        {cc && started && !done && <div className="ex-cc"><span>{seg.text}</span></div>}
        {!started && <div className="ex-play"><span><I n="play" /></span><b>Watch · {fmtT(total)}</b></div>}
      </div>
      <div className="ex-ctrl">
        <button className="ex-btn" aria-label={playing ? "Pause" : "Play"} onClick={toggle}><I n={playing ? "pause" : "play"} /></button>
        <span className="ex-time">{fmtT(t)} / {fmtT(total)}</span>
        <div className="ex-bar" ref={barRef} onClick={onBar} role="slider" aria-label="Seek" aria-valuemin={0} aria-valuemax={Math.round(total / 1000)} aria-valuenow={Math.round(t / 1000)}>
          <i style={{ width: Math.min(100, (t / total) * 100) + "%" }} />
          {sceneStarts.slice(1).map((c, si) => <span key={si} className="tick" style={{ left: (c / total) * 100 + "%" }} />)}
        </div>
        <button className={"ex-btn sm" + (cc ? " on" : "")} aria-label="Captions" aria-pressed={cc} onClick={toggleCc}><ExIcon n="cc" /></button>
        <button className="ex-btn sm" aria-label={muted ? "Unmute" : "Mute"} onClick={toggleMute}><I n={muted ? "mute" : "vol"} /></button>
      </div>
      <div className="ex-chapters">{scenes.map((s, si) => <button key={si} className={si === seg.scene && started && !done ? "on" : ""} onClick={() => { if (!mutedRef.current) { unlockSpeech(); unlockAudio(); } if (!playing) { setStarted(true); setDone(false); } playFrom(sceneStarts[si]); }}>{s.v === "title" ? "Intro" : s.title || "Key statistic"}</button>)}</div>
    </div>
  );
}
