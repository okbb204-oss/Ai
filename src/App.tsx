/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Wrench, Hammer, Droplets, Flame, Wind, Paintbrush, 
  Scissors, Utensils, Palette, User, BookOpen, BarChart3, 
  ChevronRight, BrainCircuit, Moon, Sun, ArrowLeft, LogOut,
  Target, ShieldCheck, Briefcase, TrendingUp, Info,
  LayoutDashboard, CheckCircle2, Clock, Gauge
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

type View = 'welcome' | 'analysis' | 'dashboard' | 'craft-detail' | 'learning' | 'report';

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

  const t = useMemo(() => ({
    ar: {
      title: 'حرفتي',
      subtitle: 'اكتشف حرفتك وابدأ مستقبلك المهني',
      desc: 'منصة احترافية تجمع بين التوجيه الذكي والتعلم المهني الحقيقي. اكتشف شغفك، تعلم الحرفة، وكن مستعداً لسوق العمل.',
      heroTitle: 'اكتشف حرفتك وابدأ مستقبلك',
      howItWorks: 'كيف تعمل المنصة؟',
      steps: [
        { t: 'حلل ميولك', d: 'اختبار ذكي يحلل مهاراتك وشخصيتك.' },
        { t: 'تعلم بذكاء', d: 'مسار تعليمي متكامل من 20 مستوى احترافي.' },
        { t: 'احصل على تقييم', d: 'تقرير شامل عن جاهزيتك لسوق العمل.' }
      ],
      ctaAnalysis: 'ابدأ التحليل الذكي',
      ctaBrowse: 'تصفح الحرف',
      loading: 'جاري معالجة البيانات...',
      logout: 'خروج',
      next: 'التالي',
      prev: 'سابق',
      submit: 'إرسال وتحليل',
      level: 'المستوى',
      startLearning: 'ابدأ التعلم الآن',
      quiz: 'اختبار تقييمي',
      result: 'النتيجة',
      report: 'تقرير الكفاءة والاحترافية',
      strengths: 'نقاط القوة',
      weaknesses: 'مجالات التطوير',
      readiness: 'جاهزية سوق العمل',
      nextSteps: 'التوصيات والمسار المهني',
      restart: 'بدء مسار جديد',
      tools: 'الأدوات المطلوبة',
      salary: 'متوسط الدخل المتوقع',
      duration: 'مدة التدريب',
      skills: 'المهارات المكتسبة',
      opportunities: 'فرص العمل',
      difficulty: 'مستوى الصعوبة',
      diffLevels: { easy: 'سهل', medium: 'متوسط', hard: 'متقدم' },
      craftLevels: {
        primary: 'المستوى الأساسي',
        secondary: 'المستوى التقني',
        higher: 'التخصصات العليا'
      }
    },
    en: {
      title: 'HIRFATI AI',
      subtitle: 'Discover Your Craft & Build Your Future',
      desc: 'A high-end professional platform combining smart guidance and real vocational learning. Discover your passion, master the craft, and prepare for top-tier jobs.',
      heroTitle: 'Discover Your Craft, Start Your Career',
      howItWorks: 'How It Works',
      steps: [
        { t: 'Analysis', d: 'Smart AI test to analyze your skills and personality.' },
        { t: 'Learning', d: 'Comprehensive 20-level professional learning path.' },
        { t: 'Evaluation', d: 'Full competency report for market readiness.' }
      ],
      ctaAnalysis: 'Start Smart Analysis',
      ctaBrowse: 'Browse Crafts',
      loading: 'Processing application data...',
      logout: 'Logout',
      next: 'Next Step',
      prev: 'Previous',
      submit: 'Analyze Profile',
      level: 'Level',
      startLearning: 'Start Learning Now',
      quiz: 'Evaluation Quiz',
      result: 'Result',
      report: 'Competency & Professional Report',
      strengths: 'Core Strengths',
      weaknesses: 'Areas for Improvement',
      readiness: 'Job Market Readiness',
      nextSteps: 'Career Recommendations',
      restart: 'Start New Path',
      tools: 'Required Tools',
      salary: 'Estimated Salary',
      duration: 'Training Duration',
      skills: 'Acquired Skills',
      opportunities: 'Career Paths',
      difficulty: 'Difficulty',
      diffLevels: { easy: 'Entry', medium: 'Intermediate', hard: 'Advanced' },
      craftLevels: {
        primary: 'Primary Crafts',
        secondary: 'Technical Crafts',
        higher: 'Higher Specialties'
      }
    },
    fr: {
      title: 'HIRFATI AI',
      subtitle: 'Découvrez votre métier et forgez votre avenir',
      desc: 'Plateforme professionnelle de haut niveau combinant orientation intelligente et formation réelle. Découvrez votre passion, apprenez le métier et préparez-vous au marché du travail.',
      heroTitle: 'Découvrez votre métier, lancez votre carrière',
      howItWorks: 'Comment ça marche ?',
      steps: [
        { t: 'Analyse', d: 'Test IA intelligent pour analyser vos compétences.' },
        { t: 'Apprentissage', d: 'Parcours professionnel complet en 20 niveaux.' },
        { t: 'Évaluation', d: 'Rapport complet d\'aptitude au marché du travail.' }
      ],
      ctaAnalysis: 'Lancer l\'analyse intelligente',
      ctaBrowse: 'Parcourir les métiers',
      loading: 'Traitement des données...',
      logout: 'Déconnexion',
      next: 'Suivant',
      prev: 'Précédent',
      submit: 'Analyser le profil',
      level: 'Niveau',
      startLearning: 'Commencer l\'apprentissage',
      quiz: 'Quiz d\'évaluation',
      result: 'Résultat',
      report: 'Rapport de compétence et professionnalisme',
      strengths: 'Points forts',
      weaknesses: 'Axes d\'amélioration',
      readiness: 'Aptitude au marché',
      nextSteps: 'Recommandations de carrière',
      restart: 'Nouveau parcours',
      tools: 'Outils requis',
      salary: 'Salaire estimé',
      duration: 'Durée de formation',
      skills: 'Compétences acquises',
      opportunities: 'Débouchés',
      difficulty: 'Difficulté',
      diffLevels: { easy: 'Débutant', medium: 'Intermédiaire', hard: 'Avancé' },
      craftLevels: {
        primary: 'Métiers de base',
        secondary: 'Métiers techniques',
        higher: 'Spécialités supérieures'
      }
    }
  }[lang]), [lang]);

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

  const selectCraftForOverview = (craft: Craft) => {
    setSelectedCraft(craft);
    setView('craft-detail');
  };

  const startLesson = async (craft: Craft, level: number) => {
    setLoading(true);
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
      // Logic for next level or back to overview
      const nextLevel = currentLevel + 1;
      if (nextLevel <= 20) {
        startLesson(selectedCraft!, nextLevel);
      } else {
        setView('dashboard');
      }
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
    <div className="min-h-screen transition-colors duration-500 font-sans selection:bg-primary-500 selection:text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('welcome')}>
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-black shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform">H</div>
            <span className="text-2xl font-black tracking-tight uppercase dark:text-white">{t.title} <span className="text-primary-600">AI</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-neutral-100 dark:bg-neutral-900 rounded-xl p-1 shadow-inner">
              {(['ar', 'en', 'fr'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                    lang === l ? "bg-white dark:bg-neutral-800 shadow-md text-primary-600" : "text-neutral-500 hover:text-primary-500 dark:hover:text-neutral-300"
                  )}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors dark:text-white"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {profile && (
              <button 
                onClick={() => { setProfile(null); setView('welcome'); }}
                className="btn-secondary py-2 px-4 text-sm"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          {view === 'welcome' && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-32"
            >
              {/* Hero Section */}
              <section className="text-center py-20 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary-600/5 dark:bg-primary-600/10 blur-[100px] -z-10 rounded-full" />
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="title-hero mb-8 bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 bg-clip-text text-transparent">
                    {t.heroTitle}
                  </h1>
                  <p className="text-xl md:text-2xl text-neutral-500 dark:text-neutral-400 max-w-3xl mx-auto mb-14 leading-relaxed font-arabic">
                    {t.desc}
                  </p>
                  <div className="flex flex-wrap justify-center gap-6">
                    <button onClick={() => setView('analysis')} className="btn-primary text-lg">
                      <BrainCircuit size={24} />
                      {t.ctaAnalysis}
                    </button>
                    <button onClick={() => setView('dashboard')} className="btn-secondary text-lg">
                      <BookOpen size={24} />
                      {t.ctaBrowse}
                    </button>
                  </div>
                </motion.div>
              </section>

              {/* Steps Section */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {t.steps.map((step, i) => (
                  <motion.div 
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="card-premium p-10 text-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-primary-600/10 flex items-center justify-center text-primary-600 mx-auto mb-8 font-black text-2xl">
                      {i + 1}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 dark:text-white">{step.t}</h3>
                    <p className="text-neutral-500 dark:text-neutral-400">{step.d}</p>
                  </motion.div>
                ))}
              </section>

              {/* Marquee crafts */}
              <section className="text-center opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-12 dark:text-white">{t.ctaBrowse}</h2>
                <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
                  {CRAFTS.map(c => {
                    const Icon = ICON_MAP[c.icon];
                    return (
                      <div key={c.id} className="flex flex-col items-center gap-3">
                        <Icon size={40} className="dark:text-white" />
                        <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">
                          {lang === 'ar' ? c.nameAr : lang === 'fr' ? c.nameFr : c.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          )}

          {view === 'analysis' && (
            <AnalysisForm key="analysis" onSubmit={handleStartAnalysis} loading={loading} lang={lang} t={t} />
          )}

          {view === 'dashboard' && (
            <Dashboard 
              key="dashboard"
              profile={profile}
              analysis={analysis}
              onSelectCraft={selectCraftForOverview}
              completedLevels={scores}
              lang={lang}
              t={t}
            />
          )}
          
          {view === 'craft-detail' && selectedCraft && (
            <CraftOverview
               craft={selectedCraft}
               onBack={() => setView('dashboard')}
               onStart={() => startLesson(selectedCraft, scores[selectedCraft.id] ? scores[selectedCraft.id] + 1 : 1)}
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
              onBack={() => setView('craft-detail')}
              onGoToLevel={ level => startLesson(selectedCraft, level) }
              scores={scores}
              lang={lang}
              t={t}
            />
          )}

          {view === 'report' && finalReport && selectedCraft && (
            <ReportView 
              key="report"
              report={finalReport}
              craft={selectedCraft}
              onRestart={() => { setScores({}); setView('welcome'); }}
              lang={lang}
              t={t}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Global Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-white/60 dark:bg-black/60 backdrop-blur-xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <BrainCircuit className="text-primary-600 animate-pulse" size={32} />
              </div>
            </div>
            <p className="font-bold text-neutral-800 dark:text-neutral-200 text-xl tracking-tight">{t.loading}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-Views ---

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

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto card-premium p-10 md:p-16"
    >
      <div className="mb-12">
        <div className="flex gap-2 mb-6">
          {[1,2,3,4].map(s => (
            <div key={s} className={cn("h-1.5 flex-1 rounded-full", step >= s ? "bg-primary-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "bg-neutral-200 dark:bg-neutral-800")} />
          ))}
        </div>
        <h2 className="text-3xl font-black mb-2 dark:text-white capitalize">{lang === 'ar' ? 'التحليل المهني' : 'Career Analysis'}</h2>
        <p className="text-neutral-500 dark:text-neutral-400">{lang === 'ar' ? 'أجب بمصداقية لنحدد مسارك' : 'Answer honestly to define your path'}</p>
      </div>

      <div className="space-y-10">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="card-premium p-8 border-primary-600/10">
              <label className="block text-sm font-black uppercase tracking-widest text-neutral-400 mb-4">{lang === 'ar' ? 'العمر' : 'Your Age'}</label>
              <input 
                type="number" 
                value={formData.age} 
                onChange={e => setFormData({...formData, age: parseInt(e.target.value)})}
                className="text-4xl font-black w-full bg-transparent outline-none border-b-2 border-neutral-100 dark:border-neutral-800 focus:border-primary-600 transition-colors pb-4 dark:text-white"
              />
            </div>
            <div className="card-premium p-8 border-primary-600/10">
              <label className="block text-sm font-black uppercase tracking-widest text-neutral-400 mb-6">{lang === 'ar' ? 'المستوى التعليمي' : 'Education Level'}</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['primary', 'secondary', 'university'] as const).map((edu) => (
                   <button
                    key={edu}
                    onClick={() => setFormData({...formData, education: edu})}
                    className={cn(
                      "px-6 py-4 rounded-xl border-2 font-bold transition-all",
                      formData.education === edu ? "border-primary-600 bg-primary-600 text-white shadow-lg" : "border-neutral-100 dark:border-neutral-800 hover:border-primary-600 dark:text-white"
                    )}
                   >
                     {edu.toUpperCase()}
                   </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <label className="block text-sm font-black uppercase tracking-widest text-neutral-400 mb-2">{lang === 'ar' ? 'ما هي اهتماماتك؟' : 'Your Interests'}</label>
            <div className="grid grid-cols-2 gap-4">
              {interestsOptions.map(i => (
                <button
                  key={i}
                  onClick={() => handleToggleInterest(i)}
                  className={cn(
                    "px-6 py-4 rounded-2xl border-2 text-sm font-bold transition-all flex items-center justify-between",
                    formData.interests.includes(i) 
                      ? "bg-primary-600 border-primary-600 text-white shadow-xl translate-y-[-2px]" 
                      : "border-neutral-100 dark:border-neutral-800 hover:border-primary-600/50 dark:text-white"
                  )}
                >
                  <span>{i}</span>
                  {formData.interests.includes(i) && <CheckCircle2 size={16} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <label className="block text-sm font-black uppercase tracking-widest text-neutral-400 mb-6">{lang === 'ar' ? 'نمط العمل المفضل' : 'Work Style'}</label>
             <div className="grid grid-cols-1 gap-6">
                {[
                  { id: 'manual', icon: Hammer, t: 'Manual & Practical' },
                  { id: 'technical', icon: Zap, t: 'Technical & Engineering' },
                  { id: 'creative', icon: Palette, t: 'Creative & Artistic' }
                ].map(style => (
                  <button
                    key={style.id}
                    onClick={() => setFormData({...formData, workStyle: style.id as any})}
                    className={cn(
                      "flex items-center gap-6 p-8 rounded-3xl border-2 transition-all text-left",
                      formData.workStyle === style.id 
                        ? "border-primary-600 bg-primary-600/5 shadow-xl" 
                        : "border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    )}
                  >
                    <div className={cn("p-4 rounded-2xl", formData.workStyle === style.id ? "bg-primary-600 text-white" : "bg-neutral-100 dark:bg-neutral-800")}>
                      <style.icon size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black mb-1 dark:text-white">{style.t}</h4>
                      <p className="text-neutral-500 text-sm">Preferred for {style.id} focused career paths</p>
                    </div>
                  </button>
                ))}
             </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center">
            <h3 className="text-4xl font-black dark:text-white">{lang === 'ar' ? 'جاهز للنتيجة؟' : 'Ready for Results?'}</h3>
            <p className="text-neutral-500 mb-10">AI will now analyze your profile against 10 professional vocational paths.</p>
            <div className="grid grid-cols-3 gap-6">
              {(['beginner', 'intermediate', 'advanced'] as const).map(exp => (
                <button
                  key={exp}
                  onClick={() => setFormData({...formData, experience: exp})}
                  className={cn(
                    "p-8 rounded-3xl border-4 transition-all",
                    formData.experience === exp ? "border-primary-600 bg-primary-600 text-white" : "border-neutral-100 dark:border-neutral-800 opacity-50"
                  )}
                >
                   <div className="font-black text-xs uppercase tracking-[0.2em] mb-2">{exp}</div>
                   <div className="text-lg font-bold">{exp === 'advanced' ? 'Professional' : 'Learner'}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="flex gap-6 pt-10">
          {step > 1 && (
            <button key="prev" onClick={() => setStep(step-1)} className="btn-secondary w-1/3">
              <ArrowLeft size={18} className={lang === 'ar' ? "rotate-180" : ""} /> {t.prev}
            </button>
          )}
          <button 
            key="next"
            onClick={() => step === 4 ? onSubmit(formData) : setStep(step + 1)}
            disabled={loading}
            className="btn-primary flex-1 py-5 text-xl"
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

  const getCraftName = (c: Craft) => lang === 'ar' ? c.nameAr : lang === 'fr' ? c.nameFr : c.name;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-24">
      {analysis && (
        <section>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tight dark:text-white capitalize">{lang === 'ar' ? 'توصيات الذكاء الاصطناعي' : 'AI Career Blueprint'}</h2>
              <p className="text-neutral-500 font-medium">Mapped specifically to your professional profile</p>
            </div>
            <BrainCircuit className="text-primary-600" size={48} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {top3.map((id, index) => {
              const craft = CRAFTS.find(c => c.id === id);
              if (!craft) return null;
              const Icon = ICON_MAP[craft.icon];
              return (
                <motion.div 
                  key={id}
                  whileHover={{ y: -10 }}
                  className="relative p-10 card-premium border-2 border-primary-600/30 overflow-hidden group cursor-pointer"
                  onClick={() => onSelectCraft(craft)}
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Icon size={120} />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white font-black text-xl mb-8">
                    {index + 1}
                  </div>
                  <h3 className="text-3xl font-black mb-4 dark:text-white">{getCraftName(craft)}</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8 leading-relaxed line-clamp-4">
                    {analysis.explanations[id]}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary-600 font-black text-sm uppercase tracking-widest">
                       {t.startLearning}
                       <ChevronRight size={18} className={lang === 'ar' ? "rotate-180" : ""} />
                    </div>
                    <div className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full text-[10px] font-black uppercase">
                       98% Match
                    </div>
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
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-2xl font-black tracking-tight text-neutral-400 uppercase tracking-[0.2em]">{(t.craftLevels as any)[level]}</h2>
              <div className="h-[2px] flex-1 bg-neutral-100 dark:bg-neutral-900" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {levelCrafts.map(craft => {
                const Icon = ICON_MAP[craft.icon];
                const isSuggested = suggestedIds.includes(craft.id);
                return (
                  <div 
                    key={craft.id}
                    onClick={() => onSelectCraft(craft)}
                    className={cn(
                      "p-8 card-premium cursor-pointer group",
                      isSuggested ? "ring-2 ring-primary-600 ring-offset-4 dark:ring-offset-neutral-950" : ""
                    )}
                  >
                    <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 group-hover:bg-primary-600 group-hover:text-white transition-all w-fit mb-8 shadow-sm">
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-black mb-2 dark:text-white group-hover:text-primary-600 transition-colors">{getCraftName(craft)}</h3>
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-neutral-50 dark:border-neutral-800">
                       <div className="flex flex-col">
                         <span className="text-[10px] font-black uppercase tracking-[0.1em] text-neutral-400">{t.salary}</span>
                         <span className="text-sm font-bold dark:text-white">{craft.salary}</span>
                       </div>
                       <div className={cn("w-3 h-3 rounded-full", isSuggested ? "bg-primary-600 animate-pulse" : "bg-neutral-200 dark:bg-neutral-800")} />
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

function CraftOverview({ craft, onBack, onStart, lang, t }: { craft: Craft, onBack: () => void, onStart: () => void, lang: Language, t: any }) {
  const getCraftName = (c: Craft) => lang === 'ar' ? c.nameAr : lang === 'fr' ? c.nameFr : c.name;
  const getCraftDesc = (c: Craft) => lang === 'ar' ? c.descriptionAr : lang === 'fr' ? c.descriptionFr : c.description;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <button onClick={onBack} className="btn-secondary py-2 px-4 shadow-sm">
        <ArrowLeft size={20} className={lang === 'ar' ? "rotate-180" : ""} /> {lang === 'ar' ? 'رجوع للوحة التحكم' : 'Back to Dashboard'}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           <div className="card-premium p-10 md:p-16 relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary-600/5 blur-[80px]" />
             <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10">
                <div className="p-6 rounded-3xl bg-primary-600 text-white shadow-2xl shadow-primary-600/30">
                   {(() => {
                     const Icon = ICON_MAP[craft.icon];
                     return Icon ? <Icon size={48} /> : null;
                   })()}
                </div>
                <div>
                   <h1 className="text-5xl font-black mb-3 dark:text-white">{getCraftName(craft)}</h1>
                   <div className="flex flex-wrap gap-3">
                      <span className="px-3 py-1 bg-primary-600/10 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest">{t.diffLevels[craft.difficulty]}</span>
                      <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-full text-[10px] font-black uppercase tracking-widest">{craft.duration}</span>
                   </div>
                </div>
             </div>
             <p className="text-xl md:text-2xl text-neutral-500 dark:text-neutral-400 leading-relaxed font-arabic bg-neutral-50 dark:bg-white/5 p-8 rounded-3xl">
                {getCraftDesc(craft)}
             </p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card-premium p-10 border-primary-600/10">
                 <h3 className="flex items-center gap-3 text-xl font-black mb-8 dark:text-white">
                    <Wrench className="text-primary-600" size={24} />
                    {t.tools}
                 </h3>
                 <div className="grid grid-cols-1 gap-3">
                    {craft.tools.map((tool, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl font-bold dark:text-white">
                         <div className="w-2 h-2 rounded-full bg-primary-600" />
                         {tool}
                      </div>
                    ))}
                 </div>
              </div>
              <div className="card-premium p-10 border-primary-600/10">
                 <h3 className="flex items-center gap-3 text-xl font-black mb-8 dark:text-white">
                    <TrendingUp className="text-primary-600" size={24} />
                    {t.skills}
                 </h3>
                 <div className="grid grid-cols-1 gap-3">
                    {craft.skills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-primary-600/5 rounded-xl font-bold dark:text-white">
                         <CheckCircle2 className="text-primary-600" size={20} />
                         {skill}
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="card-premium p-10 bg-primary-600 text-white shadow-2xl shadow-primary-600/30 border-none sticky top-32">
              <h3 className="text-2xl font-black mb-8 capitalize">{t.startLearning}</h3>
              <div className="space-y-6 mb-10">
                 <div className="flex justify-between items-center py-4 border-b border-white/20">
                    <span className="text-white/70 font-bold">{t.salary}</span>
                    <span className="text-2xl font-black">{craft.salary}</span>
                 </div>
                 <div className="flex justify-between items-center py-4 border-b border-white/20">
                    <span className="text-white/70 font-bold">{t.duration}</span>
                    <span className="text-xl font-black">{craft.duration}</span>
                 </div>
              </div>
              <button 
                onClick={onStart}
                className="w-full py-5 bg-white text-primary-600 rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition-all active:scale-95"
              >
                {t.startLearning}
              </button>
           </div>
           
           <div className="card-premium p-10">
              <h3 className="flex items-center gap-3 text-xl font-black mb-6 dark:text-white">
                 <Briefcase className="text-primary-600" size={24} />
                 {t.opportunities}
              </h3>
              <div className="space-y-4">
                 {craft.opportunities.map((opp, i) => (
                    <div key={i} className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-2xl text-sm font-bold dark:text-neutral-300">
                      {opp}
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function LessonInterface({ craft, lesson, onComplete, onBack, onGoToLevel, scores, lang, t }: { 
  craft: Craft, 
  lesson: Lesson, 
  onComplete: (score: number) => void,
  onBack: () => void,
  onGoToLevel: (level: number) => void,
  scores: Record<number, number>,
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row gap-8 min-h-[80vh]">
      {/* Sidebar - Levels */}
      <aside className="w-full lg:w-72 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6 h-fit sticky top-28">
         <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 px-2 dark:text-white">{lang === 'ar' ? 'خارطة الطريق' : 'Learning Roadmap'}</h3>
         <div className="grid grid-cols-5 lg:grid-cols-1 gap-2">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((lvl) => {
              const isCurrent = lvl === lesson.level;
              const isCompleted = scores[lvl] !== undefined;
              const isLocked = lvl > (Object.keys(scores).length + 1);
              
              return (
                <button
                  key={lvl}
                  disabled={isLocked}
                  onClick={() => onGoToLevel(lvl)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all font-black text-xs",
                    isCurrent ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30" : 
                    isCompleted ? "bg-primary-600/10 text-primary-600 border border-primary-600/20" : 
                    isLocked ? "opacity-30 border border-neutral-100 dark:border-neutral-800" : "hover:bg-neutral-50 dark:hover:bg-neutral-800 dark:text-neutral-400"
                  )}
                >
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 font-mono", isCurrent ? "border-white" : "border-current")}>
                    {lvl}
                  </div>
                  <span className="hidden lg:inline">{t.level} {lvl}</span>
                  {isCompleted && !isCurrent && <CheckCircle2 className="ml-auto hidden lg:block" size={14} />}
                </button>
              );
            })}
         </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 card-premium p-8 py-6">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl hover:bg-neutral-200 transition-colors dark:text-white">
              <ArrowLeft size={20} className={lang === 'ar' ? "rotate-180" : ""} />
            </button>
            <div>
               <h2 className="text-2xl font-black dark:text-white tracking-tight">{lesson.title}</h2>
               <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">{getCraftName(craft)} - {t.level} {lesson.level}/20</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{lang === 'ar' ? 'التقدم' : 'Progress'}</span>
                <div className="w-32 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                   <div className="h-full bg-primary-600" style={{ width: `${(lesson.level / 20) * 100}%` }} />
                </div>
             </div>
          </div>
        </div>

        {!showQuiz ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-10 md:p-16">
            <div className="markdown-body prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
            </div>
            <div className="mt-16 pt-10 border-t border-neutral-50 dark:border-neutral-800 flex justify-end">
               <button 
                onClick={() => setShowQuiz(true)}
                className="btn-primary text-xl px-12"
               >
                 {t.quiz}
               </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {lesson.quiz.map((q, idx) => (
              <motion.div 
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card-premium p-10 md:p-12 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-primary-600/20" />
                <h3 className="text-2xl font-black mb-8 flex gap-5 dark:text-white">
                  <span className="text-primary-600/50">0{idx + 1}</span>
                  {q.text}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[q.id] === oIdx;
                    const isCorrect = q.correctIndex === oIdx;
                    return (
                      <button
                        key={oIdx}
                        disabled={submitted}
                        onClick={() => setAnswers({...answers, [q.id]: oIdx})}
                        className={cn(
                          "p-6 rounded-2xl border-2 text-right transition-all font-bold text-lg",
                          submitted
                            ? isCorrect 
                              ? "border-success-500 bg-success-500/10 text-success-600" 
                              : isSelected ? "border-red-500 bg-red-500/10 text-red-600" : "border-neutral-50 dark:border-neutral-800 opacity-50 dark:text-white"
                            : isSelected ? "border-primary-600 bg-primary-600 text-white shadow-xl translate-y-[-2px]" : "border-neutral-50 dark:border-neutral-800 hover:border-primary-600/30 dark:text-white"
                        )}
                      >
                         <span className={cn("inline-block w-8 h-8 rounded-lg border-2 mx-3 align-middle text-xs text-center leading-7", isSelected ? "bg-white/20 border-white" : "border-neutral-200")}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {submitted && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 bg-primary-600/5 rounded-2xl border-l-4 border-primary-600">
                     <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                      <span className="text-primary-600 font-black uppercase tracking-widest text-xs block mb-2">{lang === 'ar' ? 'توضيح احترافي' : 'Professional Insight'}</span> {q.explanation}
                     </p>
                  </motion.div>
                )}
              </motion.div>
            ))}

            <div className="flex flex-col items-center gap-8 py-16 card-premium p-10 mt-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <ShieldCheck size={120} className="text-primary-600" />
              </div>
              {submitted ? (
                <div className="text-center space-y-10 relative z-10">
                  <div className="space-y-2">
                    <h4 className="text-sm font-black uppercase tracking-[0.4em] text-primary-600">{lang === 'ar' ? 'التقييم المهني للمستوى' : 'Professional Level Evaluation'}</h4>
                    <div className="text-9xl font-black text-neutral-900 dark:text-white tabular-nums tracking-tighter">
                      {Math.round((score / 5) * 100)}<span className="text-3xl text-neutral-400">%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                     <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700">
                        <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{lang === 'ar' ? 'الدقة' : 'Accuracy'}</div>
                        <div className="font-bold dark:text-white">{score}/5</div>
                     </div>
                     <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700">
                        <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{lang === 'ar' ? 'الكفاءة' : 'Competency'}</div>
                        <div className="font-bold dark:text-white">{score >= 4 ? (lang === 'ar' ? 'ممتاز' : 'Excellent') : score >= 3 ? (lang === 'ar' ? 'جيد' : 'Good') : (lang === 'ar' ? 'يحتاج تدريب' : 'Needs Practice')}</div>
                     </div>
                     <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700">
                        <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{lang === 'ar' ? 'الحالة' : 'Status'}</div>
                        <div className="font-bold text-success-500">{lang === 'ar' ? 'مكتمل' : 'Validated'}</div>
                     </div>
                  </div>

                  <button 
                    onClick={() => onComplete(score)}
                    className="btn-primary text-2xl px-20 py-5 group shadow-2xl shadow-primary-600/40"
                  >
                    {t.next}
                    <ChevronRight size={28} className={cn("transition-transform group-hover:translate-x-2", lang === 'ar' ? "rotate-180" : "")} />
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-8 relative z-10 w-full max-w-md">
                  <div className="p-6 bg-primary-600/5 rounded-2xl border-2 border-dashed border-primary-600/20">
                     <p className="text-neutral-500 font-bold">{lang === 'ar' ? 'أكمل جميع الأسئلة لتلقي التقييم الفني' : 'Complete all questions to receive technical evaluation'}</p>
                  </div>
                  <button 
                    onClick={() => setSubmitted(true)}
                    disabled={Object.keys(answers).length < 5}
                    className="btn-primary text-2xl w-full py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    {t.submit}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ReportView({ report, craft, onRestart, lang, t }: { report: FinalReport, craft: Craft, onRestart: () => void, lang: Language, t: any }) {
  const getCraftName = (c: Craft) => lang === 'ar' ? c.nameAr : lang === 'fr' ? c.nameFr : c.name;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto space-y-10">
      <div className="bg-neutral-900 text-white rounded-[40px] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.15),transparent)] pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-600/30 blur-[100px]" />
        
        <div className="relative z-10">
          <BarChart3 className="mx-auto mb-10 text-primary-600" size={64} />
          <h2 className="text-5xl font-black mb-4 tracking-tight leading-tight">{t.report}</h2>
          <p className="text-neutral-500 font-bold uppercase tracking-[0.4em] mb-16">{getCraftName(craft)} Specialist accreditation</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-start">
            <div className="space-y-8 p-10 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-sm">
              <h3 className="text-primary-600 font-black uppercase tracking-[0.3em] text-xs">{t.strengths}</h3>
              <div className="space-y-5">
                {report.strengths.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 text-xl font-bold bg-white/5 p-4 rounded-2xl">
                    <CheckCircle2 className="text-success-500" size={24} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-8 p-10 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-sm flex flex-col justify-center items-center text-center">
              <h3 className="text-primary-600 font-black uppercase tracking-[0.3em] text-xs">{t.readiness}</h3>
              <div className="relative">
                <svg className="w-56 h-56 transform -rotate-90">
                  <circle cx="112" cy="112" r="90" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                  <motion.circle 
                    cx="112" cy="112" r="90" stroke="currentColor" strokeWidth="12" fill="transparent" 
                    className="text-primary-600" 
                    initial={{ strokeDasharray: "0 565" }}
                    animate={{ strokeDasharray: `${(report.readiness / 100) * 565} 565` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <div className="text-6xl font-black">{report.readiness}%</div>
                </div>
              </div>
              <div className="px-8 py-3 bg-primary-600 text-white rounded-2xl text-lg font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-600/30">
                {report.skillLevel}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="card-premium p-12">
          <div className="flex items-center gap-4 mb-10">
             <div className="w-12 h-12 rounded-2xl bg-warning-500/10 text-warning-500 flex items-center justify-center">
                <Target size={28} />
             </div>
             <h3 className="text-2xl font-black dark:text-white">{t.weaknesses}</h3>
          </div>
          <ul className="space-y-6">
            {report.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-4 p-5 bg-neutral-50 dark:bg-neutral-800 rounded-2xl text-neutral-600 dark:text-neutral-400 font-bold leading-relaxed border border-neutral-100 dark:border-neutral-800">
                <div className="w-2 h-2 rounded-full bg-warning-500 shrink-0 mt-2.5" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-premium p-12">
          <div className="flex items-center gap-4 mb-10">
             <div className="w-12 h-12 rounded-2xl bg-success-500/10 text-success-500 flex items-center justify-center">
                <ShieldCheck size={28} />
             </div>
             <h3 className="text-2xl font-black dark:text-white">{t.nextSteps}</h3>
          </div>
          <div className="space-y-4">
            {report.nextSteps.map((step, i) => (
              <div key={i} className="p-6 bg-primary-600/5 rounded-3xl flex items-center gap-6 border-2 border-primary-600/10">
                <div className="w-10 h-10 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-black shrink-0 shadow-lg shadow-primary-600/20">{i+1}</div>
                <span className="font-bold text-base leading-relaxed dark:text-neutral-200">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 pt-16">
        <button onClick={onRestart} className="btn-primary py-6 px-20 text-2xl shadow-2xl">
          {t.restart}
        </button>
        <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Hirfati AI - Excellence in vocational training</p>
      </div>
    </motion.div>
  );
}
