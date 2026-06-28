/* ============================================================
   APEX RIGOR MCQ — Vanilla JS Application
   Converted from React/TypeScript original.
   Fixes: generation now actually saves the deck to storage.
   ============================================================ */

'use strict';

// ============================================================
// SVG ICONS (inline strings for dynamic content)
// ============================================================
const IC = {
  sparkles:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
  grad:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  play:      `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  trash:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  download:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  filejson:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/><path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"/></svg>`,
  chevR:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  chevD:     `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  chevU:     `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`,
  arrowL:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  check:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  xmark:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  star:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  starFill:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  lightbulb: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>`,
  book:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  upload:    `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>`,
  filetext:  `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  settings:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  refresh:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  award:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
  brain:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`,
  info:      `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  alert:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  checkCirc: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
};

// ============================================================
// DEFAULT SAMPLE DECK
// ============================================================
const DEFAULT_DECK = {
  id: 'entropy-and-information',
  title: "Maxwell's Demon & Landauer's Principle",
  createdAt: new Date().toISOString(),
  sourceName: 'Information Physics Foundations',
  sourceType: 'text',
  difficulty: 'Extremely Challenging',
  cognitiveLevel: 'Mixed (High-Order)',
  format: 'Standard 4-Option',
  questions: [
    {
      question: "In the context of Maxwell's Demon and Landauer's Principle, what is the fundamental thermodynamic reason why the sorting of particles by the demon does not violate the Second Law of Thermodynamics?",
      options: [
        "The physical mechanical sorting process requires mechanical work that precisely offsets the entropy reduction in the gas.",
        "The demon's memory is finite, and the logical erasure of each bit of recorded info necessarily dissipates at least k·T·ln(2) of heat into the environment.",
        "The demon operates in a quantum coherent domain where traditional macroscopic entropy calculations are fundamentally invalid.",
        "The sorted gas particles undergo an irreversible adiabatic expansion that compensates for the local sorting order."
      ],
      correctIndex: 1,
      explanation: "According to Landauer's Principle (1961), any logically irreversible manipulation of information—such as the erasure of a bit of memory—must be accompanied by a thermodynamic cost of at least k·T·ln(2) Joules of heat dissipated into the environment. While sorting seems to decrease entropy locally, the demon must store measurement data. Erasing this data to reset the demon's memory increases the entropy of the environment, fully preserving the Second Law.",
      topic: "Information Thermodynamics",
      cognitiveLevel: "Analyzing"
    },
    {
      question: "Which of the following best characterizes the 'measurement problem' in standard Copenhagen quantum mechanics, and how does the Many-Worlds Interpretation (MWI) mathematically bypass it?",
      options: [
        "Copenhagen lacks a mathematical description for the non-unitary 'collapse' of the wavefunction; MWI bypasses this by postulating that the wavefunction never collapses and the observer merely entangles with the system.",
        "Copenhagen assumes observers are purely classical; MWI resolves this by redefining classical observers as quantum states governed by localized gravitational anomalies.",
        "Copenhagen requires infinite measurement intervals; MWI bypasses this by utilizing finite-dimensional Hilbert space calculations which scale logarithmically.",
        "Copenhagen cannot explain why independent observers agree on outcomes; MWI bypasses this by having observers live in separate, non-communicating parallel dimensions."
      ],
      correctIndex: 0,
      explanation: "In standard Copenhagen quantum mechanics, the wavefunction evolves deterministically under the Schrödinger equation but undergoes a sudden, non-unitary 'collapse' upon measurement, which is not mathematically derived from the theory. The Many-Worlds Interpretation proposed by Hugh Everett III resolves this by asserting that the wave function never collapses. All physical processes are unitary and deterministic. The observer and system simply become entangled, branching the universe into orthogonal superpositions.",
      topic: "Quantum Foundations",
      cognitiveLevel: "Evaluating"
    },
    {
      question: "Suppose an economy is in a liquidity trap. If the central bank increases the money supply through massive quantitative easing (QE), what does the Keynesian IS-LM framework predict regarding the immediate impact on interest rates and real GDP?",
      options: [
        "Interest rates will plunge below zero, triggering an immediate spike in private investment and causing real GDP to expand rapidly.",
        "Interest rates will remain virtually unchanged because the money demand curve is perfectly elastic at the lower bound, resulting in no shift in the LM curve or real GDP.",
        "The money supply increase shifts the IS curve rightward, raising interest rates and expanding real GDP through the government spending multiplier.",
        "The velocity of money increases dramatically, driving hyperinflation while leaving real GDP and real interest rates completely unaffected."
      ],
      correctIndex: 1,
      explanation: "In a liquidity trap, the demand for money becomes horizontal (perfectly elastic) at a very low interest rate because people expect bonds to lose value or yield near-zero. Increasing the money supply (QE) fails to lower interest rates further. In the IS-LM framework, the LM curve is horizontal in this range. A shift in the money supply does not shift the active horizontal section of the LM curve, meaning interest rates and aggregate output remain completely unchanged. Monetary policy becomes ineffective.",
      topic: "Macroeconomics",
      cognitiveLevel: "Applying"
    },
    {
      question: "Under Bloom's Taxonomy, which task most accurately represents the 'Evaluating' level of cognitive complexity in the design of a psychological study?",
      options: [
        "Explaining the differences between classical conditioning and operant conditioning in behavioral science.",
        "Formulating a novel hypothesis regarding neuroplasticity in geriatric patients.",
        "Critiquing a peer-reviewed research study on cognitive bias based on its methodological flaws and sample size limitations.",
        "Calculating the statistical power and p-value of a pre-existing clinical trial dataset."
      ],
      correctIndex: 2,
      explanation: "The 'Evaluating' level in Bloom's Taxonomy involves making judgments based on criteria and standards. Critiquing a peer-reviewed study's methodology, identifying potential confounding variables, and analyzing sample bias represents active evaluation. In contrast, 'Explaining' is Understanding, 'Formulating' a new hypothesis is Creating, and 'Calculating' statistical power is Applying.",
      topic: "Psychometrics",
      cognitiveLevel: "Evaluating"
    },
    {
      question: "Why is the classic 'All of the above' option strongly discouraged by modern academic psychometricians when designing high-stakes, analytically rigorous multiple-choice assessments?",
      options: [
        "It increases the grading complexity for electronic optical scanning systems.",
        "It allows test-takers to successfully identify the correct answer by recognizing only two correct options, introducing a structural guessing bias.",
        "It artificially inflates the reading comprehension time compared to standard vertical lists.",
        "It violates the primary laws of classical test theory regarding standard item difficulty coefficients."
      ],
      correctIndex: 1,
      explanation: "In high-stakes testing, 'All of the above' reduces the cognitive rigor of the item. If a test-taker is certain that at least two of the four choices are correct, they can logically conclude that 'All of the above' must be the correct answer, even if they are completely ignorant of the third option. This structural flaw enables partial knowledge to get full credit, undermining the diagnostic rigor of the item.",
      topic: "Assessment Methodology",
      cognitiveLevel: "Understanding"
    }
  ]
};

// ============================================================
// STATE
// ============================================================
const state = {
  currentTab: 'home',
  deviceMode: 'mobile',
  decks: [],
  selectedDeck: null,
  activeSession: null,
  currentQuestionIndex: 0,
  showAnswerFeedback: false,
  stats: {
    quizzesTaken: 0,
    totalQuestionsAnswered: 0,
    totalCorrectQuestions: 0,
    averageAccuracy: 0,
    topicPerformance: {},
    cognitivePerformance: {}
  },
  // Generator
  inputMode: 'text',
  generatorText: '',
  uploadedFile: null,
  numQuestions: 5,
  cognitiveLevel: 'Mixed',
  difficulty: 'Hard',
  format: 'Standard 4-Option',
  focusTopic: '',
  customTitle: '',
  geminiApiKey: '',
  isGenerating: false,
  generationError: null,
  generationSuccess: null,
  loadingPhase: '',
  // Quiz
  hintUsed: false,
  flaggedQuestions: {},
  revealedRationales: {}
};

// ============================================================
// STORAGE HELPERS
// ============================================================
function loadStorage() {
  try {
    const decks = JSON.parse(localStorage.getItem('rigor_mcq_decks') || 'null');
    state.decks = (decks && decks.length) ? decks : [DEFAULT_DECK];
    if (!decks || !decks.length) saveDecks();
  } catch (e) {
    state.decks = [DEFAULT_DECK];
  }
  try {
    const s = JSON.parse(localStorage.getItem('rigor_mcq_stats') || 'null');
    if (s) state.stats = s;
  } catch (e) {}
  state.geminiApiKey = localStorage.getItem('gemini_api_key') || '';
}

function saveDecks() {
  localStorage.setItem('rigor_mcq_decks', JSON.stringify(state.decks));
}

function saveStats() {
  localStorage.setItem('rigor_mcq_stats', JSON.stringify(state.stats));
}

// ============================================================
// SIMULATED CLOCK
// ============================================================
function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const el = document.getElementById('clock');
  if (el) el.textContent = `${h}:${m} ${ampm}`;
}

// ============================================================
// NAVIGATION
// ============================================================
const App = {

  setDeviceMode(mode) {
    state.deviceMode = mode;
    const frame = document.getElementById('device-frame');
    frame.classList.toggle('mobile-mode', mode === 'mobile');
    frame.classList.toggle('full-mode', mode === 'full');
    document.getElementById('btn-mobile').classList.toggle('active', mode === 'mobile');
    document.getElementById('btn-full').classList.toggle('active', mode === 'full');
    // Show/hide gesture bar
    const g = document.getElementById('gesture-bar');
    if (g) g.style.display = mode === 'mobile' ? 'flex' : 'none';
  },

  navigate(tab) {
    state.currentTab = tab;
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    // Show target
    const target = document.getElementById('screen-' + tab);
    if (target) {
      target.classList.add('active');
      target.classList.add('fade-in');
      setTimeout(() => target.classList.remove('fade-in'), 300);
    }
    // Update nav highlight
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    // Render the screen
    renderScreen(tab);
  }
};

function renderScreen(tab) {
  switch (tab) {
    case 'home':     renderHome(); break;
    case 'generate': renderGenerate(); break;
    case 'library':  renderLibrary(); break;
    case 'quiz':     renderQuiz(); break;
    case 'review':   renderReview(); break;
  }
}

// ============================================================
// RENDER — HOME
// ============================================================
function renderHome() {
  const el = document.getElementById('screen-home');
  const { stats, decks } = state;
  const accuracy = stats.quizzesTaken > 0 ? `${stats.averageAccuracy}%` : 'N/A';

  const recentDecks = decks.slice(0, 3);

  const deckItemsHTML = decks.length === 0
    ? `<div class="empty-state">
        ${IC.filetext}
        <p>No study decks loaded yet.</p>
        <small>Generate dynamic decks to get started!</small>
       </div>`
    : recentDecks.map(d => `
        <div class="deck-item" onclick="startQuiz('${d.id}')">
          <div class="deck-item-left">
            <div class="deck-icon-box">${IC.grad}</div>
            <div style="min-width:0">
              <span class="deck-title">${esc(d.title)}</span>
              <div class="deck-meta">
                <span>${d.questions.length} Items</span>
                <span>·</span>
                <span>${esc(d.difficulty)}</span>
              </div>
            </div>
          </div>
          <div class="deck-item-actions">
            <button class="btn-icon accent" title="Export" onclick="event.stopPropagation(); exportMD('${d.id}')">${IC.download}</button>
            <button class="btn-icon danger" title="Delete" onclick="event.stopPropagation(); deleteDeck('${d.id}')">${IC.trash}</button>
            <span style="color:var(--accent);margin-left:2px">${IC.play}</span>
          </div>
        </div>`).join('');

  el.innerHTML = `
    <div class="home-header">
      <div class="home-header-left">
        <p>Psychometric Suite</p>
        <h2>Apex Rigor MCQ</h2>
      </div>
      <div class="home-icon-box">${IC.grad}</div>
    </div>

    <div class="stats-card">
      <div class="stats-card-header">
        <span>Your Cognitive Scorecard</span>
        <span class="tag tag-amber">★ Elite Level</span>
      </div>
      <div class="stats-grid">
        <div class="stat-box">
          <span class="stat-label">Accuracy</span>
          <span class="stat-value accent">${accuracy}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Answered</span>
          <span class="stat-value">${stats.totalQuestionsAnswered}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Quizzes</span>
          <span class="stat-value">${stats.quizzesTaken}</span>
        </div>
      </div>
    </div>

    <button class="generate-cta" onclick="App.navigate('generate')">
      <div class="cta-left">
        <div class="cta-icon-box">${IC.sparkles}</div>
        <div>
          <span class="cta-title">Generate New Rigorous Decks</span>
          <span class="cta-sub">Convert PDF, notes, or images to MCQs</span>
        </div>
      </div>
      ${IC.chevR}
    </button>

    <div>
      <div class="section-header">
        <span class="section-title">Active MCQ Library</span>
        <button class="see-all-btn" onclick="App.navigate('library')">See All ${IC.chevR}</button>
      </div>
      <div id="home-deck-list">${deckItemsHTML}</div>
    </div>

    <div class="home-info" style="margin-top:16px">
      <div class="home-info-header">${IC.brain} <span>Academic Psychometrics</span></div>
      <p>APEX uses professional cognitive assessment models aligning with <strong style="color:var(--accent)">Bloom's Higher-Order Taxonomy</strong>. Questions avoid surface-level recall to prioritize reasoning, diagnostic evaluation, and scenario-based logic checks.</p>
    </div>
  `;
}

// ============================================================
// RENDER — GENERATE
// ============================================================
function renderGenerate() {
  const el = document.getElementById('screen-generate');
  const { inputMode, generatorText, uploadedFile, numQuestions, cognitiveLevel,
          difficulty, format, focusTopic, customTitle, geminiApiKey,
          isGenerating, generationError, generationSuccess, loadingPhase } = state;

  const textAreaHTML = `
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:5px">
        <label class="form-label" style="margin:0">Study Notes / Transcripts / Research Text</label>
        <span style="font-size:10px;color:var(--text3);font-family:monospace" id="char-count">${generatorText.length} chars</span>
      </div>
      <textarea id="gen-textarea" class="form-textarea" rows="7"
        placeholder="Paste textbook sections, research abstracts, raw transcripts, clinical notes or code files here..."
        oninput="state.generatorText=this.value; document.getElementById('char-count').textContent=this.value.length+' chars'"
      >${esc(generatorText)}</textarea>
    </div>`;

  const fileZoneHTML = `
    <div class="file-zone" style="margin-bottom:14px">
      <input type="file" id="file-input" accept=".txt,.md,.json,.csv,.pdf,.ppt,.pptx,image/*" onchange="handleFileInput(event)">
      ${IC.upload}
      ${uploadedFile
        ? `<p class="file-ready">${esc(uploadedFile.name)}</p>
           <p class="file-mime">Ready to Analyze · MIME: ${esc(uploadedFile.mimeType)}</p>`
        : `<p style="font-size:12px;font-weight:600;color:var(--text2);margin-bottom:4px">Drag & drop or click to browse</p>
           <p style="font-size:10px;color:var(--text3)">Supports PowerPoint, PDF, Markdown, Images, Word, Text</p>`
      }
    </div>`;

  const errorHTML = generationError
    ? `<div class="error-box">${IC.alert}<span>${esc(generationError)}</span></div>` : '';

  const successHTML = generationSuccess
    ? `<div class="success-box">${IC.checkCirc}<span>${esc(generationSuccess)}</span></div>` : '';

  el.innerHTML = `
    <div class="gen-header">
      <h3>${IC.sparkles} Analytic Generator</h3>
      <p>Transform any source document directly into rigorous MCQs.</p>
    </div>

    <!-- Input mode toggle -->
    <div class="mode-toggle">
      <button class="mode-btn ${inputMode === 'text' ? 'active' : ''}" onclick="switchInputMode('text')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Pasted Canvas
      </button>
      <button class="mode-btn ${inputMode === 'file' ? 'active' : ''}" onclick="switchInputMode('file')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
        Document Upload
      </button>
    </div>

    ${inputMode === 'text' ? textAreaHTML : fileZoneHTML}

    <!-- Settings -->
    <div class="settings-panel">
      <div class="settings-header">${IC.settings} Rigor Metrics Calibration</div>
      <div class="settings-grid">
        <div class="field">
          <label class="form-label">Custom Title</label>
          <input class="form-input" type="text" id="inp-title" placeholder="e.g. Molecular Biology"
            value="${esc(customTitle)}" oninput="state.customTitle=this.value">
        </div>
        <div class="field">
          <label class="form-label">Topic Focus Filter</label>
          <input class="form-input" type="text" id="inp-topic" placeholder="e.g. Quantum Entropy"
            value="${esc(focusTopic)}" oninput="state.focusTopic=this.value">
        </div>
        <div class="field">
          <label class="form-label">Question Count</label>
          <select class="form-select" id="sel-num" onchange="state.numQuestions=+this.value">
            ${[5,10,15,20].map(n => `<option value="${n}" ${numQuestions===n?'selected':''}>${n} Questions</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label class="form-label">Cognitive Complexity</label>
          <select class="form-select" id="sel-cog" onchange="state.cognitiveLevel=this.value">
            ${['Mixed','Remembering','Understanding','Applying','Analyzing','Evaluating','Creating']
              .map(c => `<option value="${c}" ${cognitiveLevel===c?'selected':''}>${c}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label class="form-label">Target Difficulty</label>
          <select class="form-select" id="sel-diff" onchange="state.difficulty=this.value">
            ${[['Mixed','Mixed Difficulty'],['Easy','Standard Academic (Easy)'],['Medium','Undergraduate (Medium)'],['Hard','Professional Licensing (Hard)'],['Extremely Challenging','GRE / MCAT Advanced (Extreme)']]
              .map(([v,l]) => `<option value="${v}" ${difficulty===v?'selected':''}>${l}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label class="form-label">MCQ Format Style</label>
          <select class="form-select" id="sel-fmt" onchange="state.format=this.value">
            ${[['Standard 4-Option','Standard (A, B, C, D)'],['Assertion-Reasoning','Assertion-Reasoning'],['Scenario-Based Cases','Case-Study Scenario'],['Multiple-Response Select','Multiple-Response Select']]
              .map(([v,l]) => `<option value="${v}" ${format===v?'selected':''}>${l}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>

    <!-- API Key -->
    <div class="api-key-box">
      <label class="form-label">🔑 Gemini API Key</label>
      <input class="form-input" type="password" id="inp-apikey"
        placeholder="Paste your Gemini API key here..."
        value="${esc(geminiApiKey)}"
        oninput="state.geminiApiKey=this.value; localStorage.setItem('gemini_api_key',this.value)">
      <small>Get a free key at <a href="https://aistudio.google.com/apikey" target="_blank">aistudio.google.com/apikey</a> · Saved locally in your browser.</small>
    </div>

    ${errorHTML}
    ${successHTML}

    <!-- Generate button -->
    <button class="btn-primary" id="gen-btn" onclick="triggerGeneration()" ${isGenerating ? 'disabled' : ''}>
      ${isGenerating
        ? `<span class="spin" style="display:inline-block">${IC.refresh}</span> <span style="font-size:10px">${esc(loadingPhase)}</span>`
        : `${IC.sparkles} Compile Rigorous MCQs`}
    </button>
  `;
}

// ============================================================
// RENDER — LIBRARY
// ============================================================
function renderLibrary() {
  const el = document.getElementById('screen-library');
  const { decks } = state;

  const cardsHTML = decks.length === 0
    ? `<div class="empty-state" style="padding:40px 20px">
        ${IC.filetext}
        <p style="margin-bottom:6px">Your Library is empty</p>
        <small>Generate a deck from pasted text or uploads!</small>
        <div style="margin-top:12px">
          <button onclick="App.navigate('generate')"
            style="background:var(--accent-bg);color:var(--accent);border:1px solid var(--accent-bd);border-radius:8px;padding:7px 16px;font-size:11px;font-weight:600;cursor:pointer">
            Go to Generator
          </button>
        </div>
       </div>`
    : decks.map(d => `
        <div class="lib-deck-card" onclick="startQuiz('${d.id}')">
          <div class="lib-deck-header">
            <div>
              <span class="lib-deck-title">${esc(d.title)}</span>
              <span class="lib-deck-source">Source: ${esc(d.sourceName || 'Canvas Text')}</span>
            </div>
            <span style="color:var(--accent);margin-top:2px">${IC.play}</span>
          </div>
          <div class="lib-deck-footer">
            <div class="lib-deck-tags">
              <span class="tag tag-amber">${d.questions.length} Qs</span>
              <span class="tag tag-zinc">${esc(d.difficulty)}</span>
            </div>
            <div class="lib-deck-actions" onclick="event.stopPropagation()">
              <button class="lib-action-btn" title="Export Markdown" onclick="exportMD('${d.id}')">${IC.download}</button>
              <button class="lib-action-btn" title="Export JSON" onclick="exportJSON('${d.id}')">${IC.filejson}</button>
              <button class="lib-action-btn danger" title="Delete" onclick="deleteDeck('${d.id}')">${IC.trash}</button>
            </div>
          </div>
        </div>`).join('');

  el.innerHTML = `
    <div class="library-header">
      <div>
        <h3>${IC.book} MCQ Deck Repository</h3>
        <p>Load or export your saved evaluations.</p>
      </div>
      <span class="deck-count">${decks.length} Deck${decks.length !== 1 ? 's' : ''}</span>
    </div>
    <div id="lib-deck-list">${cardsHTML}</div>
  `;
}

// ============================================================
// RENDER — QUIZ
// ============================================================
function renderQuiz() {
  const el = document.getElementById('screen-quiz');
  const { selectedDeck, activeSession, currentQuestionIndex,
          showAnswerFeedback, hintUsed, flaggedQuestions } = state;

  if (!selectedDeck || !activeSession) {
    el.innerHTML = `<p style="padding:20px;color:var(--text3)">No active quiz. Return to <button onclick="App.navigate('home')" style="color:var(--accent)">Dashboard</button>.</p>`;
    return;
  }

  const q = selectedDeck.questions[currentQuestionIndex];
  const total = selectedDeck.questions.length;
  const isFlagged = !!flaggedQuestions[currentQuestionIndex];
  const alphas = ['A', 'B', 'C', 'D'];

  const optionsHTML = q.options.map((opt, i) => {
    const isSelected = activeSession.answers[currentQuestionIndex] === i;
    const isCorrect  = i === q.correctIndex;
    let cls = '';
    let feedbackIcon = '';
    if (showAnswerFeedback) {
      if (isCorrect) { cls = 'correct'; feedbackIcon = `<span class="option-feedback-icon" style="color:var(--ok)">${IC.check}</span>`; }
      else if (isSelected) { cls = 'wrong'; feedbackIcon = `<span class="option-feedback-icon" style="color:var(--err)">${IC.xmark}</span>`; }
      else { cls = 'faded'; }
    } else if (isSelected) {
      cls = 'selected';
    }
    return `
      <button class="option-btn ${cls}" ${showAnswerFeedback ? 'disabled' : ''}
        onclick="selectOption(${i})">
        <span class="option-alpha">${alphas[i]}</span>
        <span class="option-text">${esc(opt)}</span>
        ${feedbackIcon}
      </button>`;
  }).join('');

  const hintSection = !showAnswerFeedback ? `
    <div class="quiz-actions">
      <button class="hint-btn" ${hintUsed ? 'disabled' : ''} onclick="useHint()">
        ${IC.lightbulb}
        <span>${hintUsed ? 'Topic Revealed' : 'Reveal Context Hint'}</span>
      </button>
    </div>
    ${hintUsed ? `
      <div class="hint-box">
        <div class="hint-box-title">${IC.info} Psychometric Insight</div>
        This question targets <strong style="color:var(--text2)">${esc(q.topic)}</strong>.
        Focus on the core principle behind this topic — consider what distinguishes correct conceptual
        understanding from common misconceptions in this domain.
      </div>` : ''}
  ` : `
    <div class="quiz-actions">
      <button class="next-btn" onclick="nextQuestion()">
        ${currentQuestionIndex === total - 1 ? 'Finish Assessment' : 'Next Question'}
        ${IC.chevR}
      </button>
    </div>
    <div class="explanation-box fade-in">
      <div class="explanation-header">${IC.checkCirc} Analytical Rationale Breakdown</div>
      <p class="explanation-text">${esc(q.explanation)}</p>
      <div class="explanation-footer">
        <span>COGNITIVE: ${esc(q.cognitiveLevel)}</span>
        <span>TOPIC: ${esc(q.topic)}</span>
      </div>
    </div>`;

  el.innerHTML = `
    <div class="quiz-topbar">
      <button class="back-btn" onclick="abandonQuiz()">${IC.arrowL}</button>
      <span class="quiz-deck-title">${esc(selectedDeck.title)}</span>
      <span class="q-counter">Q ${currentQuestionIndex + 1}/${total}</span>
    </div>

    <div class="question-card">
      <div class="q-tags">
        <span class="tag tag-amber">${esc(q.cognitiveLevel || 'Analytical')}</span>
        <span class="tag tag-zinc" style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${esc(q.topic || 'Concept Study')}
        </span>
        <button class="flag-btn ${isFlagged ? 'flagged' : ''}" onclick="toggleFlag(${currentQuestionIndex})" title="Flag question">
          ${isFlagged ? IC.starFill : IC.star}
        </button>
      </div>
      <p class="q-text">${esc(q.question)}</p>
    </div>

    <div class="options-list">${optionsHTML}</div>

    ${hintSection}
  `;
}

// ============================================================
// RENDER — REVIEW
// ============================================================
function renderReview() {
  const el = document.getElementById('screen-review');
  const { selectedDeck, activeSession, revealedRationales } = state;

  if (!selectedDeck || !activeSession) {
    el.innerHTML = `<p style="padding:20px;color:var(--text3)">No review data.</p>`;
    return;
  }

  const score = activeSession.score;
  const circumference = 2 * Math.PI * 40; // r=40
  const offset = circumference - (circumference * score / 100);

  const statusText = score >= 80 ? 'Mastery Attained' : score >= 50 ? 'Proficient' : 'Revision Suggested';
  const completedAt = activeSession.completedAt
    ? new Date(activeSession.completedAt).toLocaleTimeString()
    : '';

  const itemsHTML = selectedDeck.questions.map((q, i) => {
    const selOpt = activeSession.answers[i];
    const isCorrect = selOpt === q.correctIndex;
    const revealed = !!revealedRationales[i];

    const rationaleHTML = revealed ? `
      <div class="rationale-panel">
        <p class="correct-opt">
          <strong>Correct Option: </strong>${esc(q.options[q.correctIndex])}
        </p>
        ${selOpt !== q.correctIndex && selOpt !== undefined ? `
          <p class="correct-opt wrong-opt">
            <strong>Your Selection: </strong>${esc(q.options[selOpt])}
          </p>` : ''}
        <p class="rationale-text">${esc(q.explanation)}</p>
      </div>` : '';

    return `
      <div class="review-item">
        <div class="review-item-header">
          <p class="review-q-text">
            <span class="review-q-num">${i + 1}.</span>${esc(q.question)}
          </p>
          <span class="review-correct-icon ${isCorrect ? 'ok' : 'err'}">
            ${isCorrect ? IC.check : IC.xmark}
          </span>
        </div>
        <div class="review-item-meta">
          <div class="review-tags">
            <span>${esc(q.cognitiveLevel)}</span>
            <span>·</span>
            <span>${esc(q.topic)}</span>
          </div>
          <button class="inspect-btn" onclick="toggleRationale(${i})">
            ${revealed ? 'Hide' : 'Inspect'} Rationale
            ${revealed ? IC.chevU : IC.chevD}
          </button>
        </div>
        ${rationaleHTML}
      </div>`;
  }).join('');

  el.innerHTML = `
    <div class="score-card">
      <div class="score-ring-wrapper">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border)" stroke-width="7"/>
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--accent)" stroke-width="7"
            stroke-dasharray="${circumference.toFixed(2)}"
            stroke-dashoffset="${offset.toFixed(2)}"
            stroke-linecap="round"/>
        </svg>
        <span class="score-value">${score}%</span>
      </div>
      <p class="score-sub">Evaluation Completed</p>
      <h3 class="score-status">${statusText}</h3>
      ${completedAt ? `<p class="score-time">Completed at ${completedAt}</p>` : ''}
    </div>

    <div class="breakdown-header">
      <span class="breakdown-title">Item Breakdown</span>
      <button class="export-btn-sm" onclick="exportMD('${selectedDeck.id}')">
        ${IC.download} Export Markdown
      </button>
    </div>

    <div id="review-items">${itemsHTML}</div>

    <div class="review-footer-btns">
      <button class="btn-secondary" onclick="startQuiz('${selectedDeck.id}')">
        ${IC.refresh} Re-Take
      </button>
      <button class="btn-primary" onclick="App.navigate('home')">
        ${IC.award} Return Dashboard
      </button>
    </div>
  `;
}

// ============================================================
// QUIZ LOGIC
// ============================================================
function startQuiz(deckId) {
  const deck = state.decks.find(d => d.id === deckId);
  if (!deck) return;
  state.selectedDeck = deck;
  state.activeSession = {
    deckId: deck.id,
    answers: {},
    isCompleted: false,
    score: 0,
    startedAt: new Date().toISOString()
  };
  state.currentQuestionIndex = 0;
  state.showAnswerFeedback = false;
  state.hintUsed = false;
  state.flaggedQuestions = {};
  state.revealedRationales = {};

  // Show quiz screen (not in main nav, so handle manually)
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-quiz').classList.add('active');
  // Don't update nav highlight — quiz is not a nav tab
  renderQuiz();
}

function abandonQuiz() {
  if (confirm('Abandon current quiz session? Progress will be lost.')) {
    App.navigate('home');
  }
}

function selectOption(optIdx) {
  if (state.showAnswerFeedback) return;
  state.activeSession.answers[state.currentQuestionIndex] = optIdx;
  state.showAnswerFeedback = true;
  renderQuiz();
}

function nextQuestion() {
  const { selectedDeck, activeSession, currentQuestionIndex } = state;
  if (!selectedDeck || !activeSession) return;
  const total = selectedDeck.questions.length;

  if (currentQuestionIndex < total - 1) {
    state.currentQuestionIndex++;
    state.showAnswerFeedback = false;
    state.hintUsed = false;
    renderQuiz();
  } else {
    // Finish
    let correct = 0;
    selectedDeck.questions.forEach((q, i) => {
      if (activeSession.answers[i] === q.correctIndex) correct++;
    });
    const score = Math.round((correct / total) * 100);
    state.activeSession = {
      ...activeSession,
      isCompleted: true,
      score,
      completedAt: new Date().toISOString()
    };
    recordSessionStats(state.activeSession, selectedDeck);

    // Show review screen
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-review').classList.add('active');
    renderReview();
  }
}

function useHint() {
  state.hintUsed = true;
  renderQuiz();
}

function toggleFlag(idx) {
  state.flaggedQuestions[idx] = !state.flaggedQuestions[idx];
  renderQuiz();
}

function toggleRationale(idx) {
  state.revealedRationales[idx] = !state.revealedRationales[idx];
  renderReview();
}

function recordSessionStats(session, deck) {
  const s = state.stats;
  let correct = 0;
  deck.questions.forEach((q, i) => {
    if (session.answers[i] === q.correctIndex) correct++;
  });

  s.quizzesTaken++;
  s.totalQuestionsAnswered += deck.questions.length;
  s.totalCorrectQuestions += correct;
  s.averageAccuracy = Math.round((s.totalCorrectQuestions / s.totalQuestionsAnswered) * 100);

  deck.questions.forEach((q, i) => {
    const isCorrect = session.answers[i] === q.correctIndex;
    const topic = q.topic || 'General';
    const cog   = q.cognitiveLevel || 'Understanding';

    if (!s.topicPerformance[topic]) s.topicPerformance[topic] = { total: 0, correct: 0 };
    s.topicPerformance[topic].total++;
    if (isCorrect) s.topicPerformance[topic].correct++;

    if (!s.cognitivePerformance[cog]) s.cognitivePerformance[cog] = { total: 0, correct: 0 };
    s.cognitivePerformance[cog].total++;
    if (isCorrect) s.cognitivePerformance[cog].correct++;
  });

  saveStats();
}

// ============================================================
// DECK MANAGEMENT
// ============================================================
function deleteDeck(deckId) {
  if (!confirm('Delete this deck? This cannot be undone.')) return;
  state.decks = state.decks.filter(d => d.id !== deckId);
  saveDecks();
  // Re-render whatever is currently visible
  renderScreen(state.currentTab);
}

function exportMD(deckId) {
  const deck = state.decks.find(d => d.id === deckId);
  if (!deck) return;
  let md = `# MCQ Study Deck: ${deck.title}\n`;
  md += `*Generated: ${new Date(deck.createdAt).toLocaleDateString()} | Difficulty: ${deck.difficulty} | Bloom's Level: ${deck.cognitiveLevel}*\n\n`;
  deck.questions.forEach((q, i) => {
    md += `### Q${i + 1}. ${q.question}\n`;
    ['A','B','C','D'].forEach((l, j) => {
      md += `${l}) ${q.options[j]}${j === q.correctIndex ? ' ✓ (Correct Answer)' : ''}\n`;
    });
    md += `\n**Sub-Topic:** ${q.topic || 'General'}\n`;
    md += `**Cognitive Level:** ${q.cognitiveLevel || 'Unknown'}\n`;
    md += `**Rationale:** ${q.explanation}\n\n---\n\n`;
  });
  downloadText(md, `${deck.title.toLowerCase().replace(/\s+/g, '_')}_mcqs.md`, 'text/markdown');
}

function exportJSON(deckId) {
  const deck = state.decks.find(d => d.id === deckId);
  if (!deck) return;
  downloadText(JSON.stringify(deck, null, 2), `${deck.title.toLowerCase().replace(/\s+/g, '_')}_mcqs.json`, 'application/json');
}

function downloadText(content, filename, type) {
  const blob = new Blob([content], { type });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ============================================================
// GENERATOR — FILE HANDLING
// ============================================================
function switchInputMode(mode) {
  state.inputMode = mode;
  state.uploadedFile = null;
  renderGenerate();
}

function handleFileInput(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const isText = /\.(txt|md|json|csv|xml)$/i.test(file.name);
  const reader = new FileReader();

  if (isText) {
    reader.onload = ev => {
      state.uploadedFile = {
        name: file.name,
        base64: btoa(unescape(encodeURIComponent(ev.target.result))),
        mimeType: 'text/plain'
      };
      renderGenerate();
    };
    reader.readAsText(file);
  } else {
    reader.onload = ev => {
      const result = ev.target.result;
      const base64 = result.split(',')[1];
      const ext = file.name.split('.').pop()?.toLowerCase();
      let mimeType = file.type;
      if (!mimeType || mimeType === 'application/octet-stream') {
        if (ext === 'pptx') mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        else if (ext === 'ppt') mimeType = 'application/vnd.ms-powerpoint';
        else mimeType = 'application/pdf';
      }
      state.uploadedFile = { name: file.name, base64, mimeType };
      renderGenerate();
    };
    reader.readAsDataURL(file);
  }
}

// ============================================================
// GENERATOR — GEMINI API CALL
// ============================================================
async function triggerGeneration() {
  const { inputMode, generatorText, uploadedFile, numQuestions, cognitiveLevel,
          difficulty, format, focusTopic, customTitle, geminiApiKey } = state;

  // Validate
  if (!geminiApiKey) {
    state.generationError = 'Please enter your Gemini API key.';
    state.generationSuccess = null;
    renderGenerate(); return;
  }
  if (inputMode === 'text' && !generatorText.trim()) {
    state.generationError = 'Please paste study text first.';
    state.generationSuccess = null;
    renderGenerate(); return;
  }
  if (inputMode === 'file' && !uploadedFile) {
    state.generationError = 'Please upload a file.';
    state.generationSuccess = null;
    renderGenerate(); return;
  }

  state.isGenerating = true;
  state.generationError = null;
  state.generationSuccess = null;
  localStorage.setItem('gemini_api_key', geminiApiKey);

  const phases = [
    'Analyzing context structure...',
    'Deconstructing conceptual schema...',
    'Identifying high-order pedagogical focal points...',
    'Drafting cognitive level questions...',
    'Validating logically rigorous distractors...',
    'Formatting final structured rationale decks...'
  ];
  let phaseIdx = 0;
  state.loadingPhase = phases[0];
  renderGenerate();

  const phaseInterval = setInterval(() => {
    phaseIdx = (phaseIdx + 1) % phases.length;
    state.loadingPhase = phases[phaseIdx];
    renderGenerate();
  }, 2200);

  try {
    // Build prompt
    let textToSend = generatorText;
    let fileB64 = null;
    let fileMime = null;

    if (inputMode === 'file' && uploadedFile) {
      fileB64  = uploadedFile.base64;
      fileMime = uploadedFile.mimeType;
      if (fileMime === 'text/plain') {
        textToSend = decodeURIComponent(escape(atob(fileB64)));
      }
    }

    const isOfficeFile = fileMime && (
      fileMime.includes('presentationml') ||
      fileMime.includes('powerpoint') ||
      fileMime.includes('wordprocessingml') ||
      fileMime.includes('msword') ||
      fileMime.includes('spreadsheetml') ||
      fileMime.includes('excel')
    );

    let promptText = `Generate exactly ${numQuestions} analytically rigorous multiple-choice questions (MCQs) based STRICTLY AND ONLY on the provided document content.\n\nCRITICAL: All questions, correct answers, distractors, and explanations MUST be directly sourced from and fully verifiable using ONLY the provided document. Do NOT use outside general knowledge.\n\nTarget Parameters:\n- Difficulty Level: ${difficulty}\n- Cognitive Level (Bloom's Taxonomy): ${cognitiveLevel}\n- MCQ Format: ${format}\n${focusTopic ? `- Specific Topic Focus: ${focusTopic}` : ''}\n\nStrict Quality Instructions:\n1. Plausible Distractors: Must represent common misconceptions or logical pitfalls.\n2. Scientific/Logical Precision: Unambiguous, exactly one correct answer.\n3. Bloom's Taxonomy Alignment: Higher-order questions must require multi-step reasoning.\n4. Detailed Explanation: Why correct option is right and why others are wrong.\n5. Exactly 4 options per question.\n6. STRICT SOURCE FIDELITY: Ground everything in the provided content.\n`;

    if (textToSend) promptText += `\n\nSource Text Content:\n${textToSend}`;
    if (isOfficeFile) promptText += `\n\n[Note: A ${fileMime} file was uploaded. Generate questions based on the document context provided.]`;

    // Build parts
    const parts = [];
    if (fileB64 && fileMime && !isOfficeFile) {
      parts.push({ inlineData: { mimeType: fileMime, data: fileB64 } });
    }
    parts.push({ text: promptText });

    // Build request body for Gemini REST API
    const body = {
      systemInstruction: {
        parts: [{ text: 'You are an elite academic psychometrician. Generate MCQs strictly based on the provided content only. Return valid JSON array.' }]
      },
      contents: [{ role: 'user', parts }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              question:       { type: 'STRING' },
              options:        { type: 'ARRAY', items: { type: 'STRING' } },
              correctIndex:   { type: 'INTEGER' },
              explanation:    { type: 'STRING' },
              topic:          { type: 'STRING' },
              cognitiveLevel: { type: 'STRING' }
            },
            required: ['question', 'options', 'correctIndex', 'explanation', 'topic', 'cognitiveLevel']
          }
        }
      }
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiApiKey)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response generated from Gemini. Please try again.');

    const mcqs = JSON.parse(text.trim());
    if (!Array.isArray(mcqs) || mcqs.length === 0) throw new Error('Invalid response format from AI. Please retry.');

    // Build and save new deck
    const sourceName = uploadedFile?.name || (textToSend.slice(0, 40) + '…');
    const newDeck = {
      id: 'deck-' + Date.now(),
      title: customTitle || `MCQ Deck — ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      questions: mcqs,
      sourceName,
      sourceType: inputMode,
      difficulty,
      cognitiveLevel,
      format
    };

    state.decks = [newDeck, ...state.decks];
    saveDecks();

    state.generationSuccess = `✓ ${mcqs.length} questions generated and saved! Open the Library tab to start your quiz.`;
    // Reset inputs
    state.generatorText = '';
    state.uploadedFile = null;
    state.customTitle  = '';
    state.focusTopic   = '';

  } catch (err) {
    console.error('Generation error:', err);
    state.generationError = err.message || 'An unexpected error occurred.';
  } finally {
    clearInterval(phaseInterval);
    state.isGenerating = false;
    state.loadingPhase = '';
    renderGenerate();
  }
}

// ============================================================
// UTILITIES
// ============================================================
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================
// INIT
// ============================================================
function init() {
  loadStorage();
  App.setDeviceMode('mobile');
  App.navigate('home');
  updateClock();
  setInterval(updateClock, 30000);
}

document.addEventListener('DOMContentLoaded', init);
