import _engagementData from '../data/engagement.yaml';
import { useI18n } from '../i18n/context';
import type { EngagementItem } from '../types';
import './PublicEngagement.css';

const engagementData = _engagementData as unknown as EngagementItem[];

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

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function CardWrapper({ url, children }: { url?: string; children: React.ReactNode }) {
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="engagement-card-link">
        {children}
      </a>
    );
  }
  return <>{children}</>;
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
          const videoId = item.url ? getYouTubeId(item.url) : null;
          return (
            <CardWrapper key={item.id} url={item.url}>
              <article className={`engagement-card${item.url ? ' engagement-card--linked' : ''}`}>
                {videoId && (
                  <div className="engagement-card-thumb">
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                      alt=""
                      className="engagement-card-thumb-img"
                      loading="lazy"
                    />
                    <div className="engagement-card-play">
                      <svg viewBox="0 0 24 24" width="48" height="48" fill="white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
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
            </CardWrapper>
          );
        })}
      </div>
    </div>
  );
}
