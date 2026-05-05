/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'ar' | 'en' | 'fr';

export type CraftLevel = 'primary' | 'secondary' | 'higher';

export interface Craft {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  description: string;
  descriptionAr: string;
  descriptionFr: string;
  icon: string;
  tools: string[];
  opportunities: string[];
  level: CraftLevel;
}

export interface UserProfile {
  age: number;
  education: 'primary' | 'secondary' | 'university';
  interests: string[];
  workStyle: 'manual' | 'technical' | 'creative';
  experience: 'beginner' | 'intermediate' | 'advanced';
  language: Language;
}

export interface Lesson {
  id: number;
  level: number;
  title: string;
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
