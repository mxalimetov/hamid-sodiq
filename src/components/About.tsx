import _aboutData from '../data/about.yaml';
import { useI18n } from '../i18n/context';
import './About.css';

interface AboutData {
  biography: string;
  roles: string[];
}

const aboutData = _aboutData as unknown as AboutData;

export default function About() {
  const { t } = useI18n();

  return (
    <div className="about-page">
      <header className="about-header">
        <h1 className="about-title">{t('about.title')}</h1>
        <p className="about-subtitle">{t('about.subtitle')}</p>
      </header>

      <div className="about-body">
        <p className="about-biography">{aboutData.biography}</p>

        <div className="about-roles">
          {aboutData.roles.map((role, i) => (
            <span key={i} className="about-role-tag">{role}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
