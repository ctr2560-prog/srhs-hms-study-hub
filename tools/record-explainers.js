// Records each explainer as ONE mp3 (audio/ex-<dot>.mp3) with exact cue times per narration segment,
// and writes src/explain-audio.js. Usage: node tools/record-explainers.js "Lee (Premium)" [rate] [onlyId]
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const root = path.join(__dirname, "..");
const voice = process.argv[2], rate = process.argv[3] || "175", only = process.argv[4];
if (!voice) { console.error('Pass a voice name, e.g. "Lee (Premium)"'); process.exit(1); }
const files = fs.readdirSync(path.join(root, "src")).filter((f) => /^explain-[a-z]\.js$/.test(f)).sort();
const EX = new Function(files.map((f) => fs.readFileSync(path.join(root, "src", f), "utf8")).join("\n") + ";return EXPLAIN;")();

function speakable(x) {
  return x
    .replace(/≈\s?/g, "about ").replace(/\s?→\s?/g, ", leading to ").replace(/×/g, " times ")
    .replace(/\bVO2\s?max\b/gi, "V O 2 max").replace(/\b1RM\b/g, "one rep max").replace(/\bHIIT\b/g, "hit")
    .replace(/\bATP-PC\b/g, "A T P, P C").replace(/\bATP\b/g, "A T P").replace(/\bCOPD\b/g, "C O P D")
    .replace(/\bDALYs\b/g, "dallies").replace(/\bDALY\b/g, "dally").replace(/\bGPs?\b/g, (m) => m === "GP" ? "G P" : "G Ps")
    .replace(/\bSDGs?\b/g, (m) => m === "SDG" ? "S D G" : "S D Gs").replace(/\bAIHW\b/g, "A I H W").replace(/\bHSC\b/g, "H S C")
    .replace(/\bkm\b/g, "kilometre").replace(/\bTOTAPS\b/g, "toe taps").replace(/\bRICER\b/g, "rice-er").replace(/\bHARM\b/g, "harm")
    .replace(/\bSMART\b/g, "smart").replace(/\bWADA\b/g, "wahda").replace(/\bNSAIDs\b/g, "N SAIDS").replace(/\bEPO\b/g, "E P O")
    .replace(/\bPBS\b/g, "P B S").replace(/\bTGA\b/g, "T G A").replace(/\bNDIS\b/g, "N D I S").replace(/\bOECD\b/g, "O E C D")
    .replace(/\bCAR-T\b/g, "car T").replace(/\bHIIT\b/g, "hit").replace(/\bTUE\b/g, "T U E").replace(/\bNCD\b/g, "N C D")
    .replace(/\bmg\/kg\b/g, "milligrams per kilo").replace(/\bg\/kg\b/g, "grams per kilo").replace(/\bA I\b/g, "A I").replace(/\s+/g, " ").trim();
}
const RATE = 22050, GAP = 0.14, SCENE_GAP = 0.4;
const tmp = path.join(root, "build", "seg.wav");
const outDir = path.join(root, "audio"); fs.mkdirSync(outDir, { recursive: true });
const manPath = path.join(root, "src", "explain-audio.js");
let man = {};
if (fs.existsSync(manPath)) { try { man = (new Function(fs.readFileSync(manPath, "utf8").replace(/^const EXPLAIN_AUDIO = /, "return "))() || {}).files || {}; } catch (e) {} }
const silence = (s) => Buffer.alloc(Math.round(s * RATE) * 2);
for (const id of Object.keys(EX)) {
  if (only && id !== only) continue;
  const chunks = [], cues = []; let bytes = 0;
  EX[id].forEach((sc, si) => {
    if (si > 0) { const g = silence(SCENE_GAP - GAP); chunks.push(g); bytes += g.length; }
    sc.say.forEach((s) => {
      const text = speakable(Array.isArray(s) ? s[0] : s);
      execFileSync("say", ["-v", voice, "-r", rate, "--file-format=WAVE", "--data-format=LEI16@" + RATE, "-o", tmp, text]);
      const wav = fs.readFileSync(tmp); const di = wav.indexOf("data") + 8; const pcm = wav.subarray(di);
      cues.push(Math.round((bytes / 2 / RATE) * 1000));
      chunks.push(pcm); bytes += pcm.length;
      const g = silence(GAP); chunks.push(g); bytes += g.length;
    });
  });
  const pcm = Buffer.concat(chunks);
  const raw = path.join(root, "build", "ex.raw"); fs.writeFileSync(raw, pcm);
  const out = `ex-${id}.mp3`;
  execFileSync("lame", ["--quiet", "-r", "-s", "22.05", "--bitwidth", "16", "--signed", "--little-endian", "-m", "m", "-b", "64", raw, path.join(outDir, out)]);
  man[id] = { f: out, cues, ms: Math.round((bytes / 2 / RATE) * 1000) };
  console.log(id, (man[id].ms / 1000).toFixed(1) + "s", cues.length + " cues");
}
fs.writeFileSync(manPath, "const EXPLAIN_AUDIO = " + JSON.stringify({ voice, files: man }) + ";\n");
try { fs.unlinkSync(tmp); fs.unlinkSync(path.join(root, "build", "ex.raw")); } catch (e) {}
