// Course structure, NESA key words, band descriptors, extended-response bank and game data
const FOCUS_AREAS = [
 {id:"fa1",n:1,name:"Health in an Australian and global context",short:"Health in Australia & the world",
  iqs:["How healthy are Australians?","How does Australia's healthcare system work towards achieving better health for all Australians?","How is the growing and changing use of technology and data impacting Australia's healthcare system?","What actions are needed to promote and improve the health of Australians?"],
  dots:["h1","h2","h3","h4","h5","h6","h7","h8","h9","h10","h11","h12","h13","h14","h15","h16","h17","h18"],
  outcomes:["HM-12-01 analyses the health status of Australians at a national and international level","HM-12-02 examines how technology and data can achieve better health for all Australians","HM-12-03 evaluates how the Sustainable Development Goals can be used to improve the health of a community"]},
 {id:"fa2",n:2,name:"Training for improved performance",short:"Training for improved performance",
  iqs:["How can exercise assessment and prescription be personalised?","How does training influence movement and performance?","How does training differ for individual and group sports?","What impact does sleep, nutrition and supplementation have on movement and performance?","How do individuals train for sustained movement and performance?"],
  dots:["t1","t2","t3","t4","t5","t6","t7","t8","t9","t10","t11","t12","t13","t14","t15","t16","t17","t18"],
  outcomes:["HM-12-04 investigates factors that impact movement and performance","HM-12-05 analyses individual and group training programs to improve performance"]}
];
const SKILL_OUTCOMES = ["HM-12-06 Analysis","HM-12-07 Communication","HM-12-08 Creative thinking","HM-12-09 Problem-solving","HM-12-10 Research"];

// NESA glossary of key words (tier: 1 = describe/recall, 2 = explain/relate, 3 = judge)
const VERBS = [
 {w:"Identify",d:"Recognise and name",tier:1,how:"Name it. One clear point per mark."},
 {w:"Outline",d:"Sketch in general terms; indicate the main features of",tier:1,how:"Main features, briefly. No deep explanation needed."},
 {w:"Describe",d:"Provide characteristics and features",tier:1,how:"What it is and what it looks like. Characteristics + features."},
 {w:"Explain",d:"Relate cause and effect; make the relationships between things evident; provide why and/or how",tier:2,how:"Use 'because', 'which leads to', 'as a result'. Every point needs a HOW or WHY."},
 {w:"Compare",d:"Show how things are similar or different",tier:2,how:"Similarities AND differences. Use 'whereas', 'similarly', 'in contrast'."},
 {w:"Contrast",d:"Show how things are different or opposite",tier:2,how:"Differences only, side by side."},
 {w:"Examine",d:"Inquire into",tier:2,how:"Look closely at the patterns and the reasons behind them. Go beyond describing."},
 {w:"Investigate",d:"Plan, inquire into and draw conclusions about",tier:2,how:"Explore several aspects, use evidence, finish with a conclusion."},
 {w:"Analyse",d:"Identify components and the relationship between them; draw out and relate implications",tier:2,how:"Break it into parts, show how the parts connect, then state the implications."},
 {w:"Discuss",d:"Identify issues and provide points for and/or against",tier:3,how:"Both sides, then a reasoned position."},
 {w:"Assess",d:"Make a judgement of value, quality, outcomes, results or size",tier:3,how:"State a judgement early, weigh evidence on both sides, return to the judgement at the end."},
 {w:"Evaluate",d:"Make a judgement based on criteria; determine the value of",tier:3,how:"Name your criteria, test against each, give an overall verdict."},
 {w:"Justify",d:"Support an argument or conclusion",tier:3,how:"Give your position and back it with evidence and mechanisms."},
 {w:"Critically analyse",d:"Add a degree or level of accuracy, depth, knowledge and understanding, logic, questioning, reflection and quality to analysis",tier:3,how:"Analyse, plus question assumptions and weigh the significance of each relationship."},
 {w:"Critically evaluate",d:"Add a degree or level of accuracy, depth, knowledge and understanding, logic, questioning, reflection and quality to evaluation",tier:3,how:"Evaluate, plus test the strength of the evidence and consider alternatives."},
 {w:"Propose",d:"Put forward (a point of view, idea, argument, suggestion) for consideration or action",tier:2,how:"Make a suggestion and explain why it would work."}
];

// Holistic band descriptors (simplified from NESA course performance descriptors for HMS)
const BANDS = [
 {b:6,min:90,d:"Extensive, accurate knowledge; critically analyses relationships and implications; sustained, logical, well-supported judgements; precise HMS terminology"},
 {b:5,min:80,d:"Thorough knowledge; analyses relationships with relevant examples; well-reasoned judgements; accurate terminology"},
 {b:4,min:70,d:"Sound knowledge; explains relationships with examples; some judgement; generally accurate terminology"},
 {b:3,min:60,d:"Basic knowledge; describes features with some explanation; limited judgement"},
 {b:2,min:50,d:"Elementary knowledge; identifies and describes some features"},
 {b:1,min:0,d:"Limited knowledge; identifies some features"}
];
function bandFor(mark,outOf){const p=outOf?mark/outOf*100:0;for(const b of BANDS){if(p>=b.min)return b.b}return 1}

// Section III style 12-mark questions
const ER_BANK = [
 {id:"er1",fa:"fa1",m:12,q:"To what extent has Australia's healthcare system been effective in providing equity of access for groups experiencing health inequities? In your answer, refer to Aboriginal and Torres Strait Islander peoples and ONE other group.",dots:["h2","h6","h9"]},
 {id:"er2",fa:"fa1",m:12,q:"Evaluate the impact of digital health, artificial intelligence and health data on the health of Australians and the sustainability of the healthcare system.",dots:["h13","h15","h16","h9"]},
 {id:"er3",fa:"fa1",m:12,q:"Analyse how the application of SDGs 3, 4, 10 and 11 could inform community action to improve the health status of a community you have studied.",dots:["h17","h18"]},
 {id:"er4",fa:"fa1",m:12,q:"Assess the challenges and opportunities that an ageing population presents for Australia's health, and the strategies needed to support healthy ageing.",dots:["h5","h9","h12"]},
 {id:"er5",fa:"fa2",m:12,q:"Analyse the relationship between the principles of training, physiological adaptations and improved performance for an aerobic AND a strength-based athlete.",dots:["t5","t6","t4"]},
 {id:"er6",fa:"fa2",m:12,q:"Compare the yearly training program AND training sessions of an athlete in an individual sport and an athlete in a group sport.",dots:["t7","t8"]},
 {id:"er7",fa:"fa2",m:12,q:"Evaluate the effectiveness of sleep, nutrition, hydration and supplementation in sustaining movement and improving performance.",dots:["t11","t12","t13"]},
 {id:"er8",fa:"fa2",m:12,q:"Justify how an elite athlete's support team should prevent, manage and recover from a sporting injury, with reference to drug use and return-to-play procedures.",dots:["t17","t18","t15"]}
];
const ER_GUIDE = [["10–12","Provides a sustained, logical and cohesive response; demonstrates extensive, accurate knowledge and understanding; critically applies the key word with clear judgements/relationships; integrates relevant, specific examples and data; uses precise HMS terminology"],["7–9","Provides a logical and cohesive response; demonstrates thorough knowledge and understanding; applies the key word with relationships/judgements; uses relevant examples; uses appropriate terminology"],["4–6","Demonstrates sound knowledge; describes and partly explains relevant features; some examples; limited relationships or judgement"],["1–3","Provides some relevant information; identifies features; limited use of terminology"]];

// ---- Game data ----
const SORT_SETS = [
 {id:"train",name:"Training methods",bins:["Aerobic","Anaerobic","Flexibility","Strength","Skill"],items:[["Continuous running 30 min","Aerobic"],["Fartlek","Aerobic"],["4 × 4 min intervals","Aerobic"],["Circuit training","Aerobic"],["HIIT 30s on/30s off","Anaerobic"],["Sprint interval training","Anaerobic"],["Depth jumps","Anaerobic"],["6 × 200 m with full rest","Anaerobic"],["PNF stretching","Flexibility"],["Leg swings","Flexibility"],["Ballistic bouncing","Flexibility"],["Holding a hamstring stretch 30 s","Flexibility"],["Barbell back squat","Strength"],["Leg press machine","Strength"],["Push-ups and chin-ups","Strength"],["Elastic band rows","Strength"],["Passing drill in pairs","Skill"],["3v2 overlap game","Skill"],["Modified 4v4 game","Skill"]]},
 {id:"injury",name:"Injury classification",bins:["Soft tissue","Hard tissue","Overuse"],items:[["Ankle ligament sprain","Soft tissue"],["Hamstring strain","Soft tissue"],["Corked thigh (contusion)","Soft tissue"],["Grazed knee","Soft tissue"],["ACL rupture","Soft tissue"],["Broken collarbone","Hard tissue"],["Dislocated shoulder","Hard tissue"],["Chipped tooth","Hard tissue"],["Fractured wrist","Hard tissue"],["Shin splints","Overuse"],["Stress fracture in a runner","Overuse"],["Tennis elbow (tendinopathy)","Overuse"],["Swimmer's shoulder","Overuse"]]},
 {id:"gov",name:"Who's responsible?",bins:["Federal","State","Local","NGO"],items:[["Medicare","Federal"],["PBS medicines","Federal"],["TGA regulation","Federal"],["Aged care funding","Federal"],["Running public hospitals","State"],["Ambulance services","State"],["School dental programs","State"],["Food premises inspections","Local"],["Parks and bike paths","Local"],["Waste collection","Local"],["Cancer Council","NGO"],["Heart Foundation","NGO"],["Royal Flying Doctor Service","NGO"],["Beyond Blue","NGO"]]},
 {id:"sdg",name:"Match the SDG",bins:["SDG 3","SDG 4","SDG 10","SDG 11"],items:[["Universal health coverage","SDG 3"],["Halve road traffic deaths","SDG 3"],["Cut NCD deaths by one-third","SDG 3"],["Free primary & secondary schooling","SDG 4"],["Early childhood development","SDG 4"],["Lifelong learning","SDG 4"],["Income growth for the bottom 40%","SDG 10"],["End discriminatory laws","SDG 10"],["Inclusion regardless of race or disability","SDG 10"],["Accessible public transport","SDG 11"],["Green public spaces","SDG 11"],["Reduce urban air pollution","SDG 11"]]},
 {id:"arousal",name:"Optimal arousal",bins:["Lower arousal","Higher arousal"],items:[["Golf putt","Lower arousal"],["Archery","Lower arousal"],["Basketball free throw","Lower arousal"],["Pistol shooting","Lower arousal"],["Goal kick conversion","Lower arousal"],["Rugby tackle","Higher arousal"],["Weightlifting clean","Higher arousal"],["Sprint start","Higher arousal"],["Shot put","Higher arousal"],["Scrum engagement","Higher arousal"]]}
];
const SEQ_SETS = [
 {id:"totaps",name:"TOTAPS",steps:["Talk","Observe","Touch","Active movement","Passive movement","Skill test"]},
 {id:"cycle",name:"Assessment → program cycle",steps:["Pre-exercise screening","Fitness assessment","Needs analysis","Set SMART goals","Prescribe (FITT)","Monitor & re-test"]},
 {id:"year",name:"Training year",steps:["Off-season (transition)","Pre-season: general preparation","Pre-season: specific preparation","In-season: competition","Taper & peak for finals"]},
 {id:"rehab",name:"Injury pathway",steps:["Classify the injury","Assess with TOTAPS","Manage with RICER","Progressive mobilisation","Graduated exercise & skills","Return-to-play clearance"]},
 {id:"chain",name:"Training → performance chain",steps:["Apply progressive overload in the aerobic zone","Left ventricle enlarges","Stroke volume increases","Resting & submaximal heart rate fall","Athlete sustains race pace for longer"]},
 {id:"comm",name:"SDG community action",steps:["Identify community health issues with data","Map issues to SDGs 3, 4, 10, 11","Learn from other communities","Co-design & advocate for strategies","Evaluate against criteria"]}
];
