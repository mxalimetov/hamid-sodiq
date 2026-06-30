import { useState, useMemo } from 'react';
import _libraryData from '../data/library.yaml';
import { useI18n } from '../i18n/context';
import BookModal from './BookModal';
import type { LibraryItem } from '../types';
import './LibraryGrid.css';

const libraryData = _libraryData as unknown as LibraryItem[];

const TOPIC_COLORS: Record<string, string> = {
  'Political Economy': '#f59e0b',
  'Development Economics': '#3b82f6',
  'History': '#10b981',
  'Economics': '#8b5cf6',
  'Political Science': '#ef4444',
  'Psychology & Policy': '#ec4899',
  'Political Theory': '#14b8a6',
};

function getTopicColor(topic: string): string {
  return TOPIC_COLORS[topic] ?? '#6b7280';
}

export default function LibraryGrid() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<string>('all');
  const [selectedBook, setSelectedBook] = useState<LibraryItem | null>(null);

  const topics = useMemo(() => {
    const set = new Set(libraryData.map(b => b.topic));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return libraryData;
    return libraryData.filter(b => b.topic === filter);
  }, [filter]);

  return (
    <div className="library-page">
      <header className="library-header">
        <h1 className="library-title">{t('library.title')}</h1>
        <p className="library-subtitle">{t('library.subtitle')}</p>
      </header>

      <div className="library-filters" role="tablist" aria-label={t('library.all')}>
        <button
          role="tab"
          aria-selected={filter === 'all'}
          className={`library-filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          {t('library.all')}
        </button>
        {topics.map(topic => (
          <button
            key={topic}
            role="tab"
            aria-selected={filter === topic}
            className={`library-filter-btn ${filter === topic ? 'active' : ''}`}
            style={{
              '--topic-color': getTopicColor(topic),
            } as React.CSSProperties}
            onClick={() => setFilter(topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="library-grid" role="list" aria-label={t('library.title')}>
        {filtered.map(book => (
          <article
            key={book.id}
            className="library-card"
            role="listitem"
            onClick={() => setSelectedBook(book)}
            onKeyDown={e => { if (e.key === 'Enter') setSelectedBook(book); }}
            tabIndex={0}
            aria-label={`${book.title} by ${book.author}`}
          >
            <div className="library-card-top">
              <span
                className="library-card-topic"
                style={{
                  background: getTopicColor(book.topic) + '20',
                  color: getTopicColor(book.topic),
                }}
              >
                {book.topic}
              </span>
            </div>
            <div className="library-card-body">
              <h2 className="library-card-title">{book.title}</h2>
              <p className="library-card-author">{book.author}</p>
              <p className="library-card-year">{book.year}</p>
              <p className="library-card-commentary">
                {book.commentary}
              </p>
            </div>
            <div className="library-card-footer">
              <span className="library-card-read">{t('library.readCommentary')}</span>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="library-empty">
          <p>{t('library.empty')}</p>
        </div>
      )}

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
