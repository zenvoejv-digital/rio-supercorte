/* Rio Supercorte — Assistente de vendas automático (sem IA, sem custo)
   Respostas prontas + fluxo guiado de orçamento que termina no WhatsApp.
   Para editar respostas, altere a lista TOPICOS abaixo. */
(function () {
  'use strict';

  var WHATSAPP = '5521996841513';
  var TELEFONE = '(21) 2111-7700';
  var EMAIL = 'vendas@riosupercorte.com.br';
  var ENDERECO = 'Estr. João Paulo, 130 – Honório Gurgel, Rio de Janeiro – RJ';

  function wa(texto) {
    return 'https://wa.me/' + WHATSAPP + (texto ? '?text=' + encodeURIComponent(texto) : '');
  }

  // Remove acentos e deixa minúsculo, para comparar palavras-chave
  function norm(t) {
    return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  /* ---------- Base de conhecimento ---------- */
  var TOPICOS = [
    {
      id: 'produtos',
      chaves: ['produto', 'material', 'vende', 'vendem', 'trabalha com', 'estoque', 'catalogo'],
      resposta: 'Trabalhamos com <b>barras, cantoneiras, chapas, perfis, tubos, telhas e vigas de aço</b>, além de <b>aço carbono, inox, alumínio e latão</b>, planos e não planos. Qual material você precisa?',
      opcoes: ['Chapas', 'Vigas e perfis', 'Tubos', 'Inox e alumínio', 'Fazer orçamento']
    },
    {
      id: 'chapas',
      chaves: ['chapa', 'placa', 'plano'],
      resposta: 'Fornecemos <b>chapas de aço</b> finas e grossas e cortamos sob medida (oxicorte, plasma ou jato d\'água, conforme o material e a espessura). Me diga a espessura, as medidas e a quantidade que eu já monto seu pedido.',
      opcoes: ['Fazer orçamento', 'Tipos de corte']
    },
    {
      id: 'vigas',
      chaves: ['viga', 'perfil', 'perfis', 'estrutura', 'cantoneira', 'barra'],
      resposta: 'Temos <b>vigas (I e H), perfis (U, T e dobrados), cantoneiras e barras</b> redondas, quadradas e chatas. Também entregamos cortado no comprimento que você precisa.',
      opcoes: ['Fazer orçamento', 'Serviços']
    },
    {
      id: 'tubos',
      chaves: ['tubo', 'cano', 'tubular'],
      resposta: 'Fornecemos <b>tubos de aço</b> redondos, quadrados e retangulares, e fazemos calandragem para transformar chapas em peças tubulares e curvas.',
      opcoes: ['Fazer orçamento', 'Calandragem']
    },
    {
      id: 'metais',
      chaves: ['inox', 'aluminio', 'latao', 'nao ferroso'],
      resposta: 'Trabalhamos com <b>aço inox, alumínio e latão</b>. Para cortar esses materiais, o mais indicado costuma ser o <b>plasma</b> ou o <b>jato d\'água</b>. Soldamos inox com TIG e também fazemos solda de alumínio.',
      opcoes: ['Fazer orçamento', 'Tipos de corte']
    },
    {
      id: 'telhas',
      chaves: ['telha', 'cobertura', 'telhado'],
      resposta: 'Temos <b>telhas de aço</b> para coberturas. Me passe o tamanho da área ou a quantidade de peças para orçarmos.',
      opcoes: ['Fazer orçamento']
    },
    {
      id: 'servicos',
      chaves: ['servico', 'beneficiamento', 'faz ', 'fazem'],
      resposta: 'Além do material, entregamos a peça pronta: <b>oxicorte, jato d\'água, plasma, corte a frio, dobra a frio, soldagem, calandragem e usinagem</b>. Qual serviço você precisa?',
      opcoes: ['Tipos de corte', 'Dobra e calandragem', 'Soldagem e usinagem', 'Fazer orçamento']
    },
    {
      id: 'corte',
      chaves: ['corte', 'cortar', 'oxicorte', 'plasma', 'jato', 'agua', 'serra'],
      resposta: '<b>Oxicorte</b>: nosso carro-chefe, para chapas e peças grossas de aço carbono.<br><b>Plasma</b>: indicado para inox e alumínio.<br><b>Jato d\'água</b>: corte a frio de alta precisão, sem alterar o material.<br><b>Corte a frio</b>: rápido, para quando a precisão não é crítica.<br>Tem desenho da peça? Pode mandar no WhatsApp.',
      opcoes: ['Fazer orçamento', 'Enviar desenho no WhatsApp']
    },
    {
      id: 'dobra',
      chaves: ['dobra', 'dobrar', 'calandra', 'curvar', 'curva', 'conformacao'],
      resposta: '<b>Dobra a frio</b>: conformação de peças e perfis no formato do projeto.<br><b>Calandragem</b>: transforma chapas planas em peças tubulares e curvas.',
      opcoes: ['Fazer orçamento']
    },
    {
      id: 'solda',
      chaves: ['solda', 'soldagem', 'tig', 'mig', 'mag', 'usinagem', 'usinar', 'torno'],
      resposta: '<b>Soldagem</b>: TIG para inox, MIG/MAG para aço carbono e solda de alumínio.<br><b>Usinagem</b>: acabamento por remoção de material, com precisão.',
      opcoes: ['Fazer orçamento']
    },
    {
      id: 'preco',
      chaves: ['preco', 'valor', 'quanto custa', 'quanto e', 'orcamento', 'cotacao', 'cotar', 'comprar', 'pedido'],
      fluxo: 'orcamento'
    },
    {
      id: 'prazo',
      chaves: ['prazo', 'entrega', 'entregar', 'frete', 'demora', 'quando chega', 'disponivel', 'disponibilidade'],
      resposta: 'Entrega rápida é um dos nossos diferenciais. O prazo exato depende do material, da quantidade e do serviço. Nosso time confirma no orçamento. Quer que eu monte o pedido agora?',
      opcoes: ['Fazer orçamento', 'Falar com vendedor']
    },
    {
      id: 'qualidade',
      chaves: ['certificado', 'qualidade', 'garantia', 'usina', 'norma'],
      resposta: 'Todo o material tem <b>certificado emitido diretamente pelas usinas siderúrgicas</b>. Somos uma empresa 100% nacional.',
      opcoes: ['Fazer orçamento', 'Produtos']
    },
    {
      id: 'endereco',
      chaves: ['endereco', 'onde', 'localizacao', 'fica', 'retirar', 'retirada', 'mapa', 'buscar'],
      resposta: 'Estamos em <b>' + ENDERECO + '</b>.<br><a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ENDERECO) + '" target="_blank" rel="noopener">Abrir no mapa →</a>',
      opcoes: ['Horário de atendimento', 'Falar com vendedor']
    },
    {
      id: 'horario',
      chaves: ['horario', 'abre', 'fecha', 'funciona', 'sabado', 'domingo', 'aberto'],
      resposta: 'Para confirmar o horário de atendimento e de retirada, fale com a gente pelo telefone <b>' + TELEFONE + '</b> ou pelo WhatsApp.',
      opcoes: ['Falar com vendedor']
    },
    {
      id: 'contato',
      chaves: ['contato', 'telefone', 'ligar', 'whatsapp', 'zap', 'email', 'vendedor', 'atendente', 'humano', 'pessoa'],
      resposta: 'Fale direto com nosso time de vendas:<br>WhatsApp: <a href="' + wa('Olá! Vim pelo site e gostaria de falar com um vendedor.') + '" target="_blank" rel="noopener">(21) 99684-1513</a><br>Telefone: <a href="tel:+552121117700">' + TELEFONE + '</a><br>E-mail: <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>',
      opcoes: ['Fazer orçamento']
    },
    {
      id: 'setores',
      chaves: ['setor', 'obra', 'construcao', 'industria', 'naval', 'agricola', 'petroquimico', 'automotivo', 'ferroviario', 'energia'],
      resposta: 'Atendemos construção civil e mecânica, usinas, indústrias, setor rodoviário e ferroviário, agrícola, alimentício, naval, energia, químico/petroquímico e automobilístico, da peça única ao lote recorrente.',
      opcoes: ['Fazer orçamento', 'Produtos']
    },
    {
      id: 'vagas',
      chaves: ['vaga', 'emprego', 'curriculo', 'trabalhar', 'trabalhe'],
      resposta: 'Que bom que quer fazer parte do time! Envie seu currículo pela página <a href="/trabalhe-conosco">Trabalhe conosco</a>.',
      opcoes: []
    },
    {
      id: 'saudacao',
      chaves: ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'opa', 'e ai'],
      resposta: 'Olá! Como posso ajudar? Posso tirar dúvidas sobre produtos e serviços ou montar seu pedido de orçamento.',
      opcoes: ['Produtos', 'Serviços', 'Fazer orçamento', 'Falar com vendedor']
    },
    {
      id: 'obrigado',
      chaves: ['obrigad', 'valeu', 'agradeco', 'show', 'perfeito'],
      resposta: 'Por nada! Se precisar de mais alguma coisa, é só chamar.',
      opcoes: ['Fazer orçamento', 'Falar com vendedor']
    }
  ];

  // Botões de resposta rápida → tópico
  var ATALHOS = {
    'Produtos': 'produtos', 'Serviços': 'servicos', 'Chapas': 'chapas', 'Vigas e perfis': 'vigas',
    'Tubos': 'tubos', 'Inox e alumínio': 'metais', 'Tipos de corte': 'corte', 'Dobra e calandragem': 'dobra',
    'Calandragem': 'dobra', 'Soldagem e usinagem': 'solda', 'Prazo de entrega': 'prazo',
    'Endereço': 'endereco', 'Horário de atendimento': 'horario', 'Falar com vendedor': 'contato'
  };

  function acharTopico(texto) {
    var t = ' ' + norm(texto) + ' ';
    var melhor = null, pontos = 0;
    TOPICOS.forEach(function (tp) {
      var p = 0;
      tp.chaves.forEach(function (k) {
        var nk = norm(k).trim();
        // palavras curtas precisam bater como palavra inteira (ex.: "oi" não casa com "dois")
        var achou = nk.length <= 4 ? new RegExp('(^|[^a-z])' + nk + '([^a-z]|$)').test(t) : t.indexOf(nk) !== -1;
        if (achou) p += nk.length;
      });
      if (p > pontos) { pontos = p; melhor = tp; }
    });
    return melhor;
  }

  /* ---------- Interface ---------- */
  var raiz = document.createElement('div');
  raiz.className = 'rs-chat';
  raiz.innerHTML =
    '<button type="button" class="rs-chat-botao" aria-expanded="false" aria-controls="rs-chat-painel">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"></path></svg>' +
      '<span>Fale com a gente</span>' +
    '</button>' +
    '<div class="rs-chat-painel" id="rs-chat-painel" role="dialog" aria-label="Assistente de vendas Rio Supercorte" hidden>' +
      '<div class="rs-chat-topo">' +
        '<div><strong>Assistente de vendas</strong><span>Rio Supercorte · respostas automáticas</span></div>' +
        '<button type="button" class="rs-chat-fechar" aria-label="Fechar assistente">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>' +
        '</button>' +
      '</div>' +
      '<div class="rs-chat-log" aria-live="polite"></div>' +
      '<div class="rs-chat-opcoes"></div>' +
      '<form class="rs-chat-form">' +
        '<label class="rs-sr" for="rs-chat-input">Digite sua mensagem</label>' +
        '<input id="rs-chat-input" type="text" autocomplete="off" placeholder="Digite sua dúvida...">' +
        '<button type="submit" aria-label="Enviar mensagem">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>' +
        '</button>' +
      '</form>' +
    '</div>';
  document.body.appendChild(raiz);

  var botao = raiz.querySelector('.rs-chat-botao');
  var painel = raiz.querySelector('.rs-chat-painel');
  var log = raiz.querySelector('.rs-chat-log');
  var opcoesEl = raiz.querySelector('.rs-chat-opcoes');
  var form = raiz.querySelector('.rs-chat-form');
  var input = raiz.querySelector('#rs-chat-input');
  var iniciado = false;
  var fluxo = null; // estado do orçamento guiado

  function msg(html, de) {
    var b = document.createElement('div');
    b.className = 'rs-msg ' + (de === 'cliente' ? 'rs-msg-cliente' : 'rs-msg-bot');
    if (de === 'cliente') b.textContent = html; else b.innerHTML = html;
    log.appendChild(b);
    log.scrollTop = log.scrollHeight;
  }

  function bot(html, opcoes) {
    var digitando = document.createElement('div');
    digitando.className = 'rs-msg rs-msg-bot rs-digitando';
    digitando.innerHTML = '<span></span><span></span><span></span>';
    log.appendChild(digitando);
    log.scrollTop = log.scrollHeight;
    opcoesEl.innerHTML = '';
    setTimeout(function () {
      digitando.remove();
      msg(html, 'bot');
      mostrarOpcoes(opcoes || []);
    }, 450);
  }

  function mostrarOpcoes(lista) {
    opcoesEl.innerHTML = '';
    lista.forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = o;
      b.addEventListener('click', function () { receber(o); });
      opcoesEl.appendChild(b);
    });
  }

  function abrir() {
    painel.hidden = false;
    botao.setAttribute('aria-expanded', 'true');
    raiz.classList.add('rs-aberto');
    if (!iniciado) {
      iniciado = true;
      bot('Olá! 👋 Sou o assistente de vendas da Rio Supercorte. Posso tirar dúvidas sobre produtos e serviços ou montar seu pedido de orçamento para enviar ao nosso time no WhatsApp.',
        ['Fazer orçamento', 'Produtos', 'Serviços', 'Prazo de entrega', 'Endereço', 'Falar com vendedor']);
    }
    setTimeout(function () { input.focus(); }, 50);
  }
  function fechar() {
    painel.hidden = true;
    botao.setAttribute('aria-expanded', 'false');
    raiz.classList.remove('rs-aberto');
    botao.focus();
  }

  botao.addEventListener('click', function () { painel.hidden ? abrir() : fechar(); });
  raiz.querySelector('.rs-chat-fechar').addEventListener('click', fechar);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !painel.hidden) fechar(); });

  // Links do site que pedem orçamento podem abrir o assistente: <a data-assistente>
  document.querySelectorAll('[data-assistente]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); abrir(); receber('Fazer orçamento'); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var t = input.value.trim();
    if (!t) return;
    input.value = '';
    receber(t);
  });

  /* ---------- Orçamento guiado ---------- */
  var PASSOS = [
    { campo: 'material', pergunta: 'Ótimo! Vamos montar seu pedido. <b>Qual material ou produto</b> você precisa? (ex.: chapa de aço carbono, viga I, tubo inox)', opcoes: ['Chapa de aço carbono', 'Viga / perfil', 'Tubo', 'Inox', 'Alumínio'] },
    { campo: 'servico', pergunta: 'Precisa de algum <b>serviço</b> junto?', opcoes: ['Só o material', 'Oxicorte', 'Plasma', 'Jato d\'água', 'Dobra / calandragem', 'Solda / usinagem'] },
    { campo: 'medidas', pergunta: 'Quais são as <b>medidas e a quantidade</b>? (ex.: 10 peças de 500 × 300 mm, espessura 12,7 mm). Se tiver desenho, depois é só mandar no WhatsApp.', opcoes: [] },
    { campo: 'nome', pergunta: 'Qual é o <b>seu nome</b> (e empresa, se houver)?', opcoes: [] },
    { campo: 'cidade', pergunta: 'Para qual <b>bairro ou cidade</b> seria a entrega? (ou digite "retirada")', opcoes: ['Retirada no local'] }
  ];

  function iniciarOrcamento() {
    fluxo = { passo: 0, dados: {} };
    var p = PASSOS[0];
    bot(p.pergunta, p.opcoes.concat(['Cancelar']));
  }

  function continuarOrcamento(resposta) {
    if (norm(resposta) === 'cancelar') {
      fluxo = null;
      bot('Tudo bem, cancelei o pedido. Posso ajudar com outra coisa?', ['Produtos', 'Serviços', 'Falar com vendedor']);
      return;
    }
    var atual = PASSOS[fluxo.passo];
    fluxo.dados[atual.campo] = resposta;
    fluxo.passo++;
    if (fluxo.passo < PASSOS.length) {
      var p = PASSOS[fluxo.passo];
      bot(p.pergunta, p.opcoes.concat(['Cancelar']));
      return;
    }
    var d = fluxo.dados;
    fluxo = null;
    var texto = [
      'Pedido de orçamento – Rio Supercorte (via assistente do site)',
      '',
      'Nome: ' + d.nome,
      'Material/produto: ' + d.material,
      'Serviço: ' + d.servico,
      'Medidas e quantidade: ' + d.medidas,
      'Entrega: ' + d.cidade
    ].join('\n');
    var resumo = '<b>Resumo do pedido</b><br>' +
      'Material: ' + esc(d.material) + '<br>' +
      'Serviço: ' + esc(d.servico) + '<br>' +
      'Medidas: ' + esc(d.medidas) + '<br>' +
      'Nome: ' + esc(d.nome) + '<br>' +
      'Entrega: ' + esc(d.cidade) +
      '<a class="rs-cta" href="' + wa(texto) + '" target="_blank" rel="noopener">Enviar pedido no WhatsApp</a>' +
      '<a class="rs-cta rs-cta-sec" href="mailto:' + EMAIL + '?subject=' + encodeURIComponent('Pedido de orçamento – ' + d.nome) + '&body=' + encodeURIComponent(texto) + '">Enviar por e-mail</a>';
    bot(resumo, ['Novo orçamento', 'Falar com vendedor']);
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  /* ---------- Roteador de mensagens ---------- */
  function receber(texto) {
    msg(texto, 'cliente');
    if (fluxo) { continuarOrcamento(texto); return; }

    var n = norm(texto);
    if (n === 'fazer orcamento' || n === 'novo orcamento') { iniciarOrcamento(); return; }
    if (n === 'enviar desenho no whatsapp') {
      bot('Perfeito! Abra o WhatsApp e envie o desenho, a foto ou o PDF da peça:<a class="rs-cta" href="' + wa('Olá! Vim pelo site e quero enviar o desenho de uma peça para orçamento.') + '" target="_blank" rel="noopener">Abrir WhatsApp</a>', ['Fazer orçamento']);
      return;
    }

    var tp = ATALHOS[texto] ? TOPICOS.filter(function (x) { return x.id === ATALHOS[texto]; })[0] : acharTopico(texto);
    if (tp && tp.fluxo === 'orcamento') { iniciarOrcamento(); return; }
    if (tp) { bot(tp.resposta, tp.opcoes); return; }

    // Não entendeu: oferece mandar a pergunta para um vendedor
    bot('Essa eu prefiro passar para o nosso time de vendas, para te responder certinho.' +
      '<a class="rs-cta" href="' + wa('Olá! Vim pelo site e tenho uma dúvida: ' + texto) + '" target="_blank" rel="noopener">Enviar minha pergunta no WhatsApp</a>',
      ['Fazer orçamento', 'Produtos', 'Serviços']);
  }
})();
