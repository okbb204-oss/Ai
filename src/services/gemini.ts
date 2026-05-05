/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AnalysisResult, Lesson, FinalReport, Language } from "../types";
import { CRAFTS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  async analyzeUser(profile: UserProfile): Promise<AnalysisResult> {
    const lang = profile.language;
    const prompt = `
      As a vocational guidance expert, analyze this user profile and suggest the most suitable crafts from our list.
      User Profile: ${JSON.stringify(profile)}
      Available Crafts: ${JSON.stringify(CRAFTS.map(c => ({ id: c.id, name: c.name, nameAr: c.nameAr, level: c.level })))}

      Target Language: ${lang === 'ar' ? 'Arabic' : lang === 'fr' ? 'French' : 'English'}

      Provide the result in JSON format with:
      1. suggestedCrafts: Array of IDs of all suitable crafts.
      2. top3: Top 3 craft IDs in order of preference.
      3. explanations: An object mapping craft ID to a brief explanation (in the target language) of WHY it fits the user.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedCrafts: { type: Type.ARRAY, items: { type: Type.STRING } },
            top3: { type: Type.ARRAY, items: { type: Type.STRING } },
            explanations: { type: Type.OBJECT, additionalProperties: { type: Type.STRING } }
          },
          required: ["suggestedCrafts", "top3", "explanations"]
        }
      }
    });

    return JSON.parse(response.text);
  },

  async getLesson(craftId: string, level: number, lang: Language): Promise<Lesson> {
    const craft = CRAFTS.find(c => c.id === craftId);
    const targetLang = lang === 'ar' ? 'Arabic' : lang === 'fr' ? 'French' : 'English';
    const prompt = `
      Act as a Senior Vocational Instructor. Generate a professional Lesson for Level ${level}/20 of a ${craft?.name} course.
      Target Language: ${targetLang}

      The lesson MUST follow this pedagogical structure:
      1. Technical Concept: Professional explanation of the skill.
      2. Importance: Why this matters in the real workspace.
      3. REAL-WORLD SCENARIO: A specific situation (e.g., "You are at a workshop and...") that requires applying this skill.
      4. Practical Steps: How to execute the task professionally.

      Return a JSON object:
      {
        "title": "Professional Title (Level ${level})",
        "content": "Markdown content including the sections above. Use headings and bullet points. Focus on PRACTICALITY.",
        "quiz": [
          {
            "id": 1,
            "text": "Practical question based on the scenario or technical content",
            "options": ["Realistic Answer A", "Realistic Answer B", "Realistic Answer C", "Realistic Answer D"],
            "correctIndex": 0,
            "explanation": "Professional explanation of why this answer is the standard industry practice."
          }
        ] (generate exactly 5 questions)
      }
      
      Pedagogy: Practical > Theoretical. Real situations > Abstract ideas.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.NUMBER },
                  text: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.NUMBER },
                  explanation: { type: Type.STRING }
                },
                required: ["id", "text", "options", "correctIndex", "explanation"]
              }
            }
          },
          required: ["title", "content", "quiz"]
        }
      }
    });

    const data = JSON.parse(response.text);
    return { id: Date.now(), level, ...data };
  },

  async generateReport(craftId: string, scores: number[], lang: Language): Promise<FinalReport> {
    const craft = CRAFTS.find(c => c.id === craftId);
    const targetLang = lang === 'ar' ? 'Arabic' : lang === 'fr' ? 'French' : 'English';
    const prompt = `
      As a Vocational Certification Expert, analyze these test scores for the ${craft?.name} curriculum.
      Scores (out of 5 per level): ${JSON.stringify(scores)}
      Number of levels completed: ${scores.length}
      
      Target Language: ${targetLang}
      
      Generate a Final Competency Report in JSON:
      {
        "strengths": ["Clear vocational strength 1", "Clear vocational strength 2"],
        "weaknesses": ["Specific technical gap 1", "Specific technical gap 2"],
        "skillLevel": "Entry | Practitioner | Specialist",
        "readiness": 0-100 (Integer, estimate based on scores),
        "nextSteps": ["Actionable professional step 1", "Career path advice", "Required mentorship/practice"]
      }
      
      Focus on professional readiness and practical skill assessment.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            skillLevel: { type: Type.STRING },
            readiness: { type: Type.NUMBER },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["strengths", "weaknesses", "skillLevel", "readiness", "nextSteps"]
        }
      }
    });

    return JSON.parse(response.text);
  }
};
