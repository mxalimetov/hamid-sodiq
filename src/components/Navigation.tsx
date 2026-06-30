import { useI18n } from '../i18n/context';
import type { TabId } from '../types';
import './Navigation.css';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; icon: string; labelKey: string }[] = [
  { id: 'graph', icon: '◉', labelKey: 'nav.graph' },
  { id: 'library', icon: '◈', labelKey: 'nav.library' },
  { id: 'timeline', icon: '⊡', labelKey: 'nav.timeline' },
];

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { t } = useI18n();

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
              aria-controls={`panel-${tab.id}`}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
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
