/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Craft {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  icon: string;
  tools: string[];
  opportunities: string[];
}

export interface UserProfile {
  age: number;
  education: string;
  interests: string[];
  workStyle: 'manual' | 'technical' | 'creative';
  experience: 'beginner' | 'intermediate' | 'advanced';
}

export interface Lesson {
  id: number;
  level: number;
  title: string;
  titleAr: string;
  content: string;
  quiz: Question[];
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Progress {
  craftId: string;
  completedLessons: number[];
  quizScores: Record<number, number>;
}

export interface AnalysisResult {
  suggestedCrafts: string[]; // ids
  explanations: Record<string, string>;
  top3: string[];
}

export interface FinalReport {
  strengths: string[];
  weaknesses: string[];
  skillLevel: string;
  readiness: number; // 0-100
  nextSteps: string[];
}
