import { useEffect, useMemo, useState } from 'react';
import styles from '../styles/HeroMarketplaceDemo.module.css';

type Step =
  | 'idle'
  | 'moveToSearch'
  | 'searchClick'
  | 'typing'
  | 'results'
  | 'moveToCard'
  | 'cardClick'
  | 'detail'
  | 'moveToContact'
  | 'contactClick'
  | 'success';

// Cursor positions (% relative to viewport).
const CURSOR_POS: Record<Step, { x: number; y: number }> = {
  idle: { x: 90, y: 92 },
  moveToSearch: { x: 28, y: 22 },
  searchClick: { x: 28, y: 22 },
  typing: { x: 50, y: 22 },
  results: { x: 50, y: 22 },
  moveToCard: { x: 22, y: 55 },
  cardClick: { x: 22, y: 55 },
  detail: { x: 22, y: 55 },
  moveToContact: { x: 30, y: 88 },
  contactClick: { x: 30, y: 88 },
  success: { x: 30, y: 88 },
};

const STEP_DURATIONS: Record<Step, number> = {
  idle: 800,
  moveToSearch: 900,
  searchClick: 350,
  typing: 1500,
  results: 1200,
  moveToCard: 850,
  cardClick: 400,
  detail: 1300,
  moveToContact: 900,
  contactClick: 400,
  success: 1800,
};

const STEP_ORDER: Step[] = [
  'idle',
  'moveToSearch',
  'searchClick',
  'typing',
  'results',
  'moveToCard',
  'cardClick',
  'detail',
  'moveToContact',
  'contactClick',
  'success',
];

export default function HeroMarketplaceDemo() {
  const [step, setStep] = useState<Step>('idle');
  const [typedChars, setTypedChars] = useState(0);
  const [runKey, setRunKey] = useState(0);

  // Orchestrator
  useEffect(() => {
    let cancelled = false;
    const ids: number[] = [];

    let acc = 0;
    STEP_ORDER.forEach((s) => {
      const id = window.setTimeout(() => {
        if (cancelled) return;
        setStep(s);
      }, acc);
      ids.push(id);
      acc += STEP_DURATIONS[s];
    });
    const loopId = window.setTimeout(() => {
      if (cancelled) return;
      setStep('idle');
      setTypedChars(0);
      setRunKey((k) => k + 1);
    }, acc + 600);
    ids.push(loopId);

    return () => {
      cancelled = true;
      ids.forEach(window.clearTimeout);
    };
  }, [runKey]);

  // Typewriter — 8 "chars" worth of skeleton growth
  useEffect(() => {
    if (step !== 'typing') return;
    setTypedChars(0);
    let i = 0;
    const interval = window.setInterval(() => {
      i += 1;
      setTypedChars(i);
      if (i >= 8) window.clearInterval(interval);
    }, 130);
    return () => window.clearInterval(interval);
  }, [step]);

  const cursorPos = useMemo(() => CURSOR_POS[step], [step]);

  const showResults =
    step === 'results' ||
    step === 'moveToCard' ||
    step === 'cardClick';

  const showDetail =
    step === 'detail' ||
    step === 'moveToContact' ||
    step === 'contactClick' ||
    step === 'success';

  const showSuccess = step === 'success';
  const searchActive = step === 'searchClick' || step === 'typing';
  const cardActive = step === 'cardClick';
  const contactActive = step === 'contactClick' || step === 'success';
  const isClicking =
    step === 'searchClick' || step === 'cardClick' || step === 'contactClick';

  return (
    <div className={styles.frameOuter}>
      {/* Browser-like top bar */}
      <div className={styles.topbar}>
        <div className={styles.dots}>
          <span className={styles.dotRed} />
          <span className={styles.dotYellow} />
          <span className={styles.dotGreen} />
        </div>
        <div className={styles.urlbar}>
          <span className={styles.urlbarDot} />
          <span className={styles.urlbarLine} />
        </div>
        <div style={{ width: 32 }} />
      </div>

      <div className={styles.viewport}>
        {/* SEARCH VIEW */}
        <div className={`${styles.view} ${showDetail ? styles.viewHidden : ''}`}>
          {/* Header skeleton */}
          <div className={styles.headerSkel}>
            <div className={`${styles.skelLine} ${styles.skelTitle}`} />
            <div className={`${styles.skelLine} ${styles.skelSubtitle}`} />
          </div>

          {/* Search bar */}
          <div className={`${styles.searchBar} ${searchActive ? styles.searchBarActive : ''}`}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <div className={styles.searchInputArea}>
              <div
                className={styles.typedBar}
                style={{ width: `${Math.min(typedChars * 11, 88)}%` }}
              />
              {searchActive && step === 'typing' && <span className={styles.caret} />}
            </div>
            <div className={styles.searchSelectSkel} />
            <div className={styles.searchBtn} />
          </div>

          {/* Result count skel */}
          <div className={`${styles.skelLine} ${styles.skelCount} ${showResults ? styles.skelCountVisible : ''}`} />

          {/* Cards grid */}
          <div className={styles.cardsGrid}>
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className={`${styles.card} ${showResults ? styles.cardVisible : ''} ${
                  idx === 0 && cardActive ? styles.cardActive : ''
                }`}
                style={{ transitionDelay: showResults ? `${idx * 90}ms` : '0ms' }}
              >
                <div className={styles.cardCategory} />
                <div className={`${styles.skelLine} ${styles.cardLine1}`} />
                <div className={`${styles.skelLine} ${styles.cardLine2}`} />
                <div className={styles.cardMeta}>
                  <div className={styles.metaCell}>
                    <div className={`${styles.skelLine} ${styles.metaLabelSkel}`} />
                    <div className={`${styles.skelLine} ${styles.metaValueSkel}`} />
                  </div>
                  <div className={styles.metaCell}>
                    <div className={`${styles.skelLine} ${styles.metaLabelSkel}`} />
                    <div className={`${styles.skelLine} ${styles.metaValueSkel}`} />
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <div className={`${styles.skelLine} ${styles.footerLeft}`} />
                  <div className={`${styles.skelLine} ${styles.footerRight}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DETAIL VIEW */}
        <div className={`${styles.view} ${styles.detailView} ${showDetail ? styles.viewActive : ''}`}>
          <div className={styles.backLink}>
            <div className={`${styles.skelLine} ${styles.backLineDark}`} />
          </div>
          <div className={styles.cardCategory} />
          <div className={`${styles.skelLine} ${styles.detailTitleLine1}`} />
          <div className={`${styles.skelLine} ${styles.detailTitleLine2}`} />
          <div className={styles.detailDescBlock}>
            <div className={`${styles.skelLine} ${styles.detailDescLine}`} />
            <div className={`${styles.skelLine} ${styles.detailDescLine}`} />
            <div className={`${styles.skelLine} ${styles.detailDescLineShort}`} />
          </div>
          <div className={styles.detailGrid}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={styles.detailMeta}>
                <div className={`${styles.skelLine} ${styles.metaLabelSkel}`} />
                <div className={`${styles.skelLine} ${styles.metaValueSkel}`} />
              </div>
            ))}
          </div>
          <button
            type="button"
            className={`${styles.contactBtn} ${contactActive ? styles.contactBtnActive : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={styles.waIcon}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className={styles.contactBtnLabel} />
          </button>

          <div className={`${styles.successToast} ${showSuccess ? styles.successToastVisible : ''}`}>
            <span className={styles.successCheck}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <div className={styles.successLines}>
              <div className={`${styles.skelLine} ${styles.successLine1}`} />
              <div className={`${styles.skelLine} ${styles.successLine2}`} />
            </div>
          </div>
        </div>

        {/* Click ripple */}
        <span
          className={`${styles.ripple} ${isClicking ? styles.rippleActive : ''}`}
          style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
          key={`ripple-${step}`}
        />

        {/* Animated cursor */}
        <div
          className={`${styles.cursor} ${isClicking ? styles.cursorClick : ''}`}
          style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M5.5 3.5l13 6.5-5.5 1.7-2 5.3-5.5-13.5z"
              fill="#0f172a"
              stroke="white"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
