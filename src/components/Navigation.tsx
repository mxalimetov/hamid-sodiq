import { useState, useEffect } from 'react';
import { useI18n } from '../i18n/context';
import './Navigation.css';

interface NavigationProps {
  onTabChange: (sectionId: string) => void;
}

const tabs: { id: string; icon: string; labelKey: string }[] = [
  { id: 'section-graph', icon: '◉', labelKey: 'nav.graph' },
  { id: 'section-library', icon: '◈', labelKey: 'nav.library' },
  { id: 'section-timeline', icon: '⊡', labelKey: 'nav.timeline' },
];

export default function Navigation({ onTabChange }: NavigationProps) {
  const { t } = useI18n();
  const [activeSection, setActiveSection] = useState('section-graph');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );

    const sectionIds = tabs.map(t => document.getElementById(t.id)).filter(Boolean);
    for (const el of sectionIds) observer.observe(el!);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="nav-header">
      <div className="nav-inner">
        <div className="nav-brand">
          <span className="nav-brand-icon">◇</span>
          <div>
            <span className="nav-brand-title">{t('nav.brand')}</span>
            <span className="nav-brand-subtitle">{t('nav.subtitle')}</span>
          </div>
        </div>
        <nav className="nav-tabs" role="tablist" aria-label="Main navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeSection === tab.id}
              aria-controls={tab.id}
              className={`nav-tab ${activeSection === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="nav-tab-icon">{tab.icon}</span>
              <span className="nav-tab-label">{t(tab.labelKey)}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
