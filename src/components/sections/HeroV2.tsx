import { useState } from 'react';
import { WaitlistModal } from '@/components/modals/WaitlistModal';
import HeroMarketplaceDemo from '@/components/HeroMarketplaceDemo';

function MarketplaceDemoWrapper() {
  return (
    <div className="relative w-full max-w-[640px] mx-auto select-none" aria-hidden="true">
      <div
        className="absolute inset-0 -z-10 rounded-3xl blur-3xl opacity-40"
        style={{ background: 'radial-gradient(circle at 50% 50%, #C08A2E, transparent 70%)' }}
      />
      <HeroMarketplaceDemo />
    </div>
  );
}


export function HeroV2() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section
      className="relative overflow-hidden text-offwhite"
      style={{
        background: `
          radial-gradient(circle at 15% 20%, rgba(192,138,46,0.12), transparent 35%),
          radial-gradient(circle at 85% 80%, rgba(10,92,92,0.95), transparent 60%),
          radial-gradient(circle at 50% 50%, rgba(42,122,122,0.4), transparent 50%),
          linear-gradient(180deg, #0A5C5C 0%, #103838 100%)
        `,
      }}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.04,
          mixBlendMode: 'overlay',
        }}
        aria-hidden="true"
      />

      {/* Decorative floating blobs */}
      <div
        className="absolute -top-32 -right-20 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'rgba(192,138,46,0.12)', filter: 'blur(80px)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 -left-16 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'rgba(42,122,122,0.2)', filter: 'blur(60px)' }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'rgba(192,138,46,0.07)', filter: 'blur(50px)' }}
        aria-hidden="true"
      />

      {/* Main content — extra top padding on mobile to clear the 64px fixed header */}
      <div className="relative max-w-container mx-auto px-6 pt-24 pb-14 md:py-28 lg:py-32">
        <div className="grid lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 items-center">

          {/* Left column — text */}
          <div className="space-y-5 md:space-y-6">
            {/* Eyebrow */}
            <p
              className="font-sans font-bold tracking-wide text-sm"
              style={{ color: '#D4A04A' }}
            >
              Marketplace B2B brasileiro
            </p>

            {/* Headline */}
            <h1
              className="font-sans font-black text-4xl md:text-6xl lg:text-7xl text-offwhite"
              style={{ lineHeight: '1.08' }}
            >
              Encontre fornecedores B2B qualificados sem perder tempo.
            </h1>

            {/* Subheadline — narrower for editorial breathing room (Gemini pairing feedback) */}
            <p
              className="font-sans font-normal text-lg md:text-xl leading-relaxed max-w-[30rem]"
              style={{ color: 'rgba(244, 241, 234, 0.82)', lineHeight: '1.65' }}
            >
              A GiroB2B conecta compradores e fornecedores com busca técnica real: cada produto cadastrado tem atributos estruturados (material, dimensão, certificação) e quota mensal de leads garantida por plano.
            </p>

            {/* CTA */}
            <div className="pt-2">
              <button
                onClick={() => setModalOpen(true)}
                className="font-sans font-bold text-base px-8 py-4 rounded-full transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #C08A2E 0%, #D4A04A 100%)',
                  color: '#1A1F1F',
                  boxShadow: '0 4px 24px rgba(192, 138, 46, 0.35)',
                }}
              >
                Entrar na lista de espera
              </button>

              {/* Secondary text */}
              <p
                className="font-sans text-sm mt-4"
                style={{ color: 'rgba(244, 241, 234, 0.65)' }}
              >
                Lançamento previsto para maio/2026 — quem entra na lista é avisado antes.
              </p>
            </div>
          </div>

          {/* Right column — marketplace usability demo */}
          <div className="flex items-center justify-center lg:justify-end pt-8 lg:pt-0 pb-8 lg:pb-0">
            <MarketplaceDemoWrapper />
          </div>
        </div>
      </div>

      {/* Section separator — SVG diagonal cut */}
      <div className="relative w-full overflow-hidden leading-none" style={{ height: '60px', marginTop: '-1px' }}>
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-full"
          aria-hidden="true"
        >
          <path d="M0,60 L1440,0 L1440,60 Z" fill="#F4F1EA" />
        </svg>
      </div>

      <WaitlistModal open={modalOpen} onClose={() => setModalOpen(false)} source="landing_hero" />
    </section>
  );
}
