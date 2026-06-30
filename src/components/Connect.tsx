import _aboutData from '../data/about.yaml';
import { useI18n } from '../i18n/context';
import './Connect.css';

interface AboutData {
  connect: {
    telegram: string;
  };
}

const aboutData = _aboutData as unknown as AboutData;

export default function Connect() {
  const { t } = useI18n();

  return (
    <div className="connect-page">
      <header className="connect-header">
        <h1 className="connect-title">{t('connect.title')}</h1>
        <p className="connect-subtitle">{t('connect.subtitle')}</p>
      </header>

      <div className="connect-links">
        <a
          href={aboutData.connect.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="connect-card"
        >
          <span className="connect-card-icon">✈</span>
          <div className="connect-card-body">
            <span className="connect-card-label">{t('connect.telegram')}</span>
            <span className="connect-card-handle">@Hamid_Sodiq</span>
          </div>
          <span className="connect-card-arrow">↗</span>
        </a>
      </div>
    </div>
  );
}
