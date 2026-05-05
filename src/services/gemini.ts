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
      model: "gemini-2.0-flash",
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
      Generate Level ${level} lesson for ${craft?.name}. 
      Target Language: ${targetLang}
      The lesson should be professional and practical.
      Each lesson MUST have:
      1. title: Professional title.
      2. content: Clear explanation related to real work (in target language, markdown).
      3. quiz: 5 MCQs.
         - Options: 4 answers.
         - correctIndex: 0-3.
         - explanation: Why its correct.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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
                  id: { type: Type.INTEGER },
                  text: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER },
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
      Analyze these quiz scores for ${craft?.name}.
      Scores: ${JSON.stringify(scores)}
      Target Language: ${targetLang}
      Generate a professional vocational report (in target language).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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
