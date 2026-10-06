import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { WaitlistResultModal, type WaitlistResultVariant } from './WaitlistResultModal';

const EMAIL = 'compras@empresa.com.br';

function render(variant: WaitlistResultVariant) {
  return renderToStaticMarkup(
    <WaitlistResultModal open onClose={() => {}} variant={variant} email={EMAIL} />,
  );
}

/** Texto visível, sem tags, com espaços normalizados. */
function text(html: string) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

describe('WaitlistResultModal', () => {
  describe('comprador', () => {
    it('buyer_created confirma a lista de espera e só oferece Fechar', () => {
      const html = render('buyer_created');

      expect(text(html)).toContain('Você está na lista!');
      expect(text(html)).toContain(
        `A plataforma GiroB2B está sendo preparada. Assim que abrir para compradores, avisamos em ${EMAIL} para você publicar sua primeira necessidade.`,
      );
      expect(html).toContain(`<strong>${EMAIL}</strong>`);
      expect(html).not.toMatch(/<a\b/);
      expect(html).not.toContain('href');
      expect(html).toMatch(/<button[^>]*>Fechar<\/button>/);
      expect(html.match(/<button/g)).toHaveLength(1);
      expect(html).toContain('bg-teal-deep');
    });

    it('buyer_already_exists confirma que o email já está na lista e só oferece Fechar', () => {
      const html = render('buyer_already_exists');

      expect(text(html)).toContain('Você já está na lista');
      expect(text(html)).toContain(
        `O e-mail ${EMAIL} já está com a gente. Avisamos assim que a plataforma abrir.`,
      );
      expect(html).not.toMatch(/<a\b/);
      expect(html).not.toContain('href');
      expect(html).toMatch(/<button[^>]*>Fechar<\/button>/);
      expect(html.match(/<button/g)).toHaveLength(1);
      expect(html).toContain('bg-teal-deep');
    });
  });

  describe('fornecedor (inalterado)', () => {
    it('supplier_created mantém texto e botão Fechar dourado', () => {
      const html = render('supplier_created');

      expect(text(html)).toContain('Você está na lista de espera');
      expect(text(html)).toContain(`enviar o link de acesso para ${EMAIL} em breve.`);
      expect(html).not.toMatch(/<a\b/);
      expect(html).toMatch(/<button[^>]*>Fechar<\/button>/);
      expect(html).toContain('bg-gold-burnt');
    });

    it('supplier_already_exists mantém o contato por email com o comercial', () => {
      const html = render('supplier_already_exists');

      expect(text(html)).toContain('Você já está na lista de espera');
      expect(html).toMatch(/<a[^>]*href="mailto:comercial@girob2b\.com\.br\?subject=/);
      expect(text(html)).toContain('Entrar em contato');
      expect(html).toMatch(/<button[^>]*>Fechar<\/button>/);
      expect(html).toContain('bg-gold-burnt');
    });
  });

  it('não renderiza nada fechado', () => {
    const html = renderToStaticMarkup(
      <WaitlistResultModal open={false} onClose={() => {}} variant="buyer_created" email={EMAIL} />,
    );
    expect(html).toBe('');
  });
});
