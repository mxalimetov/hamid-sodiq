import Navigation from './components/Navigation';
import ConceptGraph from './components/ConceptGraph';
import LibraryGrid from './components/LibraryGrid';
import Timeline from './components/Timeline';
import './App.css';

export default function App() {
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Navigation onTabChange={handleNavigate} />
      <main className="main-content">
        <section id="section-graph" className="content-section">
          <ConceptGraph onNavigate={handleNavigate} />
        </section>
        <section id="section-library" className="content-section">
          <LibraryGrid />
        </section>
        <section id="section-timeline" className="content-section">
          <Timeline />
        </section>
      </main>
      <footer className="app-footer">
        <p>Hamid Sodiq &mdash; Open Source &middot; Independent &middot; Forever.</p>
      </footer>
    </div>
  );
}
