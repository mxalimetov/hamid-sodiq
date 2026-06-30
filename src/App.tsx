import { useState, useCallback } from 'react';
import Navigation from './components/Navigation';
import ConceptGraph from './components/ConceptGraph';
import LibraryGrid from './components/LibraryGrid';
import Timeline from './components/Timeline';
import type { TabId } from './types';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('graph');

  const handleNavigate = useCallback((tab: TabId) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="app">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {activeTab === 'graph' && <ConceptGraph onNavigate={handleNavigate} />}
        {activeTab === 'library' && <LibraryGrid />}
        {activeTab === 'timeline' && <Timeline />}
      </main>
      <footer className="app-footer">
        <p>Hamid Sodiq Archive &mdash; Open Source &middot; Independent &middot; Forever.</p>
      </footer>
    </div>
  );
}
