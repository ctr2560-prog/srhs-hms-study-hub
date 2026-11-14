// Summary notes, how-it-works steps and syllabus connections. Batch 3: FA2 dot points 1–9.
const MAP_C = {
t1: {
  sn: [
    ["What screening is", ["Identifies conditions or risks that make exercise unsafe", "APSS = Australia's standard tool", "Stage 1 compulsory questionnaire; Stage 2 risk factors; Stage 3 medications and injuries"]],
    ["Why it matters", ["Safety: detects cardiac and injury risk", "'Yes' answer → medical clearance from a GP", "Individualised prescription and baseline data", "Duty of care and legal protection; builds trust"]],
    ["Professional screening", ["Resting HR and BP, body composition", "Movement screens; ECGs for higher-risk or elite athletes"]]
  ],
  how: [["APSS Stage 1", "Questions on heart, chest pain, dizziness, conditions"], ["Any 'yes'?", "Refer to GP for medical clearance"], ["Risk factors (Stage 2)", "Age, BP, cholesterol, activity, family history"], ["Professional checks", "BP, body composition, movement, ECG"], ["Safe program", "Intensity and progression set for the person"]],
  links: [["t3", "Screening is step 1 of the assessment-to-program cycle"], ["h4", "Screening detects CVD risk factors before exercise"], ["h5", "Keeps older adults safe as they stay active"]]
},
t2: {
  sn: [
    ["Why test", ["Strengths/weaknesses, baseline, program design, motivation, selection", "Tests must be valid, reliable and specific"]],
    ["Common tests", ["Aerobic: beep test, Yo-Yo, VO2 max", "Anaerobic: Wingate, repeated sprints; strength: 1RM", "Power, speed, agility, flexibility, body composition tests"]],
    ["Recreational", ["Simple, safe, low-cost field tests", "Show progress and build motivation and adherence", "Maximal tests can be unsafe or discouraging"]],
    ["Elite", ["Precise lab and sport-specific tests (lactate, DEXA, GPS)", "Guide periodisation, selection, injury risk, return to play", "Limits: cost, time, fatigue, may not predict games"]],
    ["Discussion", ["Testing works when matched to goals and used to change the program"]]
  ],
  how: [["Choose a valid test", "Matched to the person and sport"], ["Test safely", "Standard conditions, reliable method"], ["Interpret results", "Compare to baseline or norms"], ["Change the program", "Target the weakness"], ["Re-test", "Track progress and motivate"]],
  links: [["t3", "Test results drive program design"], ["t1", "Screening must come before maximal testing"], ["t16", "Technology improves testing precision"]]
},
t3: {
  sn: [
    ["The cycle", ["Screen → assess → analyse (needs analysis) → SMART goals → prescribe (FITT) → re-test", "A continuous loop"]],
    ["How assessment helps", ["Individualises programs within the same team", "Sets intensity (% of 1RM, HR zones)", "Movement screens prevent injury", "Motivation; re-testing evaluates the program"]],
    ["Example", ["Netball defender: strong aerobic, weak jump and balance", "→ plyometrics, lower-body strength, landing mechanics"]]
  ],
  how: [["Screen", "APSS and medical clearance"], ["Assess", "Fitness tests and movement screens"], ["Analyse", "Compare to the sport's demands"], ["Prescribe", "FITT and SMART goals"], ["Re-test", "Adjust the program"]],
  links: [["t1", "Starts with pre-exercise screening"], ["t2", "Uses fitness testing results"], ["t5", "Prescription applies the principles of training"]]
},
t4: {
  sn: [
    ["Anaerobic", ["Interval, HIIT, SIT, plyometrics, resistance", "For ATP-PC and anaerobic glycolysis", "Relevant: sprinting, netball, basketball, rugby league, tennis"]],
    ["Aerobic", ["Continuous, fartlek, aerobic interval, circuit", "Relevant: marathon, triathlon, swimming, AFL midfielders, soccer"]],
    ["Flexibility", ["Static (cool-down), dynamic (warm-up), ballistic (advanced only), PNF (biggest gains)"]],
    ["Strength", ["Free weights, machines, body weight, elastics", "Low reps = strength; 6–12 = hypertrophy; 15+ = endurance"]],
    ["Skill and tactics", ["Drills (closed skills), modified games, games for specific outcomes"]],
    ["Assessing relevance", ["Match energy systems, movements, fitness components, skills", "Also athlete level, season phase, injury history"]]
  ],
  how: [["Analyse the sport", "Energy systems, movements, skills"], ["Choose the training type", "Aerobic, anaerobic, flexibility, strength, skill"], ["Choose the method", "e.g. HIIT, fartlek, PNF, free weights"], ["Design the session", "Sets, reps, intensity, rest"], ["Judge relevance", "Highly vs less relevant for that sport"]],
  links: [["t5", "Methods must apply the principles of training"], ["t6", "Each method produces specific adaptations"], ["t8", "Method choice changes across the training year"]]
},
t5: {
  sn: [
    ["Progressive overload", ["Increase load gradually: aerobic ≈5–10%/week; strength +2–5% when reps met", "Too fast → overtraining and injury"]],
    ["Training thresholds", ["Aerobic ≈70–85% MHR; lactate threshold ≈85%", "Strength ≈60%+ of 1RM", "Vary by person, so testing is needed"]],
    ["Reversibility", ["Use it or lose it", "Aerobic gains lost faster than strength"]],
    ["Specificity", ["Match energy systems, muscles, movements, speeds", "Most important principle, but too much → overuse injury"]],
    ["Variety", ["Keeps motivation, reduces overuse", "Too much reduces specificity"]],
    ["Warm-up and cool-down", ["Warm-up: raises temperature and HR; FIFA 11+ cuts injuries ≈30–50%", "Cool-down: returns to rest; soreness effect less clear"]]
  ],
  how: [["Set the threshold", "Train in the right intensity zone"], ["Apply overload", "Gradually increase load"], ["Stay specific", "Match the sport's demands"], ["Add variety and recovery", "Avoid staleness and overtraining"], ["Keep training", "Avoid reversibility"]],
  links: [["t6", "Principles cause the physiological adaptations"], ["t4", "Principles are applied through training methods"], ["t3", "Testing sets thresholds and overload"]]
},
t6: {
  sn: [
    ["The chain", ["Principle → adaptation → performance", "Band 6 answers make all three links explicit"]],
    ["Heart", ["Resting and submaximal HR fall (trained <50 bpm vs ≈72)", "Stroke volume rises (bigger left ventricle)", "Max cardiac output (Q = SV × HR) increases"]],
    ["Oxygen", ["VO2 max up ≈10–20%+ (delivery + use)", "Lung capacity changes little; ventilation efficiency improves", "Total haemoglobin rises (especially altitude training)"]],
    ["Muscle", ["Hypertrophy from resistance training (6–12 reps, ≈67–85% 1RM)", "Fibre type mostly genetic; training makes fibres more aerobic or more powerful"]]
  ],
  how: [["Principle applied", "e.g. progressive overload in the aerobic zone"], ["Stimulus", "Repeated training stress over weeks"], ["Adaptation", "e.g. larger left ventricle → higher stroke volume"], ["Physiological change", "Lower HR, higher VO2 max"], ["Performance", "Sustain a faster pace for longer"]],
  links: [["t5", "The principles are the cause of the adaptations"], ["h4", "Aerobic fitness protects against cardiovascular disease"], ["t11", "Nutrition fuels training and supports adaptation"]]
},
t7: {
  sn: [
    ["Health and safety", ["Both: screening, safe environment, hydration, first aid", "Group: more players, collisions, space, supervision"]],
    ["Aim and warm-up", ["Individual: goals tailored to one athlete", "Group: team + positional goals; team warm-up builds cohesion"]],
    ["Skill and conditioning", ["Individual: one-on-one feedback, conditioning matched to testing", "Group: stations, game-based drills, position-based conditioning"]],
    ["Tactics and reflection", ["Individual: game plan for an opponent; journals and direct feedback", "Group: set plays, structures, communication; debriefs and GPS data"]]
  ],
  how: [["Set the aim", "Linked to the training program"], ["Warm up", "General then sport-specific"], ["Skill and conditioning", "Main body of the session"], ["Tactics", "Plans and set plays"], ["Cool down and reflect", "Evaluate and plan the next session"]],
  links: [["t8", "Sessions are the building blocks of the yearly program"], ["t10", "Sessions practise strategies and tactics"], ["t4", "Sessions use specific training methods"]]
},
t8: {
  sn: [
    ["Periodisation", ["Macrocycle (year), mesocycles (4–6 weeks), microcycles (week)", "Pre-season → in-season → off-season (transition)"]],
    ["Sub-phases", ["General preparation: high volume, low intensity", "Specific preparation: lower volume, higher intensity, sport-specific"]],
    ["Peaking and tapering", ["Taper: cut volume ≈40–60%, keep intensity, 1–3 weeks", "Individual: precise peaks for 1–2 events (double periodisation)", "Group: weekly games → mini-tapers, load management, peak for finals"]],
    ["Comparison", ["Same: periodisation, phases, principles, recovery", "Different: individual = precise peaks; group = long season, positions, squad load"]]
  ],
  how: [["Off-season", "Active rest and rehab"], ["General preparation", "Aerobic base and strength"], ["Specific preparation", "Sport-specific, higher intensity"], ["Competition", "Maintain, refine, recover"], ["Peak", "Taper for the key event or finals"]],
  links: [["t7", "Each week is built from individual sessions"], ["t5", "Phases apply overload, specificity and reversibility"], ["t15", "Recovery is planned into every phase"]]
},
t9: {
  sn: [
    ["Arousal", ["Inverted-U: best performance at optimal arousal", "Fine skills (putt, free throw) need lower arousal; gross skills (tackle, lift) higher"]],
    ["Stress and anxiety", ["Trait vs state anxiety", "Cognitive (worry) vs somatic (racing heart, tension)"]],
    ["Strategies", ["Relaxation: breathing, PMR, centering", "Mental rehearsal, cue words, process goals, positive self-talk", "Routines; psyching-up for under-arousal"]],
    ["Individual vs group", ["Individual: self-talk, routines, visualisation", "Group: cohesion, team talks, role clarity; arousal differs by position"]],
    ["Participation", ["Reduce anxiety, build enjoyment and self-efficacy → people keep playing"]]
  ],
  how: [["Event pressure", "Crowd, expectations, fear of failure"], ["Arousal shifts", "Too high or too low for the skill"], ["Choose a strategy", "Relaxation, self-talk, routine or psych-up"], ["Optimal arousal", "Top of the inverted-U"], ["Performance", "Consistent under pressure"]],
  links: [["t15", "Relaxation also aids recovery"], ["t10", "Composure helps apply tactics under pressure"], ["t12", "Poor sleep increases anxiety and fatigue"]]
}
};
