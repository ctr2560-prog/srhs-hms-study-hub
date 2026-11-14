// Summary notes (sn), how-it-works steps (how) and syllabus connections (links). Batch 1: FA1 dot points 1–9.
const MAP_A = {
h1: {
  sn: [
    ["Measuring health status", ["Epidemiology: patterns and causes of health and disease in populations", "Key measures: life expectancy, mortality, morbidity, infant mortality, burden of disease (DALYs)", "Analyse = identify the trend, explain why, state the implication"]],
    ["What the data shows", ["Life expectancy ≈81 (males), ≈85 (females); up 20+ years in a century", "Chronic disease now leads: CHD, dementia, stroke, lung cancer, COPD", "Dementia = leading cause of death for females; CHD for males"]],
    ["Morbidity", ["≈Half of Australians have a chronic condition; many have multimorbidity", "Biggest burden: cancer, musculoskeletal, CVD, mental health", "≈38% of burden is preventable (modifiable risk factors)"]],
    ["Sociological causes of risk", ["Shaped by SES, education, peers, family, media, culture, stress", "Explains why men die younger and why smoking/obesity cluster in low SES"]],
    ["Inequities", ["Unfair, avoidable differences in health", "Biggest gaps: First Nations, low SES, rural/remote, disability, some CALD groups", "Fix the determinants, not just treatment"]]
  ],
  how: [["Determinants", "Income, education, environment, culture shape behaviour"], ["Risk factors", "Smoking, obesity, inactivity, alcohol, high BP"], ["Chronic disease", "CVD, cancer, diabetes, dementia develop over years"], ["Health status data", "Shows up as mortality, morbidity and DALYs"], ["Implication", "Prevention and equity must be the priorities"]],
  links: [["h2", "Explains WHY some groups have worse health status"], ["h4", "Goes deeper into CVD, cancer and diabetes from the data"], ["h9", "Preventable burden links to how health money is spent"]]
},
h2: {
  sn: [
    ["First Nations: the data", ["Life expectancy gap ≈8–9 years", "Burden of disease ≈2.3× non-Indigenous Australians", "Main causes: mental health, CVD, cancer, kidney disease, diabetes", "Progress: lower infant mortality and smoking"]],
    ["Underlying causes", ["Colonisation, dispossession, racism, intergenerational trauma", "Lead to: low income, overcrowding, lower education, distance, racism in care", "Determinants interact (overcrowding → infection → heart/kidney damage)"]],
    ["Actions that work", ["Closing the Gap (2020): targets + 4 Priority Reforms", "ACCHOs: community-controlled, culturally safe care", "Principle: self-determination, designed WITH communities"]],
    ["Rural and remote", ["≈28% live outside major cities; death rates rise with remoteness", "Fewer doctors, long travel, dangerous work, stoicism", "Responses: RFDS, telehealth, rural workforce incentives"]],
    ["Low SES", ["More chronic disease, smoking, obesity; live several years less", "Income/education shape health literacy, diet, housing, access", "Responses: bulk billing incentives, PBS safety net, community health"]]
  ],
  how: [["Historical causes", "Colonisation, dispossession, Stolen Generations"], ["Socioeconomic disadvantage", "Lower income, employment, education"], ["Environmental barriers", "Overcrowding, remoteness, few services"], ["Risk + late care", "More risk factors, distrust delays care"], ["Health gap", "Higher burden of disease, lower life expectancy"]],
  links: [["h1", "Uses the same health status measures to show the gap"], ["h6", "Equity of access is judged by how well the system serves these groups"], ["h8", "ACCHOs are a key example of person-centred collaboration"]]
},
h3: {
  sn: [
    ["Where Australia ranks", ["OECD = 38 mostly high-income countries", "Top 10 for life expectancy (≈83 vs OECD ≈81)", "Strong: heart disease deaths, cancer survival, low smoking", "Weak: obesity, alcohol, First Nations gap"]],
    ["Why we rank well (and poorly)", ["Strengths: Medicare, PBS, tobacco control, vaccination, safety laws", "Weaknesses: car-based lifestyles, energy-dense diets, alcohol culture, inequity"]],
    ["Others higher or lower", ["Japan higher: healthy diet, very low obesity, strong community", "USA lower despite spending most: no universal coverage, obesity, inequity", "More money ≠ better health: how it's spent matters"]],
    ["Lessons for Australia", ["Japan: healthy ageing, food culture", "Nordic: prevention, primary care, less inequality", "UK/Mexico: sugar taxes change diets"]]
  ],
  how: [["Health system", "Universal coverage and primary care"], ["Lifestyle and diet", "Obesity, activity, alcohol, smoking"], ["Policy", "Tobacco control, taxes, safety laws"], ["Equity", "Size of the gap between groups"], ["Ranking", "Life expectancy and disease rates vs OECD"]],
  links: [["h1", "Australia's health status data is the starting point for the comparison"], ["h9", "Spending levels vs outcomes (USA vs Australia)"], ["h6", "Universal coverage is a key reason for Australia's ranking"]]
},
h4: {
  sn: [
    ["Cardiovascular disease", ["CHD, stroke, heart failure; ≈1 in 4 deaths", "Death rate down 80%+ since 1968: less smoking, statins, stents, emergency care", "Higher in males, older, First Nations, low SES, remote"]],
    ["CVD risk and protective factors", ["Modifiable: smoking, BP, cholesterol, inactivity, obesity, diet, alcohol", "Non-modifiable: age, sex, family history", "Protective: activity, healthy diet, not smoking, Heart Health Checks"]],
    ["Cancer", ["Largest burden of disease; ≈1 in 2 diagnosed by 85", "Lung cancer causes most cancer deaths; 5-year survival ≈70%", "Screening: bowel, breast, cervical, lung (2025)"]],
    ["Diabetes (third condition)", ["≈1.3 million; 85–90% type 2; prevalence doubled since late 1980s", "Linked to obesity, inactivity, ageing", "3–4× higher in First Nations adults"]],
    ["Prevalence vs incidence", ["Prevalence = all current cases; incidence = new cases", "Better survival → prevalence rises even if incidence is steady"]]
  ],
  how: [["Risk factors", "Smoking, high BP, obesity, inactivity"], ["Disease develops", "Damage to blood vessels and organs over years"], ["Detection", "Screening and health checks catch it early"], ["Treatment", "Medicines, surgery, emergency care"], ["Trend", "Fewer deaths, but more people living with it"]],
  links: [["t6", "Aerobic training adaptations (lower BP, stronger heart) protect against CVD"], ["t11", "Diet is a key modifiable risk factor for CVD, cancer and diabetes"], ["h1", "These conditions are the leading causes in the health status data"]]
},
h5: {
  sn: [
    ["The data", ["≈17% aged 65+, rising to ≈22–23% by 2066", "85+ is the fastest-growing group", "More chronic disease, dementia, falls; high hospital and PBS use"]],
    ["Healthy ageing", ["WHO: maintaining functional ability for wellbeing", "Not just absence of disease: mobility, learning, relationships, contribution", "Supported by activity, nutrition, social connection"]],
    ["Opportunities", ["Volunteering, grandparent childcare, experience", "Longer working lives; growing 'silver economy'"]],
    ["Challenges", ["Chronic disease demand; aged care quality (2021 Royal Commission)", "Workforce and carer shortages; smaller tax base", "Isolation, loneliness, elder abuse"]],
    ["Strategies", ["Now: Support at Home, Aged Care Act (2024), falls prevention, dementia strategy", "Future: workforce, ageing in place, telehealth, age-friendly cities, prevention"]]
  ],
  how: [["Longer lives", "Lower mortality, people live into their 80s+"], ["More chronic disease", "Multimorbidity and dementia increase"], ["Demand rises", "More GP, hospital, medicine and aged care use"], ["Pressure on system", "Workforce, carers and costs stretched"], ["Strategies", "Prevention, healthy ageing, support at home"]],
  links: [["h9", "Ageing is a major driver of rising health expenditure"], ["h12", "Ageing is a key current challenge for the healthcare system"], ["t1", "Pre-exercise screening keeps older adults safe as they stay active"]]
},
h6: {
  sn: [
    ["The system's role", ["Promote, prevent, diagnose, treat, rehabilitate, palliate", "Primary care first; then secondary/tertiary", "Mixed public-private system"]],
    ["Strengths", ["Medicare (1984) + PBS = universal access", "High life expectancy, good cancer survival", "Spending ≈10% GDP: moderate for OECD"]],
    ["Weaknesses: equity", ["Elective surgery waits; falling bulk billing; out-of-pocket costs", "Dental mostly outside Medicare; mental health shortages", "Rural shortages; cultural safety barriers; fragmentation", "Only ≈2% spent on prevention"]],
    ["Future opportunities", ["Urgent Care Clinics, bulk billing incentives, MyMedicare", "Digital health, expanded scopes of practice", "Prevention target: 5% by 2030"]]
  ],
  how: [["Need care", "A person becomes unwell or needs prevention"], ["Primary care", "GP, pharmacist or community health first"], ["Funding", "Medicare, PBS and insurance cover costs"], ["Barriers?", "Cost, distance, waits, cultural safety"], ["Outcome", "Access is equal for some, not for all"]],
  links: [["h7", "Who funds and runs each part of the system"], ["h9", "How spending affects sustainability and equity"], ["h2", "Groups that experience the biggest barriers to access"]]
},
h7: {
  sn: [
    ["Federal government", ["Funds and sets national policy", "Medicare, PBS, PHI rebate, aged care, TGA", "Funds a share of public hospitals; AIHW data"]],
    ["State and territory", ["Run public hospitals, ambulances, community and mental health", "School dental, immunisation, food safety, disease notification"]],
    ["Local government", ["Waste, sanitation, food inspections", "Parks, bike paths, recreation, smoke-free areas"]],
    ["Non-government", ["Private: hospitals, insurers, GPs, pharmacies, allied health", "Not-for-profit: Heart Foundation, Cancer Council, Beyond Blue, RFDS, ACCHOs", "Services, research, advocacy; reach hard-to-reach groups"]],
    ["Why share?", ["National consistency + local delivery + specialist expertise", "Downside: fragmentation and cost-shifting"]]
  ],
  how: [["Federal", "Funds and regulates (Medicare, PBS, TGA)"], ["State", "Delivers hospitals and ambulances"], ["Local", "Shapes the environment (parks, food safety)"], ["NGOs", "Fill gaps with services, research, advocacy"], ["Person", "Receives care from all levels at once"]],
  links: [["h8", "How these organisations collaborate around the person"], ["h6", "Shared responsibility affects how effective the system is"], ["h9", "Who pays: federal, state, individuals and insurers"]]
},
h8: {
  sn: [
    ["Person-centred care", ["Care organised around the person, not the system", "Person is a partner; preferences, culture and family respected", "Part of the Australian Charter of Healthcare Rights"]],
    ["Why collaborate", ["Government = funding and reach", "NGOs = trust, local knowledge, expertise"]],
    ["Examples", ["headspace: federally funded via PHNs, run by NGOs; one-stop youth care", "ACCHOs: government-funded, community-run, culturally safe", "PHNs: commission local services", "NDIS: funding follows the participant's choices"]],
    ["Why it matters", ["Fewer gaps and less duplication; continuity of care", "My Health Record shares information across providers"]]
  ],
  how: [["Government funds", "e.g. federal funding through PHNs"], ["NGO delivers", "Local organisation runs the service"], ["Services combine", "Health, mental health, social support in one place"], ["Person chooses", "Care fits their needs, culture and goals"], ["Continuity", "Fewer gaps, easier to navigate"]],
  links: [["h7", "Builds on which organisations share responsibility"], ["h2", "ACCHOs improve access for First Nations communities"], ["h15", "My Health Record supports shared, coordinated care"]]
},
h9: {
  sn: [
    ["The numbers", ["≈$250 billion/year, ≈10% of GDP, rising", "≈Two-thirds from government; ≈15% out-of-pocket", "Drivers: ageing, chronic disease, new technology"]],
    ["Treatment vs prevention", ["Only ≈2% on prevention (target 5% by 2030)", "Prevention is cost-effective but pays off years later"]],
    ["Medicare, PHI, programs", ["Medicare: tax + 2% levy; PBS subsidises 900+ medicines", "PHI encouraged: 30% rebate, levy surcharge, Lifetime Health Cover", "≈45% hold hospital cover; NDIS, aged care, Closing the Gap co-payments"]],
    ["Impact now and later", ["Sustainability: ageing + smaller tax base", "Equity: out-of-pocket costs delay care; PHI subsidies favour the wealthy", "Under-investing in prevention = more disease and cost later"]]
  ],
  how: [["Money in", "Taxes, Medicare levy, insurance, out-of-pocket"], ["Spent mostly on treatment", "Hospitals, primary care, medicines"], ["Little on prevention", "≈2% of spending"], ["Chronic disease grows", "Costs keep rising with ageing"], ["Future impact", "Sustainability and equity at risk"]],
  links: [["h5", "Ageing is a key driver of rising costs"], ["h6", "Spending shapes access and equity in the system"], ["h1", "≈38% of the disease burden is preventable"]]
}
};
