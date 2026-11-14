// Summary notes, how-it-works steps and syllabus connections. Batch 2: FA1 dot points 10–18.
const MAP_B = {
h10: {
  sn: [
    ["What it is", ["Practices and products outside mainstream medicine, used alongside it", "Used instead of medicine = 'alternative'", "≈2 in 3 Australians use some form"]],
    ["Products and services", ["Products: vitamins, herbs, fish oil, probiotics", "Services: chiropractic, acupuncture, naturopathy, massage, yoga", "AUST L: safety and quality only; AUST R: evaluated for effectiveness"]],
    ["Why people use it", ["Prevention and wellbeing", "Treating chronic issues (pain, anxiety)", "Supplementing treatment (e.g. massage during chemotherapy)", "Holistic care, longer consults, culture, control"]],
    ["Benefits and risks", ["Some have good evidence (massage for back pain, meditation for stress)", "Risks: weak evidence, drug interactions, delayed treatment, cost", "Natural therapies removed from PHI rebates (2019)"]]
  ],
  how: [["Health need", "Chronic pain, stress or wanting prevention"], ["Choose a product or service", "e.g. massage, fish oil, acupuncture"], ["Check the evidence", "AUST L vs AUST R, research, practitioner"], ["Use alongside medicine", "Tell your doctor to avoid interactions"], ["Outcome", "Benefit if evidence-based; risk if it replaces treatment"]],
  links: [["h11", "Critical health consumers judge complementary claims"], ["t13", "Supplements in sport raise the same evidence and contamination questions"], ["h9", "Out-of-pocket spending and PHI rebate decisions"]]
},
h11: {
  sn: [
    ["What it means", ["Can access, evaluate and act on health information, products and services", "Core part of health literacy; ≈60% of Australians have low health literacy"]],
    ["Why it matters", ["Misinformation spreads fast (detox teas, miracle supplements, vaccine myths)", "Risks: wasted money, harm, interactions, delayed treatment"]],
    ["Who to believe", ["Who: qualified source (AHPRA-registered)?", "What: evidence or testimonials?", "When: current? Why: inform or sell? Conflict of interest?", "Verify with healthdirect, AIHW, NHMRC, .gov.au"]],
    ["Rights and protections", ["Australian Charter of Healthcare Rights", "TGA, AHPRA, ACCC, Health Care Complaints Commission"]]
  ],
  how: [["See a claim", "Social media post, ad or product"], ["Check the source", "Qualifications and conflicts of interest"], ["Check the evidence", "Research vs testimonials, currency"], ["Verify", "Compare with reputable sources"], ["Decide", "Safe, informed choice"]],
  links: [["h10", "Applies directly to evaluating complementary products"], ["h13", "Online misinformation is a negative side of technology"], ["t13", "Athletes must critically evaluate supplement claims"]]
},
h12: {
  sn: [
    ["What to investigate", ["Current challenges + emerging changes", "Explain cause, response, then conclude"]],
    ["Current challenges", ["Rising demand: ageing and chronic disease", "Workforce shortages, especially rural; post-COVID burnout", "Declining bulk billing → delayed care, ED use", "ED waits, ramping, surgery backlogs, mental health demand"]],
    ["How the system responds", ["Medicare Urgent Care Clinics (free, no appointment)", "Tripled bulk billing incentives (2023), later expanded", "Pharmacist prescribing; nurse practitioners; rural incentives"]],
    ["Emerging changes", ["Telehealth, e-prescriptions, virtual hospitals", "AI imaging and scribes; genomics", "Climate change; Australian Centre for Disease Control"]],
    ["Conclusion", ["Challenges are linked (workforce + ageing + cost)", "Responses help but take time; risk of digital divide"]]
  ],
  how: [["Pressure", "Ageing, chronic disease, workforce gaps"], ["Symptoms", "Long waits, gap fees, ED crowding"], ["Response", "Urgent Care Clinics, incentives, new roles"], ["Emerging change", "Digital health, AI, genomics"], ["Judgement", "Adapting, but long-term workforce is key"]],
  links: [["h5", "Ageing is a main driver of demand"], ["h14", "New technologies are among the emerging changes"], ["h6", "Challenges reduce the system's effectiveness and equity"]]
},
h13: {
  sn: [
    ["The relationship", ["Two-way and mixed: improves and harms health", "Discuss = weigh both, then a position"]],
    ["Improves health", ["Diagnosis and treatment: MRI, robotic surgery, cochlear implant", "Access: telehealth, eheadspace", "Self-management: CGMs, fitness apps; health promotion online"]],
    ["Harms health", ["Screen time → sedentary behaviour (<1 in 10 young people active enough)", "Late-night devices → poor sleep → mood, concentration", "Social media: cyberbullying, body image; under-16 minimum age", "Misinformation; rising costs"]],
    ["Who misses out", ["Digital divide: older, low-income, remote, some First Nations communities", "Can widen inequity"]],
    ["Judgement", ["Neither simply good nor bad", "Depends on access, use and regulation"]]
  ],
  how: [["Technology use", "Devices, apps, social media, medical tech"], ["Positive path", "Better diagnosis, access, self-management"], ["Negative path", "Inactivity, poor sleep, misinformation"], ["Moderators", "Access, digital literacy, regulation"], ["Net effect", "Health improves when use is managed well"]],
  links: [["h15", "Digital health is the healthcare side of technology"], ["t16", "Technology improves sports performance too"], ["h11", "Misinformation online needs critical consumers"]]
},
h14: {
  sn: [
    ["What to investigate", ["New technologies (tools, devices, digital) + new treatments (therapies, drugs)", "How it works → difference it makes → conclusion"]],
    ["Five examples", ["Genomics: match drugs to a tumour's genes", "Immunotherapy/CAR-T: funded for some blood cancers since 2019", "Robotic surgery: smaller cuts, shorter stays", "Virtual hospitals: RPA Virtual Hospital", "CGMs: fully subsidised for type 1 diabetes since 2022"]],
    ["How the system changes", ["Hospital → home", "One-size-fits-all → personalised", "Late treatment → early detection", "New value decisions: PBAC and MSAC"]],
    ["Who misses out", ["Cost, equity (city hospitals), digital divide", "Ethics: genetic privacy; TGA approval; workforce training"]],
    ["Conclusion", ["Improves outcomes and efficiency", "Cost and equity decide who benefits"]]
  ],
  how: [["New technology", "Developed and tested"], ["Approved", "TGA checks safety and effectiveness"], ["Funded?", "PBAC/MSAC assess value for subsidy"], ["Adopted", "Hospitals and clinics start using it"], ["Impact", "Better outcomes, but unequal access"]],
  links: [["h12", "New technology is an emerging change for the system"], ["h16", "AI is one of the fastest-growing new technologies"], ["h9", "Expensive treatments add to health spending"]]
},
h15: {
  sn: [
    ["What it is", ["Digital technologies to improve health and care delivery", "Led by the Australian Digital Health Agency"]],
    ["Services", ["My Health Record (opt-out since 2019)", "Telehealth (permanent since 2022), e-prescriptions", "healthdirect, Medicare app, remote monitoring, apps and wearables"]],
    ["How connected?", ["Most GPs and pharmacies upload", "Gaps: specialists, private providers, interoperability", "'Sharing by default' reforms aim to fix this"]],
    ["Opportunities and challenges", ["Individuals: convenience, rural access, fewer repeat tests vs privacy and digital divide", "Organisations: efficiency, fewer errors vs cost, cyberattacks, training"]],
    ["Evaluation", ["Improved access and efficiency substantially", "Limited by incomplete connection and unequal access"]]
  ],
  how: [["Health information created", "Test, script or consultation"], ["Stored digitally", "My Health Record, e-prescription"], ["Shared", "Other providers can see it"], ["Used", "Fewer errors, faster, remote care"], ["Limits", "Gaps, privacy risk, digital divide"]],
  links: [["h16", "AI uses the health data that digital systems collect"], ["h8", "Shared records support coordinated, person-centred care"], ["h13", "Part of the wider technology–health relationship"]]
},
h16: {
  sn: [
    ["How AI is used", ["Imaging: X-rays, mammograms, skin lesions", "AI scribes summarise consultations", "Predictive analytics: deterioration, ED demand", "Drug discovery and population planning"]],
    ["Reducing spending", ["Earlier detection = cheaper treatment", "Less admin time; fewer unnecessary tests and admissions", "Better use of staff and beds"]],
    ["Curing and managing disease", ["Earlier, more accurate diagnosis", "Personalised treatment; remote monitoring of chronic disease", "Mental health chatbots (with limits)"]],
    ["Privacy and confidentiality", ["Privacy Act 1988; My Health Records Act 2012", "Consent, de-identification, cybersecurity, human oversight", "Risk of bias if data under-represents some groups"]]
  ],
  how: [["Health data collected", "Images, records, monitoring"], ["AI finds patterns", "Trained on large data sets"], ["Supports clinicians", "Flags risks, reads images"], ["Better outcomes", "Earlier diagnosis, lower cost"], ["Safeguards", "Consent, privacy law, oversight"]],
  links: [["h15", "Digital health systems provide the data AI uses"], ["h14", "AI is a key new technology in the system"], ["t16", "Data and monitoring also drive sports performance"]]
},
h17: {
  sn: [
    ["Key features", ["Adopted 2015 by all 193 UN members; 17 goals, 169 targets, by 2030", "Universal, integrated and indivisible", "'Leave no one behind'; social, economic, environmental"]],
    ["SDG 3: Good Health", ["Cut NCD deaths by one-third; mental health", "Halve road deaths; universal health coverage; reduce tobacco"]],
    ["SDG 4: Quality Education", ["Free primary and secondary education; early childhood", "Education → health literacy, income, fewer risky behaviours"]],
    ["SDG 10: Reduced Inequalities", ["Income growth for the bottom 40%", "Inclusion regardless of age, sex, disability, race; end discrimination"]],
    ["SDG 11: Sustainable Cities", ["Affordable housing, public transport, green space", "Less air pollution; disaster resilience"]]
  ],
  how: [["SDG 4 Education", "Improves health literacy and income"], ["SDG 10 Equality", "Reduces gaps between groups"], ["SDG 11 Cities", "Active, safe, healthy environments"], ["SDG 3 Health", "Better health and wellbeing for all"], ["Integrated", "Progress on one goal supports the others"]],
  links: [["h18", "Applying these SDGs to a real community"], ["h2", "SDG 10 targets the inequities in health status"], ["h1", "SDG 3 targets match Australia's chronic disease burden"]]
},
h18: {
  sn: [
    ["Other communities", ["Melbourne/Copenhagen: cycling, 20-minute neighbourhoods (SDG 11 + 3)", "Clontarf and Stars Foundations: school engagement (SDG 4 + 3)", "Finland's North Karelia: heart disease deaths down 80%+ (SDG 3)"]],
    ["Your community", ["Use data: LHD reports, PHN needs assessments", "Western Sydney: obesity, diabetes, heat, car dependence, GP access", "Map each issue to an SDG"]],
    ["Strategies and advocacy", ["Advocacy: petitions, council, youth councils, social media, NGOs", "Action: shared paths, shade, free exercise, school health units, gardens"]],
    ["Evaluating effectiveness", ["Criteria: evidence-based, targets determinants, equitable, sustainable, co-designed, measurable", "Measure before and after; set time-bound targets"]]
  ],
  how: [["Identify issues", "Use local health data"], ["Map to SDGs", "3 health, 4 education, 10 equity, 11 environment"], ["Learn from others", "What worked elsewhere"], ["Co-design and advocate", "Community-led strategies"], ["Evaluate", "Criteria and before/after data"]],
  links: [["h17", "Uses the key features of the SDGs"], ["h2", "Equity focus for disadvantaged groups"], ["h4", "Targets local chronic disease such as diabetes"]]
}
};
