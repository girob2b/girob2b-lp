import { useState } from 'react';
import { PRICING_TIERS } from '@/data/pricingTiers';
import { PricingCard } from '@/components/ui/PricingCard';
import { WaitlistModal } from '@/components/modals/WaitlistModal';
import { trackEvent } from '@/lib/analytics';

export function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  function handleCta(_tierId: string) {
    setWaitlistOpen(true);
  }

  function toggleBilling(next: 'monthly' | 'annual') {
    setBilling(next);
    trackEvent(next === 'annual' ? 'pricing_toggle_annual' : 'pricing_toggle_monthly');
  }

  return (
    <section
      id="pricing"
      className="py-16 md:py-24 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 50%, rgba(192,138,46,0.05), transparent 60%),
          #F4F1EA
        `,
      }}
    >
      {/* Decorative shape — gold diamond outline, top-right */}
      <svg
        aria-hidden="true"
        className="absolute top-8 right-8 opacity-[0.06] pointer-events-none"
        width="180"
        height="180"
        viewBox="0 0 180 180"
        fill="none"
      >
        <rect x="45" y="45" width="90" height="90" stroke="#C08A2E" strokeWidth="1" transform="rotate(45 90 90)" />
        <rect x="30" y="30" width="120" height="120" stroke="#C08A2E" strokeWidth="0.5" transform="rotate(45 90 90)" />
      </svg>

      <div className="max-w-container mx-auto px-6">
        {/* Heading block */}
        <div className="text-center mb-12">
          <p className="font-sans font-bold uppercase tracking-widest text-gold-burnt text-xs mb-3">Investimento transparente</p>
          <h2 className="font-sans font-black text-3xl md:text-4xl text-graphite mb-4">
            Planos para fornecedores
          </h2>
          <p className="text-graphite/60 text-lg">
            O comprador navega grátis. O fornecedor paga mensalidade transparente.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-14">
          <div
            className="inline-flex p-1 gap-0.5"
            style={{
              background: 'rgba(26,31,31,0.06)',
              borderRadius: '100px',
              border: '1px solid rgba(26,31,31,0.08)',
            }}
          >
            <button
              onClick={() => toggleBilling('monthly')}
              className="px-6 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 rounded-full"
              style={{
                background: billing === 'monthly' ? '#0A5C5C' : 'transparent',
                color: billing === 'monthly' ? '#F4F1EA' : 'rgba(26,31,31,0.5)',
              }}
            >
              Mensal
            </button>
            <button
              onClick={() => toggleBilling('annual')}
              className="px-6 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 rounded-full flex items-center gap-2"
              style={{
                background: billing === 'annual' ? '#0A5C5C' : 'transparent',
                color: billing === 'annual' ? '#F4F1EA' : 'rgba(26,31,31,0.5)',
              }}
            >
              Anual
              <span
                className="text-xs font-normal normal-case"
                style={{ color: billing === 'annual' ? '#D4A04A' : '#C08A2E' }}
              >
                −15%
              </span>
            </button>
          </div>
        </div>

        {/* Cards grid — 2 colunas; Pro destacado com scale-105 */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-6 py-6 max-w-3xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.id} tier={tier} billing={billing} onCtaClick={() => handleCta(tier.id)} />
          ))}
        </div>
      </div>

      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} source="landing_pricing" />
    </section>
  );
}
