import { supabase } from './supabase';
import { trackEvent } from './analytics';

export type WaitlistRole = 'buyer' | 'supplier';

export type WaitlistSupplierPayload = {
  /** "buyer" libera acesso imediato à plataforma; "supplier" fica em waitlist
   *  até aprovação manual do admin (decisão de produto 2026-05-14). */
  role: WaitlistRole;
  email: string;
  cnpj: string;
  category: string;
  consent_marketing: boolean;
  source: 'landing_hero' | 'landing_pricing' | 'landing_final_cta' | 'landing_footer';
};

export type WaitlistEnterprisePayload = {
  name: string;
  email: string;
  company: string;
  estimated_volume?: string;
  message?: string;
};

function readUTMs() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  };
}

export type SubmitSupplierResult =
  | { ok: true; status: 'created' | 'already_exists' }
  | { ok: false; error: string };

export async function submitSupplier(payload: WaitlistSupplierPayload): Promise<SubmitSupplierResult> {
  try {
    const { error } = await supabase
      .from('waitlist')
      .insert({
        role: payload.role,
        email: payload.email.toLowerCase().trim(),
        cnpj: payload.cnpj,
        category: payload.category,
        consent_marketing: payload.consent_marketing,
        source: payload.source,
        ...readUTMs(),
        user_agent: navigator.userAgent.slice(0, 500),
      });

    if (error) {
      // 23505 = unique_violation. Tratamos como "já está na lista" — não é erro
      // de UX: queremos guiar o user pelo caminho certo (comprador acessa, vendedor
      // aguarda). Decisão de produto 2026-05-15: evitar mensagem de erro
      // vermelha; mostrar modal informativo com CTA apropriado por role.
      if (error.code === '23505') {
        trackEvent('waitlist_supplier_duplicate', { role: payload.role });
        return { ok: true, status: 'already_exists' };
      }
      trackEvent('waitlist_supplier_error', { code: error.code ?? 'unknown' });
      return { ok: false, error: 'Erro ao enviar. Tente novamente em alguns segundos.' };
    }

    trackEvent('waitlist_supplier_submit', { source: payload.source, category: payload.category });
    return { ok: true, status: 'created' };
  } catch {
    trackEvent('waitlist_supplier_error', { code: 'network' });
    return { ok: false, error: 'Erro de conexão. Verifique sua internet e tente novamente.' };
  }
}

export async function submitEnterprise(payload: WaitlistEnterprisePayload): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('waitlist').insert({
      role: 'enterprise',
      email: payload.email.toLowerCase().trim(),
      name: payload.name,
      company: payload.company,
      estimated_volume: payload.estimated_volume,
      message: payload.message,
    });

    if (error) {
      if (error.code === '23505') {
        return { ok: false, error: 'Esse email já está cadastrado. Entraremos em contato em breve.' };
      }
      trackEvent('enterprise_contact_submit', { status: 'error' });
      return { ok: false, error: 'Erro ao enviar. Tente novamente em alguns segundos.' };
    }

    trackEvent('enterprise_contact_submit', { status: 'success' });
    return { ok: true };
  } catch {
    return { ok: false, error: 'Erro de conexão. Verifique sua internet e tente novamente.' };
  }
}
