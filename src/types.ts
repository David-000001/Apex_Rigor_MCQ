export interface MCQQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  cognitiveLevel: string;
}

export interface QuizDeck {
  id: string;
  title: string;
  createdAt: string;
  questions: MCQQuestion[];
  sourceName: string;
  sourceType: 'text' | 'file';
  difficulty: string;
  cognitiveLevel: string;
  format: string;
}

export interface QuizSession {
  deckId: string;
  answers: Record<number, number>; // index of question -> index of selected option
  isCompleted: boolean;
  score: number;
  startedAt: string;
  completedAt?: string;
}

export interface PerformanceStats {
  quizzesTaken: number;
  totalQuestionsAnswered: number;
  totalCorrectQuestions: number;
  averageAccuracy: number;
  topicPerformance: Record<string, { total: number; correct: number }>;
  cognitivePerformance: Record<string, { total: number; correct: number }>;
}
