// Atomi-style 1-minute explainers. Each scene = a visual (v) + narration segments (say).
// A segment is a string (reveals the next element) or [text, n] (reveals n elements; 0 = none).
// Visuals: title{kicker,title,sub} · list{title,items:[[icon,text,detail?]]} · bars{title,unit,max,items:[[label,value,tone]]}
// stat{n,label,note} · flow{title,steps:[[icon,label,detail]]} · eq{title,parts:[[sym,label]],ops} · split{title,L,R:{h,icon,items}}
// recap{title,items:[[label,detail]],tip}
const EXPLAIN = {
h1: [
  { v: "title", kicker: "Focus Area 1 · Dot point 1", title: "How healthy are Australians?", sub: "Analysing health status data",
    say: [["How healthy are Australians, really? Let's see what the data shows, and how to analyse it like a Band 6 student.", 2]] },
  { v: "list", title: "How we measure health status", items: [["clock", "Life expectancy", "How long we live"], ["cross", "Mortality", "The rate of death"], ["pulse", "Morbidity", "The rate of illness"], ["scale", "Burden of disease", "DALYs: healthy years lost"]],
    say: [["We measure health status four ways.", 0], "Life expectancy: how long we live.", "Mortality: the rate of death.", "Morbidity: the rate of illness.", "And burden of disease, in DALYs, which combines the two."] },
  { v: "bars", title: "Life expectancy at birth", unit: " yrs", max: 90, items: [["Males", 81, "a"], ["Females", 85, "b"]],
    say: [["The headline is good news.", 0], "Males born today can expect to live about 81 years,", "and females about 85. Among the best in the world."] },
  { v: "list", title: "Leading causes of death", items: [["heart", "Coronary heart disease"], ["brain", "Dementia"], ["bolt", "Stroke"], ["lungs", "Lung cancer"], ["lungs", "COPD"]],
    say: [["The catch? We now mostly die from chronic disease.", 0], ["Coronary heart disease and dementia lead the list,", 2], ["followed by stroke, lung cancer and COPD.", 3]] },
  { v: "stat", n: "38%", label: "of Australia's burden of disease is preventable", note: "Linked to tobacco, obesity, poor diet, alcohol and inactivity",
    say: ["Remember this one: about 38 percent of our burden of disease is preventable,", "linked to risk factors we can change, like smoking, obesity and inactivity."] },
  { v: "flow", title: "Why do people take risks?", steps: [["users", "Social determinants", "Income, peers, marketing, place"], ["alert", "Risky behaviours", "Smoking, poor diet, alcohol"], ["heart", "Chronic disease", "Illness and early death"]],
    say: [["So why take those risks? It isn't just bad choices.", 0], "Social determinants, like income, peers, marketing and where you live,", "shape risky behaviours,", "which lead to chronic disease."] },
  { v: "list", title: "Averages hide the gaps", items: [["users", "First Nations peoples", "≈8-year life expectancy gap"], ["dollar", "Low socioeconomic groups"], ["pin", "Rural and remote areas"], ["user", "People with disability"]],
    say: [["But averages hide inequities: gaps that are unfair and avoidable.", 0], ["They're largest for First Nations peoples and low socioeconomic groups,", 2], ["rural and remote communities, and people with disability.", 2]] },
  { v: "recap", title: "Analyse like a marker", items: [["Trend", "What the data shows"], ["Cause", "The determinant or risk factor"], ["Implication", "Who is affected and what it means"]], tip: "Don't list statistics. Link each one to a cause and an implication.",
    say: [["In the exam, analyse means showing relationships.", 0], "Identify the trend,", "explain its cause,", "and give the implication.", "Don't list statistics. Link them."] }
],
t6: [
  { v: "title", kicker: "Focus Area 2 · Dot point 6", title: "Why does training work?", sub: "Principles → adaptations → performance",
    say: [["Why does training make you fitter and faster? It's a chain of three links, and Band 6 answers connect all three.", 2]] },
  { v: "flow", title: "The chain", steps: [["target", "Principle of training", "e.g. progressive overload"], ["heart", "Physiological adaptation", "e.g. bigger stroke volume"], ["trend", "Improved performance", "e.g. faster 10 km time"]],
    say: [["Here's the chain.", 0], "A principle of training, like progressive overload,", "causes a physiological adaptation,", "and that adaptation is why performance improves."] },
  { v: "eq", title: "Inside the heart", parts: [["Q", "Cardiac output", "Blood pumped per minute"], ["SV", "Stroke volume", "Blood pumped per beat"], ["HR", "Heart rate", "Beats per minute"]], ops: ["=", "×"],
    say: ["Start with the heart. Cardiac output is the blood pumped each minute.", "It equals stroke volume, the blood per beat,", "times heart rate."] },
  { v: "bars", title: "Resting heart rate", unit: " bpm", max: 80, items: [["Untrained", 72, "a"], ["Trained athlete", 48, "b"]],
    say: [["Aerobic training enlarges the left ventricle, so stroke volume goes up.", 0], "Untrained, resting heart rate is about 72 beats per minute.", "A trained athlete can drop below 50, because each beat pumps more blood."] },
  { v: "list", title: "More oxygen to the muscles", items: [["lungs", "VO2 max rises", "≈10–20% with aerobic training"], ["drop", "More haemoglobin", "Especially after altitude training"], ["pulse", "More capillaries and mitochondria", "Muscles use more oxygen"]],
    say: [["More blood means more oxygen.", 0], "VO2 max rises by around 10 to 20 percent,", "haemoglobin increases, especially with altitude training,", "and muscles grow capillaries and mitochondria to use that oxygen."] },
  { v: "split", title: "Muscles adapt specifically", L: { h: "Resistance training", icon: "weight", items: ["Hypertrophy: bigger fibres", "Mainly fast-twitch", "More strength and power"] }, R: { h: "Aerobic training", icon: "run", items: ["Fibres become more aerobic", "More fatigue resistant", "Fibre type is mostly genetic"] },
    say: [["Muscles adapt too, specific to the training.", 0], "Resistance training at 6 to 12 reps causes hypertrophy: more strength and power.", "Aerobic training makes fibres more fatigue resistant, though fibre type is mostly genetic."] },
  { v: "recap", title: "Write the full chain", items: [["Principle", "What was applied"], ["Adaptation", "What changed in the body"], ["Performance", "Why the athlete is better"]], tip: "Overload → bigger stroke volume → holds a faster pace for longer.",
    say: [["So in your answer, write the full chain.", 0], "Name the principle,", "explain the adaptation,", "and link it to performance.", "Miss a link, and you miss the band."] }
]
};
