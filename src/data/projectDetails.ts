/**
 * Case-study content for the project detail view.
 * Every statement is derived from the resume entries in portfolio.ts (stack, features, metrics).
 * Preview images are original illustrative interface mockups, not screenshots of deployed apps.
 */

import { assetUrl } from '../assets';

export type FlowNode = { id: string; label: string; x: number; y: number; detail: string };
export type FlowEdge = [from: string, to: string];
export type Step = { title: string; text: string };
export type Note = { title: string; body: string };

export type ProjectDetail = {
  preview: { src: string; alt: string };
  overview: string;
  problem: string;
  workflow: Step[];
  architecture: { nodes: FlowNode[]; edges: FlowEdge[] };
  implementation: Note[];
  challenges: Note[];
};

/** Diagram canvas size shared by every architecture diagram. */
export const FLOW_W = 960;
export const FLOW_H = 340;
export const NODE_W = 160;
export const NODE_H = 52;

export const projectDetails: Record<string, ProjectDetail> = {
  'construction-erp': {
    preview: {
      src: assetUrl('assets/projects/construction-erp.svg'),
      alt: 'Illustrative mockup of an offline workforce management dashboard with attendance, wages, sync status and records',
    },
    overview:
      'An offline-first PWA and Android app that replaces paper muster logs for workforce attendance on civil job sites. It also covers wage, advance and settlement reconciliation and produces print-ready audit reports.',
    problem:
      'Paper muster logs are slow to reconcile into wages and audit records, and job-site connectivity is unreliable. Attendance capture therefore cannot depend on a live connection, and nothing recorded on site may be lost when the network drops.',
    workflow: [
      { title: 'Attendance', text: 'Supervisors record workforce attendance in the PWA or the Capacitor-packaged Android app.' },
      { title: 'Local storage', text: 'Records are written to local storage on the device and the app keeps working offline through Service Workers.' },
      { title: 'Synchronization', text: 'When the network returns, queued records are synchronized, with images compressed on a Canvas to shrink the payload.' },
      { title: 'Backend', text: 'Node.js persistence stores the records, which feed wage reconciliation and CSS print-to-PDF audit reports.' },
    ],
    architecture: {
      nodes: [
        { id: 'app', label: 'PWA + Android app', x: 100, y: 170, detail: 'One JavaScript codebase, packaged for Android with Capacitor, replacing paper muster logs.' },
        { id: 'canvas', label: 'Canvas compression', x: 330, y: 70, detail: 'HTML5 Canvas image compression of up to 80% shrinks storage and sync payloads.' },
        { id: 'sw', label: 'Service Workers', x: 330, y: 270, detail: 'Service Workers keep the app usable offline on job sites.' },
        { id: 'store', label: 'Local storage', x: 570, y: 270, detail: 'Attendance is stored locally until the network returns.' },
        { id: 'node', label: 'Node.js persistence', x: 570, y: 150, detail: 'Node.js persistence gives real-time synchronization with zero data loss during network dropouts.' },
        { id: 'recon', label: 'Wage reconciliation', x: 840, y: 80, detail: 'Wage, advance and settlement reconciliation modules manage workforce payments.' },
        { id: 'pdf', label: 'Audit PDF reports', x: 840, y: 230, detail: 'CSS print-to-PDF audit reports for site and payment records.' },
      ],
      edges: [['app', 'canvas'], ['app', 'sw'], ['sw', 'store'], ['canvas', 'node'], ['store', 'node'], ['node', 'recon'], ['node', 'pdf']],
    },
    implementation: [
      { title: 'Offline access', body: 'Service Workers provide offline access so attendance entry never waits on connectivity.' },
      { title: 'Persistence and sync', body: 'Local storage plus Node.js persistence give real-time synchronization with zero data loss during network dropouts.' },
      { title: 'Image compression', body: 'HTML5 Canvas compresses images by up to 80% to cut sync payloads.' },
      { title: 'Reconciliation and reporting', body: 'Wage, advance and settlement reconciliation modules, and CSS print-to-PDF audit reports.' },
    ],
    challenges: [
      { title: 'Working without a network', body: 'Attendance has to be captured and kept safe on the device first, then reconciled once connectivity returns.' },
      { title: 'Keeping sync payloads small', body: 'Canvas-based compression reduces the image data that has to travel over weak job-site connections.' },
      { title: 'One codebase, two targets', body: 'The same JavaScript app ships as a PWA and as an Android app through Capacitor.' },
    ],
  },

  'safety-monitoring': {
    preview: {
      src: assetUrl('assets/projects/safety-monitoring.svg'),
      alt: 'Illustrative mockup of a computer vision monitoring interface with person detection, pose keypoints, a virtual boundary and safety events',
    },
    overview:
      'A real-time computer vision platform that watches for workplace safety violations using YOLOv8-based pose estimation, with idle-state analysis and virtual boundary detection layered on top.',
    problem:
      'Safety violations on a work site are easy to miss when people have to watch every camera. The system needs to detect people, understand their posture and position, and flag violations automatically and in real time.',
    workflow: [
      { title: 'Camera', text: 'Live video from the work area is the input to the pipeline.' },
      { title: 'YOLOv8', text: 'YOLOv8 detects each person in the frame.' },
      { title: 'Pose estimation', text: 'Pose estimation recovers body keypoints for every detected person.' },
      { title: 'Safety analysis', text: 'Idle-state analysis and virtual boundary detection turn poses and positions into safety violation flags.' },
    ],
    architecture: {
      nodes: [
        { id: 'video', label: 'Live video', x: 100, y: 190, detail: 'Real-time worker safety monitoring runs on live video from the work area.' },
        { id: 'label', label: 'LabelMe annotation', x: 330, y: 60, detail: 'A structured LabelMe annotation workflow improved dataset quality and led to 85% detection accuracy.' },
        { id: 'pose', label: 'YOLOv8 pose', x: 330, y: 190, detail: 'YOLOv8-based pose estimation, built with PyTorch, OpenCV and Ultralytics.' },
        { id: 'idle', label: 'Idle-state analysis', x: 570, y: 90, detail: 'Idle-state analysis adds context about what each worker is doing.' },
        { id: 'bound', label: 'Virtual boundaries', x: 570, y: 290, detail: 'Virtual boundary detection flags workers entering restricted areas.' },
        { id: 'viol', label: 'Violation detection', x: 800, y: 190, detail: 'Automated detection of safety violations, aimed at reducing safety incidents.' },
        { id: 'dock', label: 'Docker inference', x: 840, y: 300, detail: 'Inference services were containerized with Docker for reproducible deployment during the Intersect IQ internship.' },
      ],
      edges: [['video', 'pose'], ['label', 'pose'], ['pose', 'idle'], ['pose', 'bound'], ['idle', 'viol'], ['bound', 'viol'], ['viol', 'dock']],
    },
    implementation: [
      { title: 'Pose estimation', body: 'YOLOv8-based pose estimation built with Python, PyTorch, OpenCV and Ultralytics.' },
      { title: 'Detection layers', body: 'Three layers work together: pose, idle state and virtual boundary.' },
      { title: 'Annotation workflow', body: 'A structured LabelMe annotation workflow improved dataset quality and supported 85% detection accuracy.' },
    ],
    challenges: [
      { title: 'Real-time constraint', body: 'Detection, pose and rule checks have to keep pace with live video rather than run offline.' },
      { title: 'Dataset quality', body: 'Consistent annotation was needed before accuracy could improve, which the LabelMe workflow provided.' },
      { title: 'Reproducible deployment', body: 'Inference services were containerized with Docker so the same build runs everywhere.' },
    ],
  },

  'emotion-recognition': {
    preview: {
      src: assetUrl('assets/projects/emotion-recognition.svg'),
      alt: 'Illustrative mockup of an audio and video processing architecture with face detection, audio features and multimodal fusion',
    },
    overview:
      'A multimodal deep learning framework for real-time emotion recognition. A visual branch (MTCNN and CNN) and an audio sentiment branch are combined by feature fusion to improve prediction performance. Published as first author in an international research journal.',
    problem:
      'A single signal gives an incomplete picture of emotion: a face can be neutral while the voice is not, and the reverse. Combining both modalities aims at better classification than either alone.',
    workflow: [
      { title: 'Audio → features', text: 'The audio stream is processed for sentiment features.' },
      { title: 'Video → facial features', text: 'MTCNN detects faces and a CNN extracts facial emotion features from the video stream.' },
      { title: 'Multimodal fusion', text: 'Audio and visual features are fused into one representation.' },
      { title: 'Prediction', text: 'The fused features drive the final emotion classification.' },
    ],
    architecture: {
      nodes: [
        { id: 'vid', label: 'Video', x: 95, y: 80, detail: 'The visual stream carries facial expressions.' },
        { id: 'mtcnn', label: 'MTCNN faces', x: 290, y: 80, detail: 'MTCNN detects faces for real-time facial emotion recognition.' },
        { id: 'cnn', label: 'CNN features', x: 485, y: 80, detail: 'CNNs extract visual emotion features.' },
        { id: 'aud', label: 'Audio', x: 95, y: 260, detail: 'The audio stream carries tone and sentiment.' },
        { id: 'sent', label: 'Audio sentiment', x: 290, y: 260, detail: 'Audio sentiment analysis, integrated with the visual branch.' },
        { id: 'fuse', label: 'Feature fusion', x: 690, y: 170, detail: 'Multimodal feature fusion combines both branches to improve prediction performance.' },
        { id: 'cls', label: 'Emotion class', x: 875, y: 170, detail: 'Improved emotion classification, published as first author in an international research journal.' },
      ],
      edges: [['vid', 'mtcnn'], ['mtcnn', 'cnn'], ['cnn', 'fuse'], ['aud', 'sent'], ['sent', 'fuse'], ['fuse', 'cls']],
    },
    implementation: [
      { title: 'Facial branch', body: 'Real-time facial emotion recognition with CNNs and MTCNN, in Python with PyTorch and OpenCV.' },
      { title: 'Audio branch', body: 'Audio sentiment analysis integrated with the visual emotion recognition.' },
      { title: 'Fusion', body: 'Multimodal feature fusion combines the two branches to improve prediction performance.' },
    ],
    challenges: [
      { title: 'Two modalities, one prediction', body: 'Audio and video features come from different pipelines and have to be merged into a single classifier input.' },
      { title: 'Real-time face handling', body: 'Faces must be detected reliably before emotion features can be extracted.' },
      { title: 'Research-grade write-up', body: 'The approach was written up and published as first author in an international research journal.' },
    ],
  },

  'sales-dashboard': {
    preview: {
      src: assetUrl('assets/projects/sales-dashboard.svg'),
      alt: 'Illustrative mockup of a business intelligence dashboard with revenue charts, regional sales and a forecast line',
    },
    overview:
      'An interactive business intelligence dashboard analysing revenue trends, sales performance and customer behaviour, with SQL and DAX forecasting models for predictive sales analytics.',
    problem:
      'Sales data spread across tables is hard to read as a trend. Decision-makers need revenue, performance and customer behaviour in one place, plus a forward-looking view to plan against.',
    workflow: [
      { title: 'Dataset', text: 'Sales, revenue and customer data are the source for the analysis.' },
      { title: 'SQL', text: 'SQL shapes and aggregates the data for analysis.' },
      { title: 'DAX', text: 'DAX measures define the metrics used across the dashboard.' },
      { title: 'Forecasting', text: 'SQL and DAX based forecasting models project future sales.' },
      { title: 'Visualization', text: 'Power BI presents revenue trends, sales performance and customer behaviour interactively.' },
    ],
    architecture: {
      nodes: [
        { id: 'data', label: 'Sales dataset', x: 95, y: 120, detail: 'Revenue, sales performance and customer behaviour data analysed in the dashboard.' },
        { id: 'sql', label: 'SQL', x: 285, y: 220, detail: 'SQL queries prepare the data and support the forecasting models.' },
        { id: 'dax', label: 'DAX measures', x: 475, y: 120, detail: 'DAX measures and forecasting logic inside Power BI.' },
        { id: 'fc', label: 'Forecasting', x: 665, y: 220, detail: 'SQL and DAX based forecasting models support data-driven decision-making through predictive sales analytics.' },
        { id: 'viz', label: 'Power BI dashboard', x: 865, y: 120, detail: 'Interactive visuals for revenue trends, sales performance and customer behaviour.' },
      ],
      edges: [['data', 'sql'], ['sql', 'dax'], ['dax', 'fc'], ['fc', 'viz']],
    },
    implementation: [
      { title: 'Dashboard', body: 'Interactive Power BI dashboard covering revenue trends, sales performance and customer behaviour.' },
      { title: 'Forecasting', body: 'SQL and DAX-based forecasting models for predictive sales analytics.' },
      { title: 'Toolchain', body: 'Power BI, DAX, SQL and Excel.' },
    ],
    challenges: [
      { title: 'From history to forecast', body: 'Turning past revenue into a forward view required forecasting models on top of the reporting layer.' },
      { title: 'One view for several questions', body: 'Revenue, sales performance and customer behaviour are presented together so they can be read side by side.' },
    ],
  },
};
