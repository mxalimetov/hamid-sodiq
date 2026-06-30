import { useState, useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import ConceptGraph from './components/ConceptGraph';
import MissionUzbekistan from './components/MissionUzbekistan';
import LibraryGrid from './components/LibraryGrid';
import Timeline from './components/Timeline';
import PublicEngagement from './components/PublicEngagement';
import Translations from './components/Translations';
import About from './components/About';
import Connect from './components/Connect';
import './App.css';

type Page = 'graph' | 'mission' | 'library' | 'timeline' | 'engagement' | 'translations' | 'about' | 'connect';

function getPageFromHash(): Page {
  const hash = window.location.hash.slice(1).toLowerCase();
  if (hash.startsWith('/graph')) return 'graph';
  if (hash.startsWith('/mission')) return 'mission';
  if (hash.startsWith('/timeline')) return 'timeline';
  if (hash.startsWith('/engagement')) return 'engagement';
  if (hash.startsWith('/translations')) return 'translations';
  if (hash.startsWith('/about')) return 'about';
  if (hash.startsWith('/connect')) return 'connect';
  return 'library';
}

export default function App() {
  const [page, setPage] = useState<Page>(getPageFromHash);

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const initialLoad = useRef(true);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    if (page === 'graph') return;
    const id = `section-${page}`;
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [page]);

  const handleNavigate = (tabId: string) => {
    window.location.hash = `/${tabId}`;
  };

  if (page === 'graph') {
    return (
      <div className="app page-graph">
        <Navigation onNavigate={handleNavigate} currentPage={page} />
        <ConceptGraph onNavigate={handleNavigate} />
      </div>
    );
  }

  return (
    <div className="app">
      <Navigation onNavigate={handleNavigate} currentPage={page} />
      <main className="main-content">
        <section id="section-mission" className="content-section">
          <MissionUzbekistan />
        </section>
        <section id="section-library" className="content-section">
          <LibraryGrid />
        </section>
        <section id="section-timeline" className="content-section">
          <Timeline />
        </section>
        <section id="section-engagement" className="content-section">
          <PublicEngagement />
        </section>
        <section id="section-translations" className="content-section">
          <Translations />
        </section>
        <section id="section-about" className="content-section">
          <About />
        </section>
        <section id="section-connect" className="content-section">
          <Connect />
        </section>
      </main>
      <footer className="app-footer">
        <p>Hamid Sodiq &mdash; Open Source &middot; Independent &middot; Forever.</p>
      </footer>
    </div>
  );
}
