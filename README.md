# Rio Supercorte — Site institucional

Site estático (HTML, CSS e JavaScript puro, sem dependências) da **Rio Supercorte Ferro e Aço Ltda.**: distribuição, corte e dobra de ferro e aço no Rio de Janeiro.

## Estrutura

```
rio-supercorte/
├── index.html               # Home: hero, serviços, produtos, diferenciais, setores, orçamento
├── trabalhe-conosco.html    # Formulário de envio de currículo
├── noticias.html            # Notícias do mercado de aço e metalurgia
├── assets/
│   ├── css/
│   │   └── style.css        # Estilos globais, animações e fundos
│   ├── js/
│   │   └── main.js          # Formulários (orçamento e currículo) e ano no rodapé
│   └── img/
│       ├── logo-rio-supercorte.svg
│       ├── hero-galpao.jpg       # Fundo do topo e da seção de orçamento
│       ├── produtos-estoque.jpg  # Fundo da seção de produtos
│       ├── equipe.jpg            # Foto da seção "Por que a Rio Supercorte"
│       └── servicos/             # Uma foto por serviço (oxicorte, plasma, etc.)
└── README.md
```

## Como ver no computador

Basta abrir o `index.html` no navegador. Para testar como num servidor:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Como publicar

Qualquer hospedagem de site estático funciona: **GitHub Pages**, Netlify, Vercel, Hostinger, UOL Host etc.

**GitHub Pages:** no repositório, vá em *Settings → Pages*, escolha a branch `main` e a pasta `/ (root)`, e salve. O site fica no ar em alguns minutos.

## Formulários

- **Orçamento (home):** monta a mensagem com nome, telefone, empresa, material, medidas e serviço, e abre o **WhatsApp** (21) 99684-1513 ou o **e-mail** de quem clicou, endereçado a vendas@riosupercorte.com.br. Não precisa de servidor.
- **Currículo (trabalhe-conosco):** sem configuração, abre o e-mail do candidato já preenchido para o RH (o candidato anexa o currículo). Para receber o **arquivo anexado direto pelo site**, crie um formulário gratuito no [Formspree](https://formspree.io) (ou similar) e coloque o endereço no atributo `data-endpoint` do formulário:

  ```html
  <form id="form-curriculo" data-endpoint="https://formspree.io/f/SEU_ID" ...>
  ```

Os contatos ficam no topo de `assets/js/main.js` (`WHATSAPP`, `EMAIL_VENDAS`, `EMAIL_RH`).

## Pendências antes de publicar

- [ ] Confirmar o e-mail de RH (hoje: `rh@riosupercorte.com.br`, em `main.js` e em `trabalhe-conosco.html`).
- [ ] Testar se `vendas@riosupercorte.com.br` está recebendo mensagens.
- [ ] Confirmar o direito de uso das fotos de serviços (algumas parecem de banco de imagens) ou trocar por fotos da própria operação.
- [ ] Criar as páginas de **Política de Privacidade** e **Cookies** (os links no rodapé ainda apontam para `#`).
- [ ] Atualizar `noticias.html` periodicamente (as notícias são de 23/11/2026).
