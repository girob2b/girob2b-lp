// Wrapper pra eventos GA4 + Meta Pixel. Só dispara se user consentiu.

type EventName =
  | 'waitlist_supplier_open'
  | 'waitlist_supplier_submit'
  | 'waitlist_supplier_duplicate'
  | 'waitlist_supplier_error'
  | 'enterprise_contact_open'
  | 'enterprise_contact_submit'
  | 'pricing_toggle_annual'
  | 'pricing_toggle_monthly'
  | 'faq_expand'
  | 'scroll_75';

const CONSENT_KEY = 'girob2b_cookie_consent';

export function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'granted';
  } catch {
    return false;
  }
}

export function grantConsent(): void {
  try {
    localStorage.setItem(CONSENT_KEY, 'granted');
  } catch {
    // localStorage blocked — proceder sem persist
  }

  // Upgrade Consent Mode
  window.dataLayer = window.dataLayer || [];
  (window as any).gtag?.('consent', 'update', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
  });
}

export function trackEvent(event: EventName, params: Record<string, unknown> = {}): void {
  if (!hasConsent()) return;

  // GA4 via dataLayer (GTM resolve)
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });

  // Meta Pixel direto (fbq) — GTM pode substituir se configurado via tag
  const fbq = (window as any).fbq;
  if (typeof fbq === 'function') {
    fbq('trackCustom', event, params);
  }
}

// Scroll tracking helper — chame em um useEffect do App
export function initScrollTracking(): () => void {
  let fired75 = false;
  function onScroll() {
    const scrolled = window.scrollY + window.innerHeight;
    const total = document.body.scrollHeight;
    if (!fired75 && scrolled / total >= 0.75) {
      trackEvent('scroll_75');
      fired75 = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}
