// Records every reel line to audio/<dot>-<beat>.m4a with a macOS voice, and writes src/audio-manifest.js.
// Usage: node tools/record-reels.js "Matilda (Premium)" [rate] [onlyId]
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const root = path.join(__dirname, "..");
const voice = process.argv[2], rate = process.argv[3] || "175", only = process.argv[4];
if (!voice) { console.error('Pass a voice name, e.g. "Matilda (Premium)"'); process.exit(1); }

eval(["meta.js", "content-fa1a.js", "content-fa1b.js", "content-fa2a.js", "content-fa2b.js"].map((f) => fs.readFileSync(path.join(root, "src", f), "utf8")).join("\n") + ";global.D=Object.assign({},DOTS_FA1A,DOTS_FA1B,DOTS_FA2A,DOTS_FA2B);global.ORDER=[...FOCUS_AREAS[0].dots,...FOCUS_AREAS[1].dots];");

// Same text the app narrates (mirrors parseBeat in app.jsx)
const plain = (t) => t.replace(/\*+/g, "");
function say(s) {
  const t = s[0], b = s.slice(2);
  if (t === "h") return plain(b);
  if (t === "p") { const [h, x] = b.split("|"); return h + ". " + x; }
  if (t === "s") { const [n, l] = b.split("|"); return n.replace("≈", "about ").replace("↓", " down").replace("%", " percent") + ". " + l; }
  if (t === "l") { const [h, x] = b.split("|"); return h + ": " + x.split(";").join(", ") + "."; }
  if (t === "c") { const [L, R] = b.split("||").map((side) => { const [h, x] = side.split("|"); return { h, items: x.split(";") }; }); return L.h + ": " + L.items.join(", ") + ". Versus " + R.h + ": " + R.items.join(", ") + "."; }
  if (t === "r") return "Lock it in. " + b.replace(/→/g, ", then ").replace(/\+/g, " plus ");
  return b;
}
// Make symbols and abbreviations read naturally
function speakable(x) {
  return x
    .replace(/…/g, ", ").replace(/≈\s?/g, "about ").replace(/\s?→\s?/g, ", leading to ").replace(/↔/g, " and ")
    .replace(/✓/g, "").replace(/✗/g, "not ").replace(/↓/g, " down").replace(/⅓/g, "one third").replace(/°C?/g, " degrees")
    .replace(/×/g, " times ").replace(/(\d)\s?x\b/g, "$1 times").replace(/\s=\s/g, " equals ").replace(/<\s?/g, "less than ")
    .replace(/\bvs\.?\b/gi, "versus").replace(/\be\.g\.\s?/gi, "for example, ").replace(/\bi\.e\.\s?/gi, "that is, ")
    .replace(/\bVO2\s?max\b/gi, "V O 2 max").replace(/\b1RM\b/g, "one rep max").replace(/\bHIIT\b/g, "hit")
    .replace(/\bATP-PC\b/g, "A T P, P C").replace(/\bATP\b/g, "A T P").replace(/\bSES\b/g, "S E S").replace(/\bPBS\b/g, "P B S")
    .replace(/\bGPs\b/g, "G Ps").replace(/\bGP\b/g, "G P").replace(/\bSDGs\b/g, "S D Gs").replace(/\bSDG\b/g, "S D G")
    .replace(/\bNGOs\b/g, "N G Os").replace(/\bNGO\b/g, "N G O").replace(/\bAIHW\b/g, "A I H W").replace(/\bOECD\b/g, "O E C D")
    .replace(/\bHSC\b/g, "H S C").replace(/\bHMS\b/g, "H M S").replace(/\bAI\b/g, "A I").replace(/\bCVD\b/g, "C V D")
    .replace(/\bWADA\b/g, "wada").replace(/\bDALYs?\b/g, "dally").replace(/\bHR\b/g, "heart rate").replace(/\bRPE\b/g, "R P E")
    .replace(/\bkm\b/g, "kilometres").replace(/\bkg\b/g, "kilograms").replace(/\bmin\b/g, "minutes").replace(/\s+/g, " ").trim();
}

const outDir = path.join(root, "audio"); fs.mkdirSync(outDir, { recursive: true });
const tmp = path.join(root, "build", "rec.aiff");
const manifestPath = path.join(root, "src", "audio-manifest.js");
let manifest = {};
if (only && fs.existsSync(manifestPath)) { try { manifest = eval(fs.readFileSync(manifestPath, "utf8").replace(/^const AUDIO = /, "(").replace(/;\s*$/, ")")).files || {}; } catch (e) {} }
let total = 0;
for (const id of ORDER) {
  if (only && id !== only) continue;
  manifest[id] = [];
  D[id].reel.forEach((beat, k) => {
    const text = speakable(say(beat)), file = `${id}-${k}.m4a`;
    execFileSync("say", ["-v", voice, "-r", rate, "-o", tmp, text]);
    execFileSync("afconvert", ["-f", "m4af", "-d", "aac", "-b", "48000", "-c", "1", tmp, path.join(outDir, file)]);
    const info = execFileSync("afinfo", [path.join(outDir, file)]).toString();
    const secs = parseFloat((info.match(/estimated duration: ([\d.]+)/) || [])[1] || "0");
    manifest[id].push([file, Math.round(secs * 1000)]);
    total += secs;
  });
  process.stdout.write(id + " ");
}
fs.writeFileSync(manifestPath, "const AUDIO = " + JSON.stringify({ voice, files: manifest }) + ";\n");
try { fs.unlinkSync(tmp); } catch (e) {}
console.log(`\nRecorded ${Object.values(manifest).flat().length} lines, ${Math.round(total)} s of audio with ${voice}`);
