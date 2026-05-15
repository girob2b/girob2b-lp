import { useState } from 'react';
import { validateCNPJ, validateEmail, formatCNPJ } from '@/lib/validators';
import { submitSupplier, type SubmitSupplierResult, type WaitlistRole, type WaitlistSupplierPayload } from '@/lib/waitlist';
import { CategoryDropdown } from '@/components/ui/CategoryDropdown';
import { type Category } from '@/data/categories';
import { trackEvent } from '@/lib/analytics';
import { WaitlistResultModal, type WaitlistResultVariant } from './WaitlistResultModal';

type Props = {
  open: boolean;
  onClose: () => void;
  source: WaitlistSupplierPayload['source'];
};

// URL do app principal — comprador é redirecionado pra completar cadastro lá.
const APP_URL = (import.meta.env.VITE_APP_URL ?? 'https://app.girob2b.com.br').replace(/\/$/, '');

export function WaitlistModal({ open, onClose, source }: Props) {
  const [role, setRole] = useState<WaitlistRole>('buyer');
  const [email, setEmail] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [consentMarketing, setConsentMarketing] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitSupplierResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!validateEmail(email)) newErrors.email = 'Email inválido';
    if (!validateCNPJ(cnpj)) newErrors.cnpj = 'CNPJ inválido (verifique dígitos)';
    if (!category) newErrors.category = 'Selecione uma categoria';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    const res = await submitSupplier({
      role,
      email: email.trim(),
      cnpj: cnpj.replace(/\D/g, ''),
      category: category as string,
      consent_marketing: consentMarketing,
      source,
    });

    setResult(res);
    setSubmitting(false);
  }

  // ── Após sucesso (ou já existia) ────────────────────────────────────────
  // 4 cenários, 1 modal moldável: (role × status) decide texto + CTA.
  if (result?.ok) {
    const variant: WaitlistResultVariant =
      role === 'buyer'
        ? result.status === 'already_exists' ? 'buyer_already_exists' : 'buyer_created'
        : result.status === 'already_exists' ? 'supplier_already_exists' : 'supplier_created';

    return (
      <WaitlistResultModal
        open
        onClose={onClose}
        variant={variant}
        email={email.trim().toLowerCase()}
        appUrl={APP_URL}
      />
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
      className="fixed inset-0 z-50 bg-graphite/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={onSubmit} noValidate>
          <h2 id="waitlist-title" className="text-2xl font-bold text-teal-deep mb-2">
            Entrar na GiroB2B
          </h2>
          <p className="text-sm text-graphite-soft mb-6">
            Compradores entram direto. Vendedores ficam na lista de espera até aprovação do time.
          </p>

          <div className="space-y-4">
            {/* Quero entrar como */}
            <fieldset>
              <legend className="block text-sm font-medium text-graphite mb-2">
                Quero entrar como <span className="text-gold-burnt">*</span>
              </legend>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`flex flex-col items-start gap-1 rounded-lg border-2 p-3 cursor-pointer transition ${
                    role === 'buyer'
                      ? 'border-teal-deep bg-teal-deep/5'
                      : 'border-graphite-soft/30 hover:border-graphite-soft'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="buyer"
                    checked={role === 'buyer'}
                    onChange={() => setRole('buyer')}
                    className="sr-only"
                  />
                  <span className="font-bold text-graphite">Comprador</span>
                  <span className="text-xs text-graphite-soft">
                    Quero publicar minhas necessidades e receber propostas
                  </span>
                </label>
                <label
                  className={`flex flex-col items-start gap-1 rounded-lg border-2 p-3 cursor-pointer transition ${
                    role === 'supplier'
                      ? 'border-teal-deep bg-teal-deep/5'
                      : 'border-graphite-soft/30 hover:border-graphite-soft'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="supplier"
                    checked={role === 'supplier'}
                    onChange={() => setRole('supplier')}
                    className="sr-only"
                  />
                  <span className="font-bold text-graphite">Vendedor</span>
                  <span className="text-xs text-graphite-soft">
                    Quero contatar compradores e vender meus produtos
                  </span>
                </label>
              </div>
            </fieldset>

            <div>
              <label htmlFor="wl-email" className="block text-sm font-medium text-graphite mb-1">
                Email corporativo <span className="text-gold-burnt">*</span>
              </label>
              <input
                id="wl-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@empresa.com.br"
                className="w-full px-3 py-2 border border-graphite-soft rounded text-graphite placeholder:text-graphite-soft/70 focus:outline-none focus:ring-2 focus:ring-teal-deep"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="wl-cnpj" className="block text-sm font-medium text-graphite mb-1">
                CNPJ <span className="text-gold-burnt">*</span>
              </label>
              <input
                id="wl-cnpj"
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                placeholder="00.000.000/0000-00"
                inputMode="numeric"
                autoComplete="off"
                className="w-full px-3 py-2 border border-graphite-soft rounded text-graphite placeholder:text-graphite-soft/70 focus:outline-none focus:ring-2 focus:ring-teal-deep"
              />
              {errors.cnpj && <p className="text-sm text-red-600 mt-1">{errors.cnpj}</p>}
            </div>

            <div>
              <CategoryDropdown value={category} onChange={setCategory} required id="wl-category" />
              {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
            </div>

            <label className="flex items-start gap-2 text-sm text-graphite-soft">
              <input
                type="checkbox"
                checked={consentMarketing}
                onChange={(e) => setConsentMarketing(e.target.checked)}
                className="mt-1"
              />
              <span>Quero receber emails sobre o lançamento e novidades da GiroB2B. Posso cancelar a qualquer momento.</span>
            </label>

            {result?.error && <p className="text-sm text-red-600">{result.error}</p>}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-graphite-soft rounded text-graphite font-medium hover:bg-offwhite transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-gold-burnt text-graphite rounded hover:bg-gold-soft font-bold disabled:opacity-50"
                onClick={() => trackEvent('waitlist_supplier_open', { source })}
              >
                {submitting
                  ? 'Enviando...'
                  : role === 'buyer'
                    ? 'Quero comprar'
                    : 'Entrar na lista'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
