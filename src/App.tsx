import { GoogleGenAI } from '@google/genai';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Upload, FileText, CheckCircle2, AlertTriangle, 
  ChevronRight, Play, Award, Settings, BookOpen, Trash2, 
  ArrowLeft, RefreshCw, Smartphone, Monitor, Clock, Battery, 
  Wifi, Download, FileJson, Check, X, HelpCircle, Lightbulb, 
  Share2, Info, Star, BrainCircuit, BarChart3, HelpCircle as HelpIcon, 
  Clipboard, GraduationCap, CheckCircle, ChevronDown, ChevronUp, FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MCQQuestion, QuizDeck, QuizSession, PerformanceStats } from './types';

// Helper: Seed initial sample deck demonstrating elite analytical rigor
const DEFAULT_DECK: QuizDeck = {
  id: 'entropy-and-information',
  title: 'Maxwell\'s Demon & Landauer\'s Principle',
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
        "The demon's memory is finite, and the logical erasure of each bit of recorded info necessarily dissipates at least k*T*ln(2) of heat into the environment.",
        "The demon operates in a quantum coherent domain where traditional macroscopic entropy calculations are fundamentally invalid.",
        "The sorted gas particles undergo an irreversible adiabatic expansion that compensates for the local sorting order."
      ],
      correctIndex: 1,
      explanation: "According to Landauer's Principle (1961) and later refined by Charles Bennett, any logically irreversible manipulation of information, such as the erasure of a bit of memory, must be accompanied by a thermodynamic cost of at least k*T*ln(2) Joules of heat dissipated into the environment. While the sorting of gas particles seems to decrease entropy locally, the demon must store measurement data. Erasing this data to reset the demon's memory increases the entropy of the environment, fully preserving the Second Law.",
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
      explanation: "In standard Copenhagen quantum mechanics, the wavefunction evolves deterministically under the SchrÃ¶dinger equation (unitary evolution), but undergoes a sudden, non-unitary 'collapse' upon measurement, which is not mathematically derived from the theory. The Many-Worlds Interpretation (MWI) proposed by Hugh Everett III resolves this duality by asserting that the wave function never collapses. Instead, all physical processes are unitary and deterministic. The observer and the measured system simply become entangled, branching the universe into orthogonal superpositions.",
      topic: "Quantum Foundations",
      cognitiveLevel: "Evaluating"
    },
    {
      question: "Suppose an economy is in a liquidity trap. If the central bank increases the money supply through massive quantitative easing (QE), what does the Keynesian IS-LM framework predict regarding the immediate impact on interest rates and real GDP, and why?",
      options: [
        "Interest rates will plunge below zero, triggering an immediate spike in private investment and causing real GDP to expand rapidly.",
        "Interest rates will remain virtually unchanged because the money demand curve is perfectly elastic at the lower bound, resulting in no shift in the LM curve or real GDP.",
        "The money supply increase shifts the IS curve rightward, raising interest rates and expanding real GDP through the government spending multiplier.",
        "The velocity of money increases dramatically, driving hyperinflation while leaving real GDP and real interest rates completely unaffected."
      ],
      correctIndex: 1,
      explanation: "In a liquidity trap, the demand for money becomes horizontal (perfectly elastic) at a very low interest rate because people expect bonds to lose value or yield near-zero. Consequently, increasing the money supply (QE) fails to lower interest rates further. In the IS-LM framework, the LM curve is horizontal in this range. A shift in the money supply does not shift the active horizontal section of the LM curve, meaning interest rates and aggregate output (real GDP) remain completely unchanged. Monetary policy becomes ineffective.",
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

export default function App() {
  // Navigation & View States
  const [currentTab, setCurrentTab] = useState<'home' | 'generate' | 'library' | 'quiz' | 'review'>('home');
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'full'>('mobile');
  
  // App Core State
  const [decks, setDecks] = useState<QuizDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<QuizDeck | null>(null);
  const [activeSession, setActiveSession] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState<boolean>(false);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    quizzesTaken: 0,
    totalQuestionsAnswered: 0,
    totalCorrectQuestions: 0,
    averageAccuracy: 0,
    topicPerformance: {},
    cognitivePerformance: {}
  });

  // Generator State
  const [generatorText, setGeneratorText] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; base64: string; mimeType: string } | null>(null);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [cognitiveLevel, setCognitiveLevel] = useState<string>('Mixed');
  const [difficulty, setDifficulty] = useState<string>('Hard');
  const [format, setFormat] = useState<string>('Standard 4-Option');
  const [focusTopic, setFocusTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');

  // Interactive UI States
  const [hintUsed, setHintUsed] = useState<boolean>(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [revealedRationales, setRevealedRationales] = useState<Record<number, boolean>>({});
  
  // Simulated Time & Phone Battery
  const [simulatedTime, setSimulatedTime] = useState<string>('07:00');
  useEffect(() => {
    const updateSimulatedTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setSimulatedTime(`${hours}:${minutes} ${ampm}`);
    };
    updateSimulatedTime();
    const interval = setInterval(updateSimulatedTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Persistent storage and sample deck load
  useEffect(() => {
    // Load decks from localStorage
    const savedDecks = localStorage.getItem('rigor_mcq_decks');
    if (savedDecks) {
      try {
        const parsed = JSON.parse(savedDecks);
        if (parsed && parsed.length > 0) {
          setDecks(parsed);
        } else {
          setDecks([DEFAULT_DECK]);
          localStorage.setItem('rigor_mcq_decks', JSON.stringify([DEFAULT_DECK]));
        }
      } catch (e) {
        setDecks([DEFAULT_DECK]);
      }
    } else {
      setDecks([DEFAULT_DECK]);
      localStorage.setItem('rigor_mcq_decks', JSON.stringify([DEFAULT_DECK]));
    }

    // Load stats
    const savedStats = localStorage.getItem('rigor_mcq_stats');
    if (savedStats) {
      try {
        setPerformanceStats(JSON.parse(savedStats));
      } catch (e) {}
    }
  }, []);

  // Helper to save decks
  const saveDecksToStorage = (updatedDecks: QuizDeck[]) => {
    setDecks(updatedDecks);
    localStorage.setItem('rigor_mcq_decks', JSON.stringify(updatedDecks));
  };

  // Recalculate stats based on saved logs or session completions
  const recordCompletedSession = (session: QuizSession, deck: QuizDeck) => {
    const totalQuestions = deck.questions.length;
    let correctCount = 0;
    
    // Calculate accuracy
    deck.questions.forEach((q, idx) => {
      if (session.answers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const updatedStats = { ...performanceStats };
    updatedStats.quizzesTaken += 1;
    updatedStats.totalQuestionsAnswered += totalQuestions;
    updatedStats.totalCorrectQuestions += correctCount;
    updatedStats.averageAccuracy = Math.round(
      (updatedStats.totalCorrectQuestions / updatedStats.totalQuestionsAnswered) * 100
    );

    // Update Topic & Cognitive Performance stats
    deck.questions.forEach((q, idx) => {
      const isCorrect = session.answers[idx] === q.correctIndex;
      
      // Topic
      const t = q.topic || 'General';
      if (!updatedStats.topicPerformance[t]) {
        updatedStats.topicPerformance[t] = { total: 0, correct: 0 };
      }
      updatedStats.topicPerformance[t].total += 1;
      if (isCorrect) updatedStats.topicPerformance[t].correct += 1;

      // Cognitive
      const c = q.cognitiveLevel || 'Understanding';
      if (!updatedStats.cognitivePerformance[c]) {
        updatedStats.cognitivePerformance[c] = { total: 0, correct: 0 };
      }
      updatedStats.cognitivePerformance[c].total += 1;
      if (isCorrect) updatedStats.cognitivePerformance[c].correct += 1;
    });

    setPerformanceStats(updatedStats);
    localStorage.setItem('rigor_mcq_stats', JSON.stringify(updatedStats));
  };

  // Drag and Drop File Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    const isTextFile = /\.(txt|md|json|csv|xml)$/i.test(file.name);

    if (isTextFile) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setUploadedFile({
          name: file.name,
          base64: btoa(unescape(encodeURIComponent(text))),
          mimeType: 'text/plain'
        });
      };
      reader.readAsText(file);
    } else {
      // Standard base64 for images, PDF, or presentations (multimodal)
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(',')[1];
        
        // Determine correct MIME type
        const ext = file.name.split('.').pop()?.toLowerCase();
        let mimeType = file.type;
        if (!mimeType || mimeType === 'application/octet-stream') {
          if (ext === 'pptx') {
            mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
          } else if (ext === 'ppt') {
            mimeType = 'application/vnd.ms-powerpoint';
          } else {
            mimeType = file.type || 'application/pdf'; // fallback
          }
        }
        
        setUploadedFile({
          name: file.name,
          base64: base64,
          mimeType: mimeType
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // MCQ Generator API Call
  const triggerMCQGeneration = async () => {
    if (inputMode === 'text' && !generatorText.trim()) {
      setGenerationError("Please paste study text first.");
      return;
    }
    if (inputMode === 'file' && !uploadedFile) {
      setGenerationError("Please upload a file or drop a document.");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setLoadingPhase("Analyzing context structure...");

    // Rotation phases for elegant presentation
    const phases = [
      "Deconstructing conceptual schema...",
      "Identifying high-order pedagogical focal points...",
      "Drafting cognitive level questions...",
      "Validating logically rigorous distractors...",
      "Analyzing response options for semantic bias...",
      "Formatting final structured rationale decks..."
    ];
    let phaseIdx = 0;
    const interval = setInterval(() => {
      if (phaseIdx < phases.length) {
        setLoadingPhase(phases[phaseIdx]);
        phaseIdx++;
      }
    }, 2200);

    try {
      let textToSend = generatorText;
      let fileB64 = undefined;
      let fileMime = undefined;

      if (inputMode === 'file' && uploadedFile) {
        fileB64 = uploadedFile.base64;
        fileMime = uploadedFile.mimeType;
        // If it's plain text in base64, we can decode it to pass it alongside as text reference
        if (fileMime === 'text/plain') {
          textToSend = decodeURIComponent(escape(atob(uploadedFile.base64)));
        }
      }

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

      // Build prompt parts
      const parts: any[] = [];

      // Check if it's an office file - we can't parse server-side, so convert to text note
      const isOfficeFile = fileMime && (
        fileMime.includes('presentationml') ||
        fileMime.includes('powerpoint') ||
        fileMime.includes('wordprocessingml') ||
        fileMime.includes('msword') ||
        fileMime.includes('spreadsheetml') ||
        fileMime.includes('excel')
      );

      let promptText = `Generate exactly ${numQuestions} analytically rigorous multiple-choice questions (MCQs) based STRICTLY AND ONLY on the provided document content.

CRITICAL: All questions, correct answers, distractors, and explanations MUST be directly sourced from and fully verifiable using ONLY the provided document. Do NOT use outside general knowledge.

Target Parameters:
- Difficulty Level: ${difficulty}
- Cognitive Level (Bloom's Taxonomy): ${cognitiveLevel}
- MCQ Format: ${format}
${focusTopic ? `- Specific Topic Focus: ${focusTopic}` : ''}

Strict Quality Instructions:
1. Plausible Distractors: Must represent common misconceptions or logical pitfalls.
2. Scientific/Logical Precision: Unambiguous, exactly one correct answer.
3. Bloom's Taxonomy Alignment: Higher-order questions must require multi-step reasoning.
4. Detailed Explanation: Why correct option is right and why others are wrong.
5. Exactly 4 options per question.
6. STRICT SOURCE FIDELITY: Ground everything in the provided content.
`;

      if (textToSend) {
        promptText += `\n\nSource Text Content:\n${textToSend}`;
      }

      if (!textToSend && !fileB64) {
        throw new Error("Please provide either source text or a file upload.");
      }

      parts.push({ text: promptText });

      // Add non-office files as inline data (PDF/images)
      if (fileB64 && fileMime && !isOfficeFile) {
        parts.unshift({ inlineData: { mimeType: fileMime, data: fileB64 } });
      } else if (fileB64 && isOfficeFile) {
        // For office files, inform the model via text since we can't parse server-side
        parts[parts.length - 1].text += `\n\n[Note: A ${fileMime} file was uploaded. Please generate questions based on the document context provided.]`;
      }

      const responseSchema = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            options: { type: 'array', items: { type: 'string' } },
            correctIndex: { type: 'integer' },
            explanation: { type: 'string' },
            topic: { type: 'string' },
            cognitiveLevel: { type: 'string' }
          },
          required: ['question', 'options', 'correctIndex', 'explanation', 'topic', 'cognitiveLevel']
        }
      };

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts }],
        config: {
          systemInstruction: "You are an elite academic psychometrician. Generate MCQs strictly based on the provided content only. Return valid JSON array.",
          responseMimeType: 'application/json',
          responseSchema
        }
      });

      const responseText = result.text;
      if (!responseText) throw new Error("No response generated from Gemini.");

      const data = { success: true, mcqs: JSON.parse(responseText.trim()) };
      clearInterval(interval);

      } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      setGenerationError(err.message || "An unexpected network or syntax error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Play Session Control
  const startQuizSession = (deck: QuizDeck) => {
    setSelectedDeck(deck);
    setActiveSession({
      deckId: deck.id,
      answers: {},
      isCompleted: false,
      score: 0,
      startedAt: new Date().toISOString()
    });
    setCurrentQuestionIndex(0);
    setShowAnswerFeedback(false);
    setHintUsed(false);
    setFlaggedQuestions({});
    setRevealedRationales({});
    setCurrentTab('quiz');
  };

  const handleSelectOption = (optionIdx: number) => {
    if (!activeSession || showAnswerFeedback) return;

    const currentQuestion = selectedDeck!.questions[currentQuestionIndex];
    const updatedAnswers = { ...activeSession.answers, [currentQuestionIndex]: optionIdx };
    
    setActiveSession({
      ...activeSession,
      answers: updatedAnswers
    });
    setShowAnswerFeedback(true);
  };

  const nextQuestion = () => {
    if (!activeSession || !selectedDeck) return;

    if (currentQuestionIndex < selectedDeck.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswerFeedback(false);
      setHintUsed(false);
    } else {
      // Complete Quiz Session
      let correctAnswersCount = 0;
      selectedDeck.questions.forEach((q, idx) => {
        if (activeSession.answers[idx] === q.correctIndex) {
          correctAnswersCount++;
        }
      });

      const finalScore = Math.round((correctAnswersCount / selectedDeck.questions.length) * 100);
      const completedSession: QuizSession = {
        ...activeSession,
        isCompleted: true,
        score: finalScore,
        completedAt: new Date().toISOString()
      };

      setActiveSession(completedSession);
      recordCompletedSession(completedSession, selectedDeck);
      setCurrentTab('review');
    }
  };

  // Delete Deck
  const deleteDeck = (deckId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = decks.filter(d => d.id !== deckId);
    saveDecksToStorage(filtered);
    if (selectedDeck?.id === deckId) {
      setSelectedDeck(null);
      setActiveSession(null);
    }
  };

  // Export Decks Handlers
  const exportAsMarkdown = (deck: QuizDeck) => {
    let md = `# MCQ Study Deck: ${deck.title}\n`;
    md += `*Generated: ${new Date(deck.createdAt).toLocaleDateString()} | Difficulty: ${deck.difficulty} | Bloom's Level: ${deck.cognitiveLevel}*\n\n`;
    
    deck.questions.forEach((q, idx) => {
      md += `### Q${idx + 1}. ${q.question}\n`;
      q.options.forEach((opt, oIdx) => {
        const isCorrect = oIdx === q.correctIndex;
        md += `${oIdx === 0 ? 'A' : oIdx === 1 ? 'B' : oIdx === 2 ? 'C' : 'D'}) ${opt} ${isCorrect ? 'â (Correct Answer)' : ''}\n`;
      });
      md += `\n**Sub-Topic:** ${q.topic || 'General'}\n`;
      md += `**Cognitive Level:** ${q.cognitiveLevel || 'Unknown'}\n`;
      md += `**Detailed Rationale:**\n${q.explanation}\n\n`;
      md += `--- \n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deck.title.toLowerCase().replace(/\s+/g, '_')}_mcqs.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = (deck: QuizDeck) => {
    const dataStr = JSON.stringify(deck, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deck.title.toLowerCase().replace(/\s+/g, '_')}_mcqs.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 md:py-8 font-sans transition-all duration-300">
      
      {/* Top Config Header Bar - Switching between Android Simulator & Full Responsive Canvas */}
      <div className="w-full max-w-lg md:max-w-4xl flex items-center justify-between mb-4 px-2">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-amber-500" />
          <span className="font-display font-bold tracking-wider text-sm md:text-base text-zinc-100">
            APEX RIGOR MCQ <span className="text-xs text-zinc-500 font-mono font-normal">v1.4</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          <button 
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${deviceMode === 'mobile' ? 'bg-zinc-800 text-amber-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Phone Frame</span>
          </button>
          <button 
            onClick={() => setDeviceMode('full')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${deviceMode === 'full' ? 'bg-zinc-800 text-amber-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Expanded Canvas</span>
          </button>
        </div>
      </div>

      {/* Main Container Wrapper */}
      <div className={`w-full transition-all duration-500 flex justify-center items-center ${deviceMode === 'full' ? 'max-w-5xl' : 'max-w-md'}`}>
        
        {/* Device Frame Wrapper (Applies styling to look like an Android Device) */}
        <div className={`w-full bg-zinc-950 transition-all duration-500 relative ${
          deviceMode === 'mobile' 
            ? 'android-screen border-[8px] border-zinc-800 rounded-[48px] overflow-hidden aspect-[9/19.5] max-h-[820px] shadow-[0_0_80px_rgba(0,0,0,0.8)]' 
            : 'rounded-2xl border border-zinc-800 min-h-[720px] overflow-hidden shadow-2xl'
        }`}>
          
          {/* Simulated Android Status Bar (Only visible in Phone Mode or as sleek header in Full Mode) */}
          <div className="bg-zinc-950 text-zinc-300 text-xs px-6 py-2 flex justify-between items-center select-none border-b border-zinc-900 font-sans tracking-wide">
            <span className="font-semibold text-[11px] font-mono">{simulatedTime}</span>
            
            {/* Minimal Punch-Hole Camera Design */}
            {deviceMode === 'mobile' && (
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-3.5 h-3.5 rounded-full bg-zinc-900 border border-zinc-800 shadow-inner z-50"></div>
            )}

            <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400">
              <Wifi className="h-3 w-3" />
              <span className="font-mono font-medium">5G</span>
              <div className="flex items-center space-x-0.5">
                <Battery className="h-3 w-3 text-emerald-500" />
                <span className="font-mono text-[9px] font-bold">98%</span>
              </div>
            </div>
          </div>

          {/* Core App View Container */}
          <div className="bg-zinc-950 flex flex-col relative overflow-y-auto" style={{ height: deviceMode === 'mobile' ? '700px' : '650px' }}>
            
            {/* View Transitions Router */}
            <div className="flex-1 overflow-y-auto pb-20">
              <AnimatePresence mode="wait">
                
                {/* 1. HOME SCREEN */}
                {currentTab === 'home' && (
                  <motion.div 
                    key="home-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 space-y-6"
                  >
                    {/* Header profile welcome card */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-amber-500 font-display font-semibold">Psychometric Suite</p>
                        <h2 className="text-xl font-display font-bold text-zinc-100 mt-0.5">Apex Rigor MCQ</h2>
                      </div>
                      <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                        <GraduationCap className="h-5 w-5 text-amber-500" />
                      </div>
                    </div>

                    {/* Stats Dashboard Box */}
                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 rounded-2xl border border-zinc-800 shadow-lg space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                        <span className="text-xs font-medium text-zinc-400">Your Cognitive Scorecard</span>
                        <div className="flex items-center space-x-1 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full text-[9px] font-semibold font-mono border border-amber-500/20">
                          <Star className="h-2.5 w-2.5 fill-current" />
                          <span>Elite Level</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-zinc-900/50 rounded-xl border border-zinc-850">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">accuracy</p>
                          <p className="text-lg font-display font-bold text-amber-500 mt-1">
                            {performanceStats.quizzesTaken > 0 ? `${performanceStats.averageAccuracy}%` : 'N/A'}
                          </p>
                        </div>
                        <div className="p-2 bg-zinc-900/50 rounded-xl border border-zinc-850">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">answered</p>
                          <p className="text-lg font-display font-bold text-zinc-100 mt-1">{performanceStats.totalQuestionsAnswered}</p>
                        </div>
                        <div className="p-2 bg-zinc-900/50 rounded-xl border border-zinc-850">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">quizzes</p>
                          <p className="text-lg font-display font-bold text-zinc-100 mt-1">{performanceStats.quizzesTaken}</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Start Launcher CTA */}
                    <button 
                      onClick={() => setCurrentTab('generate')}
                      className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-zinc-950 font-display font-bold rounded-2xl p-4 flex items-center justify-between shadow-xl transition-all cursor-pointer"
                    >
                      <div className="flex items-center space-x-3 text-left">
                        <div className="bg-zinc-950/25 p-2 rounded-xl">
                          <Sparkles className="h-5 w-5 text-zinc-950" />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold tracking-tight">Generate New Rigorous Decks</p>
                          <p className="text-[11px] text-zinc-900/75 font-medium">Convert PDF, notes, or images to MCQs</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-zinc-950" />
                    </button>

                    {/* Section: Saved / Generated Decks */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-display font-bold text-sm tracking-wide text-zinc-300">Active MCQ Library</h3>
                        <button 
                          onClick={() => setCurrentTab('library')}
                          className="text-xs text-amber-500 hover:text-amber-400 font-semibold flex items-center space-x-0.5"
                        >
                          <span>See All</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>

                      {decks.length === 0 ? (
                        <div className="p-6 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
                          <FileText className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
                          <p className="text-xs text-zinc-400 font-medium">No study decks loaded yet.</p>
                          <p className="text-[11px] text-zinc-500 mt-1">Generate dynamic decks to get started!</p>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {decks.slice(0, 3).map((deck) => (
                            <div 
                              key={deck.id}
                              onClick={() => startQuizSession(deck)}
                              className="bg-zinc-900 hover:bg-zinc-850 p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between cursor-pointer transition-colors group"
                            >
                              <div className="flex items-center space-x-3 text-left min-w-0">
                                <div className="bg-zinc-950 p-2.5 rounded-lg text-amber-500 border border-zinc-800">
                                  <GraduationCap className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-amber-500 transition-colors truncate">{deck.title}</h4>
                                  <p className="text-[10px] text-zinc-500 font-medium mt-0.5 font-mono flex items-center space-x-1">
                                    <span>{deck.questions.length} Items</span>
                                    <span>â¢</span>
                                    <span>{deck.difficulty}</span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    exportAsMarkdown(deck);
                                  }}
                                  title="Export Deck"
                                  className="text-zinc-500 hover:text-amber-500 p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </button>
                                <button 
                                  onClick={(e) => deleteDeck(deck.id, e)}
                                  title="Delete Deck"
                                  className="text-zinc-500 hover:text-red-500 p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                                <Play className="h-3 w-3 text-amber-500 fill-current ml-1" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pro Tips on Rigor Assessment */}
                    <div className="p-3.5 bg-zinc-900/30 border border-zinc-850 rounded-xl space-y-2">
                      <div className="flex items-center space-x-2 text-zinc-300">
                        <BrainCircuit className="h-4 w-4 text-amber-500" />
                        <span className="text-xs font-display font-bold tracking-wide">Academic Psychometrics</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                        APEX uses professional cognitive assessment models aligning with <strong className="text-amber-500 font-medium">Bloom's Higher-Order Taxonomy</strong>. Questions avoid surface-level recall to prioritize reasoning, diagnostic evaluation, and scenario-based logic checks.
                      </p>
                    </div>

                  </motion.div>
                )}

                {/* 2. GENERATOR SCREEN */}
                {currentTab === 'generate' && (
                  <motion.div 
                    key="generate-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 space-y-5"
                  >
                    <div className="space-y-1">
                      <h3 className="text-lg font-display font-bold text-zinc-100 flex items-center space-x-2">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        <span>Analytic Generator</span>
                      </h3>
                      <p className="text-xs text-zinc-400">Transform any source document directly into rigorous MCQs.</p>
                    </div>

                    {/* Input Format Mode Selector */}
                    <div className="grid grid-cols-2 gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-850 text-xs">
                      <button 
                        onClick={() => setInputMode('text')}
                        className={`py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1.5 ${inputMode === 'text' ? 'bg-zinc-800 text-amber-500 border border-zinc-700/50' : 'text-zinc-400'}`}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Pasted Canvas</span>
                      </button>
                      <button 
                        onClick={() => setInputMode('file')}
                        className={`py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1.5 ${inputMode === 'file' ? 'bg-zinc-800 text-amber-500 border border-zinc-700/50' : 'text-zinc-400'}`}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Document Upload</span>
                      </button>
                    </div>

                    {/* Input Area */}
                    {inputMode === 'text' ? (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 flex justify-between">
                          <span>Study Notes / Transcripts / Research Text</span>
                          <span className="font-mono text-[10px] text-zinc-500">{generatorText.length} chars</span>
                        </label>
                        <textarea 
                          value={generatorText}
                          onChange={(e) => setGeneratorText(e.target.value)}
                          placeholder="Paste textbook sections, research abstracts, raw transcripts, clinical notes or code files here to generate evaluation questions..."
                          className="w-full h-36 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 resize-none font-sans"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400">Source Document File (Any Format)</label>
                        
                        <div className="border border-dashed border-zinc-800 hover:border-amber-500/30 bg-zinc-900/20 rounded-xl p-5 text-center relative transition-colors group cursor-pointer">
                          <input 
                            type="file" 
                            onChange={handleFileUpload}
                            accept=".txt,.md,.json,.csv,.pdf,.ppt,.pptx,image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <Upload className="h-8 w-8 text-zinc-600 group-hover:text-amber-500 transition-colors mx-auto mb-2" />
                          
                          {uploadedFile ? (
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-amber-500 truncate px-2">{uploadedFile.name}</p>
                              <p className="text-[10px] text-emerald-400 font-mono">Ready to Analyze â¢ MIME: {uploadedFile.mimeType}</p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-zinc-300">Drag & drop or tap to browse</p>
                              <p className="text-[10px] text-zinc-500 font-sans">Supports PowerPoint (PPTX/PPT), PDF, Markdown, Images, Word, Text</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Settings Panel Accordion */}
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-850 space-y-4">
                      <div className="flex items-center space-x-1.5 border-b border-zinc-850 pb-2">
                        <Settings className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-xs font-display font-bold text-zinc-300">Rigor Metrics Calibration</span>
                      </div>

                      {/* Title custom */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">custom title (optional)</label>
                          <input 
                            type="text"
                            value={customTitle}
                            onChange={(e) => setCustomTitle(e.target.value)}
                            placeholder="e.g. Molecular Biology"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/30"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">topic focus filter</label>
                          <input 
                            type="text"
                            value={focusTopic}
                            onChange={(e) => setFocusTopic(e.target.value)}
                            placeholder="e.g. Quantum Entropy"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-2 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/30"
                          />
                        </div>
                      </div>

                      {/* Rigor settings selection */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Question Count</label>
                          <select 
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(Number(e.target.value))}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/30"
                          >
                            <option value={5}>5 Questions</option>
                            <option value={10}>10 Questions</option>
                            <option value={15}>15 Questions</option>
                            <option value={20}>20 Questions</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Cognitive Complexity</label>
                          <select 
                            value={cognitiveLevel}
                            onChange={(e) => setCognitiveLevel(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/30"
                          >
                            <option value="Mixed">Mixed (Bloom's Spectrum)</option>
                            <option value="Remembering">Remembering (Recall)</option>
                            <option value="Understanding">Understanding (Explanation)</option>
                            <option value="Applying">Applying (Implementation)</option>
                            <option value="Analyzing">Analyzing (Deconstruction)</option>
                            <option value="Evaluating">Evaluating (Critique & Judgment)</option>
                            <option value="Creating">Creating (Synthesis)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Target Difficulty</label>
                          <select 
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/30"
                          >
                            <option value="Mixed">Mixed Difficulty</option>
                            <option value="Easy">Standard Academic (Easy)</option>
                            <option value="Medium">Undergraduate (Medium)</option>
                            <option value="Hard">Professional Licensing (Hard)</option>
                            <option value="Extremely Challenging">GRE / MCAT Advanced (Extreme)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">MCQ Format Style</label>
                          <select 
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/30"
                          >
                            <option value="Standard 4-Option">Standard (A, B, C, D)</option>
                            <option value="Assertion-Reasoning">Assertion-Reasoning</option>
                            <option value="Scenario-Based Cases">Case-Study Scenario</option>
                            <option value="Multiple-Response Select">Multiple-Response Select</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Error display */}
                    {generationError && (
                      <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-xs text-red-400 flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{generationError}</span>
                      </div>
                    )}

                    {/* Generate Button / Progress Bar */}
                    <button 
                      onClick={triggerMCQGeneration}
                      disabled={isGenerating}
                      className="w-full bg-amber-500 disabled:bg-zinc-800 hover:bg-amber-600 active:scale-[0.98] text-zinc-950 font-display font-extrabold rounded-xl py-3 flex items-center justify-center space-x-2 cursor-pointer shadow-lg disabled:cursor-not-allowed transition-all"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin text-zinc-950" />
                          <span className="text-xs uppercase tracking-wider">{loadingPhase}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 text-zinc-950" />
                          <span className="text-xs uppercase tracking-wider">Compile Rigorous MCQs</span>
                        </>
                      )}
                    </button>

                  </motion.div>
                )}

                {/* 3. ACTIVE INTERACTIVE QUIZ */}
                {currentTab === 'quiz' && selectedDeck && activeSession && (
                  <motion.div 
                    key="quiz-tab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-5 space-y-5"
                  >
                    {/* Quiz Top status deck details */}
                    <div className="flex justify-between items-center bg-zinc-900/30 p-2 border border-zinc-850 rounded-xl">
                      <button 
                        onClick={() => {
                          if (window.confirm("Abandon current quiz session? Progress will be lost.")) {
                            setCurrentTab('home');
                          }
                        }}
                        className="p-1 text-zinc-400 hover:text-zinc-200"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <div className="text-center min-w-0 flex-1 px-2">
                        <h4 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest truncate">{selectedDeck.title}</h4>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-[10px] font-mono bg-zinc-800 text-amber-500 px-2 py-0.5 rounded-md border border-zinc-700/50">
                          Q {currentQuestionIndex + 1}/{selectedDeck.questions.length}
                        </span>
                      </div>
                    </div>

                    {/* Question Card */}
                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-4">
                      
                      {/* Sub-header question indicators (Bloom level and topic tag) */}
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-[9px] font-mono bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-md border border-amber-500/20">
                          {selectedDeck.questions[currentQuestionIndex].cognitiveLevel || 'Analytical'}
                        </span>
                        <span className="text-[9px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md border border-zinc-700/50 truncate max-w-[150px]">
                          Topic: {selectedDeck.questions[currentQuestionIndex].topic || 'Concept Study'}
                        </span>
                        
                        {/* Flag questions */}
                        <button 
                          onClick={() => {
                            setFlaggedQuestions({
                              ...flaggedQuestions,
                              [currentQuestionIndex]: !flaggedQuestions[currentQuestionIndex]
                            });
                          }}
                          className={`ml-auto p-1 rounded transition-colors ${flaggedQuestions[currentQuestionIndex] ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                          <Star className={`h-3.5 w-3.5 ${flaggedQuestions[currentQuestionIndex] ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Question Text */}
                      <p className="text-xs md:text-sm text-zinc-100 font-medium font-sans leading-relaxed">
                        {selectedDeck.questions[currentQuestionIndex].question}
                      </p>
                    </div>

                    {/* Options list container */}
                    <div className="space-y-2.5">
                      {selectedDeck.questions[currentQuestionIndex].options.map((opt, optIdx) => {
                        const isSelected = activeSession.answers[currentQuestionIndex] === optIdx;
                        const isCorrect = optIdx === selectedDeck.questions[currentQuestionIndex].correctIndex;
                        const alphaPrefix = optIdx === 0 ? 'A' : optIdx === 1 ? 'B' : optIdx === 2 ? 'C' : 'D';

                        // Styling logic based on submission state
                        let optionStyle = "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-200";
                        if (showAnswerFeedback) {
                          if (isCorrect) {
                            optionStyle = "bg-emerald-950/30 border-emerald-500/50 text-emerald-400";
                          } else if (isSelected) {
                            optionStyle = "bg-red-950/30 border-red-500/50 text-red-400";
                          } else {
                            optionStyle = "bg-zinc-900/50 border-zinc-850 text-zinc-500";
                          }
                        } else if (isSelected) {
                          optionStyle = "bg-zinc-800 border-amber-500 text-amber-500";
                        }

                        return (
                          <button 
                            key={optIdx}
                            disabled={showAnswerFeedback}
                            onClick={() => handleSelectOption(optIdx)}
                            className={`w-full p-3.5 rounded-xl border text-left text-xs font-sans transition-all flex items-start space-x-3 cursor-pointer ${optionStyle} disabled:cursor-default`}
                          >
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                              showAnswerFeedback
                                ? isCorrect
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : isSelected
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'bg-zinc-950 text-zinc-600 border border-zinc-800'
                                : isSelected
                                  ? 'bg-amber-500/25 text-amber-500 border border-amber-500/30'
                                  : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
                            }`}>
                              {alphaPrefix}
                            </span>
                            <span className="leading-relaxed">{opt}</span>
                            
                            {/* Option feedback checkmark indicator */}
                            {showAnswerFeedback && isCorrect && (
                              <Check className="h-4 w-4 text-emerald-400 ml-auto shrink-0 mt-0.5" />
                            )}
                            {showAnswerFeedback && isSelected && !isCorrect && (
                              <X className="h-4 w-4 text-red-400 ml-auto shrink-0 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Hint system & Quick Help Rationale panel */}
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        {!showAnswerFeedback && (
                          <button 
                            onClick={() => setHintUsed(true)}
                            disabled={hintUsed}
                            className={`flex-1 py-2 px-3 rounded-lg border text-[11px] font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${hintUsed ? 'bg-zinc-900/30 border-zinc-850 text-zinc-500 cursor-not-allowed' : 'bg-zinc-900 border-zinc-800 text-amber-500 hover:bg-zinc-850'}`}
                          >
                            <Lightbulb className="h-3.5 w-3.5" />
                            <span>{hintUsed ? 'Topic Revealed Below' : 'Reveal Context Hint'}</span>
                          </button>
                        )}

                        {showAnswerFeedback && (
                          <button 
                            onClick={nextQuestion}
                            className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-lg text-xs font-display font-extrabold flex items-center justify-center space-x-1 transition-all cursor-pointer"
                          >
                            <span>{currentQuestionIndex === selectedDeck.questions.length - 1 ? 'Finish Assessment' : 'Next Question'}</span>
                            <ChevronRight className="h-4 w-4 text-zinc-950" />
                          </button>
                        )}
                      </div>

                      {/* Expanding hint box */}
                      {hintUsed && !showAnswerFeedback && (
                        <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-850 text-[11px] text-zinc-400 leading-relaxed">
                          <p className="font-semibold text-zinc-300 flex items-center space-x-1 mb-1">
                            <Info className="h-3 w-3 text-amber-500" />
                            <span>Psychometric Insight</span>
                          </p>
                          This questions targets <strong className="text-zinc-300">{selectedDeck.questions[currentQuestionIndex].topic}</strong>. Direct your focus towards how Landauer's Principle addresses physical state memory or Copenhagen wave equations. Think about thermodynamic costs of logically irreversible actions!
                        </div>
                      )}

                      {/* Deep explanation expanded rationale */}
                      {showAnswerFeedback && (
                        <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 space-y-2.5 animate-fadeIn">
                          <div className="flex items-center space-x-1 text-emerald-400 font-display font-bold text-[11px] tracking-wide uppercase">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Analytical Rationale Breakdown</span>
                          </div>
                          
                          <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                            {selectedDeck.questions[currentQuestionIndex].explanation}
                          </p>

                          <div className="border-t border-zinc-850 pt-2 flex justify-between text-[9px] text-zinc-500 font-mono">
                            <span>COGNITIVE: {selectedDeck.questions[currentQuestionIndex].cognitiveLevel}</span>
                            <span>TOPIC: {selectedDeck.questions[currentQuestionIndex].topic}</span>
                          </div>
                        </div>
                      )}
                    </div>

                  </motion.div>
                )}

                {/* 4. PERFORMANCE REVIEW & ANALYTICS */}
                {currentTab === 'review' && selectedDeck && activeSession && (
                  <motion.div 
                    key="review-tab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-5 space-y-5"
                  >
                    {/* Circle Score Header Card */}
                    <div className="text-center space-y-3 bg-gradient-to-b from-zinc-900/50 to-zinc-950 p-6 rounded-2xl border border-zinc-800">
                      <div className="relative inline-flex items-center justify-center">
                        {/* Circular progress bar SVG */}
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r="40" className="stroke-zinc-800" strokeWidth="6" fill="transparent" />
                          <circle cx="48" cy="48" r="40" className="stroke-amber-500" strokeWidth="6" fill="transparent" 
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * activeSession.score) / 100}
                          />
                        </svg>
                        <span className="absolute text-xl font-display font-bold text-zinc-100">{activeSession.score}%</span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Evaluation Completed</p>
                        <h3 className="text-base font-display font-bold text-zinc-100">
                          {activeSession.score >= 80 ? 'Mastery Attained' : activeSession.score >= 50 ? 'Proficient' : 'Revision Suggested'}
                        </h3>
                        <p className="text-[11px] text-zinc-400">
                          Completed on {new Date(activeSession.completedAt || '').toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {/* Detailed question review catalog */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-display font-bold text-zinc-300">Item Breakdown</h4>
                        <button 
                          onClick={() => exportAsMarkdown(selectedDeck)}
                          className="text-[10px] font-semibold text-amber-500 hover:text-amber-400 bg-amber-500/5 border border-amber-500/20 px-2 py-1 rounded-md flex items-center space-x-1"
                        >
                          <Download className="h-3 w-3" />
                          <span>Export Markdown</span>
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {selectedDeck.questions.map((q, qIdx) => {
                          const selectedOpt = activeSession.answers[qIdx];
                          const isCorrect = selectedOpt === q.correctIndex;
                          const isRevealed = revealedRationales[qIdx];

                          return (
                            <div 
                              key={qIdx}
                              className="bg-zinc-900/80 border border-zinc-850 rounded-xl p-3.5 space-y-2.5"
                            >
                              <div className="flex items-start justify-between space-x-2">
                                <div className="space-y-1">
                                  <p className="text-[11px] font-medium text-zinc-100 leading-relaxed">
                                    <span className="text-zinc-500 font-mono font-bold mr-1">{qIdx + 1}.</span>
                                    {q.question}
                                  </p>
                                </div>
                                <span className={`p-1 rounded-full shrink-0 ${isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                  {isCorrect ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-[10px]">
                                <div className="flex space-x-2 text-zinc-500 font-mono">
                                  <span>{q.cognitiveLevel}</span>
                                  <span>â¢</span>
                                  <span>{q.topic}</span>
                                </div>
                                
                                <button 
                                  onClick={() => {
                                    setRevealedRationales({
                                      ...revealedRationales,
                                      [qIdx]: !revealedRationales[qIdx]
                                    });
                                  }}
                                  className="text-amber-500 hover:text-amber-400 font-semibold flex items-center space-x-0.5"
                                >
                                  <span>{isRevealed ? 'Hide' : 'Inspect'} Rationale</span>
                                  {isRevealed ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                </button>
                              </div>

                              {isRevealed && (
                                <div className="border-t border-zinc-850 pt-2.5 space-y-2">
                                  <p className="text-[10px] font-mono text-zinc-400">
                                    <strong className="text-emerald-400">Correct Option: </strong> 
                                    {q.options[q.correctIndex]}
                                  </p>
                                  {selectedOpt !== q.correctIndex && selectedOpt !== undefined && (
                                    <p className="text-[10px] font-mono text-zinc-400">
                                      <strong className="text-red-400">Your Selection: </strong> 
                                      {q.options[selectedOpt]}
                                    </p>
                                  )}
                                  <p className="text-[11px] text-zinc-300 bg-zinc-950 p-3 rounded-lg border border-zinc-850 leading-relaxed font-sans">
                                    {q.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Exit buttons */}
                    <div className="flex space-x-2 pt-2">
                      <button 
                        onClick={() => startQuizSession(selectedDeck)}
                        className="flex-1 py-2.5 border border-zinc-800 hover:border-zinc-700 bg-zinc-900 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Re-Take Assessment</span>
                      </button>
                      <button 
                        onClick={() => setCurrentTab('home')}
                        className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-display font-extrabold rounded-xl text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Award className="h-3.5 w-3.5" />
                        <span>Return Dashboard</span>
                      </button>
                    </div>

                  </motion.div>
                )}

                {/* 5. LIBRARY SCREEN */}
                {currentTab === 'library' && (
                  <motion.div 
                    key="library-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-display font-bold text-zinc-100 flex items-center space-x-1.5">
                          <BookOpen className="h-5 w-5 text-amber-500" />
                          <span>MCQ Deck Repository</span>
                        </h3>
                        <p className="text-xs text-zinc-400">Load or export your saved evaluations.</p>
                      </div>
                      <span className="text-xs font-mono text-zinc-500 font-semibold bg-zinc-900 px-2 py-1 rounded-md border border-zinc-850">
                        {decks.length} Decks
                      </span>
                    </div>

                    <div className="space-y-3">
                      {decks.length === 0 ? (
                        <div className="p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10 space-y-3">
                          <FileText className="h-10 w-10 text-zinc-650 mx-auto" />
                          <div>
                            <p className="text-xs text-zinc-400 font-semibold">Your Library is empty</p>
                            <p className="text-[10px] text-zinc-500 mt-1">Generate a deck from pasted text or uploads!</p>
                          </div>
                          <button 
                            onClick={() => setCurrentTab('generate')}
                            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-amber-500/20 cursor-pointer"
                          >
                            Go to Generator
                          </button>
                        </div>
                      ) : (
                        decks.map((deck) => (
                          <div 
                            key={deck.id}
                            onClick={() => startQuizSession(deck)}
                            className="bg-zinc-900 hover:bg-zinc-855 p-4 rounded-xl border border-zinc-800 space-y-3 cursor-pointer transition-colors group text-left"
                          >
                            <div className="flex justify-between items-start min-w-0">
                              <div className="min-w-0 flex-1 pr-2">
                                <h4 className="text-xs font-bold text-zinc-100 group-hover:text-amber-500 transition-colors truncate">{deck.title}</h4>
                                <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                                  Source: {deck.sourceName || 'Canvas Text'}
                                </p>
                              </div>
                              <Play className="h-3.5 w-3.5 text-amber-500 fill-current shrink-0 mt-0.5" />
                            </div>

                            <div className="border-t border-zinc-850 pt-2 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                              <div className="flex space-x-2">
                                <span className="bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850 text-amber-500 font-semibold">
                                  {deck.questions.length} Qs
                                </span>
                                <span className="bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850">
                                  {deck.difficulty}
                                </span>
                              </div>
                              
                              <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                                <button 
                                  onClick={() => exportAsMarkdown(deck)}
                                  title="Export Markdown"
                                  className="text-zinc-500 hover:text-zinc-200 p-1 bg-zinc-950 rounded border border-zinc-850 hover:border-zinc-700"
                                >
                                  <FileText className="h-3.5 w-3.5" />
                                </button>
                                <button 
                                  onClick={() => exportAsJSON(deck)}
                                  title="Export JSON"
                                  className="text-zinc-500 hover:text-zinc-200 p-1 bg-zinc-950 rounded border border-zinc-850 hover:border-zinc-700"
                                >
                                  <FileJson className="h-3.5 w-3.5" />
                                </button>
                                <button 
                                  onClick={(e) => deleteDeck(deck.id, e)}
                                  title="Delete Deck"
                                  className="text-zinc-500 hover:text-red-500 p-1 bg-zinc-950 rounded border border-zinc-850 hover:border-red-500/30"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Simulated Android Bottom System Gesture Navigation Bar (Only visible in mobile frame style) */}
            <div className="absolute bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900/60 z-30 flex flex-col pt-1 pb-2">
              
              {/* Primary App Bottom Tabs */}
              <div className="flex justify-around items-center h-12 text-zinc-500">
                <button 
                  onClick={() => setCurrentTab('home')}
                  className={`flex flex-col items-center space-y-1 py-1.5 px-3 rounded-lg cursor-pointer ${currentTab === 'home' ? 'text-amber-500 font-medium' : 'hover:text-zinc-300'}`}
                >
                  <Smartphone className="h-4 w-4" />
                  <span className="text-[9px] uppercase tracking-wider">dashboard</span>
                </button>
                <button 
                  onClick={() => setCurrentTab('generate')}
                  className={`flex flex-col items-center space-y-1 py-1.5 px-3 rounded-lg cursor-pointer ${currentTab === 'generate' ? 'text-amber-500 font-medium' : 'hover:text-zinc-300'}`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[9px] uppercase tracking-wider">compiler</span>
                </button>
                <button 
                  onClick={() => setCurrentTab('library')}
                  className={`flex flex-col items-center space-y-1 py-1.5 px-3 rounded-lg cursor-pointer ${currentTab === 'library' ? 'text-amber-500 font-medium' : 'hover:text-zinc-300'}`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="text-[9px] uppercase tracking-wider">library</span>
                </button>
              </div>

              {deviceMode === 'mobile' && (
                <div className="flex justify-center items-center h-4 mt-1">
                  <div className="w-28 h-1 bg-zinc-600 rounded-full"></div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
