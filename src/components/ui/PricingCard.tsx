import { type PricingTier } from '@/data/pricingTiers';
import { IconCheck } from '@/components/icons';

type Props = {
  tier: PricingTier;
  billing: 'monthly' | 'annual';
  onCtaClick: () => void;
};

export function PricingCard({ tier, billing, onCtaClick }: Props) {
  const isPro = tier.highlighted === true;
  const price = billing === 'monthly' ? tier.priceMonthly : Math.round(tier.priceAnnual / 12);
  const periodLabel = billing === 'monthly' ? '/mês' : '/mês cobrado anualmente';

  // ── Pro: card destacado ─────────────────────────────────────────────
  if (isPro) {
    return (
      <div
        className="rounded-xl p-7 flex flex-col relative md:scale-105"
        style={{
          background: '#FFFFFF',
          border: '2px solid #C08A2E',
          boxShadow: '0 20px 60px -15px rgba(192, 138, 46, 0.35)',
        }}
      >
        <div
          className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1"
          style={{
            background: 'linear-gradient(135deg, #C08A2E, #D4A04A)',
            borderRadius: '0 0 8px 8px',
          }}
        >
          <span className="font-sans font-bold uppercase tracking-wider text-xs text-graphite whitespace-nowrap">
            Mais popular
          </span>
        </div>

        <h3 className="font-sans font-bold text-xl text-teal-deep mb-2 mt-5">{tier.name}</h3>

        <div className="mb-5">
          <span className="font-sans font-black text-5xl text-graphite">R$ {price}</span>
          <span className="text-sm text-graphite/50 ml-1.5">{periodLabel}</span>
        </div>

        <ul className="space-y-2.5 mb-7 flex-1">
          {tier.features.map((f) => (
            <li key={f} className="text-sm flex items-start gap-2.5 text-graphite">
              <IconCheck
                size={16}
                strokeWidth={2}
                className="flex-shrink-0 mt-0.5"
                style={{ color: '#C08A2E' } as React.CSSProperties}
              />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onCtaClick}
          className="w-full py-3.5 rounded-lg font-sans font-bold text-sm transition-all hover:brightness-110 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #C08A2E 0%, #D4A04A 100%)',
            color: '#1A1F1F',
            boxShadow: '0 4px 20px rgba(192, 138, 46, 0.3)',
          }}
        >
          {tier.ctaLabel}
        </button>
      </div>
    );
  }

  // ── Start: card minimal ────────────────────────────────────────────
  return (
    <div
      className="rounded-xl p-7 flex flex-col shadow-sm"
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(26, 31, 31, 0.10)',
      }}
    >
      <h3 className="font-sans font-bold text-xl text-teal-deep mb-2">{tier.name}</h3>

      <div className="mb-5">
        <span className="font-sans font-black text-4xl text-graphite">R$ {price}</span>
        <span className="text-sm text-graphite/50 ml-1.5">{periodLabel}</span>
      </div>

      <ul className="space-y-2.5 mb-7 flex-1">
        {tier.features.map((f) => (
          <li key={f} className="text-sm flex items-start gap-2.5 text-graphite">
            <IconCheck
              size={16}
              strokeWidth={2}
              className="flex-shrink-0 mt-0.5"
              style={{ color: '#0A5C5C' } as React.CSSProperties}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onCtaClick}
        className="w-full py-3.5 rounded-lg font-sans font-medium text-sm transition-all hover:bg-teal-mid active:scale-95"
        style={{
          background: '#0A5C5C',
          color: '#F4F1EA',
        }}
      >
        {tier.ctaLabel}
      </button>
    </div>
  );
}
