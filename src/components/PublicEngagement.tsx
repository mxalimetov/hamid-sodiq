import { engagementData } from '../data/engagement';
import { useI18n } from '../i18n/context';
import './PublicEngagement.css';

const TYPE_CONFIG: Record<string, { labelKey: string; color: string }> = {
  podcast: { labelKey: 'engagement.podcast', color: '#3b82f6' },
  interview: { labelKey: 'engagement.interview', color: '#10b981' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function PublicEngagement() {
  const { t } = useI18n();

  return (
    <div className="engagement-page">
      <header className="engagement-header">
        <h1 className="engagement-title">{t('engagement.title')}</h1>
        <p className="engagement-subtitle">{t('engagement.subtitle')}</p>
      </header>

      <div className="engagement-list">
        {engagementData.map(item => {
          const config = TYPE_CONFIG[item.type];
          return (
            <article key={item.id} className="engagement-card">
              <div className="engagement-card-top">
                <span
                  className="engagement-card-type"
                  style={{ color: config.color, background: `${config.color}1a` }}
                >
                  {t(config.labelKey)}
                </span>
              </div>
              <div className="engagement-card-body">
                <h3 className="engagement-card-title">{item.title}</h3>
                <p className="engagement-card-source">{item.source}</p>
                <p className="engagement-card-date">{formatDate(item.date)}</p>
                <p className="engagement-card-desc">{item.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
