import { useMemo, useState, useRef, useEffect } from 'react';
import { timelineData } from '../data/timeline';
import { useI18n } from '../i18n/context';
import type { TimelineEvent } from '../types';
import './Timeline.css';

const TYPE_CONFIG: Record<string, { key: string; color: string }> = {
  geopolitical: { key: 'timeline.types.geopolitical', color: '#ef4444' },
  analysis: { key: 'timeline.types.analysis', color: '#3b82f6' },
  prediction: { key: 'timeline.types.prediction', color: '#8b5cf6' },
  reform: { key: 'timeline.types.reform', color: '#10b981' },
  institutional: { key: 'timeline.types.institutional', color: '#f59e0b' },
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

function useIntersectionObserver(
  ref: React.RefObject<Element | null>,
  options?: IntersectionObserverInit,
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.08, ...options },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, options]);

  return isVisible;
}

function TimelineEventCard({
  event,
  expanded,
  onToggle,
  index,
}: {
  event: TimelineEvent;
  expanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  const { t } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef);

  const config = TYPE_CONFIG[event.type] ?? { key: '', color: '#6b7280' };
  const typeLabel = config.key ? t(config.key) : event.type;

  const statusLabel =
    event.status === 'ongoing'
      ? t('timeline.statuses.ongoing')
      : event.status === 'completed'
        ? t('timeline.statuses.completed')
        : event.status === 'proposed'
          ? t('timeline.statuses.proposed')
          : event.status === 'monitoring'
            ? t('timeline.statuses.monitoring')
            : null;

  const title = event.title;
  const description = event.description;
  const analysis = event.analysis;
  const prediction = event.prediction;
  const source = event.source;

  return (
    <div
      ref={cardRef}
      className={`timeline-event ${isVisible ? 'visible' : ''} ${expanded ? 'expanded' : ''}`}
      style={{ '--card-index': index } as React.CSSProperties}
      role="article"
      aria-expanded={expanded}
    >
      <div className="timeline-marker" aria-hidden="true">
        <div
          className="timeline-dot"
          style={{ background: config.color, boxShadow: `0 0 12px ${config.color}66` }}
        />
      </div>

      <div className="timeline-card">
        <div className="timeline-card-header">
          <div className="timeline-card-meta">
            <span
              className="timeline-type-badge"
              style={{
                background: config.color + '18',
                color: config.color,
                borderColor: config.color + '40',
              }}
            >
              {typeLabel}
            </span>
            <time className="timeline-date" dateTime={event.date}>
              {formatDate(event.date)}
            </time>
          </div>
          {statusLabel && (
            <span
              className="timeline-status"
              title={statusLabel}
              style={{ color: config.color }}
            >
              {event.status === 'ongoing' ? '⟳' : event.status === 'completed' ? '✓' : event.status === 'proposed' ? '○' : '◉'}
            </span>
          )}
        </div>

        <h3 className="timeline-card-title">{title}</h3>
        <p className="timeline-card-desc">{description}</p>

        {source && (
          <p className="timeline-source">
            <span className="timeline-source-label">{t('timeline.source')}:</span> {source}
          </p>
        )}

        {(analysis || prediction) && (
          <button
            className="timeline-expand-btn"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={`details-${event.id}`}
          >
            {expanded ? t('timeline.hideAnalysis') : t('timeline.showAnalysis')}
            <span className={`timeline-expand-icon ${expanded ? 'rotated' : ''}`}>
              ▾
            </span>
          </button>
        )}

        {expanded && (
          <div className="timeline-details" id={`details-${event.id}`}>
            {analysis && (
              <div className="timeline-analysis">
                <h4 className="timeline-details-title">
                  <span className="timeline-details-icon">◆</span>
                  {t('timeline.analysis')}
                </h4>
                <p>{analysis}</p>
              </div>
            )}
            {prediction && (
              <div className="timeline-prediction">
                <h4 className="timeline-details-title">
                  <span className="timeline-details-icon">◇</span>
                  {t('timeline.prediction')}
                </h4>
                <p>{prediction}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Timeline() {
  const { t } = useI18n();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};
    for (const event of timelineData) {
      const year = event.date.split('-')[0];
      if (!groups[year]) groups[year] = [];
      groups[year].push(event);
    }
    return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a));
  }, []);

  let globalIndex = 0;

  return (
    <div className="timeline-page">
      <header className="timeline-header">
        <h1 className="timeline-title">{t('timeline.title')}</h1>
        <p className="timeline-subtitle">{t('timeline.subtitle')}</p>
      </header>

      <div className="timeline-container">
        {grouped.map(([year, events]) => (
          <div key={year} className="timeline-year-group">
            <div className="timeline-year-sticky">
              <h2 className="timeline-year-label">{year}</h2>
              <div className="timeline-year-line" />
            </div>
            <div className="timeline-events">
              {events.map(event => {
                const idx = globalIndex++;
                return (
                  <TimelineEventCard
                    key={event.id}
                    event={event}
                    index={idx}
                    expanded={expandedId === event.id}
                    onToggle={() =>
                      setExpandedId(expandedId === event.id ? null : event.id)
                    }
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
