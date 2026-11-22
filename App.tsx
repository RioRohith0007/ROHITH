import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Project } from './data/portfolio';
import { SmoothScrollProvider, useScrollLock } from './hooks/smoothScroll';
import Achievements from './components/Achievements';
import Experience from './components/Experience';
import FinalCTA from './components/FinalCTA';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Journey from './components/Journey';
import Intro from './components/Intro';
import TechMarquee from './components/TechMarquee';
import { CursorGlow, ScrollProgress } from './components/fx';
import Navbar from './components/Navbar';
import Projects from './components/Projects';
import ResumeSection from './components/ResumeViewer';
import Scene from './components/Scene';
import Skills from './components/Skills';

// Heavier pieces are split into their own chunks and loaded on demand.
const SpiderWeb = lazy(() => import('./components/SpiderWeb'));
const ProjectModal = lazy(() => import('./components/ProjectModal'));
const ResumeModal = lazy(() => import('./components/ResumeModal'));

function Page() {
  const [ready, setReady] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  useScrollLock(!ready);

  const closeProject = useCallback(() => setProject(null), []);
  const closeResume = useCallback(() => setResumeOpen(false), []);

  useEffect(() => {
    if (ready) document.documentElement.classList.add('is-ready');
  }, [ready]);

  return (
    <>
      <Suspense fallback={null}>
        <SpiderWeb />
      </Suspense>
      <div className="ambient" aria-hidden />
      <div className="streaks" aria-hidden>
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <CursorGlow />
      <AnimatePresence>{!ready && <Intro key="intro" onDone={() => setReady(true)} />}</AnimatePresence>

      {ready && (
      <div className="page">
        <ScrollProgress />
        <Navbar />
        <main>
          <Hero onResume={() => setResumeOpen(true)} />
          <TechMarquee />
          <Scene id="experience">
            <Experience />
          </Scene>
          <Scene id="journey">
            <Journey />
          </Scene>
          <Scene id="projects">
            <Projects onOpen={setProject} />
          </Scene>
          <Scene id="highlights">
            <Highlights />
          </Scene>
          <Scene id="skills">
            <Skills />
          </Scene>
          <Scene id="achievements">
            <Achievements />
          </Scene>
          <Scene id="resume">
            <ResumeSection onView={() => setResumeOpen(true)} />
          </Scene>
        </main>
        <FinalCTA />
      </div>
      )}

      <Suspense fallback={null}>
        <AnimatePresence>{project && <ProjectModal key="project" project={project} onClose={closeProject} onNavigate={setProject} />}</AnimatePresence>
        <AnimatePresence>{resumeOpen && <ResumeModal key="resume" onClose={closeResume} />}</AnimatePresence>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <Page />
    </SmoothScrollProvider>
  );
}
