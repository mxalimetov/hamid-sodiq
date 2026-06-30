import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ConceptGraph from './components/ConceptGraph';
import MissionUzbekistan from './components/MissionUzbekistan';
import LibraryGrid from './components/LibraryGrid';
import Timeline from './components/Timeline';
import PublicEngagement from './components/PublicEngagement';
import './App.css';

type Page = 'graph' | 'library' | 'timeline' | 'engagement';

function getPageFromHash(): Page {
  const hash = window.location.hash.slice(1).toLowerCase();
  if (hash.startsWith('/graph')) return 'graph';
  if (hash.startsWith('/timeline')) return 'timeline';
  if (hash.startsWith('/engagement')) return 'engagement';
  return 'library';
}

export default function App() {
  const [page, setPage] = useState<Page>(getPageFromHash);

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (page === 'graph' || page === 'library') return;
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
      </main>
      <footer className="app-footer">
        <p>Hamid Sodiq &mdash; Open Source &middot; Independent &middot; Forever.</p>
      </footer>
    </div>
  );
}
