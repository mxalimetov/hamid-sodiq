import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n/context';
import type { LibraryItem } from '../types';
import './BookModal.css';

interface BookModalProps {
  book: LibraryItem;
  onClose: () => void;
}

export default function BookModal({ book, onClose }: BookModalProps) {
  const { t } = useI18n();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const commentary =
    t(`data.library.${book.id}.commentary`) || book.commentary;
  const notes = t(`data.library.${book.id}.notes`) || book.notes;

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    modalRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;
        const focusable = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-content"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={book.title}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label={t('library.close')}>
          ✕
        </button>

        <div className="modal-header">
          <span className="modal-topic">{book.topic}</span>
          <h2 className="modal-title">{book.title}</h2>
          <p className="modal-author">{book.author}</p>
          <p className="modal-year">{book.year}</p>
        </div>

        <div className="modal-body">
          <section className="modal-section">
            <h3 className="modal-section-title">
              <span className="modal-section-icon">◇</span>
              {t('library.sectionCommentary')}
            </h3>
            <p className="modal-section-text">{commentary}</p>
          </section>

          <section className="modal-section">
            <h3 className="modal-section-title">
              <span className="modal-section-icon">◈</span>
              {t('library.sectionNotes')}
            </h3>
            <p className="modal-section-text">{notes}</p>
          </section>
        </div>

        <div className="modal-footer">
          <button className="modal-close-btn" onClick={onClose}>
            {t('library.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
