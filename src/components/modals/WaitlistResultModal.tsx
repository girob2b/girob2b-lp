import type { ReactNode } from 'react';

export type WaitlistResultVariant =
  /** Comprador novo. Entra na lista de espera e é avisado por email quando a plataforma abrir. */
  | 'buyer_created'
  /** Comprador que já estava na lista. Só confirma que o email já está com a gente. */
  | 'buyer_already_exists'
  /** Vendedor novo — fica em waitlist até aprovação. */
  | 'supplier_created'
  /** Vendedor que já está na waitlist — orienta a aguardar e oferece canal de contato. */
  | 'supplier_already_exists';

interface WaitlistResultModalProps {
  open: boolean;
  onClose: () => void;
  variant: WaitlistResultVariant;
  /** Email do user, exibido na confirmação (e no corpo do contato do vendedor). */
  email: string;
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
  supportEmail = 'comercial@girob2b.com.br',
}: WaitlistResultModalProps) {
  if (!open) return null;

  const supportMailto = `mailto:${supportEmail}?subject=${encodeURIComponent(
    'Sou vendedor — dúvidas sobre minha posição na lista de espera',
  )}&body=${encodeURIComponent(
    `Olá! Já me cadastrei na lista de espera com o email ${email} e gostaria de saber mais sobre a aprovação.`,
  )}`;

  const configs: Record<WaitlistResultVariant, VariantConfig> = {
    // Comprador: a plataforma ainda não abriu, então as 2 variantes só confirmam a lista
    // de espera e fecham o modal. Nenhum link pro app.
    buyer_created: {
      title: 'Você está na lista!',
      body: (
        <>
          A plataforma GiroB2B está sendo preparada. Assim que abrir para compradores, avisamos
          em <strong>{email}</strong> para você publicar sua primeira necessidade.
        </>
      ),
      primary: { label: 'Fechar', href: '#close', external: false },
      tone: 'teal',
    },
    buyer_already_exists: {
      title: 'Você já está na lista',
      body: (
        <>
          O e-mail <strong>{email}</strong> já está com a gente. Avisamos assim que a plataforma
          abrir.
        </>
      ),
      primary: { label: 'Fechar', href: '#close', external: false },
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
