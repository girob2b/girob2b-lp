import { useState } from 'react';
import { validateCNPJ, validateEmail, formatCNPJ } from '@/lib/validators';
import { submitSupplier, type WaitlistSupplierPayload } from '@/lib/waitlist';
import { CategoryDropdown } from '@/components/ui/CategoryDropdown';
import { type Category } from '@/data/categories';
import { trackEvent } from '@/lib/analytics';

type Props = {
  open: boolean;
  onClose: () => void;
  source: WaitlistSupplierPayload['source'];
};

export function WaitlistModal({ open, onClose, source }: Props) {
  const [email, setEmail] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [consentMarketing, setConsentMarketing] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);
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
      email: email.trim(),
      cnpj: cnpj.replace(/\D/g, ''),
      category: category as string,
      consent_marketing: consentMarketing,
      source,
    });

    setResult(res);
    setSubmitting(false);
  }

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
        {result?.ok ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-teal-deep mb-3">Você está na lista</h2>
            <p className="text-graphite mb-6">
              Enviaremos um email de confirmação para <strong>{email}</strong>. Avisaremos você por email assim que a plataforma abrir.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gold-burnt text-graphite rounded hover:bg-gold-soft font-bold"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <h2 id="waitlist-title" className="text-2xl font-bold text-teal-deep mb-2">
              Entrar na lista de espera
            </h2>
            <p className="text-sm text-graphite-soft mb-6">
              Seremos os primeiros a avisar você quando a GiroB2B abrir pros primeiros fornecedores.
            </p>

            <div className="space-y-4">
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
                  {submitting ? 'Enviando...' : 'Entrar na lista'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
