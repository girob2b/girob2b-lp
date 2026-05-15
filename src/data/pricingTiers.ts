export type PricingTier = {
  id: 'starter' | 'pro';
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  /** Cota mensal de contatos (null = ilimitado). Reservado pra exibir
   *  como "X contatos/mês" se decidirmos comunicar essa métrica. */
  monthlyLeadQuota: number | null;
  features: string[];
  highlighted: boolean;
  ctaLabel: string;
};

// Ordem deliberada: Pro primeiro (esquerda + topo mobile) pra puxar sardinha
// pro plano mais lucrativo. Start fica em segundo plano visual.
export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 349,
    priceAnnual: 3560,
    monthlyLeadQuota: null,
    features: [
      'Tudo do Start',
      'Contatos ilimitados',
      'Filtros avançados (palavra-chave, busca textual)',
      'Selo Verificado GiroB2B',
      'Acesso prioritário a leads de compradores verificados',
      'Suporte direto via WhatsApp',
    ],
    highlighted: true,
    ctaLabel: 'Entrar na lista de espera',
  },
  {
    id: 'starter',
    name: 'Start',
    priceMonthly: 89,
    priceAnnual: 908,
    monthlyLeadQuota: 30,
    features: [
      'Acesso ao feed de necessidades',
      'Contato direto via WhatsApp',
      'Filtros por categoria e UF',
      'Suporte por email',
    ],
    highlighted: false,
    ctaLabel: 'Entrar na lista de espera',
  },
];
