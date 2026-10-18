import type { Subject, CourseMaterial, UserAccount, ActionLog, PaymentSlip, PaymentGatewayConfig, GatewayTransaction } from '../types/index.ts';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'engineering-tech',
    name: 'Engineering Technology',
    nameSi: 'ඉංජිනේරු තාක්ෂණවේදය',
    code: 'ET-41',
    description: 'Comprehensive curriculum spanning Civil, Mechanical, Electrical, and Automobile engineering technology for A/L candidates.',
    descriptionSi: 'සිවිල්, යාන්ත්‍රික, විදුලි හා මෝටර් රථ ඉංජිනේරු තාක්ෂණික සංකල්ප ඇතුළත් උසස් පෙළ තාක්ෂණවේදය විෂය නිර්දේශය.',
    badgeColor: 'border-blue-200 bg-blue-50/50 text-blue-700',
    topics: [
      { id: 'et-mech', name: 'Mechanical & Workshop Technology', nameSi: 'යාන්ත්‍රික හා වැඩපළ තාක්ෂණය' },
      { id: 'et-elec', name: 'Electrical & Electronic Systems', nameSi: 'විදුලි හා ඉලෙක්ට්‍රොනික පද්ධති' },
      { id: 'et-civil', name: 'Civil Construction & Surveying', nameSi: 'සිවිල් ඉදිකිරීම් හා මිනින්දෝරු ශිල්පය' },
      { id: 'et-auto', name: 'Automotive & Internal Combustion Engines', nameSi: 'මෝටර් රථ හා අභ්‍යන්තර දහන එන්ජින්' },
      { id: 'et-cad', name: 'Engineering Drawing & CAD Drafting', nameSi: 'ඉංජිනේරු ඇඳීම සහ පරිගණක ආශ්‍රිත කෙටුම්පත්' }
    ]
  },
  {
    id: 'science-for-tech',
    name: 'Science for Technology',
    nameSi: 'තාක්ෂණවේදය සඳහා විද්‍යාව (SFT)',
    code: 'SFT-43',
    description: 'Fundamental physics, chemistry, applied biology, and mathematics tailored specifically for technology stream students.',
    descriptionSi: 'තාක්ෂණවේදී සිසුන් සඳහා භෞතික විද්‍යාව, රසායන විද්‍යාව, ජීව විද්‍යාව හා ගණිතය මුලික මූලධර්ම.',
    badgeColor: 'border-emerald-200 bg-emerald-50/50 text-emerald-700',
    topics: [
      { id: 'sft-mech', name: 'Applied Mechanics & Thermodynamics', nameSi: 'ව්‍යවහාරික යාන්ත්‍ර විද්‍යාව හා තාපගති විද්‍යාව' },
      { id: 'sft-chem', name: 'Industrial Chemistry & Electrochemistry', nameSi: 'කාර්මික රසායන විද්‍යාව හා විද්‍යුත් රසායනය' },
      { id: 'sft-bio', name: 'Applied Biology & Microbiology', nameSi: 'ව්‍යවහාරික ජීව විද්‍යාව හා ක්ෂුද්‍රජීව විද්‍යාව' },
      { id: 'sft-math', name: 'Statistics & Computational Math', nameSi: 'සංඛ්‍යානය හා පරිගණක ගණිතය' }
    ]
  },
  {
    id: 'ict',
    name: 'Information & Communication Tech',
    nameSi: 'තොරතුරු හා සන්නිවේදන තාක්ෂණය (ICT)',
    code: 'ICT-45',
    description: 'Computer architecture, Python programming, database systems, computer networking, and cloud applications.',
    descriptionSi: 'පරිගණක නිර්මිතය, Python ක්‍රමලේඛනය, දත්ත සමුදාය, ජාලකරණය සහ වෙබ් පද්ධති.',
    badgeColor: 'border-purple-200 bg-purple-50/50 text-purple-700',
    topics: [
      { id: 'ict-prog', name: 'Python & Algorithm Design', nameSi: 'Python සහ ඇල්ගොරිතම නිර්මාණය' },
      { id: 'ict-db', name: 'Relational Databases & SQL Queries', nameSi: 'දත්ත සමුදාය හා SQL විමසුම්' },
      { id: 'ict-net', name: 'Networking & Cybersecurity', nameSi: 'පරිගණක ජාලකරණය සහ සයිබර් ආරක්ෂාව' },
      { id: 'ict-web', name: 'Modern Web Development & HTML/CSS/JS', nameSi: 'නවීන වෙබ් සංවර්ධනය' }
    ]
  },
  {
    id: 'biosystems-tech',
    name: 'Biosystems Technology',
    nameSi: 'ජෛව පද්ධති තාක්ෂණවේදය (BST)',
    code: 'BST-42',
    description: 'Agro-technology, food processing, bio-resource harvesting, irrigation automation, and post-harvest management.',
    descriptionSi: 'කෘෂි තාක්ෂණය, ආහාර සැකසුම්, පශ්චාත් අස්වනු තාක්ෂණය සහ ජෛව සම්පත් කළමනාකරණය.',
    badgeColor: 'border-amber-200 bg-amber-50/50 text-amber-700',
    topics: [
      { id: 'bst-food', name: 'Food Processing & Preservation', nameSi: 'ආහාර සැකසුම් හා සංරක්ෂණ තාක්ෂණය' },
      { id: 'bst-irr', name: 'Micro-Irrigation & Protected Agriculture', nameSi: 'ක්ෂුද්‍ර ජලසම්පාදනය හා ආරක්ෂිත කෘෂිකර්මය' },
      { id: 'bst-post', name: 'Post-Harvest Operations & Storage', nameSi: 'පශ්චාත් අස්වනු මෙහෙයුම් සහ ගබඩා කිරීම්' }
    ]
  },
  {
    id: 'combined-maths',
    name: 'Technology Applied Mathematics',
    nameSi: 'ව්‍යවහාරික ගණිතය',
    code: 'AM-44',
    description: 'Calculus, trigonometry, matrix algebra, and mechanical vectors focused on real-world engineering problems.',
    descriptionSi: 'කලනය, ත්‍රිකෝණමිතිය, න්‍යාස සහ දෛශික ඉංජිනේරු ගණනය කිරීම් සඳහා.',
    badgeColor: 'border-indigo-200 bg-indigo-50/50 text-indigo-700',
    topics: [
      { id: 'cm-calc', name: 'Differentiation & Integration in Tech', nameSi: 'අවකලනය සහ අනුකලනය' },
      { id: 'cm-vec', name: 'Force Vectors & Equilibrium', nameSi: 'බල දෛශික හා සමතුලිතතාවය' },
      { id: 'cm-trig', name: 'Surveying Trigonometry & Mensuration', nameSi: 'ත්‍රිකෝණමිතිය හා පරිමිතිය' }
    ]
  }
];

export const INITIAL_MATERIALS: CourseMaterial[] = [
  // ================= SUBJECT 1: ENGINEERING TECHNOLOGY (SINHALA MEDIUM) =================
  {
    id: 'et-si-01',
    subjectId: 'engineering-tech',
    medium: 'sinhala',
    title: 'වැඩපළ තාක්ෂණය සහ නිෂ්පාදන ක්‍රියාවලි සවිස්තර සටහන',
    titleSi: 'වැඩපළ තාක්ෂණය සහ නිෂ්පාදන ක්‍රියාවලි',
    description: 'ලෝහ හැඩගැස්වීම, පට්ටල් යන්ත්‍ර ක්‍රියාකාරීත්වය (Lathe Operations), කැපුම් මෙවලම් කෝණ, සහ මිනුම් උපකරණ (Vernier & Micrometer) පිළිබඳ පූර්ණ විෂය කරුණු.',
    moduleName: 'Mechanical & Workshop Technology',
    unitNumber: 1,
    type: 'lecture_note',
    price: 0, // Free Preview
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '4.8 MB',
    downloadCount: 438,
    totalPages: 36,
    publishedDate: '2026-01-14',
    instructorName: 'Eng. Sunil Rajapakse (MSc Eng)',
    featured: true,
    sampleContent: `1. පට්ටල් යන්ත්‍රයේ මූලික කොටස් (Headstock, Tailstock, Carriage, Bed).
2. කැපුම් වේගය (Cutting Speed - V = πDN/1000 m/min) ගණනය කිරීමේ ක්‍රම.
3. වර්නියර් කැලිපරයේ කුඩාම මිනුම (Least Count = 0.02 mm) කියවීම සහ ශුන්‍ය දෝෂ නිවැරදි කිරීම.
4. වැඩපළ ආරක්ෂක විධිවිධාන සහ OSHA ප්‍රමිති.`
  },
  {
    id: 'et-si-02',
    subjectId: 'engineering-tech',
    medium: 'sinhala',
    title: 'විදුලි බල පද්ධති සහ කාර්මික ඉලෙක්ට්‍රොනික විද්‍යාව සිද්ධාන්ත සටහන්',
    titleSi: 'විදුලි බල පද්ධති සහ කාර්මික ඉලෙක්ට්‍රොනික විද්‍යාව',
    description: 'තෙකලා විදුලි පරිපථ (Three-phase circuits), ට්‍රාන්ස්ෆෝමර් ක්‍රියාකාරීත්වය, ඩයෝඩ, ට්‍රාන්සිස්ටර සහ කාර්මික ස්වයංක්‍රීයකරණ සංවේදක (Sensors & Actuators).',
    moduleName: 'Electrical & Electronic Systems',
    unitNumber: 2,
    type: 'lecture_note',
    price: 450,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '6.2 MB',
    downloadCount: 312,
    totalPages: 52,
    publishedDate: '2026-01-28',
    instructorName: 'Eng. Sunil Rajapakse (MSc Eng)',
    sampleContent: `1. තාරක (Star) සහ ත්‍රිකෝණ (Delta) සම්බන්ධතා සංසන්දනය: VL = √3 Vph.
2. අර්ධ සන්නායක ඩයෝඩ සහ පූර්ණ තරංග සෘජුකාරක පරිපථ (Bridge Rectifiers).
3. PLC (Programmable Logic Controller) මූලික ආදාන/ප්‍රතිදාන ව්‍යුහය සහ Ladder Logic ක්‍රමලේඛනය.`
  },
  {
    id: 'et-si-03',
    subjectId: 'engineering-tech',
    medium: 'sinhala',
    title: 'සිවිල් ඉදිකිරීම් තාක්ෂණය, කොන්ක්‍රීට් තාක්ෂණය සහ මිනින්දෝරු ශිල්පය',
    titleSi: 'සිවිල් ඉදිකිරීම් තාක්ෂණය සහ මිනින්දෝරු ශිල්පය',
    description: 'පාදම් වර්ග (Foundations), කොන්ක්‍රීට් මිශ්‍රණ සැලසුම් (Mix Design), ගොඩනැගිලි ආකෘති, සහ Theodolite උපකරණ මඟින් සමතල කිරීමේ මිනුම් ගැනීම.',
    moduleName: 'Civil Construction & Surveying',
    unitNumber: 3,
    type: 'lecture_note',
    price: 600,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '7.1 MB',
    downloadCount: 229,
    totalPages: 48,
    publishedDate: '2026-02-05',
    instructorName: 'Eng. Charitha Bandara (BSc Eng)',
    sampleContent: `1. පස් දරාගැනීමේ ධාරිතාව (Safe Bearing Capacity of Soil) පරීක්ෂා කිරීම.
2. සිමෙන්ති කොන්ක්‍රීට් සවිවීම හා ශක්තිමත් කිරීමේ ක්‍රම (Slump Test සහ Compressive Strength Test).
3. ගොඩනැගිලි අත්තිවාරම් වර්ග: පටි පාදම් (Strip), හුදකලා පාදම් (Pad), පාවෙන පාදම් (Raft).`
  },
  {
    id: 'et-si-04',
    subjectId: 'engineering-tech',
    medium: 'sinhala',
    title: 'ඉංජිනේරු තාක්ෂණවේදය 2018-2024 පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ විවරණ සංග්‍රහය',
    titleSi: 'පසුගිය විභාග ප්‍රශ්න පත්‍ර හා විවරණ',
    description: 'විභාග දෙපාර්තමේන්තු ලකුණු දීමේ පටිපාටිය (Official Marking Schemes) සහ ආදර්ශ පිළිතුරු සමඟ සම්පූර්ණ විවරණය.',
    moduleName: 'Past Papers & Marking Schemes',
    unitNumber: 5,
    type: 'past_paper',
    price: 850,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '14.5 MB',
    downloadCount: 560,
    totalPages: 110,
    publishedDate: '2026-02-18',
    instructorName: 'National Panel of Tech Lecturers',
    featured: true,
    sampleContent: `ප්‍රශ්න පත්‍ර අංක 01: බහුවරණ ප්‍රශ්න 50 සවිස්තරාත්මක හේතු දැක්වීම් සහිත විවරණය.
ප්‍රශ්න පත්‍ර අංක 02: ව්‍යුහගත සහ රචනා ප්‍රශ්න සඳහා පියවරෙන් පියවර ලකුණු ලබාදෙන ආකාරය.`
  },

  // ================= SUBJECT 1: ENGINEERING TECHNOLOGY (ENGLISH MEDIUM) =================
  {
    id: 'et-en-01',
    subjectId: 'engineering-tech',
    medium: 'english',
    title: 'Mechanical Workshop Technology & Modern Manufacturing Systems',
    description: 'Comprehensive English medium guide covering machine tool mechanics, CNC fundamentals, chip formation, tolerances, and metrology standards.',
    moduleName: 'Mechanical & Workshop Technology',
    unitNumber: 1,
    type: 'lecture_note',
    price: 0, // Free Preview
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '5.2 MB',
    downloadCount: 380,
    totalPages: 42,
    publishedDate: '2026-01-16',
    instructorName: 'Eng. Sunil Rajapakse (MSc Eng)',
    featured: true,
    sampleContent: `1. Classification of machine tools: Lathe, Milling, Shaper, Drilling, and Surface Grinding machines.
2. Tool geometry: Rake angle, Clearance angle, and Cutting edge angle relations to Merchant's circle.
3. Metrology: Vernier Height Gauges, Dial Indicators, Micrometers, and Slip Gauges calibration protocols.
4. Industrial safety protocols under ISO 45001 standards.`
  },
  {
    id: 'et-en-02',
    subjectId: 'engineering-tech',
    medium: 'english',
    title: 'Electrical Power Transmission, Distribution & Industrial Drives',
    description: 'AC circuit analysis, polyphase systems, induction motor torque-slip characteristics, protective switchgear, and safety grounding.',
    moduleName: 'Electrical & Electronic Systems',
    unitNumber: 2,
    type: 'lecture_note',
    price: 550,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '6.8 MB',
    downloadCount: 290,
    totalPages: 58,
    publishedDate: '2026-01-30',
    instructorName: 'Eng. Sunil Rajapakse (MSc Eng)',
    sampleContent: `1. Three-phase star/delta transformations: Line vs phase voltages and currents in balanced/unbalanced loads.
2. Single-phase and three-phase squirrel-cage induction motors: Starting methods (Star-Delta starter, DOL, Soft starters).
3. Electrical protection devices: MCB, MCCB, RCCB, and earthing installation guidelines.`
  },
  {
    id: 'et-en-03',
    subjectId: 'engineering-tech',
    medium: 'english',
    title: 'Civil Construction Materials, Concrete Technology & Site Surveying',
    description: 'Detailed civil engineering technology module covering sub-structures, superstructure loads, surveying with Total Station, and reinforced concrete design.',
    moduleName: 'Civil Construction & Surveying',
    unitNumber: 3,
    type: 'lecture_note',
    price: 650,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '8.4 MB',
    downloadCount: 215,
    totalPages: 64,
    publishedDate: '2026-02-10',
    instructorName: 'Eng. Charitha Bandara (BSc Eng)',
    sampleContent: `1. Soil Mechanics: Atterberg limits, sieve analysis, and compaction tests (Standard Proctor Test).
2. Concrete technology: Water-cement ratio, workability testing (Slump test, Compacting factor test), and cube strength evaluation.
3. Surveying: Levelling computations (Rise and Fall method, Height of Collimation method), and contour surveying.`
  },
  {
    id: 'et-en-04',
    subjectId: 'engineering-tech',
    medium: 'english',
    title: 'Engineering Technology Model Examination Paper with Answer Scheme',
    description: 'Simulated examination paper targeting high-yield exam trends, structured essay answers, and marking rubrics.',
    moduleName: 'Model Papers & Revision',
    unitNumber: 5,
    type: 'model_paper',
    price: 750,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '3.9 MB',
    downloadCount: 410,
    totalPages: 28,
    publishedDate: '2026-02-22',
    instructorName: 'National Panel of Tech Lecturers',
    sampleContent: `Section A: 50 High-yield Multiple Choice Questions covering Mechanics, Electrical, Civil, and Automotive modules.
Section B: Structured essay questions detailing workshop calculation, circuit design, and soil slope stability.`
  },

  // ================= SUBJECT 2: SCIENCE FOR TECHNOLOGY (SINHALA MEDIUM) =================
  {
    id: 'sft-si-01',
    subjectId: 'science-for-tech',
    medium: 'sinhala',
    title: 'තාක්ෂණවේදය සඳහා භෞතික විද්‍යාව - ව්‍යවහාරික යාන්ත්‍ර විද්‍යාව සහ තරල ගති විද්‍යාව',
    titleSi: 'ව්‍යවහාරික යාන්ත්‍ර විද්‍යාව සහ තරල ගති විද්‍යාව',
    description: 'නිව්ටන් නියම, ගම්‍යතාවය, කාර්යය ශක්තිය හා ක්ෂමතාවය, බර්නූලි මූලධර්මය සහ දුස්ස්‍රාවිතාවය පිළිබඳ විස්තරාත්මක සටහන.',
    moduleName: 'Applied Mechanics & Thermodynamics',
    unitNumber: 1,
    type: 'lecture_note',
    price: 0,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '4.2 MB',
    downloadCount: 395,
    totalPages: 40,
    publishedDate: '2026-01-20',
    instructorName: 'Dr. Nirmal Senaratne',
    sampleContent: `1. රේඛීය හා භ්‍රමණ චලිතය: ව්‍යවර්ථය (Torque) සහ කෝණික ගම්‍යතාවය.
2. තරල ගති විද්‍යාව: අවිච්ඡින්නතා සමීකරණය (A1V1 = A2V2) සහ බර්නූලි සමීකරණය (P + 1/2ρv² + ρgh = C).
3. දුස්ස්‍රාවිතාවය සහ ස්ටෝක්ස් නියමය (F = 6πηrv).`
  },
  {
    id: 'sft-si-02',
    subjectId: 'science-for-tech',
    medium: 'sinhala',
    title: 'කාර්මික රසායන විද්‍යාව සහ බහුඅවයවික (Polymers) තාක්ෂණය',
    titleSi: 'කාර්මික රසායන විද්‍යාව හා බහුඅවයවික',
    description: 'විද්‍යුත් රසායනික කෝෂ, ලෝහ විඛාදනය වැළැක්වීම, පෙට්‍රෝලියම් පිරිපහදුව, සහ ප්ලාස්ටික්/රබර් බහුඅවයවික සංශ්ලේෂණය.',
    moduleName: 'Industrial Chemistry & Electrochemistry',
    unitNumber: 2,
    type: 'lecture_note',
    price: 500,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '5.6 MB',
    downloadCount: 270,
    totalPages: 44,
    publishedDate: '2026-02-08',
    instructorName: 'Dr. Nirmal Senaratne',
    sampleContent: `1. ගැල්වනික් කෝෂ සහ විද්‍යුත් විච්ඡේද්‍ය කෝෂ සංසන්දනය: නර්න්ස්ට් (Nernst) සමීකරණ යෙදුම්.
2. යකඩ මලබැඳීමේ රසායනික ක්‍රියාවලිය සහ කැතෝඩික ආරක්ෂණ ක්‍රම.
3. ස්වාභාවික රබර් වල්කනයිස් කිරීම සහ කෘතිම බහුඅවයවික (PVC, Nylon, Bakelite).`
  },

  // ================= SUBJECT 2: SCIENCE FOR TECHNOLOGY (ENGLISH MEDIUM) =================
  {
    id: 'sft-en-01',
    subjectId: 'science-for-tech',
    medium: 'english',
    title: 'Applied Physics for Tech: Statics, Dynamics & Fluid Systems',
    description: 'Core physical principles applied to modern technology: moment of inertia, impulse, hydraulic machinery, and heat transfer mechanisms.',
    moduleName: 'Applied Mechanics & Thermodynamics',
    unitNumber: 1,
    type: 'lecture_note',
    price: 0,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '4.9 MB',
    downloadCount: 340,
    totalPages: 46,
    publishedDate: '2026-01-22',
    instructorName: 'Dr. Nirmal Senaratne',
    sampleContent: `1. Static equilibrium conditions: Concurrent and non-concurrent force systems, Lami's theorem.
2. Centripetal acceleration, centrifugal effects, and banking of road curves.
3. Thermodynamics: Laws of thermodynamics, thermal expansion of alloys, and heat exchangers.`
  },
  {
    id: 'sft-en-02',
    subjectId: 'science-for-tech',
    medium: 'english',
    title: 'Science for Technology Full Revision Summary & 100 Formula Cheat Sheet',
    description: 'High-density quick revision booklet containing all essential physical constants, formulas, unit conversions, and recurring diagram keys.',
    moduleName: 'Formulas & Short Notes',
    unitNumber: 4,
    type: 'short_note',
    price: 400,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '2.1 MB',
    downloadCount: 480,
    totalPages: 24,
    publishedDate: '2026-02-12',
    instructorName: 'Dr. Nirmal Senaratne',
    sampleContent: `Complete quick-reference lookup tables:
- Mechanics & Fluid equations
- Electrical & Magnetic equations
- Chemical kinetics & Gas laws
- Standard SI units and dimensional formulae.`
  },

  // ================= SUBJECT 3: ICT (SINHALA MEDIUM) =================
  {
    id: 'ict-si-01',
    subjectId: 'ict',
    medium: 'sinhala',
    title: 'Python ක්‍රමලේඛන භාෂාව සහ ගැටලු විසඳීමේ ඇල්ගොරිතම පූර්ණ පාඨමාලාව',
    titleSi: 'Python ක්‍රමලේඛන භාෂාව සහ ඇල්ගොරිතම',
    description: 'විචල්‍ය, පාලන ව්‍යුහ (Loops, Conditions), ශ්‍රිත (Functions), Lists/Dictionaries, සහ විභාග මට්ටමේ Python ගැටලු විසඳීම.',
    moduleName: 'Python & Algorithm Design',
    unitNumber: 1,
    type: 'lecture_note',
    price: 0,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '3.8 MB',
    downloadCount: 512,
    totalPages: 38,
    publishedDate: '2026-01-18',
    instructorName: 'Mr. Dinuka Jayawardena (BSc Hons Comp)',
    sampleContent: `1. Python දත්ත ප්‍රභේද: int, float, str, list, tuple, dict.
2. Flowcharts සහ පාලන ව්‍යුහ පරිවර්තනය: for සහ while ලූප භාවිතය.
3. මොඩියුල ලිවීම සහ ගොනු මෙහෙයුම් (File Handling - read/write).`
  },
  {
    id: 'ict-si-02',
    subjectId: 'ict',
    medium: 'sinhala',
    title: 'දත්ත සමුදා පද්ධති, සාමාන්‍යකරණය (Normalization) සහ SQL ප්‍රශ්නෝත්තර',
    titleSi: 'දත්ත සමුදාය සහ SQL ප්‍රශ්නෝත්තර',
    description: 'ER රූප සටහන්, 1NF, 2NF, 3NF සාමාන්‍යකරණය, සහ විභාග ප්‍රශ්න පත්‍ර වල නිතර අසන SQL DDL/DML විමසුම් ලියන ආකාරය.',
    moduleName: 'Relational Databases & SQL Queries',
    unitNumber: 2,
    type: 'tutorial_worksheet',
    price: 450,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '4.6 MB',
    downloadCount: 345,
    totalPages: 34,
    publishedDate: '2026-02-04',
    instructorName: 'Mr. Dinuka Jayawardena (BSc Hons Comp)',
    sampleContent: `1. Entity Relationship Diagrams (ERD) ඇඳීමේ මූලධර්ම සහ Cardinality සබඳතා.
2. දත්ත සමුදා සාමාන්‍යකරණය: පළමු (1NF), දෙවන (2NF) සහ තෙවන (3NF) සාමාන්‍ය ආකාර වෙත පියවරෙන් පියවර ගෙන ඒම.
3. SQL ප්‍රකාශන: SELECT, INSERT, UPDATE, JOIN, GROUP BY, HAVING.`
  },

  // ================= SUBJECT 3: ICT (ENGLISH MEDIUM) =================
  {
    id: 'ict-en-01',
    subjectId: 'ict',
    medium: 'english',
    title: 'Advanced Python Programming & Algorithmic Problem Solving',
    description: 'Master algorithm complexity, recursive functions, data structures, and practical coding challenges matching A/L requirements.',
    moduleName: 'Python & Algorithm Design',
    unitNumber: 1,
    type: 'lecture_note',
    price: 0,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '4.1 MB',
    downloadCount: 420,
    totalPages: 44,
    publishedDate: '2026-01-25',
    instructorName: 'Mr. Dinuka Jayawardena (BSc Hons Comp)',
    sampleContent: `1. Algorithm efficiency: Time complexity and space complexity fundamentals.
2. Data structures in Python: Stack, Queue, Lists, and Tree traversal concepts.
3. Error handling: try-except blocks, assertions, and defensive coding techniques.`
  },
  {
    id: 'ict-en-02',
    subjectId: 'ict',
    medium: 'english',
    title: 'Computer Networking, OSI Model & Network Security Handbook',
    description: 'Subnetting calculations (IPv4/IPv6), TCP/IP vs OSI layers, routing protocols, firewalls, and cryptographic basics.',
    moduleName: 'Networking & Cybersecurity',
    unitNumber: 3,
    type: 'lecture_note',
    price: 600,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '6.4 MB',
    downloadCount: 310,
    totalPages: 56,
    publishedDate: '2026-02-14',
    instructorName: 'Mr. Dinuka Jayawardena (BSc Hons Comp)',
    sampleContent: `1. OSI 7-layer architecture and protocol data units (PDU).
2. IPv4 CIDR subnetting calculations: Network ID, Broadcast ID, and usable host range.
3. Cryptography: Symmetric vs Asymmetric encryption, SSL/TLS handshake mechanisms.`
  },

  // ================= SUBJECT 4: BIOSYSTEMS TECHNOLOGY (SINHALA & ENGLISH) =================
  {
    id: 'bst-si-01',
    subjectId: 'biosystems-tech',
    medium: 'sinhala',
    title: 'ආහාර සැකසුම් හා සංරක්ෂණ තාක්ෂණය මූලික සිද්ධාන්ත',
    titleSi: 'ආහාර සැකසුම් හා සංරක්ෂණ තාක්ෂණය',
    description: 'තාප පිරියම් කිරීම් (Pasteurization/Sterilization), ජලක්‍රියාකාරීත්වය (aw), සහ ආහාර තත්ත්ව පාලන HACCP ප්‍රමිති.',
    moduleName: 'Food Processing & Preservation',
    unitNumber: 1,
    type: 'lecture_note',
    price: 0,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '4.3 MB',
    downloadCount: 230,
    totalPages: 36,
    publishedDate: '2026-01-19',
    instructorName: 'Ms. K. H. Samarasinghe',
    sampleContent: `1. ක්ෂුද්‍රජීවී ක්‍රියාකාරීත්වය පාලනය සහ ආහාර නරක්වීම වැළැක්වීම.
2. Blanching, Freezing සහ Dehydration තාක්ෂණික ක්‍රම.
3. GMP සහ HACCP ආහාර ආරක්ෂණ සහතිකකරණ ක්‍රමවේද.`
  },
  {
    id: 'bst-en-01',
    subjectId: 'biosystems-tech',
    medium: 'english',
    title: 'Modern Food Engineering & Automated Post-Harvest Technology',
    description: 'Principles of food extrusion, thermal preservation, moisture sorption isotherms, and automated controlled-atmosphere storage.',
    moduleName: 'Food Processing & Preservation',
    unitNumber: 1,
    type: 'lecture_note',
    price: 550,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '5.1 MB',
    downloadCount: 195,
    totalPages: 40,
    publishedDate: '2026-01-26',
    instructorName: 'Ms. K. H. Samarasinghe',
    sampleContent: `1. Thermal death time curves (D, z, and F values) in commercial sterilization.
2. Grain drying physics: psychrometric charts and deep-bed aeration systems.
3. Cold chain logistics and modified atmosphere packaging (MAP).`
  },

  // ================= SUBJECT 5: APPLIED MATHS (SINHALA & ENGLISH) =================
  {
    id: 'cm-si-01',
    subjectId: 'combined-maths',
    medium: 'sinhala',
    title: 'තාක්ෂණවේදය සඳහා අවකලනය සහ අනුකලනය ප්‍රායෝගික යෙදුම්',
    titleSi: 'අවකලනය සහ අනුකලනය ප්‍රායෝගික යෙදුම්',
    description: 'උපරිම සහ අවම අගය සෙවීම, ප්‍රවේගය සහ ත්වරණය ගණනය, සහ වක්‍රයක වර්ගඵලය හා පරිමාව නිර්ණය කිරීම.',
    moduleName: 'Differentiation & Integration in Tech',
    unitNumber: 1,
    type: 'lecture_note',
    price: 0,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '3.6 MB',
    downloadCount: 310,
    totalPages: 32,
    publishedDate: '2026-01-22',
    instructorName: 'Mr. R. Senadeera',
    sampleContent: `1. මූලික අවකලන නීති: ගුණිත නීතිය, භාග නීතිය සහ දාම නීතිය.
2. ඉංජිනේරු යෙදුම්: ද්‍රව්‍ය අවම පිරිවැයක් සඳහා ප්‍රශස්තකරණය (Optimization).
3. නිශ්චිත අනුකලනය මඟින් කේන්ද්‍රිකය (Centroid) සහ අවස්ථිති ඝූර්ණය (Moment of Inertia) සෙවීම.`
  },
  {
    id: 'cm-en-01',
    subjectId: 'combined-maths',
    medium: 'english',
    title: 'Applied Engineering Mathematics: Vector Mechanics & Equilibrium',
    description: 'Coplanar force systems, couples, resultant calculations, and rigid body equilibrium equations for engineering structures.',
    moduleName: 'Force Vectors & Equilibrium',
    unitNumber: 2,
    type: 'lecture_note',
    price: 500,
    currency: 'LKR',
    fileFormat: 'PDF',
    fileSize: '4.4 MB',
    downloadCount: 260,
    totalPages: 36,
    publishedDate: '2026-02-01',
    instructorName: 'Mr. R. Senadeera',
    sampleContent: `1. Vector resolution in 2D and 3D coordinate frames.
2. Varignon's theorem of moments and distributed load equivalents.
3. Truss analysis: Method of joints and method of sections for pin-jointed frames.`
  }
];

export const INITIAL_USER: UserAccount = {
  id: 'usr_student_01',
  name: 'Kasun Jayasundara',
  email: 'kasun.j@altech.lk',
  phone: '+94 77 123 4567',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  enrolledSubjects: ['engineering-tech', 'science-for-tech', 'ict'],
  purchasedMaterialIds: ['et-si-02', 'et-en-02', 'sft-si-02'],
  downloadHistory: [
    {
      materialId: 'et-si-01',
      downloadedAt: '2026-02-10T14:30:00Z',
      fileName: 'Workshop_Technology_Sinhala_EduNexus.pdf',
      fileSize: '4.8 MB',
      subjectId: 'engineering-tech',
      medium: 'sinhala'
    },
    {
      materialId: 'et-si-02',
      downloadedAt: '2026-02-12T09:15:00Z',
      fileName: 'Electrical_Systems_Sinhala_EduNexus.pdf',
      fileSize: '6.2 MB',
      subjectId: 'engineering-tech',
      medium: 'sinhala'
    },
    {
      materialId: 'sft-en-01',
      downloadedAt: '2026-02-14T18:45:00Z',
      fileName: 'Applied_Physics_English_EduNexus.pdf',
      fileSize: '4.9 MB',
      subjectId: 'science-for-tech',
      medium: 'english'
    }
  ],
  completedMaterialIds: ['et-si-01', 'sft-en-01'],
  walletBalance: 2400,
  createdAt: '2026-01-05T08:00:00Z'
};

export const INITIAL_INSTRUCTOR: UserAccount = {
  id: 'usr_inst_01',
  name: 'Eng. Sunil Rajapakse (MSc Eng)',
  email: 'sunil.rajapakse@edunexus.lk',
  phone: '+94 71 889 9900',
  role: 'instructor',
  enrolledSubjects: ['engineering-tech', 'science-for-tech', 'ict', 'biosystems-tech', 'combined-maths'],
  purchasedMaterialIds: [],
  downloadHistory: [],
  completedMaterialIds: [],
  walletBalance: 48500,
  createdAt: '2025-01-01T00:00:00Z'
};

export const INITIAL_ACTION_LOGS: ActionLog[] = [
  {
    id: 'log_01',
    userId: 'usr_student_01',
    userName: 'Kasun Jayasundara',
    userRole: 'student',
    actionType: 'DOWNLOAD_RESOURCE',
    details: 'Downloaded "වැඩපළ තාක්ෂණය සහ නිෂ්පාදන ක්‍රියාවලි" (Sinhala Medium PDF)',
    timestamp: '2026-02-10T14:30:00Z',
    ipAddress: '192.168.1.45',
    metadata: { materialId: 'et-si-01', fileSize: '4.8 MB' }
  },
  {
    id: 'log_02',
    userId: 'usr_student_01',
    userName: 'Kasun Jayasundara',
    userRole: 'student',
    actionType: 'MARK_COMPLETED',
    details: 'Marked "Workshop Technology Notes (Sinhala)" as 100% completed',
    timestamp: '2026-02-10T15:10:00Z',
    ipAddress: '192.168.1.45',
    metadata: { materialId: 'et-si-01' }
  },
  {
    id: 'log_03',
    userId: 'usr_student_01',
    userName: 'Kasun Jayasundara',
    userRole: 'student',
    actionType: 'PURCHASE_MATERIAL',
    details: 'Purchased "විදුලි බල පද්ධති සහ කාර්මික ඉලෙක්ට්‍රොනික විද්‍යාව" for LKR 450 via Card Payment',
    timestamp: '2026-02-12T09:10:00Z',
    ipAddress: '192.168.1.45',
    metadata: { materialId: 'et-si-02', amount: 450, method: 'Card' }
  },
  {
    id: 'log_04',
    userId: 'usr_student_01',
    userName: 'Kasun Jayasundara',
    userRole: 'student',
    actionType: 'DOWNLOAD_RESOURCE',
    details: 'Downloaded "විදුලි බල පද්ධති සහ කාර්මික ඉලෙක්ට්‍රොනික විද්‍යාව" (Sinhala Medium PDF)',
    timestamp: '2026-02-12T09:15:00Z',
    ipAddress: '192.168.1.45',
    metadata: { materialId: 'et-si-02', fileSize: '6.2 MB' }
  },
  {
    id: 'log_05',
    userId: 'usr_student_01',
    userName: 'Kasun Jayasundara',
    userRole: 'student',
    actionType: 'DOWNLOAD_RESOURCE',
    details: 'Downloaded "Applied Physics for Tech: Statics & Dynamics" (English Medium PDF)',
    timestamp: '2026-02-14T18:45:00Z',
    ipAddress: '192.168.1.45',
    metadata: { materialId: 'sft-en-01', fileSize: '4.9 MB' }
  },
  {
    id: 'log_06',
    userId: 'usr_inst_01',
    userName: 'Eng. Sunil Rajapakse',
    userRole: 'instructor',
    actionType: 'ADD_MATERIAL',
    details: 'Uploaded new unit "Engineering Technology Model Examination Paper with Answer Scheme"',
    timestamp: '2026-02-22T10:00:00Z',
    ipAddress: '192.168.1.1',
    metadata: { subjectId: 'engineering-tech', medium: 'english' }
  }
];

export const INITIAL_PAYMENT_SLIPS: PaymentSlip[] = [
  {
    id: 'slip_101',
    userId: 'usr_student_02',
    userName: 'Nimali Senanayake',
    userEmail: 'nimali.s@gmail.com',
    materialId: 'et-si-04',
    materialTitle: 'ඉංජිනේරු තාක්ෂණවේදය පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ විවරණ සංග්‍රහය',
    amount: 850,
    referenceNumber: 'BOC-TXN-884920',
    bankName: 'Bank of Ceylon (BOC) - Moratuwa',
    status: 'pending',
    submittedAt: '2026-02-24T11:20:00Z'
  },
  {
    id: 'slip_102',
    userId: 'usr_student_03',
    userName: 'Thilina Pathirana',
    userEmail: 'thilina.p@yahoo.com',
    materialId: 'et-en-03',
    materialTitle: 'Civil Construction Materials, Concrete Technology & Site Surveying',
    amount: 650,
    referenceNumber: 'COM-TXN-442190',
    bankName: 'Commercial Bank - Kandy',
    status: 'approved',
    submittedAt: '2026-02-23T16:40:00Z'
  }
];

export const INITIAL_REGISTERED_USERS: UserAccount[] = [
  {
    ...INITIAL_USER,
    status: 'active',
    preferredMedium: 'sinhala'
  },
  {
    ...INITIAL_INSTRUCTOR,
    status: 'verified',
    preferredMedium: 'both'
  },
  {
    id: 'usr_student_02',
    name: 'Nimali Senanayake',
    email: 'nimali.s@gmail.com',
    phone: '+94 71 445 6789',
    role: 'student',
    status: 'active',
    preferredMedium: 'sinhala',
    enrolledSubjects: ['engineering-tech', 'science-for-tech'],
    purchasedMaterialIds: ['et-si-01'],
    downloadHistory: [
      {
        materialId: 'et-si-01',
        downloadedAt: '2026-02-18T10:15:00Z',
        fileName: 'Workshop_Technology_Sinhala_TechnologyTeacher.pdf',
        fileSize: '4.8 MB',
        subjectId: 'engineering-tech',
        medium: 'sinhala'
      }
    ],
    completedMaterialIds: ['et-si-01'],
    walletBalance: 1200,
    createdAt: '2026-01-12T09:30:00Z'
  },
  {
    id: 'usr_student_03',
    name: 'Thilina Pathirana',
    email: 'thilina.p@yahoo.com',
    phone: '+94 78 991 2234',
    role: 'student',
    status: 'active',
    preferredMedium: 'english',
    enrolledSubjects: ['engineering-tech', 'ict'],
    purchasedMaterialIds: ['et-en-01', 'et-en-03'],
    downloadHistory: [
      {
        materialId: 'et-en-01',
        downloadedAt: '2026-02-20T14:00:00Z',
        fileName: 'Mechanical_Workshop_English_TechnologyTeacher.pdf',
        fileSize: '5.2 MB',
        subjectId: 'engineering-tech',
        medium: 'english'
      }
    ],
    completedMaterialIds: ['et-en-01'],
    walletBalance: 850,
    createdAt: '2026-01-15T11:45:00Z'
  },
  {
    id: 'usr_student_04',
    name: 'Chamari Gunawardena',
    email: 'chamari.g@outlook.com',
    phone: '+94 70 334 5566',
    role: 'student',
    status: 'verified',
    preferredMedium: 'sinhala',
    enrolledSubjects: ['science-for-tech', 'biosystems-tech'],
    purchasedMaterialIds: ['sft-si-01', 'sft-si-02'],
    downloadHistory: [],
    completedMaterialIds: ['sft-si-01'],
    walletBalance: 2100,
    createdAt: '2026-01-22T16:20:00Z'
  },
  {
    id: 'usr_student_05',
    name: 'Pravin Fernando',
    email: 'pravin.f@techmail.lk',
    phone: '+94 77 882 1199',
    role: 'student',
    status: 'active',
    preferredMedium: 'english',
    enrolledSubjects: ['engineering-tech', 'combined-maths'],
    purchasedMaterialIds: ['et-en-02'],
    downloadHistory: [],
    completedMaterialIds: [],
    walletBalance: 500,
    createdAt: '2026-02-01T13:10:00Z'
  }
];

export const DEFAULT_GATEWAY_CONFIG: PaymentGatewayConfig = {
  activeGateway: 'payhere',
  mode: 'sandbox',
  merchantId: '1218940',
  secretKey: '4TXN998_SEC_TEST_KEY',
  publicKey: '4TXN998_PUB_KEY',
  currency: 'LKR',
  supportedMethods: ['visa_master', 'ezcash_mcash', 'frimi', 'genie', 'bank_transfer'],
  autoApproveBankSlips: false,
  notifyOnPayment: true,
  bankDetails: {
    bankName: 'Bank of Ceylon (BOC) - Colombo Super Grade',
    accountNumber: '8900-2441-9002',
    accountName: 'Technology Teacher STEM Academy',
    branch: 'Colombo 01'
  }
};

export const INITIAL_GATEWAY_TRANSACTIONS: GatewayTransaction[] = [
  {
    id: 'gw_txn_001',
    gateway: 'payhere',
    referenceNumber: 'PAYHERE-TXN-881290',
    userId: 'usr_student_01',
    userName: 'Kasun Jayasundara',
    userEmail: 'kasun.j@student.lk',
    materialId: 'et-si-02',
    materialTitle: 'ඉලෙක්ට්‍රොනික විද්‍යාව සහ අර්ධ සන්නායක තාක්ෂණය',
    amount: 650,
    currency: 'LKR',
    paymentMethod: 'Visa / Mastercard (PayHere Gateway)',
    status: 'SUCCESS',
    createdAt: '2026-02-12T14:22:00Z',
    mode: 'sandbox'
  },
  {
    id: 'gw_txn_002',
    gateway: 'payhere',
    referenceNumber: 'PAYHERE-TXN-904128',
    userId: 'usr_student_03',
    userName: 'Thilina Pathirana',
    userEmail: 'thilina.p@yahoo.com',
    materialId: 'et-en-03',
    materialTitle: 'Civil Construction Materials & Site Surveying',
    amount: 650,
    currency: 'LKR',
    paymentMethod: 'eZ Cash Mobile (PayHere Gateway)',
    status: 'SUCCESS',
    createdAt: '2026-02-23T16:42:00Z',
    mode: 'sandbox'
  },
  {
    id: 'gw_txn_003',
    gateway: 'stripe',
    referenceNumber: 'pi_3MtwxPEY4',
    userId: 'usr_student_05',
    userName: 'Pravin Fernando',
    userEmail: 'pravin.f@techmail.lk',
    materialId: 'et-en-02',
    materialTitle: 'Electrical Circuits & Alternating Current Power Analysis',
    amount: 700,
    currency: 'LKR',
    paymentMethod: 'Mastercard 3D Secure',
    status: 'SUCCESS',
    createdAt: '2026-02-20T11:15:00Z',
    mode: 'sandbox'
  }
];

