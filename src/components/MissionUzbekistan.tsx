import _missionData from '../data/mission.yaml';
import { useI18n } from '../i18n/context';
import type { MissionItem } from '../types';
import './MissionUzbekistan.css';

const missionData = _missionData as unknown as MissionItem[];

export default function MissionUzbekistan() {
  const { t } = useI18n();

  return (
    <div className="mission-page">
      <header className="mission-header">
        <h1 className="mission-title">{t('mission.title')}</h1>
        <p className="mission-subtitle">{t('mission.subtitle')}</p>
      </header>

      <div className="mission-list">
        {missionData.map((item, i) => (
          <article key={i} className="mission-card">
            <div className="mission-card-number">{String(i + 1).padStart(2, '0')}</div>
            <div className="mission-card-body">
              <h2 className="mission-card-theme">{item.theme}</h2>
              <div className="mission-card-section">
                <h3 className="mission-card-label">{t('mission.missionLabel')}</h3>
                <p className="mission-card-text">{item.mission}</p>
              </div>
              <div className="mission-card-section">
                <h3 className="mission-card-label">{t('mission.messageLabel')}</h3>
                <p className="mission-card-text">{item.message}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
