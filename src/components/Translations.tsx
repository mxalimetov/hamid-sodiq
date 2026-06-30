import _translations from '../data/translations.yaml';
import { useI18n } from '../i18n/context';
import './Translations.css';

interface TranslationBook {
  title: string;
  author: string;
}

const translations = _translations as unknown as TranslationBook[];

export default function Translations() {
  const { t } = useI18n();

  return (
    <div className="translations-page">
      <header className="translations-header">
        <h1 className="translations-title">{t('translations.title')}</h1>
        <p className="translations-subtitle">{t('translations.subtitle')}</p>
      </header>

      <div className="translations-grid">
        {translations.map((book, i) => (
          <article key={i} className="translations-card">
            <span className="translations-card-number">{String(i + 1).padStart(2, '0')}</span>
            <div className="translations-card-body">
              <h2 className="translations-card-title">{book.title}</h2>
              <p className="translations-card-author">{book.author}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
