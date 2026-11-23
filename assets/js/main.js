/* Rio Supercorte — scripts do site (sem dependências) */
(function () {
  'use strict';

  // Contatos da empresa — altere aqui se mudarem
  var WHATSAPP = '5521996841513';
  var EMAIL_VENDAS = 'vendas@riosupercorte.com.br';
  var EMAIL_RH = 'rh@riosupercorte.com.br'; // TODO: confirmar o e-mail real de RH
  var FORMSPREE_ID = 'xkjrppry'; // formulário de currículos (https://formspree.io/f/xkjrppry)

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

    // Envio via Formspree (@formspree/ajax, carregado por CDN em trabalhe-conosco.html).
    // A biblioteca envia o formulário como FormData, incluindo o arquivo do currículo.
    // Sem JavaScript, o form faz POST direto para o mesmo endpoint (atributo action).
    var erroGeral = document.getElementById('cv-erro');
    if (erroGeral) {
      erroGeral.textContent = 'Não foi possível enviar agora. Tente novamente ou envie o currículo para ' + EMAIL_RH + '.';
    }

    window.formspree = window.formspree || function () { (window.formspree.q = window.formspree.q || []).push(arguments); };
    window.formspree('initForm', {
      formElement: cv,
      formId: FORMSPREE_ID,
      useDefaultStyles: false, // estilos próprios em style.css
      onSubmit: function () {
        var botao = cv.querySelector('button[type="submit"]');
        if (botao) botao.textContent = 'Enviando...'; // a biblioteca restaura o texto ao terminar
      },
      onSuccess: function () {
        mostrarSucesso(contatoInput.value === 'email' ? 'e-mail' : 'WhatsApp');
      },
      onError: function (ctx, erro) {
        // Erros devolvidos pelo Formspree (ex.: campo inválido, anexo recusado pelo plano)
        if (window.console) console.warn('[Formspree]', erro.getFormErrors(), erro.getAllFieldErrors());
      },
      onFailure: function (ctx, erro) {
        if (window.console) console.warn('[Formspree] falha de rede', erro);
      }
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
