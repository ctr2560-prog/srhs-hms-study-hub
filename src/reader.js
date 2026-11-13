// ===== Study Hub Reader: offline marker (no API) =====
// Reads a response against the question's marker notes, the key word, evidence, terminology and length,
// then places it in a marking-guideline range. Heuristic: a practice guide, not a human marker.

const RD_STOP = new Set(("a an the and or but if of to in on at by for with from into onto over under about as is are was were be been being it its this that these those their there they them he she his her we our you your i me my not no can could would should will may might must do does did done have has had having than then so such also very more most less least many much some any each other both either neither one two three how why what which who whom when where while e.g eg etc including include includes identifies identify explains explain describes describe outlines outline links link shows show uses use using draws draw makes make gives give provides provide applies apply refers refer mentions mention discusses discuss evaluates evaluate assesses assess analyses analyse compares compare justifies justify recognises recognise demonstrates demonstrate considers consider clear clearly specific relevant range example examples data trend trends point points answer response question way ways well just like get gets got make made need needs needed").split(" "));

const RD_CAUSE = ["because", "therefore", "as a result", "leads to", "lead to", "leading to", "led to", "which means", "this means", "meaning that", "due to", "resulting in", "results in", "result in", "consequently", "causes", "caused by", "so that", "contributes to", "contributing to", "thereby", "in turn", "which increases", "which reduces", "which improves", "which allows", "allowing", "enables", "this is why", "since", "hence", "thus"];
const RD_RELATE = ["relationship", "interrelat", "impact", "implication", "influence", "linked", "links to", "connected", "interact", "combined with", "compounded", "in turn", "depends on", "correlat", "associated with", "flow-on", "affects"];
const RD_COMPARE = ["whereas", "similarly", "in contrast", "both", "unlike", "compared to", "compared with", "likewise", "the same", "differ", "on the other hand", "while", "however", "in comparison", "alike", "similar"];
const RD_JUDGE = ["effective", "effectiveness", "ineffective", "significant", "successful", "limited", "strength", "weakness", "overall", "to a large extent", "to a limited extent", "to some extent", "largely", "partially", "most important", "crucial", "essential", "outweigh", "valuable", "worthwhile", "it is evident", "this shows", "ultimately", "in conclusion", "therefore", "the most", "less effective", "more effective", "highly", "inadequate", "sufficient", "insufficient"];
const RD_BALANCE = ["however", "although", "on the other hand", "despite", "nevertheless", "whereas", "yet", "limitation", "disadvantage", "advantage", "drawback", "conversely", "but", "while", "even though", "on the contrary", "benefit", "barrier"];
const RD_FEATURE = ["such as", "includes", "including", "involves", "consists of", "is characterised", "for example", "for instance", "e.g.", "is a", "are a", "refers to", "is when", "is the"];
const RD_PROPOSE = ["should", "could", "recommend", "propose", "would", "strategy", "strategies", "solution", "implement", "introduce", "invest", "expand"];
const RD_EVID = ["for example", "for instance", "e.g.", "such as", "according to", "data shows", "statistics", "aihw", "abs", "who ", "research", "study"];

function rdStem(w) {
  w = w.toLowerCase().replace(/[’']s$/, "").replace(/[^a-z0-9]/g, "");
  if (w.length > 6) w = w.replace(/(isations?|izations?|ations?|ments?|ingly|ings?|ities|ity|ness|ally|ical|ive|ies|ers?|ed|es|s|ly|al)$/, "");
  else if (w.length > 4) w = w.replace(/(ies|ed|es|s|ly)$/, "");
  return w;
}
function rdWords(t) { return (t.match(/[A-Za-z][A-Za-z'’-]*|\d+(?:\.\d+)?%?/g) || []); }
function rdTerms(t) {
  const out = [];
  for (const raw of rdWords(t)) {
    const isAcr = /^[A-Z]{2,6}s?$/.test(raw);
    const low = raw.toLowerCase();
    if (/^\d/.test(raw)) continue;
    if (!isAcr && (low.length < 4 || RD_STOP.has(low))) continue;
    const s = rdStem(raw);
    if (s.length >= (isAcr ? 2 : 3) && !out.includes(s)) out.push(s);
  }
  return out;
}
function rdHas(stems, prefixes, term) {
  if (stems.has(term)) return true;
  if (term.length >= 6) return prefixes.has(term.slice(0, 6));
  return false;
}
function rdFind(textLow, list) {
  const hits = [];
  for (const p of list) {
    const re = new RegExp("(^|[^a-z])" + p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").trim(), "g");
    const m = textLow.match(re);
    if (m) hits.push([p.trim(), m.length]);
  }
  return hits;
}
const rdCount = (hits) => hits.reduce((a, [, n]) => a + n, 0);

function rdRelevantDots(qText) {
  const qs = new Set(rdTerms(qText));
  return ALL_DOT_IDS.map((id) => {
    const d = DOTS[id];
    const terms = rdTerms(d.t + " " + d.inc.join(" ") + " " + d.con.map((c) => c[0]).join(" "));
    return [id, terms.filter((t) => qs.has(t)).length];
  }).sort((a, b) => b[1] - a[1]).filter((x) => x[1] > 0).slice(0, 2).map((x) => x[0]);
}

function rdRanges(guide, m) {
  return guide.map(([r, d]) => { const n = r.split(/[–-]/).map((x) => parseInt(x, 10)); return { r, d, lo: n[0], hi: n[1] || n[0] }; }).sort((a, b) => b.hi - a.hi);
}

const RD_STARTERS = {
  1: ["One feature of … is …", "… can be described as …, which includes …", "For example, …"],
  explain: ["… occurs because …, which leads to …", "As a result of …, …", "This means that …, so …"],
  analyse: ["… is influenced by …, which in turn …", "The relationship between … and … is …", "The implication of this is that …"],
  compare: ["Both … and … …; however, …", "Whereas … focuses on …, … instead …", "Similarly, …"],
  judge: ["… is highly effective in … because …", "However, its effectiveness is limited by …", "Overall, … is effective to a large extent, as …"],
  discuss: ["One argument for … is …", "On the other hand, …", "On balance, …"],
  propose: ["To improve …, … should …", "This would work because …", "For example, …"]
};

function rdVerbType(verb) {
  const w = (verb && verb.w || "").toLowerCase();
  if (/assess|evaluat|justif|critically/.test(w)) return "judge";
  if (/discuss/.test(w)) return "discuss";
  if (/compare|contrast/.test(w)) return "compare";
  if (/analyse|examine|investigate/.test(w)) return "analyse";
  if (/explain/.test(w)) return "explain";
  if (/propose/.test(w)) return "propose";
  return "describe";
}

function readerMark(q, answer) {
  const m = q.m, text = answer.trim(), low = " " + text.toLowerCase().replace(/\s+/g, " ") + " ";
  const words = rdWords(text), wc = words.length;
  const target = m <= 4 ? m * 30 : m <= 8 ? m * 35 : m >= 12 ? 700 : m * 55;
  let verb = VERBS.find((v) => v.w.toLowerCase() === (q.verb || "").toLowerCase()) || VERBS.find((v) => new RegExp("\\b" + v.w + "\\b", "i").test(q.q));
  if (!verb && /to what extent/i.test(q.q)) verb = VERBS.find((v) => v.w === "Assess");
  const vtype = /to what extent/i.test(q.q) ? "judge" : rdVerbType(verb);
  const tier = verb ? verb.tier : 2;
  const dots = q.dots && q.dots.length ? q.dots : rdRelevantDots(q.q);
  const guide = rdRanges(q.guide || ER_GUIDE, m);

  // answer stems
  const stems = new Set(), prefixes = new Set();
  for (const w of words) { const s = rdStem(w); if (s.length >= 2) { stems.add(s); if (s.length >= 6) prefixes.add(s.slice(0, 6)); } }

  // 1. content coverage against marker points
  const points = q.pts && q.pts.length ? q.pts : dots.flatMap((d) => DOTS[d].sum);
  const cover = points.map((p) => {
    const ts = rdTerms(p); const hit = ts.filter((t) => rdHas(stems, prefixes, t));
    const ratio = ts.length ? hit.length / ts.length : 0;
    const status = (hit.length >= 2 && ratio >= 0.3) || (ts.length <= 2 && hit.length >= 1) ? "yes" : hit.length >= 1 ? "part" : "no";
    return { p, status, hit };
  });
  const expected = q.pts && q.pts.length ? Math.max(2, Math.round(points.length * 0.75)) : Math.min(points.length, m >= 10 ? 8 : Math.max(3, Math.ceil(m * 0.7)));
  const covScore = Math.min(1, cover.reduce((a, c) => a + (c.status === "yes" ? 1 : c.status === "part" ? 0.45 : 0), 0) / expected);

  // 2. terminology
  const gloss = [];
  for (const d of dots) {
    for (const c of DOTS[d].con) gloss.push(c[0].replace(/\s*\(.*?\)/g, ""));
    for (const [, para] of DOTS[d].notes) for (const b of para.match(/\*\*([^*]+)\*\*/g) || []) gloss.push(b.slice(2, -2).replace(/[:.]$/, ""));
  }
  const termsUsed = [];
  for (const g of [...new Set(gloss)]) {
    const ts = rdTerms(g); if (!ts.length || ts.length > 4) continue;
    if (ts.every((t) => rdHas(stems, prefixes, t)) && !termsUsed.some((u) => u.toLowerCase() === g.toLowerCase())) termsUsed.push(g);
  }
  for (let i = termsUsed.length - 1; i >= 0; i--) if (termsUsed.some((u, j) => j !== i && u.toLowerCase().includes(termsUsed[i].toLowerCase()))) termsUsed.splice(i, 1);
  const qStems = new Set(rdTerms(q.q + " " + points.join(" ")));
  const unused = [...new Set(gloss)].filter((g) => !termsUsed.some((u) => u.toLowerCase() === g.toLowerCase()) && rdTerms(g).length && g.split(/\s+/).length <= 3);
  const sugg = unused.filter((g) => rdTerms(g).some((t) => qStems.has(t))).concat(unused).filter((g, i, a) => a.indexOf(g) === i).slice(0, 3);
  const termTarget = Math.max(2, Math.min(6, Math.round(m * 0.6)));
  const termScore = Math.min(1, termsUsed.length / termTarget);

  // 3. key word demands
  const cause = rdFind(low, RD_CAUSE), relate = rdFind(low, RD_RELATE), comp = rdFind(low, RD_COMPARE), judge = rdFind(low, RD_JUDGE), bal = rdFind(low, RD_BALANCE), feat = rdFind(low, RD_FEATURE), prop = rdFind(low, RD_PROPOSE);
  const nC = rdCount(cause), nR = rdCount(relate), nCo = rdCount(comp), nJ = rdCount(judge), nB = rdCount(bal), nF = rdCount(feat), nP = rdCount(prop);
  const ct = Math.max(2, Math.round(m / 2)), f = (n, t) => Math.min(1, n / t);
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim());
  const lastS = (sentences.slice(-2).join(" ") || "").toLowerCase(), firstS = (sentences.slice(0, 2).join(" ") || "").toLowerCase();
  const judgeEnd = RD_JUDGE.some((j) => lastS.includes(j)), judgeStart = RD_JUDGE.some((j) => firstS.includes(j));
  let kw;
  if (vtype === "describe") kw = Math.min(1, 0.55 + 0.15 * nF + 0.1 * nC);
  else if (vtype === "explain") kw = f(nC, ct);
  else if (vtype === "analyse") kw = 0.6 * f(nC, ct) + 0.4 * f(nR, m >= 6 ? 2 : 1);
  else if (vtype === "compare") kw = 0.7 * f(nCo, m >= 6 ? 3 : 2) + 0.3 * f(nC, 2);
  else if (vtype === "discuss") kw = 0.5 * f(nB, 2) + 0.3 * f(nC, ct) + 0.2 * f(nJ, 1);
  else if (vtype === "propose") kw = 0.6 * f(nP, 2) + 0.4 * f(nC, 2);
  else kw = 0.3 * f(nC, ct) + 0.3 * f(nJ, m >= 8 ? 4 : 2) + 0.2 * f(nB, 2) + (judgeEnd ? 0.12 : 0) + (judgeStart ? 0.08 : 0);
  kw = Math.min(1, kw);

  // 4. evidence
  const nums = (text.match(/\b\d+(?:\.\d+)?\s?(?:%|per cent|percent|years?|million|billion|times|bpm|kg|km|m|min|minutes|hours|weeks|kcal|ml)?/gi) || []).filter((n) => !/^(1|2|3|4|5|6|7|8|9)$/.test(n.trim()) || /%|year/.test(n));
  const egs = rdFind(low, RD_EVID);
  const named = (text.match(/(?<![.!?]\s)(?<!^)\b(?:[A-Z][a-z]+(?:\s(?:the|of|and|for|to)?\s?[A-Z][a-z]+)+|[A-Z]{3,})\b/g) || []).filter((x) => !/^(The|This|These|However|Overall|Also)\b/.test(x));
  const nEv = nums.length + rdCount(egs) + Math.min(3, new Set(named).size);
  const evScore = Math.min(1, nEv / Math.max(2, Math.round(m / 2.5)));

  // 5. length & structure
  const ratio = wc / target;
  const lf = ratio < 0.2 ? 0.3 : ratio < 0.35 ? 0.55 : ratio < 0.5 ? 0.78 : ratio < 0.65 ? 0.92 : 1;
  const paras = text.split(/\n\s*\n|\n/).filter((p) => p.trim().length > 30).length;
  const structScore = m >= 8 ? Math.min(1, (paras >= 4 ? 0.6 : paras >= 2 ? 0.35 : 0.1) + (judgeEnd || /in conclusion|overall|to conclude/.test(lastS) ? 0.4 : 0)) : 1;

  let comp0 = 0.45 * covScore + 0.3 * kw + 0.15 * evScore + 0.1 * termScore;
  if (m >= 8) comp0 = 0.9 * comp0 + 0.1 * structScore;
  comp0 *= lf;
  let mark = Math.round(m * Math.pow(Math.max(0, comp0), 0.85));
  const capNote = [];
  const second = guide[1] ? guide[1].hi : m - 1;
  if (tier >= 2 && vtype !== "describe" && kw < 0.4 && mark > second) { mark = second; capNote.push("key word"); }
  if (vtype === "judge" && nJ === 0 && mark > second) { mark = second; capNote.push("judgement"); }
  if (wc < 15) mark = Math.min(mark, 1);
  const topicTerms = new Set(rdTerms(q.q + " " + dots.map((d) => DOTS[d].t + " " + DOTS[d].inc.join(" ")).join(" ") + " " + points.join(" ")));
  const offTopic = covScore === 0 && termsUsed.length === 0 && ![...topicTerms].some((t) => rdHas(stems, prefixes, t));
  if (offTopic) mark = 0;
  mark = Math.max(0, Math.min(m, mark));
  if (mark === 0 && !offTopic && (wc >= 15 || covScore > 0)) mark = 1;

  const rng = guide.find((g) => mark >= g.lo && mark <= g.hi) || null;
  const nextR = guide.slice().reverse().find((g) => g.lo > mark);
  const pct = mark / m;

  // ---- feedback ----
  const yes = cover.filter((c) => c.status === "yes"), part = cover.filter((c) => c.status === "part"), no = cover.filter((c) => c.status === "no");
  const short = (s) => s.replace(/^(Identifies|Explains|Describes|Links|Shows|Uses|Draws|Makes|Gives|Provides|Outlines|Applies|Recognises|Evaluates|Assesses|Discusses|Compares|Justifies)\s+/i, "").replace(/^./, (c) => c.toUpperCase());
  const quoteList = (hits) => hits.slice(0, 3).map(([p]) => "“" + p + "”").join(", ");
  const strengths = [], improvements = [];
  if (yes.length) strengths.push("You covered " + yes.length + " of the " + (q.pts ? points.length : expected) + " key marker points, including: " + short(yes[0].p).replace(/\.$/, "") + ".");
  if (termsUsed.length >= 2) strengths.push("You used accurate HMS terminology: " + termsUsed.slice(0, 5).join(", ") + ".");
  if (vtype !== "describe" && nC >= 2) strengths.push("You linked cause and effect (" + quoteList(cause) + "), which " + (verb ? verb.w.toLowerCase() : "the key word") + " needs.");
  if (vtype === "judge" && nJ >= 2) strengths.push("You made judgements (" + quoteList(judge) + ").");
  if (vtype === "compare" && nCo >= 2) strengths.push("You signposted similarities and differences (" + quoteList(comp) + ").");
  if (nEv >= 2) strengths.push("You supported points with evidence" + (nums.length ? " such as “" + nums[0].trim() + "”" : "") + ".");
  if (!strengths.length && wc >= 15) strengths.push("You made a start on the question. Build on it using the fixes below.");

  if (covScore < 0.7 && no.length) improvements.push("Cover more of the marker points. You haven't yet dealt with: " + short(no[0].p).replace(/\.$/, "").replace(/^[A-Z](?=[a-z])/, (c) => c.toLowerCase()) + ".");
  if (vtype === "explain" && nC < ct) improvements.push("Explain asks HOW and WHY. Add cause-and-effect links (“because”, “which leads to”, “as a result”) to each point. You used " + nC + "; aim for at least " + ct + ".");
  if (vtype === "analyse" && (nC < ct || nR < 2)) improvements.push("Analyse means showing how the parts connect. After each point, add how it affects another factor and what the implication is (“this in turn…”, “the implication is…”).");
  if (vtype === "judge" && nJ < 2) improvements.push("Make an explicit judgement. Use criteria words (“highly effective”, “limited”, “to a large extent”) and state your overall verdict in the first and last sentence.");
  if (vtype === "judge" && nB < 1) improvements.push("Weigh both sides. Add a limitation or counter-point (“However, …”) before you reach your verdict.");
  if (vtype === "compare" && nCo < 2) improvements.push("Compare needs both similarities AND differences, side by side. Use “whereas”, “similarly” and “in contrast”.");
  if (vtype === "discuss" && nB < 2) improvements.push("Discuss needs points for AND against. Add the other side, then a reasoned position.");
  if (evScore < 0.6) improvements.push("Add specific evidence: a statistic, a named program or a concrete example (e.g. “for example, …”) for your main points.");
  if (termScore < 0.5) improvements.push("Use more precise HMS terminology from this dot point" + (sugg.length ? " (e.g. " + sugg.join(", ") + ")" : "") + ".");
  if (ratio < 0.5) improvements.push("Your response is short for " + m + " marks (" + wc + " words). Aim for roughly " + target + " words, developing each point fully.");
  if (m >= 8 && paras < 3) improvements.push("Structure your response into paragraphs: an introduction with your position, one paragraph per main idea, and a conclusion.");

  const kwText = {
    describe: (verb ? verb.w : "This key word") + " asks for characteristics and features. " + (nF ? "You gave features and examples, which fits the key word." : "Give clear features and an example for each."),
    explain: "Explain means cause and effect: the HOW and WHY. You used " + nC + " cause-and-effect link" + (nC === 1 ? "" : "s") + (nC ? " (" + quoteList(cause) + ")" : "") + ". " + (nC >= ct ? "That's the right kind of language. Make sure every point has one." : "Most points still need a “because” or “which leads to”."),
    analyse: (verb ? verb.w : "Analyse") + " means breaking it into parts and showing the relationships and implications. You used " + nC + " cause-and-effect link" + (nC === 1 ? "" : "s") + " and " + nR + " relationship word" + (nR === 1 ? "" : "s") + ". " + (kw >= 0.7 ? "You're showing relationships. Finish with a clear implication." : "Show how one factor affects another, then state what that means."),
    compare: "Compare needs both similarities and differences. You used " + nCo + " comparison signpost" + (nCo === 1 ? "" : "s") + (nCo ? " (" + quoteList(comp) + ")" : "") + ".",
    discuss: "Discuss needs points for and against. You used " + nB + " balancing word" + (nB === 1 ? "" : "s") + (nB ? " (" + quoteList(bal) + ")" : "") + (nJ ? " and reached a position." : ". Finish with a reasoned position."),
    propose: "Propose means putting forward a suggestion and explaining why it would work. You used " + nP + " recommendation word" + (nP === 1 ? "" : "s") + ".",
    judge: (verb ? verb.w : "This key word") + " needs a judgement backed by criteria and evidence. You used " + nJ + " judgement word" + (nJ === 1 ? "" : "s") + (nJ ? " (" + quoteList(judge) + ")" : "") + ", " + nB + " counter-point signpost" + (nB === 1 ? "" : "s") + ", and " + (judgeEnd ? "you finished with a verdict." : "no clear verdict at the end.")
  }[vtype];
  const keyword_met = kw >= 0.65;

  const verdict = offTopic ? "This response doesn't yet address the question. Re-read the key word and the dot point, then try again."
    : pct >= 0.85 ? "A strong response. It covers the key content and handles the key word well."
    : pct >= 0.65 ? "A sound response. It's on track, but needs more depth and closer use of the key word to reach the top range."
    : pct >= 0.4 ? "A developing response. Some relevant content is there, but it needs more coverage and more " + (vtype === "describe" ? "detail." : "of what the key word asks for.")
    : "An early attempt. Build up the content and use the key word before re-marking.";

  const starters = (RD_STARTERS[vtype === "describe" ? 1 : vtype] || RD_STARTERS[1]);

  return {
    mark, band: bandFor(mark, m), range: rng ? rng.r : "0", keyword_met, verdict, offTopic,
    strengths: strengths.slice(0, 4), improvements: improvements.slice(0, 4),
    missing: no.concat(part).slice(0, 4).map((c) => short(c.p)),
    keyword_feedback: kwText,
    next_level: nextR ? "To move into the " + nextR.r + " range: " + nextR.d.replace(/\.$/, "") + "." : "You're in the top range. Polish it: sharpen every link back to the question, and make sure every example is specific and accurate.",
    capNote, starters,
    scores: [["Content", covScore], ["Key word", kw], ["Evidence", evScore], ["Terminology", termScore], ["Length", Math.min(1, ratio)]].concat(m >= 8 ? [["Structure", structScore]] : []),
    hl: { cause: cause.concat(judge, comp, bal, relate).map(([p]) => p), terms: [...new Set(cover.flatMap((c) => c.hit))] },
    wc, target, points: cover
  };
}
