import { useState, useEffect } from 'react';
import { useI18n } from '../i18n/context';
import './Navigation.css';

interface NavigationProps {
  onNavigate: (tabId: string) => void;
  currentPage: string;
}

const tabs: { id: string; icon: string; labelKey: string }[] = [
  { id: 'library', icon: '◈', labelKey: 'nav.library' },
  { id: 'timeline', icon: '⊡', labelKey: 'nav.timeline' },
  { id: 'engagement', icon: '◎', labelKey: 'nav.engagement' },
  { id: 'about', icon: '◉', labelKey: 'nav.about' },
  { id: 'connect', icon: '✉', labelKey: 'nav.connect' },
];

const sectionTabs = new Set(['library', 'timeline', 'engagement', 'about', 'connect']);

export default function Navigation({ onNavigate, currentPage }: NavigationProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState(currentPage);

  useEffect(() => {
    setActiveTab(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (!sectionTabs.has(currentPage)) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id.replace('section-', ''));
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );

    const ids = Array.from(sectionTabs).map(id => document.getElementById(`section-${id}`)).filter(Boolean);
    for (const el of ids) observer.observe(el!);
    return () => observer.disconnect();
  }, [currentPage]);

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
              aria-selected={activeTab === tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onNavigate(tab.id)}
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
