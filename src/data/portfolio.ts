/**
 * Central portfolio data — generated from Rohith R's resume (ROHITH_R_RESUME.pdf).
 * Every fact on the site comes from this file. Update it here and the whole site follows.
 * Nothing here should be added unless it appears on the resume.
 */

import { assetUrl } from '../assets';

export const profile = {
  fullName: 'Rohith R',
  displayName: 'Rohith R',
  firstName: 'ROHITH R',
  role: 'AI/ML Engineer',
  tagline: ['AI / ML Engineer', 'Computer Vision', 'Full-Stack'],
  intro:
    'An AI/ML Engineer and B.Tech graduate in Artificial Intelligence & Data Science (CGPA 8.06) building and deploying real-time machine learning, computer vision, data and full-stack applications with Python, TensorFlow and PyTorch.',
  location: 'Bangalore, Karnataka',
  email: 'rohith2001r20@gmail.com',
  phone: '+91 9360795443',
  links: {
    linkedin: 'https://www.linkedin.com/in/rohithrr1',
    github: 'https://github.com/RioRohith0007',
  },
  resumePdf: assetUrl('assets/Rohith_R_Resume.pdf'),
  portrait: {
    src: assetUrl('assets/portrait-720.webp'),
    srcSet: `${assetUrl('assets/portrait-420.webp')} 420w, ${assetUrl('assets/portrait-720.webp')} 720w, ${assetUrl('assets/portrait-1100.webp')} 1100w`,
    alt: 'Portrait of Rohith R',
  },
  interests: ['Computer Vision', 'Deep Learning', 'Docker deployment'],
};

export const education = [
  {
    school: 'Bannari Amman Institute of Technology',
    place: 'Tamil Nadu',
    degree: 'Bachelor of Technology — Artificial Intelligence and Data Science',
    period: 'Sep 2022 – May 2025',
    score: 'CGPA 8.06',
  },
  {
    school: 'KMG Polytechnic College',
    place: 'Tamil Nadu',
    degree: 'Diploma in Automobile Engineering',
    period: 'Jun 2017 – Jun 2021',
    score: '87%',
  },
  {
    school: 'Oxford Matric Higher Secondary School',
    place: 'Tamil Nadu',
    degree: 'Higher Secondary Certificate (HSC)',
    period: 'Jun 2017',
    score: 'HSC',
  },
];

export const experience = [
  {
    company: 'Intersect IQ',
    role: 'AI Engineer Intern',
    place: 'Internship',
    period: 'Mar 2025 – Aug 2025',
    points: [
      'Engineered a real-time worker safety monitoring solution using YOLOv8, TensorFlow, and OpenCV, enabling automated detection of safety violations through computer vision and pose estimation.',
      'Architected automated Python data processing pipelines, improving processing efficiency by 30% while ensuring consistency across training datasets.',
      'Containerized machine learning inference services using Docker, establishing reproducible deployment workflows and improving deployment reliability.',
      'Trained, tuned, and validated deep learning models through iterative training and hyperparameter tuning, achieving 85% accuracy across varied real-world datasets.',
    ],
  },
  {
    company: 'Bannari Amman Institute of Technology',
    role: 'Linux Instructor',
    place: 'Tamil Nadu',
    period: 'Oct 2023',
    points: [
      'Delivered hands-on training in Linux fundamentals, shell scripting, automation, and system administration to undergraduate students.',
      'Developed practical laboratory exercises emphasizing scripting, operating system concepts, and analytical problem-solving.',
    ],
  },
];

export type Metric = { value: string; label: string };

export type Project = {
  id: string;
  title: string;
  year: string;
  category: string;
  logline: string;
  stack: string[];
  build: string[];
  features: string[];
  metrics: Metric[];
  /** Omit when the repository isn't public — the GitHub button is hidden instead of linking to a 404. */
  github?: string;
  /** Omit unless a verified, publicly reachable demo exists. */
  live?: string;
};


export const projects: Project[] = [
  {
    id: 'construction-erp',
    title: 'Construction Operations & Workforce ERP',
    year: '2026',
    category: 'PWA • Android • Offline-first',
    logline: 'An offline-first PWA and Android app that replaces paper muster logs for workforce attendance on civil job sites.',
    stack: ['JavaScript (ES6+)', 'Node.js', 'Capacitor', 'Android', 'HTML5 Canvas', 'Service Workers'],
    build: [
      'Engineered an offline-first PWA and Android app (packaged with Capacitor) replacing paper muster logs for workforce attendance on civil job sites.',
      'Implemented Service Workers for offline access and local storage + Node.js persistence for real-time synchronization with zero data loss during network dropouts.',
    ],
    features: [
      'Offline-first attendance with Service Workers',
      'Wage, advance and settlement reconciliation modules',
      'HTML5 Canvas image compression of up to 80%',
      'CSS print-to-PDF audit reports',
    ],
    metrics: [
      { value: '80%', label: 'image compression to cut sync payloads' },
      { value: '0', label: 'data loss during network dropouts' },
      { value: 'PWA + Android', label: 'one codebase, packaged with Capacitor' },
    ],
  },
  {
    id: 'safety-monitoring',
    title: 'AI-Driven Real-Time Safety Monitoring System',
    year: '2025',
    category: 'Computer Vision • YOLOv8 • Pose Estimation',
    logline: 'A real-time computer vision platform that watches for workplace safety violations using YOLOv8-based pose estimation.',
    stack: ['Python', 'YOLOv8', 'OpenCV', 'PyTorch', 'Ultralytics'],
    build: [
      'Designed a real-time computer vision platform for automated workplace safety monitoring using YOLOv8-based pose estimation.',
      'Established a structured LabelMe annotation workflow, improving dataset quality and achieving 85% detection accuracy.',
    ],
    features: [
      'YOLOv8 pose estimation',
      'Idle-state analysis',
      'Virtual boundary detection',
      'Structured LabelMe annotation workflow',
    ],
    metrics: [
      { value: '85%', label: 'detection accuracy' },
      { value: '3', label: 'detection layers: pose, idle state, virtual boundary' },
    ],
  },
  {
    id: 'emotion-recognition',
    title: 'Multimodal Emotion Recognition from Audio and Video',
    year: '2024–25',
    category: 'Deep Learning • Research • Published',
    logline: 'A multimodal deep learning framework that fuses facial and audio signals for real-time emotion recognition.',
    stack: ['Python', 'PyTorch', 'OpenCV', 'CNN', 'MTCNN'],
    build: [
      'Developed a multimodal deep learning framework for real-time facial emotion recognition using CNNs and MTCNN.',
      'Integrated audio sentiment analysis with visual emotion recognition via multimodal feature fusion to improve prediction performance.',
    ],
    features: [
      'CNN + MTCNN facial emotion recognition',
      'Audio sentiment analysis',
      'Multimodal feature fusion',
      'Published as first author in an international research journal',
    ],
    metrics: [
      { value: '1st', label: 'author, international research journal' },
      { value: '2', label: 'modalities fused: audio and video' },
    ],
  },
  {
    id: 'sales-dashboard',
    title: 'Sales and Forecasting Dashboard',
    year: '2025',
    category: 'Business Intelligence • Forecasting',
    logline: 'An interactive dashboard analysing revenue trends, sales performance and customer behaviour, with predictive forecasting.',
    stack: ['Power BI', 'DAX', 'SQL', 'Excel'],
    build: [
      'Developed an interactive business intelligence dashboard analyzing revenue trends, sales performance, and customer behavior.',
      'Implemented SQL and DAX-based forecasting models to support data-driven decision-making through predictive sales analytics.',
    ],
    features: ['Revenue trend analysis', 'Sales performance views', 'Customer behaviour insights', 'SQL + DAX forecasting models'],
    metrics: [
      { value: 'SQL + DAX', label: 'forecasting models' },
      { value: '4', label: 'tools: Power BI, DAX, SQL, Excel' },
    ],
  },
];

export type Achievement = {
  id: string;
  title: string;
  org: string;
  detail: string;
  laurel: string;
  link?: string;
};

export const achievements: Achievement[] = [
  {
    id: 'publication',
    title: 'First Author',
    org: 'International Research Journal · 2024',
    detail: 'Published research proposing “Deep Learning Based Multimodal Emotion Recognition from Audio and Video” for improved emotion classification.',
    laurel: 'Published',
  },
  {
    id: 'servicenow-cad',
    title: 'Certified Application Developer',
    org: 'ServiceNow · Dec 2024',
    detail: 'Designed scalable data models, business rules, and client/server scripts for custom applications.',
    laurel: 'ServiceNow CAD',
  },
  {
    id: 'servicenow-csa',
    title: 'Certified System Administrator',
    org: 'ServiceNow · Oct 2024',
    detail: 'User and role management, data imports, reporting, and workflow automation.',
    laurel: 'ServiceNow CSA',
  },
  {
    id: 'accuracy',
    title: '85% Accuracy',
    org: 'Intersect IQ · AI Engineer Intern',
    detail: 'Trained, tuned and validated deep learning models across varied real-world datasets.',
    laurel: 'Production ML',
  },
];

export type Certification = { issuer: string; name: string; link?: string };

export const certifications: Certification[] = [
  { issuer: 'ServiceNow', name: 'Certified System Administrator (CSA) · Oct 2024' },
  { issuer: 'ServiceNow', name: 'Certified Application Developer (CAD) · Dec 2024' },
  { issuer: 'Infosys Springboard', name: 'Python Programming · Oct 2022' },
];

export type Skill = { name: string; mono: string; note?: string };
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Languages',
    subtitle: 'Python is the primary language',
    skills: [
      { name: 'Python', mono: 'Py', note: 'Primary' },
      { name: 'JavaScript (ES6+)', mono: 'Js' },
      { name: 'SQL', mono: 'Sq' },
    ],
  },
  {
    id: 'ml',
    title: 'ML & Deep Learning',
    subtitle: 'Models that run in real time',
    skills: [
      { name: 'TensorFlow', mono: 'Tf' },
      { name: 'PyTorch', mono: 'Pt' },
      { name: 'Scikit-learn', mono: 'Sk' },
      { name: 'Keras', mono: 'Ke' },
      { name: 'YOLOv8', mono: 'Yo' },
      { name: 'OpenCV', mono: 'Cv' },
      { name: 'MTCNN', mono: 'Mt' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Web',
    subtitle: 'Apps that work offline too',
    skills: [
      { name: 'Node.js', mono: 'No' },
      { name: 'REST APIs', mono: 'Ap' },
      { name: 'Capacitor', mono: 'Cp' },
      { name: 'Android', mono: 'An' },
      { name: 'HTML5 Canvas', mono: 'Ca' },
      { name: 'Service Workers', mono: 'Sw' },
      { name: 'PWA', mono: 'Pw' },
    ],
  },
  {
    id: 'fundamentals',
    title: 'Core CS',
    subtitle: 'The foundations',
    skills: [
      { name: 'DSA', mono: 'Ds' },
      { name: 'OOP', mono: 'Oo' },
      { name: 'DBMS', mono: 'Db' },
      { name: 'Operating Systems', mono: 'Os' },
      { name: 'System Design', mono: 'Sd' },
    ],
  },
  {
    id: 'data',
    title: 'Data & Analytics',
    subtitle: 'Insight and forecasting',
    skills: [
      { name: 'Data Visualization', mono: 'Dv' },
      { name: 'Statistical Analysis', mono: 'St' },
      { name: 'Power BI', mono: 'Pb' },
      { name: 'DAX', mono: 'Dx' },
      { name: 'Matplotlib', mono: 'Mp' },
      { name: 'Forecasting', mono: 'Fc' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & Practices',
    subtitle: 'Shipping reliably',
    skills: [
      { name: 'Docker', mono: 'Dk' },
      { name: 'Git', mono: 'Gt' },
      { name: 'GitHub', mono: 'Gh' },
      { name: 'Linux / Shell Scripting', mono: 'Lx' },
    ],
  },
  {
    id: 'soft',
    title: 'Soft Skills',
    subtitle: 'Working with people',
    skills: [
      { name: 'Problem-Solving', mono: 'Ps' },
      { name: 'Communication', mono: 'Cm' },
      { name: 'Presentation', mono: 'Pr' },
      { name: 'Time Management', mono: 'Tm' },
      { name: 'Leadership', mono: 'Ld' },
      { name: 'Logical Thinking', mono: 'Lt' },
    ],
  },
];

/**
 * Factual cross-references shown when a skill card is hovered/tapped:
 * where the skill appears in the projects, experience or certifications on the resume.
 */
export const skillEvidence: Record<string, string[]> = {
  Python: ['Safety Monitoring System', 'Emotion Recognition', 'Intersect IQ data pipelines', 'Infosys Springboard Python'],
  'JavaScript (ES6+)': ['Construction Operations & Workforce ERP'],
  SQL: ['Sales and Forecasting Dashboard'],
  TensorFlow: ['Intersect IQ safety monitoring'],
  PyTorch: ['Safety Monitoring System', 'Emotion Recognition'],
  YOLOv8: ['Safety Monitoring System', 'Intersect IQ safety monitoring'],
  OpenCV: ['Safety Monitoring System', 'Emotion Recognition', 'Intersect IQ safety monitoring'],
  MTCNN: ['Emotion Recognition'],
  'Node.js': ['Construction Operations & Workforce ERP'],
  Capacitor: ['Construction Operations & Workforce ERP'],
  Android: ['Construction Operations & Workforce ERP'],
  'HTML5 Canvas': ['Construction Operations & Workforce ERP'],
  'Service Workers': ['Construction Operations & Workforce ERP'],
  PWA: ['Construction Operations & Workforce ERP'],
  'Power BI': ['Sales and Forecasting Dashboard'],
  DAX: ['Sales and Forecasting Dashboard'],
  Forecasting: ['Sales and Forecasting Dashboard'],
  Docker: ['Intersect IQ containerized ML inference'],
  'Linux / Shell Scripting': ['Linux Instructor, BIT'],
  'Operating Systems': ['Linux Instructor, BIT'],
};

export type Milestone = {
  code: string;
  title: string;
  description: string;
  tags: string[];
  runtime: string;
};

export type Phase = {
  number: number;
  title: string;
  period: string;
  synopsis: string;
  milestones: Milestone[];
};

export const journey: Phase[] = [
  {
    number: 1,
    title: 'Foundation',
    period: '2017 – 2021',
    synopsis: 'Early schooling and a Diploma in Automobile Engineering in Tamil Nadu.',
    milestones: [
      {
        code: '1.1',
        title: 'Higher Secondary',
        description: 'Higher Secondary Certificate (HSC) at Oxford Matric Higher Secondary School, Tamil Nadu.',
        tags: ['HSC'],
        runtime: 'Jun 2017',
      },
      {
        code: '1.2',
        title: 'Automobile Engineering Diploma',
        description: 'Diploma in Automobile Engineering at KMG Polytechnic College — finished with 87%.',
        tags: ['Diploma', '87%'],
        runtime: 'Jun 2017 – Jun 2021',
      },
    ],
  },
  {
    number: 2,
    title: 'AI & Data Science',
    period: '2022 – 2025',
    synopsis: 'B.Tech in Artificial Intelligence and Data Science at Bannari Amman Institute of Technology.',
    milestones: [
      {
        code: '2.1',
        title: 'B.Tech, AI & Data Science',
        description: 'Bachelor of Technology in Artificial Intelligence and Data Science — CGPA 8.06 / 10.',
        tags: ['B.Tech', 'AI & DS', 'CGPA 8.06'],
        runtime: 'Sep 2022 – May 2025',
      },
      {
        code: '2.2',
        title: 'Linux Instructor',
        description: 'Linux Instructor — hands-on training in Linux fundamentals, shell scripting, automation and system administration.',
        tags: ['Linux', 'Shell Scripting'],
        runtime: 'Oct 2023',
      },
      {
        code: '2.3',
        title: 'Multimodal Emotion Recognition',
        description: 'Multimodal Emotion Recognition from audio and video — published as first author in an international research journal.',
        tags: ['PyTorch', 'MTCNN', 'Published'],
        runtime: 'Oct 2024 – Mar 2025',
      },
      {
        code: '2.4',
        title: 'ServiceNow Certifications',
        description: 'ServiceNow Certified System Administrator (Oct 2024) and Certified Application Developer (Dec 2024).',
        tags: ['ServiceNow', 'CSA', 'CAD'],
        runtime: 'Oct – Dec 2024',
      },
    ],
  },
  {
    number: 3,
    title: 'Applied Engineering',
    period: '2025',
    synopsis: 'An AI Engineer internship at Intersect IQ and projects that ship.',
    milestones: [
      {
        code: '3.1',
        title: 'AI Engineer Intern',
        description: 'AI Engineer Intern — real-time worker safety monitoring with YOLOv8, TensorFlow and OpenCV.',
        tags: ['YOLOv8', 'TensorFlow', 'OpenCV'],
        runtime: 'Mar 2025 – Aug 2025',
      },
      {
        code: '3.2',
        title: 'Data Pipelines & Docker',
        description: 'Automated Python data pipelines that improved processing efficiency by 30%, and Dockerized inference services.',
        tags: ['Python', 'Docker', '30% faster'],
        runtime: 'Intersect IQ',
      },
      {
        code: '3.3',
        title: 'Sales & Forecasting Dashboard',
        description: 'Sales and Forecasting Dashboard built with Power BI, DAX, SQL and Excel.',
        tags: ['Power BI', 'DAX', 'SQL'],
        runtime: 'Aug 2025 – Sep 2025',
      },
    ],
  },
  {
    number: 4,
    title: 'Product Engineering',
    period: '2026',
    synopsis: 'An offline-first ERP for civil job sites, built as a PWA and an Android app.',
    milestones: [
      {
        code: '4.1',
        title: 'Construction ERP',
        description: 'Construction Operations & Workforce ERP — offline-first, zero data loss during network dropouts, up to 80% smaller images.',
        tags: ['Node.js', 'Capacitor', 'Service Workers'],
        runtime: 'Jul 2026 – Sep 2026',
      },
    ],
  },
  {
    number: 5,
    title: 'Present',
    period: 'Today',
    synopsis: 'AI/ML Engineer based in Bangalore, Karnataka.',
    milestones: [
      {
        code: '5.1',
        title: 'AI/ML Engineer',
        description: 'Building and deploying real-time machine learning, computer vision, data and full-stack applications.',
        tags: ['Python', 'PyTorch', 'Docker'],
        runtime: 'Bangalore',
      },
    ],
  },
];

export type Highlight = { label: string; title: string; detail: string };

export const highlights: Highlight[] = [
  { label: 'Model accuracy', title: '85%', detail: 'Across varied real-world datasets' },
  { label: 'Published', title: 'First Author', detail: 'International research journal, 2024' },
  { label: 'Pipeline speed-up', title: '30%', detail: 'Automated Python data pipelines' },
  { label: 'Payload savings', title: '80%', detail: 'Canvas image compression in the ERP' },
  { label: 'Credential', title: 'ServiceNow CAD', detail: 'Certified Application Developer' },
  { label: 'Credential', title: 'ServiceNow CSA', detail: 'Certified System Administrator' },
  { label: 'Academic', title: 'CGPA 8.06', detail: 'B.Tech, AI & Data Science' },
  { label: 'Diploma', title: '87%', detail: 'Automobile Engineering' },
  { label: 'Core vision stack', title: 'YOLOv8', detail: 'PyTorch • OpenCV • Ultralytics' },
  { label: 'Deployment', title: 'Docker', detail: 'Reproducible ML inference services' },
];

export type SectionId = 'experience' | 'journey' | 'projects' | 'highlights' | 'skills' | 'achievements' | 'resume';

/** Page order and navigation labels. */
export const sections: { id: SectionId; nav: string }[] = [
  { id: 'experience', nav: 'Experience' },
  { id: 'journey', nav: 'Journey' },
  { id: 'projects', nav: 'Projects' },
  { id: 'highlights', nav: 'Highlights' },
  { id: 'skills', nav: 'Skills' },
  { id: 'achievements', nav: 'Achievements' },
  { id: 'resume', nav: 'Resume' },
];
