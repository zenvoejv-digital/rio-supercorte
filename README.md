# Rio Supercorte — Site institucional

Site estático (HTML, CSS e JavaScript puro, sem dependências) da **Rio Supercorte Ferro e Aço Ltda.**: distribuição, corte e dobra de ferro e aço no Rio de Janeiro.

## Estrutura

```
rio-supercorte/
├── index.html               # Home: hero, serviços, produtos, diferenciais, setores, orçamento
├── trabalhe-conosco.html    # Formulário de envio de currículo
├── noticias.html            # Notícias do mercado de aço e metalurgia
├── 404.html                 # Página de erro (endereço não encontrado)
├── vercel.json              # Configuração da Vercel (URLs limpas, cache, segurança)
├── robots.txt               # Regras para buscadores
├── sitemap.xml              # Mapa do site para o Google
├── assets/
│   ├── css/
│   │   └── style.css        # Estilos globais, animações e fundos
│   ├── js/
│   │   ├── main.js          # Formulários (orçamento e currículo), menu do celular e ano no rodapé
│   │   └── assistente.js    # Assistente de vendas (chat automático)
│   └── img/
│       ├── logo-rio-supercorte.svg
│       ├── hero-galpao.jpg       # Fundo do topo e da seção de orçamento
│       ├── produtos-estoque.jpg  # Fundo da seção de produtos
│       ├── equipe.jpg            # Foto da seção "Por que a Rio Supercorte"
│       └── servicos/             # Uma foto por serviço (oxicorte, plasma, etc.)
└── README.md
```

## Endereços das páginas

Na Vercel as páginas ficam sem o `.html`:

| Página | Endereço |
|---|---|
| Home | `/` |
| Trabalhe conosco | `/trabalhe-conosco` |
| Notícias | `/noticias` |

## Publicar na Vercel (grátis)

1. Acesse **vercel.com** e entre com o GitHub.
2. Clique em **Add New → Project** e importe o repositório **rio-supercorte**.
3. Em *Framework Preset* escolha **Other**. Deixe *Build Command* e *Output Directory* vazios.
4. Clique em **Deploy**. O site fica em `https://rio-supercorte.vercel.app` (ou um nome parecido, se este já existir).

Cada `git push` na branch `main` publica a nova versão automaticamente.

**Se o endereço final for outro** (outro nome na Vercel ou domínio próprio), troque `https://rio-supercorte.vercel.app` pelo endereço certo em: `index.html`, `noticias.html`, `trabalhe-conosco.html` (tags `canonical` e `og:`), `robots.txt` e `sitemap.xml`.

**Domínio próprio:** no projeto da Vercel, abra *Settings → Domains*, adicione o domínio (ex.: `riosupercorte.com.br`) e siga as instruções de DNS.

## Testar no computador

Como os links usam endereços sem `.html`, teste com um servidor local que entenda isso:

```bash
npx serve .
# ou, com a CLI da Vercel:
npx vercel dev
```

## Formulários

- **Orçamento (home):** monta a mensagem com nome, telefone, empresa, material, medidas e serviço, e abre o **WhatsApp** (21) 99684-1513 ou o **e-mail** de quem clicou, endereçado a vendas@riosupercorte.com.br. Não precisa de servidor.
- **Currículo (trabalhe-conosco):** envia direto para o Formspree (`https://formspree.io/f/xkjrppry`), com o currículo anexado. As respostas chegam no e-mail cadastrado na conta Formspree. Se o `data-endpoint` for removido, o formulário volta a abrir o e-mail do candidato para o RH.

  ```html
  <form id="form-curriculo" data-endpoint="https://formspree.io/f/SEU_ID" ...>
  ```

Os contatos ficam no topo de `assets/js/main.js` (`WHATSAPP`, `EMAIL_VENDAS`, `EMAIL_RH`).

## Assistente de vendas

Chat flutuante ("Fale com a gente") em todas as páginas, **sem IA e sem custo**:

- Responde sobre produtos, materiais, tipos de corte, serviços, prazo, certificados, endereço, setores e vagas.
- **Orçamento guiado:** pergunta material, serviço, medidas, nome e local de entrega, mostra um resumo e envia o pedido pronto para o **WhatsApp** (ou por e-mail).
- Se não entender a pergunta, oferece enviá-la direto a um vendedor pelo WhatsApp.

Para mudar respostas ou palavras-chave, edite a lista `TOPICOS` em `assets/js/assistente.js`. Para mudar as perguntas do orçamento, edite `PASSOS`.

## Pendências antes de publicar

- [ ] Confirmar o e-mail de RH (hoje: `rh@riosupercorte.com.br`, em `main.js` e em `trabalhe-conosco.html`).
- [ ] Testar se `vendas@riosupercorte.com.br` está recebendo mensagens.
- [ ] Confirmar o direito de uso das fotos de serviços (algumas parecem de banco de imagens) ou trocar por fotos da própria operação.
- [ ] Criar as páginas de **Política de Privacidade** e **Cookies** (os links no rodapé ainda apontam para `#`).
- [ ] Atualizar `noticias.html` periodicamente (as notícias são de 23/11/2026).
