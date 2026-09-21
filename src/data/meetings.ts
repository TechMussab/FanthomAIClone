export interface Attendee {
  id: string
  name: string
  role: string
  avatar: string
  email: string
}

export interface TranscriptEntry {
  timestamp: number
  speaker: string
  avatar: string
  text: string
}

export interface Summary {
  executive: string
  engineering: string
  sales: string
  actionItems: string[]
}

export interface Highlight {
  id: string
  timestamp: number
  endTimestamp: number
  title: string
}

export interface Meeting {
  id: string
  title: string
  date: string
  duration: number
  attendees: Attendee[]
  videoUrl: string
  transcript: TranscriptEntry[]
  summaries: Summary
  highlights: Highlight[]
}

const attendees = {
  alice: {
    id: '1',
    name: 'Alice Johnson',
    role: 'Engineering Lead',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    email: 'alice@company.com',
  },
  bob: {
    id: '2',
    name: 'Bob Smith',
    role: 'Product Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    email: 'bob@company.com',
  },
  carol: {
    id: '3',
    name: 'Carol Davis',
    role: 'Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
    email: 'carol@company.com',
  },
  david: {
    id: '4',
    name: 'David Wilson',
    role: 'Sales Lead',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    email: 'david@company.com',
  },
  emma: {
    id: '5',
    name: 'Emma Brown',
    role: 'QA Engineer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    email: 'emma@company.com',
  },
  frank: {
    id: '6',
    name: 'Frank Miller',
    role: 'Backend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank',
    email: 'frank@company.com',
  },
  grace: {
    id: '7',
    name: 'Grace Lee',
    role: 'Frontend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace',
    email: 'grace@company.com',
  },
  henry: {
    id: '8',
    name: 'Henry Chen',
    role: 'CEO',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry',
    email: 'henry@company.com',
  },
}
// for testing youtube video meeting data, this is a real youtube video with a transcript and summary
export const ytArchitectureMeeting = {
  id: "meeting-mvvm-vs-mvi",
  title: "Android Architecture Review: MVVM vs MVI Pattern Analysis",
  date: "2026-09-21T10:00:00Z",
  duration: 1840,
  type: "youtube",
  youtubeId: "b2z1jvD4VMQ",
  attendees: [
    { id: "8", name: "Philipp Lackner", avatar: "https://i.pravatar.cc/150?u=philipp", role: "Lead Mobile Architect" }
  ],
  videoUrl: null, // YouTube video URL will be constructed from youtubeId
  transcript: [
    { id: "t1", startSeconds: 0, speaker: "Philipp Lackner", text: "Welcome back! Today we are comparing MVVM vs MVI in Android native development once and for all." },
    { id: "t2", startSeconds: 92, speaker: "Philipp Lackner", text: "Both MVVM (Model-View-ViewModel) and MVI (Model-View-Intent) are presentational patterns meant to separate your presentation layer." },
    { id: "t3", startSeconds: 140, speaker: "Philipp Lackner", text: "In both patterns, the Model implements project-wide business rules and logic, like Data Classes in Kotlin." },
    { id: "t4", startSeconds: 281, speaker: "Philipp Lackner", text: "The View refers strictly to the UI layer—whether XML layouts, View classes, or Jetpack Compose composables." },
    { id: "t5", startSeconds: 304, speaker: "Philipp Lackner", text: "The ViewModel contains state mapping logic and processes incoming UI actions to update state." },
    { id: "t6", startSeconds: 367, speaker: "Philipp Lackner", text: "In MVVM, each UI state property is exposed as an individual State flow or reference." },
    { id: "t7", startSeconds: 484, speaker: "Philipp Lackner", text: "In MVI, all screen states are bundled into a single immutable UI State wrapper class with an Intent/Action sealed interface." },
    { id: "t8", startSeconds: 965, speaker: "Philipp Lackner", text: "MVI gives better readability because you can inspect the full state class in 5 lines of code." }
  ],
  summaries: {
    executive: "Detailed architectural breakdown comparing MVVM and MVI presentational patterns. Highlighted how MVI improves readability via single immutable UI state wrappers and Intent sealed interfaces.",
    engineering: "1. Presentation Layer Scope: MVVM/MVI only manage UI/ViewModel presentation, not clean architecture domain/data layers.\n2. State Management: MVVM uses multiple StateFlows; MVI uses a unified UIState copy data class.\n3. User Actions: MVI encapsulates UI interactions inside an `onAction` sealed interface.",
    actionItems: [
      "Standardize UI state wrapper pattern across Jetpack Compose screens",
      "Evaluate migration of multi-state flows to MVI single state representations"
    ]
  }
};

export const meetings: Meeting[] = [
  {
    id: 'meeting-1',
    title: 'Engineering Standup',
    date: '2024-09-20',
    duration: 1800,
    attendees: [attendees.alice, attendees.emma, attendees.frank, attendees.grace],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/big_buck_bunny.mp4',
    transcript: [
      {
        timestamp: 0,
        speaker: 'Alice Johnson',
        avatar: attendees.alice.avatar,
        text: 'Good morning everyone. Let\'s kick off with a quick standup. Frank, what did you work on yesterday?',
      },
      {
        timestamp: 15,
        speaker: 'Frank Miller',
        avatar: attendees.frank.avatar,
        text: 'I finished the API refactoring for the user service. All tests are passing and it\'s ready for code review.',
      },
      {
        timestamp: 40,
        speaker: 'Grace Lee',
        avatar: attendees.grace.avatar,
        text: 'I started working on the new dashboard components. I\'ll have the first version ready by end of day.',
      },
      {
        timestamp: 65,
        speaker: 'Emma Brown',
        avatar: attendees.emma.avatar,
        text: 'I\'ve been running integration tests on the payment module. Found a couple of edge cases we need to fix.',
      },
      {
        timestamp: 90,
        speaker: 'Alice Johnson',
        avatar: attendees.alice.avatar,
        text: 'Great work everyone. Emma, can you create tickets for those edge cases? Let\'s prioritize them for this sprint.',
      },
    ],
    summaries: {
      executive: 'Engineering team completed user service refactoring and began dashboard redesign. One payment module issue identified.',
      engineering: 'API refactoring completed and merged. Dashboard components in progress. Payment module edge cases found and need fixing.',
      sales: 'Backend infrastructure improvements underway. Expected to improve system performance and stability.',
      actionItems: [
        'Create tickets for payment module edge cases',
        'Complete dashboard component designs',
        'Review Frank\'s API refactoring PR',
      ],
    },
    highlights: [
      {
        id: 'h1',
        timestamp: 15,
        endTimestamp: 40,
        title: 'API Refactoring Complete',
      },
    ],
  },
  {
    id: 'meeting-2',
    title: 'Design Review',
    date: '2024-09-19',
    duration: 2700,
    attendees: [attendees.carol, attendees.bob, attendees.alice, attendees.grace],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/big_buck_bunny.mp4',
    transcript: [
      {
        timestamp: 0,
        speaker: 'Carol Davis',
        avatar: attendees.carol.avatar,
        text: 'Thanks everyone for joining. Today we\'re reviewing the new dashboard mockups. Grace, can you walk us through the first iteration?',
      },
      {
        timestamp: 30,
        speaker: 'Grace Lee',
        avatar: attendees.grace.avatar,
        text: 'Sure! I\'ve redesigned the main dashboard with improved navigation and better data visualization.',
      },
      {
        timestamp: 60,
        speaker: 'Bob Smith',
        avatar: attendees.bob.avatar,
        text: 'This looks great. The new layout is much more intuitive. Can we add dark mode support?',
      },
      {
        timestamp: 90,
        speaker: 'Alice Johnson',
        avatar: attendees.alice.avatar,
        text: 'Dark mode is definitely on our roadmap. Grace, can you add that to the next iteration?',
      },
      {
        timestamp: 120,
        speaker: 'Carol Davis',
        avatar: attendees.carol.avatar,
        text: 'Approved for development. Let\'s target launch in two weeks.',
      },
    ],
    summaries: {
      executive: 'Dashboard redesign approved. Launch planned for two weeks with dark mode support.',
      engineering: 'Dashboard redesign approved. Grace to implement with dark mode as top priority.',
      sales: 'Improved user interface will enhance customer experience and reduce support tickets.',
      actionItems: [
        'Implement dashboard redesign',
        'Add dark mode support',
        'Schedule QA testing',
      ],
    },
    highlights: [
      {
        id: 'h2',
        timestamp: 60,
        endTimestamp: 90,
        title: 'Dark Mode Decision',
      },
    ],
  },
  {
    id: 'meeting-3',
    title: 'Sales Discovery Call',
    date: '2024-09-18',
    duration: 1200,
    attendees: [attendees.david, attendees.bob, attendees.carol],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/big_buck_bunny.mp4',
    transcript: [
      {
        timestamp: 0,
        speaker: 'David Wilson',
        avatar: attendees.david.avatar,
        text: 'Welcome to our discovery call. I\'d like to understand your key business challenges.',
      },
      {
        timestamp: 45,
        speaker: 'Bob Smith',
        avatar: attendees.bob.avatar,
        text: 'Our main challenge is scaling our customer communication platform. We need better analytics.',
      },
      {
        timestamp: 90,
        speaker: 'Carol Davis',
        avatar: attendees.carol.avatar,
        text: 'We\'re also interested in AI-powered insights to help our team make better decisions.',
      },
      {
        timestamp: 135,
        speaker: 'David Wilson',
        avatar: attendees.david.avatar,
        text: 'Perfect. Our platform handles exactly these use cases. I\'ll send you a demo link.',
      },
    ],
    summaries: {
      executive: 'Prospect identified need for communication platform scaling and AI-powered analytics.',
      engineering: 'Prospect needs analytics infrastructure and AI integration capabilities.',
      sales: 'Strong fit for our platform. Next step: product demo scheduled.',
      actionItems: [
        'Send product demo link',
        'Schedule follow-up call',
        'Prepare custom use case analysis',
      ],
    },
    highlights: [
      {
        id: 'h3',
        timestamp: 90,
        endTimestamp: 135,
        title: 'AI Insights Requirement Identified',
      },
    ],
  },
  {
    id: 'meeting-4',
    title: 'Product Planning Session',
    date: '2024-09-17',
    duration: 2400,
    attendees: [attendees.bob, attendees.alice, attendees.david, attendees.carol],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/big_buck_bunny.mp4',
    transcript: [
      {
        timestamp: 0,
        speaker: 'Bob Smith',
        avatar: attendees.bob.avatar,
        text: 'Let\'s review Q4 roadmap priorities. Alice, engineering perspective?',
      },
      {
        timestamp: 30,
        speaker: 'Alice Johnson',
        avatar: attendees.alice.avatar,
        text: 'We can deliver the API improvements and dashboard redesign. Security audit needed.',
      },
      {
        timestamp: 70,
        speaker: 'Carol Davis',
        avatar: attendees.carol.avatar,
        text: 'Design-wise, we\'re ready for the new user onboarding flow.',
      },
      {
        timestamp: 110,
        speaker: 'David Wilson',
        avatar: attendees.david.avatar,
        text: 'Sales perspective: clients are asking for better reporting and compliance features.',
      },
      {
        timestamp: 150,
        speaker: 'Bob Smith',
        avatar: attendees.bob.avatar,
        text: 'Let\'s add reporting and compliance to Q4. Alice, what\'s the effort estimate?',
      },
      {
        timestamp: 180,
        speaker: 'Alice Johnson',
        avatar: attendees.alice.avatar,
        text: 'About 3 sprints for full compliance suite and advanced reporting.',
      },
    ],
    summaries: {
      executive: 'Q4 roadmap set: API improvements, dashboard redesign, reporting, and compliance features.',
      engineering: 'Q4 roadmap: 3 sprints for API and security, dashboard redesign, 3 sprints for compliance.',
      sales: 'Reporting and compliance features approved for Q4 to address client requests.',
      actionItems: [
        'Schedule security audit',
        'Create compliance feature spec',
        'Plan sprint allocation',
        'Client communication on Q4 features',
      ],
    },
    highlights: [
      {
        id: 'h4',
        timestamp: 110,
        endTimestamp: 150,
        title: 'Q4 Roadmap Finalized',
      },
    ],
  },
  {
    id: 'meeting-5',
    title: 'All-Hands Sprint Review',
    date: '2024-09-16',
    duration: 3600,
    attendees: [
      attendees.henry,
      attendees.alice,
      attendees.bob,
      attendees.carol,
      attendees.david,
      attendees.emma,
      attendees.frank,
      attendees.grace,
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/big_buck_bunny.mp4',
    transcript: [
      {
        timestamp: 0,
        speaker: 'Henry Chen',
        avatar: attendees.henry.avatar,
        text: 'Welcome everyone to our all-hands sprint review. This has been an exceptional sprint. Let\'s celebrate wins and plan next steps.',
      },
      {
        timestamp: 45,
        speaker: 'Alice Johnson',
        avatar: attendees.alice.avatar,
        text: 'Engineering shipped the API refactoring and completed 8 of 9 planned features. Dashboard redesign is 75% complete.',
      },
      {
        timestamp: 120,
        speaker: 'Carol Davis',
        avatar: attendees.carol.avatar,
        text: 'Design delivered all mockups on time and conducted two client interviews for next quarter planning.',
      },
      {
        timestamp: 180,
        speaker: 'David Wilson',
        avatar: attendees.david.avatar,
        text: 'Sales closed 3 new enterprise deals totaling $500k ARR. Pipeline is strong for Q4.',
      },
      {
        timestamp: 240,
        speaker: 'Bob Smith',
        avatar: attendees.bob.avatar,
        text: 'Product team coordinated all releases successfully. Customer feedback is overwhelmingly positive.',
      },
      {
        timestamp: 300,
        speaker: 'Emma Brown',
        avatar: attendees.emma.avatar,
        text: 'QA team achieved 98% test coverage on critical paths. Defect escape rate is lowest on record.',
      },
      {
        timestamp: 360,
        speaker: 'Frank Miller',
        avatar: attendees.frank.avatar,
        text: 'Backend infrastructure improvements reduced API latency by 35%. System stability metrics are excellent.',
      },
      {
        timestamp: 420,
        speaker: 'Grace Lee',
        avatar: attendees.grace.avatar,
        text: 'Frontend development completed with zero critical bugs. Performance improvements show 40% faster load times.',
      },
      {
        timestamp: 480,
        speaker: 'Henry Chen',
        avatar: attendees.henry.avatar,
        text: 'Outstanding work everyone. We\'re on track for our annual goals. Next sprint priorities: security audit, compliance features, and enterprise scaling.',
      },
      {
        timestamp: 540,
        speaker: 'Henry Chen',
        avatar: attendees.henry.avatar,
        text: 'Let\'s take a break and reconvene in 5 minutes for open Q&A.',
      },
      {
        timestamp: 600,
        speaker: 'Henry Chen',
        avatar: attendees.henry.avatar,
        text: 'Welcome back everyone. I\'d like to open the floor for questions and comments from the team.',
      },
      {
        timestamp: 660,
        speaker: 'Frank Miller',
        avatar: attendees.frank.avatar,
        text: 'Henry, regarding the security audit - can we get an external firm involved?',
      },
      {
        timestamp: 690,
        speaker: 'Henry Chen',
        avatar: attendees.henry.avatar,
        text: 'Great question. Yes, we\'ve already budgeted for an external security firm. Alice, can you coordinate?',
      },
      {
        timestamp: 720,
        speaker: 'Alice Johnson',
        avatar: attendees.alice.avatar,
        text: 'Absolutely. I\'ll get proposals from top firms and we\'ll schedule for next month.',
      },
      {
        timestamp: 780,
        speaker: 'Grace Lee',
        avatar: attendees.grace.avatar,
        text: 'One more thing - can we prioritize accessibility improvements in Q4?',
      },
      {
        timestamp: 810,
        speaker: 'Bob Smith',
        avatar: attendees.bob.avatar,
        text: 'That\'s an excellent suggestion. Accessibility is critical. Let\'s add it to the roadmap.',
      },
      {
        timestamp: 840,
        speaker: 'Henry Chen',
        avatar: attendees.henry.avatar,
        text: 'Agreed. Grace, work with Carol on accessibility standards. Great sprint everyone. See you next week!',
      },
    ],
    summaries: {
      executive: '8-person team delivered exceptional sprint: API refactoring complete, 3 enterprise deals ($500k ARR), 98% test coverage, 35% latency improvement. Q4 focus: security, compliance, accessibility, and enterprise scaling.',
      engineering: 'All planned features shipped except one. API latency reduced 35%, 98% test coverage achieved, dashboard redesign 75% complete. Security audit and compliance suite planned for next sprint.',
      sales: '3 new enterprise deals closed totaling $500k ARR. Strong Q4 pipeline. Accessibility features identified as customer requirement.',
      actionItems: [
        'Coordinate external security audit',
        'Plan accessibility improvement sprints',
        'Complete dashboard redesign',
        'Implement compliance features',
        'Request security firm proposals',
        'Schedule next month security audit',
      ],
    },
    highlights: [
      {
        id: 'h5',
        timestamp: 300,
        endTimestamp: 360,
        title: '98% Test Coverage Achievement',
      },
      {
        id: 'h6',
        timestamp: 240,
        endTimestamp: 300,
        title: '$500k ARR in New Enterprise Deals',
      },
      {
        id: 'h7',
        timestamp: 420,
        endTimestamp: 480,
        title: '40% Performance Improvement',
      },
    ],
  },
]
