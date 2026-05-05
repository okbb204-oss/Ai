/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AnalysisResult, Lesson, FinalReport } from "../types";
import { CRAFTS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  async analyzeUser(profile: UserProfile): Promise<AnalysisResult> {
    const prompt = `
      As a vocational guidance expert, analyze this user profile and suggest the most suitable crafts from our list.
      User Profile: ${JSON.stringify(profile)}
      Available Crafts: ${JSON.stringify(CRAFTS.map(c => ({ id: c.id, name: c.name, nameAr: c.nameAr })))}

      Provide the result in JSON format with:
      1. suggestedCrafts: Array of IDs of all suitable crafts.
      2. top3: Top 3 craft IDs in order of preference.
      3. explanations: An object mapping craft ID to a brief explanation (in Arabic) of WHY it fits the user.
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

  async getLesson(craftId: string, level: number): Promise<Lesson> {
    const craft = CRAFTS.find(c => c.id === craftId);
    const prompt = `
      Generate Level ${level} lesson for ${craft?.name} (${craft?.nameAr}). 
      The lesson should be professional, practical, and progressive in difficulty.
      Each lesson MUST have:
      1. title: Professional title in English.
      2. titleAr: Professional title in Arabic.
      3. content: Clear explanation (professional + practical) related to real work (in Arabic, markdown format).
      4. quiz: 5 unique multiple-choice questions related to this lesson. 
         - Options: 4 realistic answers.
         - correctIndex: Index of the correct answer (0-3).
         - explanation: Brief explanation (in Arabic) why the answer is correct.

      This is level ${level}/20. Ensure the difficulty matches the level.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview", // Complex reasoning needed for lesson structure
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            titleAr: { type: Type.STRING },
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
          required: ["title", "titleAr", "content", "quiz"]
        }
      }
    });

    const data = JSON.parse(response.text);
    return {
      id: Date.now(),
      level,
      ...data
    };
  },

  async generateReport(craftId: string, scores: number[]): Promise<FinalReport> {
    const craft = CRAFTS.find(c => c.id === craftId);
    const prompt = `
      Analyze these quiz scores ([0-5] per lesson) for the ${craft?.name} course.
      Scores: ${JSON.stringify(scores)}
      
      Generate a professional vocational report in Arabic:
      1. strengths: List of 3-5 strengths.
      2. weaknesses: List of 2-4 areas for improvement.
      3. skillLevel: One of 'Beginner', 'Practitioner', 'Expert'.
      4. readiness: Number from 0-100 indicating career readiness for this craft.
      5. nextSteps: 3 professional recommendations for their career.
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
