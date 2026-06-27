import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import officeParser from 'officeparser';
import fs from 'fs';
import os from 'os';

dotenv.config();

const app = express();
const PORT = 3000;

// Set maximum request body size for file uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Helper to get Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Please configure it in the Secrets panel in the AI Studio UI.');
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Helper to extract text from PPTX/PPT/DOCX/XLSX using officeparser
async function extractTextFromOfficeFile(fileBase64: string, fileMimeType: string): Promise<string> {
  const buffer = Buffer.from(fileBase64, 'base64');
  
  // Create a temporary file to be absolutely safe and avoid any stream/buffer parsing edge cases
  const tempDir = os.tmpdir();
  const ext = fileMimeType.includes('presentationml') || fileMimeType.includes('powerpoint') ? 'pptx' : 'docx';
  const tempFilePath = path.join(tempDir, `upload_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`);
  
  try {
    await fs.promises.writeFile(tempFilePath, buffer);
    
    // Wrap officeParser.parseOffice in a Promise
    const extractedText = await new Promise<string>((resolve, reject) => {
      officeParser.parseOffice(tempFilePath, (data: any, err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data as string);
        }
      });
    });
    
    return extractedText;
  } catch (error) {
    console.error("OfficeParser temp file parse failed, trying direct buffer parse:", error);
    try {
      const extractedText = await new Promise<string>((resolve, reject) => {
        officeParser.parseOffice(buffer, (data: any, err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(data as string);
          }
        });
      });
      return extractedText;
    } catch (innerError) {
      throw new Error(`Failed to extract text from document: ${(error as Error).message}`);
    }
  } finally {
    // Clean up temporary file
    try {
      if (fs.existsSync(tempFilePath)) {
        await fs.promises.unlink(tempFilePath);
      }
    } catch (cleanupError) {
      console.error("Temporary file cleanup error:", cleanupError);
    }
  }
}

// API Routes
app.post('/api/generate-mcq', async (req, res) => {
  try {
    const {
      text,
      fileBase64,
      fileMimeType,
      numQuestions = 5,
      cognitiveLevel = 'Mixed',
      difficulty = 'Medium',
      format = 'Standard 4-Option',
      focusTopic = ''
    } = req.body;

    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }

    // Prepare contents array
    const parts: any[] = [];

    // Check if it's an office file to parse server-side
    const isOfficeFile = fileMimeType && (
      fileMimeType.includes('presentationml') || 
      fileMimeType.includes('powerpoint') ||
      fileMimeType.includes('wordprocessingml') ||
      fileMimeType.includes('msword') ||
      fileMimeType.includes('spreadsheetml') ||
      fileMimeType.includes('excel')
    );

    let parsedOfficeText = '';
    if (isOfficeFile && fileBase64) {
      try {
        parsedOfficeText = await extractTextFromOfficeFile(fileBase64, fileMimeType);
        console.log(`Successfully extracted ${parsedOfficeText.length} characters from office document.`);
      } catch (err: any) {
        return res.status(400).json({ error: `Document Parsing Error: ${err.message}` });
      }
    } else if (fileBase64 && fileMimeType) {
      // PDF or Image - native inlineData
      parts.push({
        inlineData: {
          mimeType: fileMimeType,
          data: fileBase64
        }
      });
    }

    // Prepare prompt text
    let promptText = `Generate exactly ${numQuestions} analytically rigorous multiple-choice questions (MCQs) based STRICTLY AND ONLY on the provided document content (the attached file or provided text).

CRITICAL: All questions, correct answers, distractors, and explanations MUST be directly sourced from and fully verifiable using ONLY the provided document. Do NOT use outside general knowledge, do NOT invent concepts, and do NOT extrapolate beyond what is explicitly written in the provided content. If a specific topic focus is requested, focus ONLY on the portions of the provided document that cover that topic.

Target Parameters:
- Difficulty Level: ${difficulty}
- Cognitive Level (Bloom's Taxonomy): ${cognitiveLevel}
- MCQ Format: ${format}
${focusTopic ? `- Specific Topic Focus: ${focusTopic}` : ''}

Strict Quality Instructions for High Analytical Rigor:
1. Plausible Distractors (Wrong Options): Distractors must be highly plausible, representing common misconceptions, logical pitfalls, or incorrect applications of terms related to the content. Do NOT use silly, obviously wrong options.
2. Scientific/Logical Precision: Ensure the questions are technically, historically, or scientifically accurate according to the provided content. Questions must be unambiguous, with exactly one demonstrably correct or best answer.
3. Bloom's Taxonomy Alignment: If cognitive level is 'Analyzing', 'Evaluating', or 'Creating', the questions must require multi-step reasoning, interpreting data, evaluating claims, or synthesizing concepts rather than mere recall.
4. Detailed Explanation: For each question, provide a comprehensive rationale detailing exactly why the correct option is correct and why each of the other options is incorrect.
5. Content Coverage: Distribute questions across different core concepts in the provided text to maximize coverage.
6. Options Limit: Exactly 4 options must be generated for each question.
7. STRICT SOURCE FIDELITY: Every question, option, correct answer, and explanation must be 100% grounded in the provided document content. Do not hallucinate or use external/prior knowledge outside the provided content.
`;

    if (text) {
      promptText += `\n\nSource Text Content:\n${text}`;
    }
    if (parsedOfficeText) {
      promptText += `\n\nSource Document Extracted Content:\n${parsedOfficeText}`;
    }

    if (!text && !fileBase64 && !parsedOfficeText) {
      return res.status(400).json({ error: "Please provide either source text or a file upload." });
    }

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: { parts },
      config: {
        systemInstruction: "You are an elite, highly rigorous academic psychometrician and subject matter expert specialized in designing MCQs. You base all questions, options, correct answers, and explanations strictly and exclusively on the provided content (the attached file/document or the provided source text). Do NOT use external pre-trained knowledge or facts not present in the document. You must strictly adhere to the requested JSON schema.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: "List of generated MCQs matching the requested constraints.",
          items: {
            type: Type.OBJECT,
            properties: {
              question: { 
                type: Type.STRING, 
                description: "The MCQ question text. Must be clear, complete, and analytically challenging." 
              },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Exactly 4 options, labeled implicitly. Do not include prefix letters like 'A)', 'B)' inside the string."
              },
              correctIndex: { 
                type: Type.INTEGER, 
                description: "The 0-based index of the correct option in the options array (0, 1, 2, or 3)." 
              },
              explanation: { 
                type: Type.STRING, 
                description: "In-depth analytical explanation of the correct choice and why the distractors are wrong." 
              },
              topic: { 
                type: Type.STRING, 
                description: "The specific sub-concept or topic tested." 
              },
              cognitiveLevel: { 
                type: Type.STRING, 
                description: "The Bloom's Taxonomy cognitive level, matching the question's cognitive depth (e.g., Remembering, Understanding, Applying, Analyzing, Evaluating, Creating)." 
              }
            },
            required: ["question", "options", "correctIndex", "explanation", "topic", "cognitiveLevel"]
          }
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response generated from the Gemini model.");
    }

    // Return parsed json to client
    const mcqs = JSON.parse(responseText.trim());
    return res.json({ success: true, mcqs });
  } catch (error: any) {
    console.error("MCQ Generation Error:", error);
    return res.status(500).json({ 
      error: error.message || "An unexpected error occurred during MCQ generation." 
    });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
