/* Rio Supercorte — scripts do site (sem dependências) */
(function () {
  'use strict';

  // Contatos da empresa — altere aqui se mudarem
  var WHATSAPP = '5521996841513';
  var EMAIL_VENDAS = 'vendas@riosupercorte.com.br';
  var EMAIL_RH = 'rh@riosupercorte.com.br'; // TODO: confirmar o e-mail real de RH

  function val(form, name) {
    var el = form.elements[name];
    return el ? String(el.value || '').trim() : '';
  }

  /* ---------- Formulário de orçamento (index.html) ---------- */
  var orc = document.getElementById('form-orcamento');
  if (orc) {
    var aviso = document.getElementById('form-aviso');
    var btnWa = document.getElementById('btn-whatsapp');
    var btnMail = document.getElementById('btn-email');

    function montarMensagem() {
      var linhas = [
        'Pedido de material/produto – Rio Supercorte',
        '',
        'Nome: ' + val(orc, 'nome'),
        'Empresa: ' + (val(orc, 'empresa') || '-'),
        'Contato: ' + val(orc, 'telefone'),
        'Material/produto: ' + val(orc, 'material'),
        'Serviço: ' + val(orc, 'servico'),
        'Medidas e quantidade: ' + val(orc, 'medidas')
      ];
      var obs = val(orc, 'mensagem');
      if (obs) linhas.push('Observações: ' + obs);
      return linhas.join('\n');
    }

    function valido() {
      return val(orc, 'nome') && val(orc, 'telefone') && val(orc, 'material') && val(orc, 'medidas');
    }

    function enviar(e, canal) {
      if (!valido()) {
        e.preventDefault();
        if (aviso) aviso.hidden = false;
        return;
      }
      if (aviso) aviso.hidden = true;
      var texto = montarMensagem();
      if (canal === 'whatsapp') {
        btnWa.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
      } else {
        var assunto = 'Pedido de material/produto – ' + val(orc, 'nome');
        btnMail.href = 'mailto:' + EMAIL_VENDAS + '?subject=' + encodeURIComponent(assunto) + '&body=' + encodeURIComponent(texto);
      }
    }

    orc.addEventListener('submit', function (e) { e.preventDefault(); });
    orc.addEventListener('input', function () { if (aviso && valido()) aviso.hidden = true; });
    if (btnWa) btnWa.addEventListener('click', function (e) { enviar(e, 'whatsapp'); });
    if (btnMail) btnMail.addEventListener('click', function (e) { enviar(e, 'email'); });
  }

  /* ---------- Formulário de currículo (trabalhe-conosco.html) ---------- */
  var cv = document.getElementById('form-curriculo');
  if (cv) {
    var wrap = document.getElementById('cv-form-wrap');
    var sucesso = document.getElementById('cv-sucesso');
    var canalTxt = document.getElementById('cv-canal');
    var contatoInput = document.getElementById('cv-contato');
    var nomeArquivo = document.getElementById('cv-nome-arquivo');
    var opcoes = cv.querySelectorAll('.contato-opcao');

    opcoes.forEach(function (btn) {
      btn.addEventListener('click', function () {
        opcoes.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        contatoInput.value = btn.getAttribute('data-contato');
      });
    });

    var arquivo = cv.elements['curriculo'];
    if (arquivo) {
      arquivo.addEventListener('change', function () {
        var f = arquivo.files && arquivo.files[0];
        nomeArquivo.textContent = f ? f.name : 'Nenhum arquivo selecionado';
      });
    }

    cv.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!cv.reportValidity()) return;

      var canal = contatoInput.value === 'email' ? 'e-mail' : 'WhatsApp';
      var endpoint = cv.getAttribute('data-endpoint');

      if (endpoint) {
        // Envio real com anexo (ex.: Formspree, Getform, Netlify Forms) — ver README
        var botao = cv.querySelector('button[type="submit"]');
        var textoBotao = botao ? botao.textContent : '';
        if (botao) { botao.disabled = true; botao.textContent = 'Enviando...'; }
        fetch(endpoint, { method: 'POST', body: new FormData(cv), headers: { Accept: 'application/json' } })
          .then(function (r) { if (!r.ok) throw new Error(r.status); mostrarSucesso(canal); })
          .catch(function () { alert('Não foi possível enviar agora. Tente novamente ou envie para ' + EMAIL_RH + '.'); })
          .then(function () { if (botao) { botao.disabled = false; botao.textContent = textoBotao; } });
        return;
      }

      // Sem serviço de formulário configurado: abre o e-mail do candidato já preenchido
      var corpo = [
        'Candidatura – Rio Supercorte',
        '',
        'Nome: ' + val(cv, 'nome'),
        'E-mail: ' + val(cv, 'email'),
        'WhatsApp: ' + val(cv, 'whatsapp'),
        'Área de interesse: ' + val(cv, 'area'),
        'Bairro/cidade: ' + (val(cv, 'cidade') || '-'),
        'Prefere ser chamado por: ' + canal,
        '',
        'Experiência: ' + (val(cv, 'mensagem') || '-'),
        '',
        '(Anexe seu currículo a este e-mail antes de enviar.)'
      ].join('\n');
      window.location.href = 'mailto:' + EMAIL_RH +
        '?subject=' + encodeURIComponent('Currículo – ' + val(cv, 'area') + ' – ' + val(cv, 'nome')) +
        '&body=' + encodeURIComponent(corpo);
      mostrarSucesso(canal);
    });

    function mostrarSucesso(canal) {
      canalTxt.textContent = canal;
      wrap.hidden = true;
      sucesso.hidden = false;
    }

    var reset = document.getElementById('cv-reset');
    if (reset) {
      reset.addEventListener('click', function () {
        cv.reset();
        nomeArquivo.textContent = 'Nenhum arquivo selecionado';
        opcoes.forEach(function (b, i) { b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false'); });
        contatoInput.value = 'whatsapp';
        sucesso.hidden = true;
        wrap.hidden = false;
      });
    }
  }

  /* ---------- Ano automático no rodapé ---------- */
  document.querySelectorAll('[data-ano]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
