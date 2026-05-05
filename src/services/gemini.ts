import { UserProfile, AnalysisResult, Lesson, FinalReport, Language } from "../types";
import { CRAFTS } from "../constants";

export const geminiService = {
  async analyzeUser(profile: UserProfile): Promise<AnalysisResult> {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
    const lang = profile.language;
    
    // Simple logic based on profile
    let suitable: string[] = [];
    if (profile.workStyle === 'technical') {
      suitable = CRAFTS.filter(c => c.level === 'higher' || c.skills.includes('Technical')).map(c => c.id);
    } else if (profile.workStyle === 'manual') {
      suitable = CRAFTS.filter(c => c.level === 'primary' || c.level === 'secondary').map(c => c.id);
    } else {
      suitable = CRAFTS.filter(c => c.difficulty === 'medium' || c.difficulty === 'easy').map(c => c.id);
    }
    
    if (suitable.length === 0) suitable = CRAFTS.map(c => c.id).slice(0, 3);
    const top3 = suitable.slice(0, 3);
    
    const explanations: Record<string, string> = {};
    top3.forEach(id => {
      const c = CRAFTS.find(x => x.id === id);
      if (lang === 'ar') explanations[id] = `هذه المهنة مناسبة لأنك تفضل العمل الـ ${profile.workStyle === 'manual' ? 'يدوي' : profile.workStyle === 'technical' ? 'تقني' : 'إبداعي'} ولديك اهتمامات مطابقة.`;
      else if (lang === 'fr') explanations[id] = `Ce métier est adapté car vous préférez le travail ${profile.workStyle === 'manual' ? 'manuel' : profile.workStyle === 'technical' ? 'technique' : 'créatif'} et avez des intérêts correspondants.`;
      else explanations[id] = `This craft fits well because you prefer ${profile.workStyle} work and have matching interests.`;
    });

    return { suggestedCrafts: suitable, top3, explanations };
  },

  async getLesson(craftId: string, level: number, lang: Language): Promise<Lesson> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const craft = CRAFTS.find(c => c.id === craftId);
    const craftName = lang === 'ar' ? craft?.nameAr : lang === 'fr' ? craft?.nameFr : craft?.name;

    const titleEn = `Level ${level}: ${craftName} Fundamentals`;
    const titleAr = `المستوى ${level}: أساسيات ${craftName}`;
    const titleFr = `Niveau ${level}: Principes fondamentaux de ${craftName}`;
    const title = lang === 'ar' ? titleAr : lang === 'fr' ? titleFr : titleEn;

    const contentAr = `
### 1. المفهوم التقني
فهم أساسيات ${craftName} يشمل التعامل مع الأدوات والمعدات باحترافية وتطبيق معايير السلامة المهنية. في هذا المستوى (${level})، نركز على المهارات الأساسية الواجب توفرها للحصول على نتائج ممتازة.

### 2. الأهمية في سوق العمل
يعتبر هذا الجانب حيوياً لأنه يمثل العمود الفقري لإنتاج عمل خالي من الأخطاء ويضمن رضا العميل والحفاظ على الموارد من الهدر.

### 3. سيناريو واقعي
أنت في ورشة العمل وطلب منك العميل تنفيذ مشروع بناءً على مخططات مبدئية. يجب عليك أولاً تخطيط العمل، واختيار المواد المناسبة والتأكد من مطابقتها للمواصفات، ثم البدء في التنفيذ بدقة متناهية.

### 4. خطوات عملية
*   **الخطوة 1:** تجهيز بيئة العمل وتنظيفها من العوائق.
*   **الخطوة 2:** فحص وارتداء معدات السلامة المهنية المناسبة.
*   **الخطوة 3:** مراجعة المخطط والتأكد من توفر جميع متطلبات التنفيذ.
*   **الخطوة 4:** التنفيذ بحذر مع استخدام أدوات القياس بشكل متكرر.
    `;
    
    const contentFr = `
### 1. Concept technique
Comprendre les bases de ${craftName} implique de manipuler des outils professionnels et d'appliquer les normes de sécurité. Au niveau ${level}, l'accent est mis sur l'acquisition de bases solides.

### 2. Importance dans le monde du travail
Cet aspect est vital car il constitue l'épine dorsale de la production d'un travail sans erreur et garantit la satisfaction du client.

### 3. Scénario réel
Vous êtes dans un atelier et un client vous a demandé de réaliser un projet. Vous devez d'abord planifier, vérifier les matériaux, puis exécuter avec une grande précision.

### 4. Étapes pratiques
*   **Étape 1:** Préparez l'environnement de travail.
*   **Étape 2:** Portez des équipements de sécurité appropriés.
*   **Étape 3:** Révisez le plan et rassemblez le matériel.
*   **Étape 4:** Exécutez avec précaution en vérifiant régulièrement les mesures.
    `;
    
    const contentEn = `
### 1. Technical Concept
Understanding the basics of ${craftName} includes handling professional tools and applying safety standards. At level ${level}, our focus is establishing a solid foundational technique.

### 2. Importance in the Workspace
This aspect is vital because it is the backbone of producing error-free work, conserving resources, and ensuring client satisfaction.

### 3. Real-World Scenario
You are in a workshop and a client asked you to execute a project based on initial drafts. You must first plan the workflow, check the materials, and execute with extreme precision.

### 4. Practical Steps
*   **Step 1:** Prepare and clear your work environment.
*   **Step 2:** Inspect and put on your Personal Protective Equipment.
*   **Step 3:** Review the plan and ensure all materials are ready.
*   **Step 4:** Execute cautiously, using measuring tools frequently.
    `;
    
    const content = lang === 'ar' ? contentAr : lang === 'fr' ? contentFr : contentEn;

    const quizAr = [
      { id: 1, text: "ما هي أول خطوة قبل البدء بأي عمل مهني؟", options: ["تجهيز الأدوات والسلامة", "البدء فوراً في التنفيذ", "الانتظار حتى وصول العميل", "تنظيف المكان بعد الانتهاء"], correctIndex: 0, explanation: "السلامة المهنية وتجهيز الأدوات هي دوماً الخطوة الأولى لضمان سير العمل بشكل صحيح وبدون حوادث." },
      { id: 2, text: "لماذا نعتبر التخطيط المسبق خطوة أساسية؟", options: ["لإضاعة الوقت", "لتحديد المشاكل قبل وقوعها وتوفير المواد", "لإرضاء العميل فقط بدون فائدة", "العمل العشوائي أسرع"], correctIndex: 1, explanation: "التخطيط يمنع هدر المواد ويضمن وضوح الخطوات ويقلل من الأخطاء المكلفة." },
      { id: 3, text: "كيف تتعامل مع عطل مفاجئ أو مشكلة في إحدى الأدوات؟", options: ["الاستمرار في استخدامها بحذر أكبر", "إيقاف العمل وفصل التيار وتفعيل الصيانة", "إخفاء العطل عن المسؤول", "رميها واستخدام أداة يدوية بديلة مباشرة"], correctIndex: 1, explanation: "الإجراء الآمن هو إيقاف العمل وفصل الطاقة فوراً وتطبيق إجراءات الصيانة وإبلاغ المسؤولين." },
      { id: 4, text: "ما هو الهدف الحقيقي من استخدام معدات الوقاية الشخصية؟", options: ["لتظهر بمظهر احترافي أمام العميل", "لحمايتك من الإصابات الجسدية وتقليل المخاطر", "لأنها رخيصة الثمن", "مضطر لاستخدامها فقط لوجود تفتيش"], correctIndex: 1, explanation: "معدات الوقاية (PPE) هي خط الدفاع الأول والأهم لحمايتك الجسدية وصيانة صحتك." },
      { id: 5, text: "كيف يتأكد المهني المحترف من جودة شغله بعد الانتهاء؟", options: ["سؤال المارة أو الزملاء", "استخدام أدوات القياس والفحص المعيارية بدقة", "بالنظر والملاحظة العامة فقط", "تجاهل الأخطاء البسيطة وتسليم العمل"], correctIndex: 1, explanation: "أدوات القياس المعيارية هي الوسيلة الوحيدة والموضوعية التي تضمن دقة ومطابقة المواصفات الهندسية والفنية." },
    ];
    
    const quizFr = [
      { id: 1, text: "Quelle est la toute première étape avant de commencer un travail ?", options: ["Préparer les outils et s'assurer de la sécurité", "Commencer l'exécution immédiatement", "Attendre le client", "Nettoyer après avoir fini"], correctIndex: 0, explanation: "La sécurité et la préparation sont la priorité numéro un." },
      { id: 2, text: "Pourquoi la planification préalable est-elle primordiale ?", options: ["Pour gaspiller du temps", "Pour anticiper les problèmes et économiser du matériel", "Juste pour l'apparence", "Inutile, l'improvisation est meilleure"], correctIndex: 1, explanation: "Elle évite le gaspillage et définit des étapes claires." },
      { id: 3, text: "Comment réagir face à une panne soudaine d'un outil ?", options: ["Continuer à l'utiliser", "Débrancher immédiatement, arrêter et réparer", "Cacher le défaut", "Jeter l'outil"], correctIndex: 1, explanation: "Il faut couper l'alimentation immédiatement pour des raisons de sécurité." },
      { id: 4, text: "Quel est le véritable but des EPI (Équipements de Protection Individuelle) ?", options: ["Pour un look professionnel", "Protéger votre corps et réduire les risques d'accidents", "Parce qu'ils sont bon marché", "Seulement en cas d'inspection"], correctIndex: 1, explanation: "Les EPI sont vitaux pour votre propre sécurité corporelle." },
      { id: 5, text: "Comment un professionnel s'assure-t-il de la qualité de son travail ?", options: ["Demander autour de soi", "Utiliser des outils de mesure standard avec précision", "Juste à l'œil nu", "Ignorer les petites erreurs"], correctIndex: 1, explanation: "La mesure standardisée est la seule garantie objective de qualité." },
    ];

    const quizEn = [
      { id: 1, text: "What is the absolute first step before starting any professional work?", options: ["Prepare tools and ensure safety", "Start execution immediately", "Wait for the client", "Make sure you clean up later"], correctIndex: 0, explanation: "Safety and proper preparation are strictly your first steps before any execution." },
      { id: 2, text: "Why is proper planning considered a fundamental step?", options: ["To waste billable hours", "To proactively identify issues and save materials", "Just to satisfy bureaucracy", "Random execution is faster"], correctIndex: 1, explanation: "Planning prevents wasting resources and ensures logical, clear steps." },
      { id: 3, text: "How should you deal with a sudden tool failure or hazard?", options: ["Keep using it but be more careful", "Power off, stop work, and initiate maintenance", "Hide the failure from supervisors", "Throw it away immediately"], correctIndex: 1, explanation: "The safest procedure is immediate power cutoff and applying maintenance protocols." },
      { id: 4, text: "What is the true purpose of wearing Personal Protective Equipment (PPE)?", options: ["To maintain a professional look", "To protect your body from injuries and minimize risks", "Because they are inexpensive", "Only because of safety inspections"], correctIndex: 1, explanation: "PPE is the paramount defense mechanism for your physical safety and well-being." },
      { id: 5, text: "How does a professional ensure correct quality upon completion?", options: ["Ask bystanders for their opinion", "Diligently use standard measuring and testing tools", "Just by looking and guessing", "Ignore minor errors and deliver"], correctIndex: 1, explanation: "Standard measuring tools ensure exact specifications are met objectively." },
    ];

    const quiz = lang === 'ar' ? quizAr : lang === 'fr' ? quizFr : quizEn;

    return { id: Date.now(), level, title, content, quiz };
  },

  async generateReport(craftId: string, scores: number[], lang: Language): Promise<FinalReport> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const avgScore = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
    const percentage = Math.round((avgScore / 5) * 100);
    
    let skillLevel = "Entry";
    if (avgScore >= 4) skillLevel = lang === 'ar' ? "متخصص (Specialist)" : "Specialist";
    else if (avgScore >= 3) skillLevel = lang === 'ar' ? "ممارس (Practitioner)" : "Practitioner";
    else skillLevel = lang === 'ar' ? "مبتدئ (Entry)" : "Entry";

    const strengthsAr = ["الإلمام بالقواعد الأساسية للمهنة", "الاستيعاب الجيد لمعايير السلامة المهنية وممارسات العمل"];
    const weaknessesAr = avgScore < 4 ? ["تحتاج إلى تحسين في المهارات التحليلية وحل المشكلات التقنية", "الدقة والسرعة في التنفيذ العملي"] : ["لا يوجد نقاط ضعف واضحة ضمن هذا المستوى"];
    const nextStepsAr = ["الانتقال للتطبيق العملي المكثف في ورشة حقيقية", "متابعة تدريب متقدم لمستويات أعلى", "العمل تحت إشراف حرفي خبير لاكتساب الخبرة"];

    const strengthsEn = ["Solid knowledge of craft basics", "Good awareness of safety standards and practices"];
    const weaknessesEn = avgScore < 4 ? ["Needs improvement in technical problem solving skills", "Accuracy and speed in practical execution"] : ["No obvious weaknesses at this level"];
    const nextStepsEn = ["Progress to intensive practical application in a real workshop", "Follow advanced training for higher levels", "Work under supervision of an expert to gain experience"];

    const strengthsFr = ["Connaissance solide des bases du métier", "Bonne sensibilisation aux normes de sécurité"];
    const weaknessesFr = avgScore < 4 ? ["Besoin d'améliorer la résolution de problèmes techniques", "Précision et rapidité d'exécution"] : ["Pas de faiblesses évidentes à ce niveau"];
    const nextStepsFr = ["Passer à une application pratique en atelier", "Suivre une formation avancée", "Travailler sous la supervision d'un expert"];

    return {
      strengths: lang === 'ar' ? strengthsAr : lang === 'fr' ? strengthsFr : strengthsEn,
      weaknesses: lang === 'ar' ? weaknessesAr : lang === 'fr' ? weaknessesFr : weaknessesEn,
      skillLevel,
      readiness: percentage,
      nextSteps: lang === 'ar' ? nextStepsAr : lang === 'fr' ? nextStepsFr : nextStepsEn
    };
  }
};
