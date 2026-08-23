import { BatchCourse, ClassTopic, PdfTopic } from '../types';

export const INITIAL_BATCHES: BatchCourse[] = [
  {
    id: '6a06e488b927c1a84a90a818',
    title: 'Selection Batch VOD 2.0',
    short_description: 'Dedicated comprehensive video-on-demand batch for SSC Exams with complete coverage.',
    price: 3999,
    discountPrice: 1599,
    isRecorded: true,
    isLive: false,
    status: 'active',
    validity: '2 years',
    priority: 1,
    category: 'ssc',
    description: [
      'Full Syllabus Coverage for SSC CGL, CHSL, CPO, MTS & GD exams.',
      'High-definition video lectures with chapter-wise structured notes.',
      'Previous Year Questions (PYQs) 2019-2025 thoroughly solved by top faculty.',
      'Speed calculation tricks, grammar rules mastery, and reasoning shortcuts.'
    ],
    courseHighlights: [
      '200+ Recorded HD Classes with multi-quality resolution',
      'Downloadable Chapter PDFs and Class Notes',
      'Doubt solving assistance on official NST Telegram channel (@NST_XY_09)',
      '2 Years Unlimited Access with offline caching support'
    ],
    facultyDetails: {
      name: 'Gagan Pratap & Aman Vashisth Sir',
      designation: 'Senior Faculty & SSC Topper Mentors',
      experience: '10+ Years Teaching Experience',
      reach: '5M+ Students Mentored',
      bio: 'Renowned educators known for revolutionary conceptual clarity, formula-free maths approaches, and comprehensive English mastery.'
    },
    faqs: [
      { question: 'Can I watch lectures offline?', answer: 'Yes, video streams support multiple bitrates and notes can be viewed anytime.' },
      { question: 'Where can I get real-time batch alerts and test links?', answer: 'Join our official Telegram channel https://t.me/NST_XY_09 for all instant updates.' }
    ],
    timeTable: [
      { topic: 'Maths Mastery (Arithmetic & Advanced)', time: 'Daily 10:00 AM' },
      { topic: 'English Comprehension & Vocab', time: 'Daily 02:00 PM' },
      { topic: 'General Studies & Science', time: 'Daily 06:00 PM' }
    ]
  },
  {
    id: '69f990f7b927c1a84afd2673',
    title: 'Selection Batch - 8 (Live & Interactive)',
    short_description: 'Useful for SSC, Railways, Banking and other state exams with daily live sessions.',
    price: 4999,
    discountPrice: 1599,
    isRecorded: false,
    isLive: true,
    status: 'active',
    validity: '2 years',
    priority: 2,
    category: 'ssc',
    description: [
      'Live interactive classroom with real-time doubt clearing.',
      'Tier 1 + Tier 2 complete integrated curriculum.',
      'Daily Practice Problem (DPP) sheets with video explanations.',
      'Special focus on 2025-26 latest exam pattern changes.'
    ],
    courseHighlights: [
      'Live Streaming with chat support',
      'Instant class recordings available right after live session',
      'Curated subject-wise PDF notes',
      'Official NST Community support on Telegram'
    ],
    facultyDetails: {
      name: 'NST All-Star Faculty Team',
      designation: 'Specialist Educator Panel',
      experience: '12+ Years Cumulative Experience',
      reach: '2M+ Selections'
    },
    faqs: [
      { question: 'What happens if I miss a live class?', answer: 'All live lectures are auto-converted into HD recordings within 15 minutes.' }
    ]
  },
  {
    id: '6a06e470b927c1a84a90a804',
    title: 'Maths Special VOD Batch-4.0',
    short_description: 'Complete Arithmetic and Advanced Maths special recorded batch by Gagan Sir.',
    price: 2999,
    discountPrice: 999,
    isRecorded: true,
    isLive: false,
    status: 'active',
    validity: '2 years',
    priority: 3,
    category: 'maths',
    description: [
      'Zero level to Mains level Maths complete roadmap.',
      'Smart techniques for Geometry, Mensuration, Trigonometry, Algebra.',
      'Short tricks for Time & Work, Percentage, Profit & Loss, SI-CI, Speed & Distance.'
    ],
    courseHighlights: ['180+ Topic-wise Lectures', 'Handwritten Class Notes PDFs', 'Formula Book PDF Included']
  },
  {
    id: '69f990f3b927c1a84afcf32f',
    title: 'Maths Special-8 (Live)',
    short_description: 'Live interactive Mathematics special for All Competitive Exams (SSC, CGL, CHSL, CPO, CDS).',
    price: 2999,
    discountPrice: 999,
    isRecorded: false,
    isLive: true,
    status: 'active',
    validity: '2 years',
    priority: 4,
    category: 'maths'
  },
  {
    id: '6a06e47eb927c1a84a90a809',
    title: 'English Special VOD Batch-2.0',
    short_description: 'Grammar mastery, Vocabulary root words, and Reading Comprehension VOD.',
    price: 2999,
    discountPrice: 999,
    isRecorded: true,
    isLive: false,
    status: 'active',
    validity: '2 years',
    priority: 5,
    category: 'english'
  },
  {
    id: '69f990eeb927c1a84afcbff8',
    title: 'English Special-8 (Live)',
    short_description: 'Dedicated live batch for SSC, Defence & Banking aspirants with Aman Sir.',
    price: 2999,
    discountPrice: 999,
    isRecorded: false,
    isLive: true,
    status: 'active',
    validity: '2 years',
    priority: 6,
    category: 'english'
  },
  {
    id: '69eb26c022cc6f4d5fd1b02e',
    title: 'Railway Foundation Batch -4',
    short_description: 'RRB NTPC, Group D, ALP, JE, Technician Grade I & III, RPF Constable & SI.',
    price: 2999,
    discountPrice: 999,
    isRecorded: false,
    isLive: true,
    status: 'active',
    validity: '2 years',
    priority: 7,
    category: 'railway'
  },
  {
    id: '697df3954ca8c7fbe8f501ee',
    title: 'RRB Group D Target Batch 2026',
    short_description: 'Specially designed for Railway Group D with focused Science & Math boosters.',
    price: 2999,
    discountPrice: 999,
    isRecorded: false,
    isLive: true,
    status: 'active',
    validity: '2 years',
    priority: 8,
    category: 'railway'
  },
  {
    id: '69f990e6b927c1a84afcbff2',
    title: 'GS Special -8 (Live Batch)',
    short_description: 'History, Polity, Geography, Economics & Static GK with Varun Sir.',
    price: 1999,
    discountPrice: 499,
    isRecorded: false,
    isLive: true,
    status: 'active',
    validity: '2 years',
    priority: 9,
    category: 'gs'
  },
  {
    id: '69f990e0b927c1a84afcbfed',
    title: 'Reasoning Special-8 (Live)',
    short_description: 'Verbal & Non-Verbal reasoning master course for SSC, Defence and State Exams.',
    price: 1999,
    discountPrice: 499,
    isRecorded: false,
    isLive: true,
    status: 'active',
    validity: '2 years',
    priority: 10,
    category: 'reasoning'
  },
  {
    id: '69550afab54cadeb6105fa51',
    title: 'उप्र कांस्टेबल सिपाhi BATCH 2026',
    short_description: 'Dedicated UP Police Constable preparation batch with live practice tests.',
    price: 2999,
    discountPrice: 499,
    isRecorded: false,
    isLive: true,
    status: 'active',
    validity: '1 year',
    priority: 11,
    category: 'state'
  },
  {
    id: '6933f35cdd258fd32320c55d',
    title: 'UPSI 2026 दरोगा बैच (Polity + Moolvidhi)',
    short_description: 'UP Police Sub-Inspector complete batch with IPC, CrPC, Constitution and Hindi.',
    price: 3999,
    discountPrice: 599,
    isRecorded: false,
    isLive: true,
    status: 'active',
    validity: '1 year',
    priority: 12,
    category: 'state'
  },
  {
    id: '69329844dd258fd3230f50d7',
    title: 'SSC GD Target Batch 2025-26',
    short_description: 'Dedicated for SSC GD from basics to advanced with model papers.',
    price: 3999,
    discountPrice: 499,
    isRecorded: false,
    isLive: true,
    status: 'active',
    validity: '1 year',
    priority: 13,
    category: 'ssc'
  },
  {
    id: '69204beb39642e9188a548b9',
    title: 'NCERT Science Foundation Batch 2026-27',
    short_description: 'Physics, Chemistry & Biology NCERT line-by-line breakdown with diagrams.',
    price: 2999,
    discountPrice: 299,
    isRecorded: false,
    isLive: true,
    status: 'active',
    validity: '2 years',
    priority: 14,
    category: 'gs'
  },
  {
    id: '69622fc8027f25d29ebca4f6',
    title: 'तथास्तु BATCH 2026 All-In-One',
    short_description: 'Comprehensive mega-batch for SSC, Railway and central government exams.',
    price: 2999,
    discountPrice: 759,
    isRecorded: false,
    isLive: true,
    status: 'active',
    validity: '2 years',
    priority: 15,
    category: 'ssc'
  },
  {
    id: '694403528b3dd15b95906023',
    title: 'Railway Reasoning Special Batch',
    short_description: 'Dedicated reasoning course tailored for RRB NTPC & Group D puzzles.',
    price: 1999,
    discountPrice: 399,
    isRecorded: false,
    isLive: true,
    status: 'active',
    validity: '2 years',
    priority: 16,
    category: 'reasoning'
  },
  {
    id: '6943f165cd0a679bc120abf4',
    title: 'Science Booster Practice Batch',
    short_description: 'Rapid 1000+ MCQ science booster for SSC CGL, Railways & CDS.',
    price: 2999,
    discountPrice: 199,
    isRecorded: false,
    isLive: true,
    status: 'active',
    validity: '2 years',
    priority: 17,
    category: 'gs'
  },
  {
    id: '68ef76338b84905b84eebde7',
    title: 'Vocab Mastery VOD Batch (Aman Sir)',
    short_description: 'Root words, mnemonics, idioms, phrasal verbs, and one-word substitutions.',
    price: 2999,
    discountPrice: 499,
    isRecorded: true,
    isLive: false,
    status: 'active',
    validity: '1 year',
    priority: 18,
    category: 'english'
  },
  {
    id: '698487d5fdd21a8a2d1a5270',
    title: 'GS संपूर्ण Batch (Free Access)',
    short_description: 'Complete General Studies foundation course by Shubham Sir.',
    price: 2999,
    discountPrice: 0,
    isRecorded: false,
    isLive: true,
    status: 'active',
    validity: '1 year',
    priority: 19,
    category: 'gs'
  },
  {
    id: '683def9c2f4523ef6c8b18cb',
    title: 'Defence All In One Master Batch',
    short_description: 'NDA, CDS, AFCAT, CAPF complete prep with mock SSB guidance.',
    price: 1899,
    discountPrice: 999,
    isRecorded: false,
    isLive: true,
    status: 'active',
    validity: '2 years',
    priority: 20,
    category: 'defence'
  }
];

// Sample default topics & classes generator for any batch (Multi-subject support: Maths, Reasoning, English, GS, Science)
export function generateSampleClassesForBatch(batch: BatchCourse): ClassTopic[] {
  const rawCat = batch.category;
  const cat = (
    typeof rawCat === 'string'
      ? rawCat
      : typeof (rawCat as any)?.name === 'string'
      ? (rawCat as any).name
      : typeof (rawCat as any)?.slug === 'string'
      ? (rawCat as any).slug
      : 'ssc'
  ).toLowerCase();

  // If specific single subject batch, provide deep chapter modules
  if (cat === 'maths') {
    return [
      {
        topicName: '📐 Subject 1: Complete Arithmetic (Percentage, Profit & Loss, SI-CI)',
        classes: [
          {
            id: `${batch.id}-m1`,
            title: 'Class 01: Percentage Basics & Fraction Conversion Speed Hack',
            teacherName: batch.facultyDetails?.name || 'Gagan Pratap Sir',
            startDate: new Date(Date.now() - 86400000 * 3).toISOString(),
            isLive: false,
            streamStatus: 'ended',
            class_link: 'https://selectionwaylive.hranker.com/561/6a83bace873324752d90fa46/playlist-mpl-vod.m3u8',
            mp4Recordings: [
              { quality: '720p', url: 'https://selectionwaylive.hranker.com/561/6a83bace873324752d90fa46/playlist-mpl-vod.m3u8', size: 482.37 },
              { quality: '480p', url: 'https://selectionwaylive.hranker.com/561/6a83bace873324752d90fa46/playlist-mpl-vod.m3u8', size: 332.55 },
              { quality: '360p', url: 'https://selectionwaylive.hranker.com/561/6a83bace873324752d90fa46/playlist-mpl-vod.m3u8', size: 238.36 },
              { quality: '240p', url: 'https://selectionwaylive.hranker.com/561/6a83bace873324752d90fa46/playlist-mpl-vod.m3u8', size: 177.25 }
            ],
            classPdf: [
              { name: 'Lecture 01 - Complete Class Board Work PDF.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '3.4 MB' }
            ],
            dpp: [
              { name: 'DPP-01: Percentage 30 Level-1 & Level-2 Practice Questions with Solution Key.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '2.1 MB' }
            ],
            classNotes: [
              { name: 'Class 01 Handwritten Classroom Board Notes (Full HD Ink).pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '4.8 MB' }
            ],
            shortNotes: [
              { name: 'Percentage Speed Conversion Golden Short Notes & Formulas.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '1.2 MB' }
            ]
          },
          {
            id: `${batch.id}-m2`,
            title: 'Class 02: Profit & Loss Marked Price & Successive Discount Tricks',
            teacherName: batch.facultyDetails?.name || 'Gagan Pratap Sir',
            startDate: new Date(Date.now() - 86400000 * 2).toISOString(),
            isLive: false,
            streamStatus: 'ended',
            class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            mp4Recordings: [
              { quality: '720p (HD)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', size: 310 }
            ],
            classPdf: [
              { name: 'Lecture 02 - Profit & Loss Slide Handout.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '2.9 MB' }
            ],
            dpp: [
              { name: 'DPP-02: Profit, Loss & Discount 25 PYQs with Explanations.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '1.8 MB' }
            ],
            classNotes: [
              { name: 'Class 02 Teacher Annotated Handwritten Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '3.6 MB' }
            ],
            shortNotes: [
              { name: 'Profit Loss 1-Page Rapid Revision Mindmap.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '980 KB' }
            ]
          },
          {
            id: `${batch.id}-m3`,
            title: 'Class 03: Simple Interest & Compound Interest Formula-Free Method',
            teacherName: batch.facultyDetails?.name || 'Gagan Pratap Sir',
            startDate: new Date().toISOString(),
            isLive: batch.isLive ?? false,
            streamStatus: batch.isLive ? 'live' : 'ended',
            class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            classPdf: [
              { name: 'Lecture 03 - SI & CI Tree Method Theory.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '3.1 MB' }
            ],
            dpp: [
              { name: 'DPP-03: SI & CI Installment & Ratio Method Worksheet.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '2.4 MB' }
            ],
            classNotes: [
              { name: 'Class 03 Handwritten Notes with Tree Diagrams.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '4.2 MB' }
            ],
            shortNotes: [
              { name: 'SI-CI Difference Shortcut Formulas 2 & 3 Years.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '1.1 MB' }
            ]
          }
        ]
      },
      {
        topicName: '📐 Subject 2: Advanced Maths (Geometry, Mensuration 2D/3D)',
        classes: [
          {
            id: `${batch.id}-g1`,
            title: 'Class 01: Triangles Similarity, Congruence & Centers Properties',
            teacherName: batch.facultyDetails?.name || 'Gagan Pratap Sir',
            startDate: new Date(Date.now() - 86400000 * 1).toISOString(),
            isLive: false,
            streamStatus: 'ended',
            class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            classPdf: [
              { name: 'Lecture 01 Geometry Triangles Board PDF.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '3.8 MB' }
            ],
            dpp: [
              { name: 'DPP-01: Triangles Geometry 30 Selected Questions.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '2.0 MB' }
            ],
            classNotes: [
              { name: 'Class 01 Geometry Full Handwritten Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '5.1 MB' }
            ],
            shortNotes: [
              { name: 'Triangle Incentre, Circumcentre, Orthocentre Quick Formula Sheet.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '1.3 MB' }
            ]
          },
          {
            id: `${batch.id}-g2`,
            title: 'Class 02: Circles Tangents, Chords & Cyclic Quadrilateral Theorems',
            teacherName: batch.facultyDetails?.name || 'Gagan Pratap Sir',
            startDate: new Date().toISOString(),
            isLive: false,
            streamStatus: 'ended',
            class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            classPdf: [
              { name: 'Lecture 02 Circles & Quadrilaterals Slides.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '3.2 MB' }
            ],
            dpp: [
              { name: 'DPP-02: Circle Tangents and Chords High-Level Problems.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '2.2 MB' }
            ],
            classNotes: [
              { name: 'Class 02 Geometry Circle Handwritten Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '4.5 MB' }
            ],
            shortNotes: [
              { name: 'Circle Theorems & Direct Common Tangent Formulas.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '1.0 MB' }
            ]
          }
        ]
      },
      {
        topicName: '📐 Subject 3: Algebra & Trigonometry Identity Mastery',
        classes: [
          {
            id: `${batch.id}-a1`,
            title: 'Class 01: Algebraic Identities x + 1/x Special Forms',
            teacherName: batch.facultyDetails?.name || 'Gagan Pratap Sir',
            startDate: new Date(Date.now() - 86400000 * 2).toISOString(),
            isLive: false,
            streamStatus: 'ended',
            class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            classPdf: [
              { name: 'Lecture 01 Algebra Formulas Board PDF.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '2.7 MB' }
            ],
            dpp: [
              { name: 'DPP-01: Algebra 40 Speed Calculation Problems.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '1.9 MB' }
            ],
            classNotes: [
              { name: 'Class 01 Algebra Handwritten Class Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '3.9 MB' }
            ],
            shortNotes: [
              { name: 'Algebra 20 Golden Formulae Pocket Sheet.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '850 KB' }
            ]
          },
          {
            id: `${batch.id}-a2`,
            title: 'Class 02: Trigonometry Maxima-Minima & Value Putting Tricks',
            teacherName: batch.facultyDetails?.name || 'Gagan Pratap Sir',
            startDate: new Date(Date.now() + 86400000).toISOString(),
            isLive: false,
            streamStatus: 'upcoming',
            class_link: 'https://t.me/NST_XY_09',
            classPdf: [
              { name: 'Lecture 02 Trigonometry Table & Values PDF.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '3.0 MB' }
            ],
            dpp: [
              { name: 'DPP-02: Trigonometry Value Putting Sheet.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '2.1 MB' }
            ],
            classNotes: [
              { name: 'Class 02 Trigonometry Classroom Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '4.1 MB' }
            ],
            shortNotes: [
              { name: 'Trig Identities & Angles Chart Short Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '920 KB' }
            ]
          }
        ]
      },
      {
        topicName: '📊 Subject 4: Data Interpretation (DI) & Number System',
        classes: [
          {
            id: `${batch.id}-di1`,
            title: 'Class 01: Number System Divisibility Rules & Remainder Theorem',
            teacherName: batch.facultyDetails?.name || 'Gagan Pratap Sir',
            startDate: new Date(Date.now() - 86400000 * 4).toISOString(),
            isLive: false,
            streamStatus: 'ended',
            class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            classPdf: [
              { name: 'Lecture 01 Number System Concepts.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '2.5 MB' }
            ],
            dpp: [
              { name: 'DPP-01: Number System Remainder Theorem Worksheet.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '1.7 MB' }
            ],
            classNotes: [
              { name: 'Class 01 Number System Handwritten Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '3.4 MB' }
            ],
            shortNotes: [
              { name: 'Divisibility Rules 2 to 99 Quick Short Note.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '780 KB' }
            ]
          },
          {
            id: `${batch.id}-di2`,
            title: 'Class 02: Bar Chart, Pie Chart & Tabular DI Speed Solving',
            teacherName: batch.facultyDetails?.name || 'Gagan Pratap Sir',
            startDate: new Date().toISOString(),
            isLive: false,
            streamStatus: 'ended',
            class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            classPdf: [
              { name: 'Lecture 02 DI Charts Handout.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '2.8 MB' }
            ],
            dpp: [
              { name: 'DPP-02: DI Practice Set 20 Questions.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '1.9 MB' }
            ],
            classNotes: [
              { name: 'Class 02 DI Handwritten Solution Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '3.7 MB' }
            ],
            shortNotes: [
              { name: 'DI Ratio & Average Calculation Shortcuts.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '820 KB' }
            ]
          }
        ]
      }
    ];
  }

  // Full-Curriculum Multi-Subject Batch (Maths, Reasoning, English, General Studies, Science)
  return [
    {
      topicName: '📐 Subject 1: Quantitative Aptitude / Mathematics (Gagan Sir)',
      classes: [
        {
          id: `${batch.id}-qa1`,
          title: 'Class 01: Complete Maths Roadmap & Live HLS Lecture',
          teacherName: 'Gagan Pratap Sir',
          startDate: new Date(Date.now() - 86400000 * 4).toISOString(),
          isLive: false,
          streamStatus: 'ended',
          class_link: 'https://selectionwaylive.hranker.com/561/6a83bace873324752d90fa46/playlist-mpl-vod.m3u8',
          mp4Recordings: [
            { quality: '720p', url: 'https://selectionwaylive.hranker.com/561/6a83bace873324752d90fa46/playlist-mpl-vod.m3u8', size: 482.37 },
            { quality: '480p', url: 'https://selectionwaylive.hranker.com/561/6a83bace873324752d90fa46/playlist-mpl-vod.m3u8', size: 332.55 },
            { quality: '360p', url: 'https://selectionwaylive.hranker.com/561/6a83bace873324752d90fa46/playlist-mpl-vod.m3u8', size: 238.36 },
            { quality: '240p', url: 'https://selectionwaylive.hranker.com/561/6a83bace873324752d90fa46/playlist-mpl-vod.m3u8', size: 177.25 }
          ],
          classPdf: [
            { name: 'Lecture 01 - Vedic Maths & Speed Calculation Handout.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '3.4 MB' }
          ],
          dpp: [
            { name: 'DPP-01: Maths Speed Calculation & Percentages Practice Set.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '2.1 MB' }
          ],
          classNotes: [
            { name: 'Class 01 Complete Handwritten Board Notes (HD Ink).pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '4.8 MB' }
          ],
          shortNotes: [
            { name: 'Speed Calculation & Multiplication Tricks Short Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '1.2 MB' }
          ]
        },
        {
          id: `${batch.id}-qa2`,
          title: 'Class 02: Percentage & Ratio Proportion Concept Builders',
          teacherName: 'Gagan Pratap Sir',
          startDate: new Date(Date.now() - 86400000 * 2).toISOString(),
          isLive: false,
          streamStatus: 'ended',
          class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          mp4Recordings: [
            { quality: '720p (HD)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', size: 310 }
          ],
          classPdf: [
            { name: 'Lecture 02 - Percentage & Ratio Proportion Handout.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '2.8 MB' }
          ],
          dpp: [
            { name: 'DPP-02: Ratio & Percentage 30 Exam PYQs.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '1.9 MB' }
          ],
          classNotes: [
            { name: 'Class 02 Gagan Sir Handwritten Class Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '3.9 MB' }
          ],
          shortNotes: [
            { name: 'Ratio & Fraction Conversion Key Short Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '890 KB' }
          ]
        },
        {
          id: `${batch.id}-qa3`,
          title: 'Class 03: Time & Work, Pipes & Cisterns Shortcut Methods',
          teacherName: 'Gagan Pratap Sir',
          startDate: new Date().toISOString(),
          isLive: batch.isLive ?? false,
          streamStatus: batch.isLive ? 'live' : 'ended',
          class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          classPdf: [
            { name: 'Lecture 03 - Time & Work Efficiency Method Slides.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '3.0 MB' }
          ],
          dpp: [
            { name: 'DPP-03: Time & Work Efficiency 25 Questions.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '2.0 MB' }
          ],
          classNotes: [
            { name: 'Class 03 Time & Work Handwritten Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '4.1 MB' }
          ],
          shortNotes: [
            { name: 'Pipes & Cisterns Alternate Working Formula CheatSheet.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '940 KB' }
          ]
        }
      ]
    },
    {
      topicName: '🧠 Subject 2: Reasoning Ability & Logical Mind (Praveen Sir)',
      classes: [
        {
          id: `${batch.id}-re1`,
          title: 'Class 01: Coding-Decoding & Alphabet Number Series Hacks',
          teacherName: 'Praveen Sir',
          startDate: new Date(Date.now() - 86400000 * 3).toISOString(),
          isLive: false,
          streamStatus: 'ended',
          class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          classPdf: [
            { name: 'Lecture 01 Coding Decoding Concept Sheet.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '2.4 MB' }
          ],
          dpp: [
            { name: 'DPP-01: Coding-Decoding 40 Practice Questions.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '1.6 MB' }
          ],
          classNotes: [
            { name: 'Class 01 Reasoning Alphabet Positioning Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '3.2 MB' }
          ],
          shortNotes: [
            { name: 'EJOTY & Reverse Alphabet Quick Mnemonics.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '650 KB' }
          ]
        },
        {
          id: `${batch.id}-re2`,
          title: 'Class 02: Syllogism 100-50 & Venn Diagram 10-Second Method',
          teacherName: 'Praveen Sir',
          startDate: new Date(Date.now() - 86400000 * 1).toISOString(),
          isLive: false,
          streamStatus: 'ended',
          class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          classPdf: [
            { name: 'Lecture 02 Syllogism Rules PDF.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '2.6 MB' }
          ],
          dpp: [
            { name: 'DPP-02: Syllogism Possibility Cases Practice Sheet.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '1.8 MB' }
          ],
          classNotes: [
            { name: 'Class 02 Syllogism Handwritten Class Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '3.5 MB' }
          ],
          shortNotes: [
            { name: 'Syllogism Only/Few Golden Rules Short Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '720 KB' }
          ]
        },
        {
          id: `${batch.id}-re3`,
          title: 'Class 03: Blood Relation, Direction & Ranking Masterclass',
          teacherName: 'Praveen Sir',
          startDate: new Date(Date.now() + 86400000).toISOString(),
          isLive: false,
          streamStatus: 'upcoming',
          class_link: 'https://t.me/NST_XY_09',
          classPdf: [
            { name: 'Lecture 03 Blood Relation Tree Diagram Handout.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '2.5 MB' }
          ],
          dpp: [
            { name: 'DPP-03: Blood Relation & Direction Test DPP.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '1.7 MB' }
          ],
          classNotes: [
            { name: 'Class 03 Blood Relation Handwritten Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '3.3 MB' }
          ],
          shortNotes: [
            { name: 'Direction Angles & Pythagorean Shortcuts.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '680 KB' }
          ]
        }
      ]
    },
    {
      topicName: '📖 Subject 3: English Language & Grammar Rules (Aman Vashisth Sir)',
      classes: [
        {
          id: `${batch.id}-en1`,
          title: 'Class 01: 120 Golden Rules of Grammar (Subject-Verb & Tenses)',
          teacherName: 'Aman Vashisth Sir',
          startDate: new Date(Date.now() - 86400000 * 3).toISOString(),
          isLive: false,
          streamStatus: 'ended',
          class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          classPdf: [
            { name: 'Lecture 01 120 Grammar Rules Part-1 Handout.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '3.5 MB' }
          ],
          dpp: [
            { name: 'DPP-01: Subject-Verb Agreement 50 Error Spotting.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '2.2 MB' }
          ],
          classNotes: [
            { name: 'Class 01 Aman Sir Grammar Handwritten Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '4.6 MB' }
          ],
          shortNotes: [
            { name: 'Top 30 Common Error Triggers Quick Short Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '1.1 MB' }
          ]
        },
        {
          id: `${batch.id}-en2`,
          title: 'Class 02: Vocabulary Root Words, Idioms & Phrasal Verbs Mnemonics',
          teacherName: 'Aman Vashisth Sir',
          startDate: new Date(Date.now() - 86400000).toISOString(),
          isLive: false,
          streamStatus: 'ended',
          class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          classPdf: [
            { name: 'Lecture 02 Root Words & Idiom Visual Flashcards.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '4.2 MB' }
          ],
          dpp: [
            { name: 'DPP-02: 100 Most Repeated SSC Synonyms & Antonyms.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '2.3 MB' }
          ],
          classNotes: [
            { name: 'Class 02 Vocab Mnemonics Handwritten Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '4.0 MB' }
          ],
          shortNotes: [
            { name: '50 High-Frequency Phrasal Verbs Quick Short Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '950 KB' }
          ]
        },
        {
          id: `${batch.id}-en3`,
          title: 'Class 03: Cloze Test & Reading Comprehension Elimination Technique',
          teacherName: 'Aman Vashisth Sir',
          startDate: new Date().toISOString(),
          isLive: false,
          streamStatus: 'ended',
          class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          classPdf: [
            { name: 'Lecture 03 Comprehension Strategies Handout.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '2.9 MB' }
          ],
          dpp: [
            { name: 'DPP-03: 10 Cloze Tests with Step-by-Step Analysis.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '1.9 MB' }
          ],
          classNotes: [
            { name: 'Class 03 Reading Comprehension Handwritten Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '3.6 MB' }
          ],
          shortNotes: [
            { name: 'Tone of Passage & Context Clues Quick Short Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '860 KB' }
          ]
        }
      ]
    },
    {
      topicName: '🏛️ Subject 4: General Studies (Indian Polity, History & Geography)',
      classes: [
        {
          id: `${batch.id}-gs1`,
          title: 'Class 01: Indian Constitution Fundamental Rights & Articles 12-35',
          teacherName: 'Varun Awasthi Sir',
          startDate: new Date(Date.now() - 86400000 * 4).toISOString(),
          isLive: false,
          streamStatus: 'ended',
          class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          classPdf: [
            { name: 'Lecture 01 Polity Articles 12-35 Chart PDF.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '3.2 MB' }
          ],
          dpp: [
            { name: 'DPP-01: Indian Polity 50 Important MCQs with Solutions.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '2.1 MB' }
          ],
          classNotes: [
            { name: 'Class 01 Indian Polity Handwritten Class Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '4.5 MB' }
          ],
          shortNotes: [
            { name: 'Fundamental Rights & Writs Summary Short Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '1.0 MB' }
          ]
        },
        {
          id: `${batch.id}-gs2`,
          title: 'Class 02: Modern Indian History 1857 to 1947 Freedom Struggle Timeline',
          teacherName: 'Varun Awasthi Sir',
          startDate: new Date(Date.now() - 86400000 * 2).toISOString(),
          isLive: false,
          streamStatus: 'ended',
          class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          classPdf: [
            { name: 'Lecture 02 Modern History Chronology Chart.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '3.6 MB' }
          ],
          dpp: [
            { name: 'DPP-02: Modern History Viceroy & Movement Questions.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '2.0 MB' }
          ],
          classNotes: [
            { name: 'Class 02 Freedom Struggle Handwritten Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '4.3 MB' }
          ],
          shortNotes: [
            { name: 'Governor Generals & Key Acts Quick Revision Sheet.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '980 KB' }
          ]
        }
      ]
    },
    {
      topicName: '🔬 Subject 5: General Science (Physics, Chemistry & Biology)',
      classes: [
        {
          id: `${batch.id}-sc1`,
          title: 'Class 01: Human Physiology, Vitamins, Diseases & Nutrition Booster',
          teacherName: 'Radhika Mam',
          startDate: new Date(Date.now() - 86400000 * 2).toISOString(),
          isLive: false,
          streamStatus: 'ended',
          class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          classPdf: [
            { name: 'Lecture 01 Biology Vitamins & Diseases Diagram PDF.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '3.7 MB' }
          ],
          dpp: [
            { name: 'DPP-01: Science 40 NCERT Exemplar Questions.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '2.2 MB' }
          ],
          classNotes: [
            { name: 'Class 01 Human Physiology Handwritten Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '4.7 MB' }
          ],
          shortNotes: [
            { name: 'Vitamins Chemical Names & Deficiency Short Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '1.1 MB' }
          ]
        },
        {
          id: `${batch.id}-sc2`,
          title: 'Class 02: Physics Optics, Light Reflection, Refraction & Electricity',
          teacherName: 'Radhika Mam',
          startDate: new Date().toISOString(),
          isLive: false,
          streamStatus: 'ended',
          class_link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          classPdf: [
            { name: 'Lecture 02 Physics Optics Mirror & Lens Formula.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'pdf', size: '3.3 MB' }
          ],
          dpp: [
            { name: 'DPP-02: Physics Numerical Worksheet & Solution.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'dpp', size: '1.9 MB' }
          ],
          classNotes: [
            { name: 'Class 02 Physics Optics Handwritten Notes.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'notes', size: '4.4 MB' }
          ],
          shortNotes: [
            { name: 'Lens Formula & Sign Convention Quick Mindmap.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', type: 'short-notes', size: '920 KB' }
          ]
        }
      ]
    }
  ];
}

// Sample default PDF topics per subject
export function generateSamplePdfsForBatch(batch: BatchCourse): PdfTopic[] {
  return [
    {
      topicName: '📐 Subject 1: Maths Handwritten Formula Book & DPPs',
      pdfs: [
        {
          id: 'pdf-m1',
          title: 'Maths Class Notes: Percentage, Ratio & Profit Loss (Red/Blue Ink)',
          teacherName: 'Gagan Pratap Sir',
          uploadPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          date: '2026-03-01'
        },
        {
          id: 'pdf-m2',
          title: 'Advanced Geometry 100 Golden Theorems & Mind Map PDF',
          teacherName: 'Gagan Pratap Sir',
          uploadPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          date: '2026-03-05'
        }
      ]
    },
    {
      topicName: '🧠 Subject 2: Reasoning Shortcuts & Question Bank',
      pdfs: [
        {
          id: 'pdf-r1',
          title: 'Reasoning Top 500 PYQs with Hand Solution Guide',
          teacherName: 'Praveen Sir',
          uploadPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          date: '2026-03-08'
        }
      ]
    },
    {
      topicName: '📖 Subject 3: English 120 Grammar Rules & Vocab Booster',
      pdfs: [
        {
          id: 'pdf-e1',
          title: '120 Rules of English Grammar with Hindi Explanation',
          teacherName: 'Aman Vashisth Sir',
          uploadPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          date: '2026-03-10'
        }
      ]
    },
    {
      topicName: '🏛️ Subject 4: General Studies Complete Theory Notes',
      pdfs: [
        {
          id: 'pdf-g1',
          title: 'Indian Polity & Constitution Articles Chart PDF',
          teacherName: 'Varun Awasthi Sir',
          uploadPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          date: '2026-03-12'
        }
      ]
    },
    {
      topicName: '🔬 Subject 5: General Science NCERT Summary PDF',
      pdfs: [
        {
          id: 'pdf-s1',
          title: 'Biology & Physics High-Yield Diagram Workbook',
          teacherName: 'Radhika Mam',
          uploadPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          date: '2026-03-14'
        }
      ]
    }
  ];
}
