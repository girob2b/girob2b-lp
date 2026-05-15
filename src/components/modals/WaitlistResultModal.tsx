import type { ReactNode } from 'react';

export type WaitlistResultVariant =
  /** Comprador novo — pode publicar direto. */
  | 'buyer_created'
  /** Comprador que já mandou waitlist antes — manda pro app direto, sem novo cadastro. */
  | 'buyer_already_exists'
  /** Vendedor novo — fica em waitlist até aprovação. */
  | 'supplier_created'
  /** Vendedor que já está na waitlist — orienta a aguardar e oferece canal de contato. */
  | 'supplier_already_exists';

interface WaitlistResultModalProps {
  open: boolean;
  onClose: () => void;
  variant: WaitlistResultVariant;
  /** Email do user — usado tanto pra prefill do /postar quanto pra exibir. */
  email: string;
  /** URL do app principal (vem de VITE_APP_URL no chamador). */
  appUrl: string;
  /** Email da equipe pra suporte. */
  supportEmail?: string;
}

interface VariantConfig {
  title: string;
  body: ReactNode;
  primary: {
    label: string;
    href: string;
    external?: boolean;
  };
  /** Cor do botão primário — comprador = teal (ação), vendedor = gold (espera/contato). */
  tone: 'teal' | 'gold';
}

/**
 * Modal moldável de resultado de submissão da waitlist. 4 variantes em 1 componente:
 * - Evita inflar a árvore de modais (decisão 2026-05-15).
 * - Cada variante tem seu próprio texto + CTA primário, mas estrutura visual idêntica.
 */
export function WaitlistResultModal({
  open,
  onClose,
  variant,
  email,
  appUrl,
  supportEmail = 'comercial@girob2b.com.br',
}: WaitlistResultModalProps) {
  if (!open) return null;

  const postarUrl = `${appUrl}/postar?email=${encodeURIComponent(email)}`;
  const supportMailto = `mailto:${supportEmail}?subject=${encodeURIComponent(
    'Sou vendedor — dúvidas sobre minha posição na lista de espera',
  )}&body=${encodeURIComponent(
    `Olá! Já me cadastrei na lista de espera com o email ${email} e gostaria de saber mais sobre a aprovação.`,
  )}`;

  const configs: Record<WaitlistResultVariant, VariantConfig> = {
    buyer_created: {
      title: 'Tudo certo! Vamos publicar',
      body: (
        <>
          Como comprador, você publica direto — sem precisar criar conta. Vamos te levar pro
          formulário com seu email já preenchido.
        </>
      ),
      primary: { label: 'Publicar minha necessidade →', href: postarUrl, external: true },
      tone: 'teal',
    },
    buyer_already_exists: {
      title: 'Você já pode acessar a plataforma',
      body: (
        <>
          O email <strong>{email}</strong> já está na nossa base. Como comprador, você não precisa
          de senha nem cadastro pra publicar — clica abaixo e segue direto.
        </>
      ),
      primary: { label: 'Acessar a plataforma →', href: postarUrl, external: true },
      tone: 'teal',
    },
    supplier_created: {
      title: 'Você está na lista de espera',
      body: (
        <>
          Estamos abrindo a plataforma pra vendedores aos poucos. Vamos avaliar seu cadastro e
          enviar o link de acesso para <strong>{email}</strong> em breve.
        </>
      ),
      primary: { label: 'Fechar', href: '#close', external: false },
      tone: 'gold',
    },
    supplier_already_exists: {
      title: 'Você já está na lista de espera',
      body: (
        <>
          O email <strong>{email}</strong> já está cadastrado pra avaliação. Estamos liberando
          vendedores aos poucos — assim que aprovarmos, você recebe o acesso por email. Se tiver
          dúvidas ou quiser acelerar, fala com a gente.
        </>
      ),
      primary: { label: 'Entrar em contato', href: supportMailto, external: false },
      tone: 'gold',
    },
  };

  const config = configs[variant];
  const primaryClasses =
    config.tone === 'teal'
      ? 'bg-teal-deep text-white hover:bg-teal-deep/90'
      : 'bg-gold-burnt text-graphite hover:bg-gold-soft';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-result-title"
      className="fixed inset-0 z-50 bg-graphite/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full p-6 md:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="waitlist-result-title" className="text-2xl font-bold text-teal-deep mb-3">
          {config.title}
        </h2>
        <p className="text-graphite mb-6">{config.body}</p>
        <div className="flex flex-col gap-2">
          {config.primary.href === '#close' ? (
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded font-bold ${primaryClasses}`}
            >
              {config.primary.label}
            </button>
          ) : (
            <a
              href={config.primary.href}
              {...(config.primary.external ? {} : { rel: 'noopener' })}
              className={`px-6 py-3 rounded font-bold ${primaryClasses}`}
            >
              {config.primary.label}
            </a>
          )}
          {config.primary.href !== '#close' && (
            <button
              onClick={onClose}
              className="px-6 py-2 text-graphite-soft hover:text-graphite text-sm"
            >
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
