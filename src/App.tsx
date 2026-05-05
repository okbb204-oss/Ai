/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Wrench, Hammer, Droplets, Flame, Wind, Paintbrush, 
  Scissors, Utensils, Palette, User, BookOpen, BarChart3, 
  ChevronRight, BrainCircuit, Moon, Sun, ArrowLeft, LogOut
} from 'lucide-react';
import { CRAFTS } from './constants';
import { UserProfile, AnalysisResult, Lesson, FinalReport, Craft, Language, CraftLevel } from './types';
import { geminiService } from './services/gemini';
import { cn } from './lib/utils';
import ReactMarkdown from 'react-markdown';

// --- Components ---

const ICON_MAP: Record<string, any> = {
  Zap, Wrench, Hammer, Droplets, Flame, Wind, Paintbrush, Scissors, Utensils, Palette
};

type View = 'welcome' | 'analysis' | 'dashboard' | 'learning' | 'report';

export default function App() {
  const [view, setView] = useState<View>('welcome');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [lang, setLang] = useState<Language>('ar');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedCraft, setSelectedCraft] = useState<Craft | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null);

  const t = {
    ar: {
      title: 'حرفتي',
      subtitle: 'اكتشف حرفتك وابدأ مستقبلك المهني',
      desc: 'منصة احترافية تجمع بين التوجيه الذكي والتعلم المهني الحقيقي. اكتشف شغفك، تعلم الحرفة، وكن مستعداً لسوق العمل.',
      ctaAnalysis: 'ابدأ التحليل الذكي',
      ctaBrowse: 'تصفح الحرف',
      loading: 'جاري معالجة البيانات...',
      logout: 'خروج',
      next: 'التالي',
      prev: 'سابق',
      submit: 'إرسال وتحليل',
      level: 'المستوى',
      startLearning: 'بدء التعلم',
      quiz: 'اختبار تقييمي',
      result: 'النتيجة',
      report: 'تقرير الكفاءة',
      strengths: 'نقاط القوة',
      weaknesses: 'نقاط التطوير',
      readiness: 'جاهزية سوق العمل',
      nextSteps: 'التوصيات المهنية',
      restart: 'بدء مسار جديد',
      craftLevels: {
        primary: 'مستوى أساسي (حرف بسيطة)',
        secondary: 'مستوى تقني (حرف فنية)',
        higher: 'مستوى متقدم (تخصصات عليا)'
      }
    },
    en: {
      title: 'Hirfati',
      subtitle: 'Discover your craft and start your career',
      desc: 'A professional platform combining smart guidance and real vocational learning. Discover your passion, learn the craft, and get ready for the job market.',
      ctaAnalysis: 'Start Smart Analysis',
      ctaBrowse: 'Browse Crafts',
      loading: 'Processing data...',
      logout: 'Logout',
      next: 'Next',
      prev: 'Previous',
      submit: 'Submit & Analyze',
      level: 'Level',
      startLearning: 'Start Learning',
      quiz: 'Evaluation Quiz',
      result: 'Result',
      report: 'Competency Report',
      strengths: 'Strengths',
      weaknesses: 'Areas for Improvement',
      readiness: 'Market Readiness',
      nextSteps: 'Career Recommendations',
      restart: 'Start New Path',
      craftLevels: {
        primary: 'Primary (Basic Crafts)',
        secondary: 'Secondary (Technical Crafts)',
        higher: 'Higher (Advanced Specialties)'
      }
    },
    fr: {
      title: 'Hirfati',
      subtitle: 'Découvrez votre métier et lancez votre carrière',
      desc: 'Une plateforme professionnelle combinant orientation intelligente et apprentissage professionnel réel. Découvrez votre passion, apprenez le métier et préparez-vous au marché du travail.',
      ctaAnalysis: 'Lancer l\'analyse intelligente',
      ctaBrowse: 'Parcourir les métiers',
      loading: 'Traitement en cours...',
      logout: 'Déconnexion',
      next: 'Suivant',
      prev: 'Précédent',
      submit: 'Envoyer et analyser',
      level: 'Niveau',
      startLearning: 'Commencer l\'apprentissage',
      quiz: 'Quiz d\'évaluation',
      result: 'Résultat',
      report: 'Rapport de compétence',
      strengths: 'Points forts',
      weaknesses: 'Points à améliorer',
      readiness: 'Aptitude au marché',
      nextSteps: 'Recommandations de carrière',
      restart: 'Nouveau parcours',
      craftLevels: {
        primary: 'Primaire (Métiers de base)',
        secondary: 'Secondaire (Métiers techniques)',
        higher: 'Supérieur (Spécialités avancées)'
      }
    }
  }[lang];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [theme, lang]);

  const handleStartAnalysis = async (p: UserProfile) => {
    setLoading(true);
    try {
      const res = await geminiService.analyzeUser({ ...p, language: lang });
      setProfile(p);
      setAnalysis(res);
      setView('dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startLesson = async (craft: Craft, level: number) => {
    setLoading(true);
    setSelectedCraft(craft);
    setCurrentLevel(level);
    try {
      const lesson = await geminiService.getLesson(craft.id, level, lang);
      setCurrentLesson(lesson);
      setView('learning');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const completeLesson = (score: number) => {
    const updatedScores = { ...scores, [currentLevel]: score };
    setScores(updatedScores);
    
    if (currentLevel >= 20) {
      generateFinalReport(updatedScores);
    } else {
      setView('dashboard');
    }
  };

  const generateFinalReport = async (finalScores: Record<number, number>) => {
    setLoading(true);
    try {
      const scoreValues = Object.values(finalScores);
      const report = await geminiService.generateReport(selectedCraft!.id, scoreValues, lang);
      setFinalReport(report);
      setView('report');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300 font-sans selection:bg-orange-500 selection:text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('welcome')}>
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">H</div>
            <span className="text-xl font-semibold tracking-tight uppercase">{t.title} <span className="text-orange-600">AI</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-900 rounded-lg p-1">
              {(['ar', 'en', 'fr'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "px-2 py-1 text-xs font-bold rounded-md transition-all",
                    lang === l ? "bg-white dark:bg-neutral-800 shadow-sm text-orange-600" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                  )}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {profile && (
              <button 
                onClick={() => {
                  setProfile(null);
                  setView('welcome');
                }}
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <LogOut size={16} />
                <span>{t.logout}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {view === 'welcome' && (
            <motion.section 
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                {t.subtitle.split(' ').map((word, i) => (
                  <span key={i} className={cn(i > 2 ? "text-orange-600 block md:inline" : "")}>{word} </span>
                ))}
              </h1>
              <p className="text-xl text-neutral-500 max-w-2xl mx-auto mb-12">
                {t.desc}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => setView('analysis')}
                  className="px-8 py-4 bg-orange-600 text-white rounded-xl font-medium shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95 flex items-center gap-2"
                >
                  <BrainCircuit size={20} />
                  {t.ctaAnalysis}
                </button>
                <button 
                  onClick={() => setView('dashboard')}
                  className="px-8 py-4 border border-neutral-300 dark:border-neutral-700 rounded-xl font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all flex items-center gap-2"
                >
                  <BookOpen size={20} />
                  {t.ctaBrowse}
                </button>
              </div>

              <div className="mt-24 grid grid-cols-2 md:grid-cols-5 gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                {CRAFTS.map(c => {
                  const Icon = ICON_MAP[c.icon];
                  return (
                    <div key={c.id} className="flex flex-col items-center gap-2 p-4">
                      <Icon size={32} />
                      <span className="text-xs font-medium uppercase tracking-widest">{lang === 'ar' ? c.nameAr : lang === 'fr' ? c.nameFr : c.name}</span>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {view === 'analysis' && (
            <AnalysisForm key="analysis" onSubmit={handleStartAnalysis} loading={loading} lang={lang} t={t} />
          )}

          {view === 'dashboard' && (
            <Dashboard 
              key="dashboard"
              profile={profile}
              analysis={analysis}
              onSelectCraft={(c) => startLesson(c, scores[1] ? (Object.keys(scores).length + 1) : 1)}
              completedLevels={scores}
              lang={lang}
              t={t}
            />
          )}

          {view === 'learning' && currentLesson && selectedCraft && (
            <LessonInterface 
              key="learning"
              craft={selectedCraft}
              lesson={currentLesson}
              onComplete={completeLesson}
              onBack={() => setView('dashboard')}
              lang={lang}
              t={t}
            />
          )}

          {view === 'report' && finalReport && selectedCraft && (
            <ReportView 
              key="report"
              report={finalReport}
              craft={selectedCraft}
              onRestart={() => {
                setScores({});
                setView('welcome');
              }}
              lang={lang}
              t={t}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-medium text-neutral-600 dark:text-neutral-400">جاري معالجة البيانات...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Specific View Components ---

function AnalysisForm({ onSubmit, loading, lang, t }: { onSubmit: (p: UserProfile) => void, loading: boolean, lang: Language, t: any }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    age: 20,
    education: 'secondary',
    interests: [],
    workStyle: 'technical',
    experience: 'beginner',
    language: lang
  });

  const interestsOptions = lang === 'ar' 
    ? ['إصلاح الأشياء', 'الرسم والتصميم', 'حل الألغاز', 'الطبخ', 'العمل اليدوي', 'الأجهزة الإلكترونية', 'البناء', 'تغيير شكل الأشياء']
    : lang === 'fr'
    ? ['Réparer les choses', 'Dessin et Design', 'Résoudre des énigmes', 'Cuisine', 'Travail manuel', 'Électronique', 'Construction', 'Transformation']
    : ['Fixing things', 'Drawing & Design', 'Solving puzzles', 'Cooking', 'Manual work', 'Electronics', 'Construction', 'Transformation'];

  const handleToggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const labels = {
    ar: { title: 'التحليل المهني الذكي', desc: 'أجب على هذه الأسئلة لنحدد الحرفة الأنسب لك.', age: 'العمر', edu: 'المستوى التعليمي', interests: 'ما هي اهتماماتك؟', style: 'نمط العمل المفضل', exp: 'مستوى الخبرة' },
    en: { title: 'Smart Vocational Analysis', desc: 'Answer these questions to find your perfect craft.', age: 'Age', edu: 'Education Level', interests: 'What are your interests?', style: 'Preferred Work Style', exp: 'Experience Level' },
    fr: { title: 'Analyse Vocationnelle Intelligente', desc: 'Répondez à ces questions pour trouver votre métier idéal.', age: 'Âge', edu: 'Niveau d\'éducation', interests: 'Quels sont vos intérêts ?', style: 'Style de travail préféré', exp: 'Niveau d\'expérience' }
  }[lang];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 md:p-12 shadow-2xl shadow-neutral-500/5"
    >
      <div className="mb-8">
        <div className="flex gap-2 mb-4">
          {[1,2,3,4].map(s => (
            <div key={s} className={cn("h-1 flex-1 rounded-full", step >= s ? "bg-orange-600" : "bg-neutral-200 dark:bg-neutral-800")} />
          ))}
        </div>
        <h2 className="text-2xl font-bold">{labels.title}</h2>
        <p className="text-neutral-500">{labels.desc}</p>
      </div>

      <div className="space-y-8">
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">{labels.age}</label>
              <input 
                type="number" 
                value={formData.age} 
                onChange={e => setFormData({...formData, age: parseInt(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent outline-none focus:ring-2 focus:ring-orange-600/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{labels.edu}</label>
              <select 
                value={formData.education} 
                onChange={e => setFormData({...formData, education: e.target.value as any})}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent outline-none focus:ring-2 focus:ring-orange-600/50"
              >
                <option value="primary">{lang === 'ar' ? 'أساسي' : lang === 'fr' ? 'Primaire' : 'Primary'}</option>
                <option value="secondary">{lang === 'ar' ? 'ثانوي' : lang === 'fr' ? 'Secondaire' : 'Secondary'}</option>
                <option value="university">{lang === 'ar' ? 'جامعي' : lang === 'fr' ? 'Universitaire' : 'University'}</option>
              </select>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <label className="block text-sm font-medium mb-2">{labels.interests}</label>
            <div className="grid grid-cols-2 gap-3">
              {interestsOptions.map(i => (
                <button
                  key={i}
                  onClick={() => handleToggleInterest(i)}
                  className={cn(
                    "px-4 py-3 rounded-xl border text-sm transition-all",
                    formData.interests.includes(i) 
                      ? "bg-orange-600 border-orange-600 text-white" 
                      : "border-neutral-200 dark:border-neutral-800 hover:border-orange-600"
                  )}
                >
                  {i}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-4">{labels.style}</label>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'manual', label: lang === 'ar' ? 'يدوي' : lang === 'fr' ? 'Manuel' : 'Manual', icon: Hammer },
                  { id: 'technical', label: lang === 'ar' ? 'تقني' : lang === 'fr' ? 'Technique' : 'Technical', icon: Zap },
                  { id: 'creative', label: lang === 'ar' ? 'إبداعي' : lang === 'fr' ? 'Créatif' : 'Creative', icon: Palette }
                ].map(style => (
                  <button
                    key={style.id}
                    onClick={() => setFormData({...formData, workStyle: style.id as any})}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all",
                      formData.workStyle === style.id 
                        ? "border-orange-600 bg-orange-600/5" 
                        : "border-neutral-200 dark:border-neutral-800"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <style.icon size={20} className={formData.workStyle === style.id ? "text-orange-600" : ""} />
                      <span className="font-medium">{style.label}</span>
                    </div>
                    <div className={cn("w-4 h-4 rounded-full border-2", formData.workStyle === style.id ? "border-orange-600 bg-orange-600" : "border-neutral-300")} />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <label className="block text-sm font-medium mb-4">{labels.exp}</label>
            <div className="grid grid-cols-3 gap-4">
              {['beginner', 'intermediate', 'advanced'].map(exp => (
                <button
                  key={exp}
                  onClick={() => setFormData({...formData, experience: exp as any})}
                  className={cn(
                    "p-4 rounded-2xl border text-center transition-all capitalize",
                    formData.experience === exp 
                      ? "border-orange-600 bg-orange-600 text-white" 
                      : "border-neutral-200 dark:border-neutral-800"
                  )}
                >
                  <div className="font-bold mb-1">
                    {exp === 'beginner' ? (lang === 'ar' ? 'مبتدئ' : 'Beginner') : exp === 'intermediate' ? (lang === 'ar' ? 'متوسط' : 'Intermediate') : (lang === 'ar' ? 'متقدم' : 'Expert')}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="flex gap-4 pt-10">
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all flex items-center gap-2"
            >
              <ArrowLeft size={18} className={lang !== 'ar' ? "" : "rotate-180"} /> {t.prev}
            </button>
          )}
          <button 
            onClick={() => step === 4 ? onSubmit(formData) : setStep(step + 1)}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-all active:scale-95"
          >
            {step === 4 ? (loading ? t.loading : t.submit) : t.next}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Dashboard({ profile, analysis, onSelectCraft, completedLevels, lang, t }: { 
  profile: UserProfile | null, 
  analysis: AnalysisResult | null,
  onSelectCraft: (c: Craft) => void,
  completedLevels: Record<number, number>,
  lang: Language,
  t: any
}) {
  const suggestedIds = analysis?.suggestedCrafts || [];
  const top3 = analysis?.top3 || [];

  const labels = {
    ar: { smart: 'التوصيات الذكية', all: 'جميع المسارات التعليمية', based: 'بناءً على ملفك' },
    en: { smart: 'Smart Recommendations', all: 'All Learning Paths', based: 'Based on your profile' },
    fr: { smart: 'Recommandations Intelligentes', all: 'Tous les parcours d\'apprentissage', based: 'Basé sur votre profil' }
  }[lang];

  const getCraftName = (c: Craft) => lang === 'ar' ? c.nameAr : lang === 'fr' ? c.nameFr : c.name;
  const getCraftDesc = (c: Craft) => lang === 'ar' ? c.descriptionAr : lang === 'fr' ? c.descriptionFr : c.description;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
      {analysis && (
        <section>
          <div className="flex items-center gap-3 mb-8">
            <BrainCircuit className="text-orange-600" size={28} />
            <h2 className="text-3xl font-bold tracking-tight">{labels.smart} <span className="text-neutral-500 font-normal">{labels.based}</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {top3.map((id, index) => {
              const craft = CRAFTS.find(c => c.id === id);
              if (!craft) return null;
              const Icon = ICON_MAP[craft.icon];
              return (
                <motion.div 
                  key={id}
                  whileHover={{ y: -5 }}
                  className="relative p-8 bg-white dark:bg-neutral-900 border-2 border-orange-600/30 rounded-3xl overflow-hidden group cursor-pointer"
                  onClick={() => onSelectCraft(craft)}
                >
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-black text-xl">
                    {index + 1}
                  </div>
                  <Icon size={48} className="text-orange-600 mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold mb-2">{getCraftName(craft)}</h3>
                  <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
                    {analysis.explanations[id]}
                  </p>
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-wider">
                    <span>{t.startLearning}</span>
                    <ChevronRight size={16} className={lang === 'ar' ? "rotate-180" : ""} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {(['primary', 'secondary', 'higher'] as CraftLevel[]).map((level) => {
        const levelCrafts = CRAFTS.filter(c => c.level === level);
        if (levelCrafts.length === 0) return null;

        return (
          <section key={level}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-1 border-t-4 border-orange-600 rounded-full" />
              <h2 className="text-2xl font-bold tracking-tight opacity-70">{(t.craftLevels as any)[level]}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {levelCrafts.map(craft => {
                const Icon = ICON_MAP[craft.icon];
                const isSuggested = suggestedIds.includes(craft.id);
                return (
                  <div 
                    key={craft.id}
                    onClick={() => onSelectCraft(craft)}
                    className={cn(
                      "p-6 bg-white dark:bg-neutral-900 border rounded-2xl cursor-pointer hover:shadow-xl transition-all group",
                      isSuggested ? "border-orange-600/20 shadow-orange-600/5 text-orange-600 bg-orange-600/5" : "border-neutral-200 dark:border-neutral-800"
                    )}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <Icon size={24} />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-1">{getCraftName(craft)}</h3>
                    <p className="text-xs text-neutral-500 mb-4 line-clamp-2">{getCraftDesc(craft)}</p>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">{t.level} {completedLevels[1] ? '1+' : '1'}</span>
                       {isSuggested && <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </motion.div>
  );
}

function LessonInterface({ craft, lesson, onComplete, onBack, lang, t }: { 
  craft: Craft, 
  lesson: Lesson, 
  onComplete: (score: number) => void,
  onBack: () => void,
  lang: Language,
  t: any
}) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = Object.entries(answers).reduce((acc, [qid, aid]) => {
    const q = lesson.quiz.find(q => q.id === parseInt(qid));
    return q?.correctIndex === aid ? acc + 1 : acc;
  }, 0);

  const getCraftName = (c: Craft) => lang === 'ar' ? c.nameAr : lang === 'fr' ? c.nameFr : c.name;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <ArrowLeft size={20} className={lang !== 'ar' ? "" : "rotate-180"} />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono bg-orange-600 text-white px-2 py-0.5 rounded tracking-widest uppercase">{t.level} {lesson.level}/20</span>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">{getCraftName(craft)}</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{lesson.title}</h2>
        </div>
      </div>

      {!showQuiz ? (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-10 shadow-sm transition-all">
          <div className="markdown-body prose dark:prose-invert max-w-none prose-neutral">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>
          <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
            <button 
              onClick={() => setShowQuiz(true)}
              className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all"
            >
              {t.quiz}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {lesson.quiz.map((q, idx) => (
            <div key={q.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 flex gap-4">
                <span className="text-orange-600">{idx + 1}.</span>
                {q.text}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((opt, oIdx) => {
                  const isSelected = answers[q.id] === oIdx;
                  const isCorrect = q.correctIndex === oIdx;
                  return (
                    <button
                      key={oIdx}
                      disabled={submitted}
                      onClick={() => setAnswers({...answers, [q.id]: oIdx})}
                      className={cn(
                        "p-4 rounded-xl border text-right transition-all",
                        submitted
                          ? isCorrect 
                            ? "border-green-500 bg-green-500/10" 
                            : isSelected ? "border-red-500 bg-red-500/10" : "border-neutral-200 dark:border-neutral-800 opacity-50"
                          : isSelected ? "border-orange-600 bg-orange-600/5 scale-[1.02]" : "border-neutral-200 dark:border-neutral-800 hover:border-orange-600"
                      )}
                    >
                      <span className={cn("inline-block w-6 h-6 rounded-full border mx-2 align-middle text-[10px] text-center leading-6", isSelected ? "bg-orange-600 text-white border-orange-600" : "border-neutral-300")}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                   <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    <span className="text-orange-600 font-bold">{lang === 'ar' ? 'توضيح: ' : lang === 'fr' ? 'Explication: ' : 'Explanation: '}</span> {q.explanation}
                   </p>
                </motion.div>
              )}
            </div>
          ))}

          <div className="flex flex-col items-center gap-6 pt-10">
            {submitted ? (
              <div className="text-center space-y-6">
                <div className="text-5xl font-black">{score}/5</div>
                <p className="text-lg text-neutral-500">{t.level} {lesson.level} {t.result}</p>
                <button 
                  onClick={() => onComplete(score)}
                  className="px-12 py-4 bg-orange-600 text-white rounded-2xl font-bold shadow-xl shadow-orange-600/30 hover:scale-105 transition-all text-sm uppercase tracking-widest"
                >
                  {t.next}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(answers).length < 5}
                className="px-12 py-4 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold disabled:opacity-30 transition-all hover:scale-105 uppercase tracking-widest text-sm"
              >
                {t.submit}
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ReportView({ report, craft, onRestart, lang, t }: { report: FinalReport, craft: Craft, onRestart: () => void, lang: Language, t: any }) {
  const getCraftName = (c: Craft) => lang === 'ar' ? c.nameAr : lang === 'fr' ? c.nameFr : c.name;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-8">
      <div className="bg-neutral-900 text-white rounded-[40px] p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 blur-[100px]" />
        <BarChart3 className="mx-auto mb-6 text-orange-600" size={48} />
        <h2 className="text-3xl font-bold mb-2">{t.report}</h2>
        <p className="text-neutral-400 capitalize">{getCraftName(craft)} Training AI Assessment</p>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-start">
          <div className="space-y-6 p-8 bg-white/5 rounded-3xl border border-white/10">
            <h3 className="text-orange-600 font-bold uppercase tracking-widest text-xs">{t.strengths}</h3>
            <div className="space-y-3">
              {report.strengths.map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-lg font-medium">
                  <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6 p-8 bg-white/5 rounded-3xl border border-white/10">
            <h3 className="text-orange-600 font-bold uppercase tracking-widest text-xs">{t.readiness}</h3>
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="text-7xl font-black text-orange-600">{report.readiness}%</div>
              <div className="px-6 py-2 bg-orange-600 text-white rounded-full text-sm font-bold uppercase tracking-widest whitespace-nowrap">{report.skillLevel}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-neutral-900 p-10 rounded-3xl border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-xl font-bold mb-6">{t.weaknesses}</h3>
          <ul className="space-y-4">
            {report.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-3 text-neutral-500">
                <span className="text-orange-600 font-bold mt-1.5">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-10 rounded-3xl border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-xl font-bold mb-6">{t.nextSteps}</h3>
          <div className="space-y-4">
            {report.nextSteps.map((step, i) => (
              <div key={i} className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-600/10 text-orange-600 flex items-center justify-center font-bold shrink-0">{i+1}</div>
                <span className="font-medium text-sm leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={onRestart}
          className="px-12 py-4 border-2 border-neutral-900 dark:border-white rounded-2xl font-bold hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all uppercase tracking-widest text-sm"
        >
          {t.restart}
        </button>
      </div>
    </motion.div>
  );
}
