// Summary notes, how-it-works steps and syllabus connections. Batch 4: FA2 dot points 10–18.
const MAP_D = {
t10: {
  sn: [
    ["Strategy vs tactics", ["Strategy = overall plan before the game", "Tactics = actions and adjustments during the game"]],
    ["Influencing factors", ["Opponent; own ability, fitness, injuries", "Conditions: weather, surface, heat, altitude", "Game situation: score, time, players on field", "Rules, officials, match importance, coach philosophy, data"]],
    ["Individual sports", ["Athlete decides in real time; limited coaching", "Personal strengths vs opponent weaknesses; pacing"]],
    ["Group sports", ["Communication, roles, set plays, coordination", "Coach has more influence (interchanges, time-outs)"]],
    ["Discussion", ["Plan thoroughly, adapt intelligently", "Too rigid fails; too loose lacks structure"]]
  ],
  how: [["Scout", "Opponent, conditions, own strengths"], ["Plan the strategy", "Overall approach before the game"], ["Read the game", "Score, time, fatigue, changes"], ["Adjust tactics", "Specific actions during play"], ["Review", "What worked; plan next time"]],
  links: [["t7", "Sessions are used to practise tactics"], ["t9", "Arousal control helps decision-making under pressure"], ["t16", "Video and data inform strategy"]]
},
t11: {
  sn: [
    ["Daily requirements", ["Carbohydrate scales with load: 3–5 (light) to 8–12 g/kg (extreme)", "Protein 1.2–2.0 g/kg, ≈0.3 g/kg every 3–4 h", "Fats ≈20–35% of energy; iron, calcium, vitamin D", "Sources: AIS, Sports Dietitians Australia"]],
    ["Comparing sports", ["Endurance: very high carbs; carb load 10–12 g/kg for 36–48 h", "Strength/power: moderate carbs, protein timing, maybe creatine", "Team: high carbs, recovery between games", "Weight-category: risk of low energy availability (RED-S)"]],
    ["Pre, during, post", ["Pre (1–4 h): high carb, moderate protein, low fat and fibre", "During: <1 h water; 1–2.5 h 30–60 g carb/h; >2.5 h up to 90 g/h", "Post: Refuel, Repair (20–40 g protein), Rehydrate"]],
    ["Fluids", ["2% body mass loss impairs performance", "Monitor: weigh-ins, urine colour", "Replace 125–150% of loss; avoid overdrinking"]]
  ],
  how: [["Sport demands", "Duration, intensity, energy system"], ["Daily fuel", "Carbs, protein, fats matched to load"], ["Before", "Top up glycogen, easy to digest"], ["During", "Carbs and fluid for longer events"], ["After", "Refuel, repair, rehydrate"]],
  links: [["t12", "Nutrition and hydration reduce fatigue and injury"], ["t13", "Food first before supplements"], ["h4", "Diet is a key risk factor for chronic disease"]]
},
t12: {
  sn: [
    ["Sleep", ["Teens 8–10 h; athletes often need more", "Growth hormone, tissue repair, skill memory, immunity", "<8 h in teens → higher injury rates", "Routines: regular times, screens off, cool dark room; monitor with diaries or wearables"]],
    ["Nutrition", ["Low glycogen → fatigue → poor technique → injury", "Protein repairs; calcium/vitamin D protect bone; iron prevents anaemia", "Periodise intake; plan meals; dietitian checks"]],
    ["Hydration", ["Dehydration ↑ HR and core temperature, ↓ concentration", "Keep loss under 2%; urine colour; weigh-ins; electrolytes in heat"]],
    ["Together", ["The three interact (poor sleep → poor food choices)", "Plans + monitoring catch problems before injury"]]
  ],
  how: [["Training load", "Fatigue, glycogen loss, sweat loss"], ["Sleep", "Repair and recovery overnight"], ["Nutrition", "Refuel and repair tissue"], ["Hydration", "Restore blood volume and cooling"], ["Outcome", "Less fatigue, better movement, fewer injuries"]],
  links: [["t11", "Detailed nutrition and fluid guidelines"], ["t15", "Sleep is a key recovery strategy"], ["t17", "Fatigue is a major injury risk factor"]]
},
t13: {
  sn: [
    ["Food first", ["AIS framework ranks by evidence: A strong, B emerging, C little, D banned/high risk", "Most needs met by a planned diet"]],
    ["Vitamins and minerals", ["Only help with a diagnosed deficiency (iron, vitamin D, calcium)", "Excess doesn't help and can harm"]],
    ["Protein", ["1.2–2.0 g/kg usually met by food", "20–40 g after training; powders = convenience"]],
    ["Caffeine", ["Group A: 3–6 mg/kg ≈60 min before", "↑ endurance, alertness; ↓ perceived effort", "Side effects: anxiety, gut upset, poor sleep"]],
    ["Creatine", ["Group A for repeated high-intensity and strength", "Load 20 g/day × 5 days, then 3–5 g/day", "Weight gain 1–2 kg; no endurance benefit"]],
    ["Risks and ethics", ["Contamination + strict liability; use batch-tested (HASTA)", "Cost, false claims; under-18s advised against"]]
  ],
  how: [["Diet first", "Meet needs with food"], ["Identify a specific need", "Deficiency or sport demand"], ["Check evidence", "AIS Group A–D"], ["Check safety", "Batch-tested, dose, side effects"], ["Use and monitor", "With a sports dietitian"]],
  links: [["t11", "Supplements only add to a sound diet"], ["t18", "Contamination risks and drug testing"], ["h11", "Critically evaluating supplement claims"]]
},
t14: {
  sn: [
    ["What biomechanics is", ["Study of forces on and produced by the body", "Efficient = maximum output, minimum energy and injury risk"]],
    ["Key principles", ["Motion; force and Newton's laws; impulse", "Balance: low centre of gravity, wide base", "Levers; summation of forces (large → small)", "Fluid mechanics: reduce drag, use lift"]],
    ["Developing efficiency", ["Video, motion capture, force plates, sensors", "Fix technique: reduce overstriding, improve streamline, sequence throws"]],
    ["Sustained movement and injury", ["Efficiency saves energy, delays fatigue", "Good landing and lifting mechanics prevent injury", "Guides equipment design (shoes, bike fit)"]]
  ],
  how: [["Film the movement", "Video or sensors"], ["Analyse", "Apply biomechanical principles"], ["Find inefficiency", "Wasted force, drag, poor sequencing"], ["Correct technique", "Coaching cues and drills"], ["Outcome", "Less energy, more power, fewer injuries"]],
  links: [["t16", "Technology such as video analysis measures movement"], ["t17", "Good mechanics prevent injury"], ["t6", "Efficient movement makes the most of adaptations"]]
},
t15: {
  sn: [
    ["Why recovery matters", ["Training causes fatigue, damage, glycogen loss, dehydration", "Adaptation happens during recovery (supercompensation)", "Poor recovery → overtraining, injury, illness"]],
    ["Cool-down", ["5–15 min light activity + stretching", "Prevents blood pooling, clears by-products, returns HR to rest", "Low cost, low risk; soreness evidence limited"]],
    ["Hydrotherapy", ["CWI 10–15 °C for 10–15 min: less inflammation and soreness", "Contrast therapy: hot/cold 'pumping'", "Avoid regular CWI right after strength sessions"]],
    ["Relaxation", ["Breathing, PMR, meditation, music, massage", "↓ cortisol and anxiety, ↑ sleep quality and motivation"]],
    ["Other", ["Sleep, the 3 Rs, compression, active recovery, HRV monitoring"]]
  ],
  how: [["Training stress", "Fatigue and muscle damage"], ["Choose recovery", "Physiological and psychological"], ["Body restores", "Inflammation falls, energy refills"], ["Adaptation", "Supercompensation"], ["Sustained performance", "Ready for the next session or game"]],
  links: [["t12", "Sleep, nutrition and hydration are recovery too"], ["t8", "Recovery is planned across the training year"], ["t9", "Relaxation also manages anxiety"]]
},
t16: {
  sn: [
    ["Training innovations", ["Altitude tents, virtual reality, anti-gravity treadmills", "Velocity-based training; smart trainers; blood flow restriction"]],
    ["Equipment advances", ["'Super shoes' ≈4% better running economy (now regulated)", "Polyurethane swimsuits banned in 2010", "Lighter bikes, better protective gear, prosthetics"]],
    ["Recording and monitoring", ["GPS load (NRL, AFL, A-League), HR and HRV", "Video analysis, force plates, sleep wearables", "Acute:chronic workload ratio reduces injury"]],
    ["Examining the impact", ["Benefits: precision, injury reduction, technique, recovery", "Issues: cost and access, 'technological doping', data overload, privacy"]]
  ],
  how: [["Collect data", "GPS, HR, video, force plates"], ["Analyse", "Load, technique, readiness"], ["Decide", "Adjust training or tactics"], ["Improve", "Better performance, fewer injuries"], ["Regulate", "Governing bodies keep it fair"]],
  links: [["t14", "Video and sensors drive biomechanical analysis"], ["t2", "Technology makes fitness testing more precise"], ["h13", "The same technology–health trade-offs in daily life"]]
},
t17: {
  sn: [
    ["Classifying injuries", ["Direct (external force) vs indirect (internal, no contact)", "Soft tissue (sprains, strains), hard tissue (fractures), overuse"]],
    ["Assessment: TOTAPS", ["Talk, Observe, Touch, Active, Passive, Skill test", "Stop at any stage if there is pain", "DRSABCD for serious incidents; HIA for concussion"]],
    ["Management", ["RICER for 48–72 h; ice 15–20 min every 2 h", "No HARM: Heat, Alcohol, Running, Massage", "Hard tissue: immobilise and refer"]],
    ["Rehabilitation", ["Progressive mobilisation → graduated exercise → sport-specific", "Cross-train to keep fitness; cold early, heat later"]],
    ["Return to play", ["Full range, ≈90%+ strength, skill tests, confidence, clearance", "Concussion: ≥21 days for community contact sport", "'If in doubt, sit them out'; shared responsibility"]]
  ],
  how: [["Injury occurs", "Classify it"], ["Assess", "TOTAPS (stop if pain)"], ["Manage", "RICER, No HARM, 48–72 h"], ["Rehabilitate", "Mobility → strength → sport skills"], ["Return to play", "Criteria met and cleared"]],
  links: [["t18", "Drugs used in injury management"], ["t15", "Recovery strategies support rehabilitation"], ["t14", "Good technique prevents injury"]]
},
t18: {
  sn: [
    ["Injury management drugs", ["Analgesics, NSAIDs, corticosteroids (TUE), local anaesthetics", "Masking pain can worsen injuries; NSAIDs may slow healing; opioid dependence"]],
    ["Performance-enhancing drugs", ["Steroids: muscle and recovery; heart, liver, hormone damage", "EPO and blood doping: clots, stroke", "Stimulants, peptide hormones, diuretics, beta-blockers"]],
    ["Ethics", ["Fairness and the spirit of sport; health risks", "Role modelling; coercion (Essendon 2012); trust", "Grey areas: altitude tents, TUEs"]],
    ["Drug testing", ["WADA Prohibited List; Sport Integrity Australia", "In and out of competition; whereabouts", "Athlete Biological Passport; strict liability; 4-year bans"]],
    ["Discussion", ["Proper medical use helps recovery; misuse risks harm", "Testing deters but can't catch everything; education matters"]]
  ],
  how: [["Pressure to perform", "Injury, selection, money"], ["Drug choice", "Medical treatment or doping"], ["Health impact", "Recovery or long-term harm"], ["Detection", "Testing and the biological passport"], ["Consequence", "Bans, reputation, health"]],
  links: [["t17", "Drugs in the injury management process"], ["t13", "Supplements can be contaminated with banned drugs"], ["t16", "Where technology ends and 'doping' begins"]]
}
};
