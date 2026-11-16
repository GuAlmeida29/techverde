/* =====================================================================
   TechVerde — script.js
   Interações acessíveis, sem dependências externas.

   Recursos (todos comentados abaixo):
   1. Menu responsivo (celular)                      -> evento click / Escape
   2. Alto contraste com preferência salva           -> localStorage
   3. Revelação progressiva ao rolar                 -> IntersectionObserver
   4. Botão "voltar ao topo"
   5. Formulário de contato                          -> preventDefault, mensagens de
                                                        erro, borda em destaque e
                                                        rascunho salvo no localStorage
   6. Filtro de notícias por categoria               -> manipulação do DOM
   7. Guia "O que fazer com o meu equipamento?"      -> mostrar/ocultar resultado
   ===================================================================== */
(() => {
  'use strict';

  /* ---------- Utilitários: localStorage protegido ----------
     Alguns navegadores bloqueiam o localStorage (modo privado, por exemplo).
     Por isso toda leitura/escrita passa por try/catch e o site continua
     funcionando mesmo sem armazenamento. */
  const store = {
    get(chave) { try { return window.localStorage.getItem(chave); } catch (_) { return null; } },
    set(chave, valor) { try { window.localStorage.setItem(chave, valor); return true; } catch (_) { return false; } },
    remove(chave) { try { window.localStorage.removeItem(chave); } catch (_) { /* ignora */ } }
  };
  const CHAVES = {
    contraste: 'techverde:contraste',
    rascunho: 'techverde:rascunho-contato',
    equipamento: 'techverde:ultimo-equipamento'
  };

  /* ---------- 1. Menu responsivo ---------- */
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#menu-principal');

  if (menuButton && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu de navegação');
    };
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu de navegação' : 'Fechar menu de navegação');
      nav.classList.toggle('open', !isOpen);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  /* ---------- 2. Alto contraste (preferência salva) ----------
     O atributo data-contrast="alto" no <html> troca as variáveis de cor do CSS. */
  const navWrap = document.querySelector('.nav-wrap');
  if (navWrap) {
    const botaoContraste = document.createElement('button');
    botaoContraste.type = 'button';
    botaoContraste.className = 'contrast-toggle';
    const aplicarContraste = (ativo) => {
      if (ativo) document.documentElement.setAttribute('data-contrast', 'alto');
      else document.documentElement.removeAttribute('data-contrast');
      botaoContraste.setAttribute('aria-pressed', String(ativo));
      botaoContraste.textContent = ativo ? '◑ Contraste: ligado' : '◐ Alto contraste';
    };
    aplicarContraste(store.get(CHAVES.contraste) === 'alto');   // lê a preferência salva
    botaoContraste.addEventListener('click', () => {
      const ativo = botaoContraste.getAttribute('aria-pressed') !== 'true';
      aplicarContraste(ativo);
      if (ativo) store.set(CHAVES.contraste, 'alto'); else store.remove(CHAVES.contraste);
    });
    navWrap.appendChild(botaoContraste);
  }

  /* ---------- 3. Revelação progressiva ----------
     Respeita a preferência do sistema por movimento reduzido. */
  const revealTargets = document.querySelectorAll('.card, .section-heading, .gallery figure, .highlight-grid');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach(item => item.classList.add('reveal'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(item => observer.observe(item));
  }

  /* ---------- 4. Botão de retorno ao topo ---------- */
  const topButton = document.createElement('button');
  topButton.className = 'back-to-top';
  topButton.type = 'button';
  topButton.setAttribute('aria-label', 'Voltar ao topo');
  topButton.textContent = '↑';
  document.body.appendChild(topButton);
  const updateTopButton = () => topButton.classList.toggle('visible', window.scrollY > 480);
  window.addEventListener('scroll', updateTopButton, { passive: true });
  updateTopButton();
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- 5. Formulário de contato ---------- */
  const form = document.querySelector('#form-contato');
  if (form) {
    const status = document.querySelector('#form-status');
    const campos = Array.from(form.querySelectorAll('input, select, textarea'));

    // Regras de validação: devolvem '' quando válido ou a mensagem de erro.
    const regras = {
      nome: v => v.trim().length < 3 ? 'Informe seu nome completo (mínimo de 3 letras).' : '',
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Informe um e-mail válido, como voce@email.com.',
      telefone: v => /^\d{10,11}$/.test(v.replace(/\D/g, '')) ? '' : 'Informe o telefone com DDD, só números (10 ou 11 dígitos).',
      data: v => v ? '' : 'Escolha uma data para contato.',
      numero: v => v === '' || (Number(v) >= 0 && Number(v) <= 100) ? '' : 'Informe um número entre 0 e 100.',
      assunto: v => v ? '' : 'Selecione um assunto.',
      mensagem: v => v.trim().length < 10 ? 'Escreva uma mensagem com pelo menos 10 caracteres.' : ''
    };

    const campoErro = campo => document.querySelector('#erro-' + campo.id);

    // Mostra (ou limpa) o erro de um campo: texto, borda vermelha e atributos ARIA.
    const validarCampo = campo => {
      const regra = regras[campo.name];
      const mensagem = regra ? regra(campo.value) : '';
      const alvo = campoErro(campo);
      campo.classList.toggle('invalid', Boolean(mensagem));
      campo.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
      if (alvo) alvo.textContent = mensagem;
      return !mensagem;
    };

    // Rascunho: salva os valores a cada digitação (localStorage).
    const salvarRascunho = () => {
      const dados = {};
      campos.forEach(c => { dados[c.name] = c.value; });
      store.set(CHAVES.rascunho, JSON.stringify(dados));
    };
    const restaurarRascunho = () => {
      const bruto = store.get(CHAVES.rascunho);
      if (!bruto) return false;
      try {
        const dados = JSON.parse(bruto);
        campos.forEach(c => { if (typeof dados[c.name] === 'string') c.value = dados[c.name]; });
        return campos.some(c => c.value);
      } catch (_) { return false; }
    };

    // Pré-seleciona o assunto quando o visitante vem de um link (?assunto=Voluntariado).
    const assuntoUrl = new URLSearchParams(window.location.search).get('assunto');
    const restaurou = restaurarRascunho();
    const seletorAssunto = form.querySelector('#assunto');
    if (assuntoUrl && seletorAssunto &&
        Array.from(seletorAssunto.options).some(o => o.value === assuntoUrl)) {
      seletorAssunto.value = assuntoUrl;
    }
    if (restaurou && status) {
      status.textContent = 'Recuperamos o rascunho que você começou a escrever neste navegador.';
    }

    campos.forEach(campo => {
      campo.addEventListener('input', () => {
        if (campo.classList.contains('invalid')) validarCampo(campo);  // corrige o erro em tempo real
        salvarRascunho();
      });
      campo.addEventListener('blur', () => { if (campo.value !== '') validarCampo(campo); });
    });

    const botaoLimpar = form.querySelector('#limpar-rascunho');
    if (botaoLimpar) {
      botaoLimpar.addEventListener('click', () => {
        store.remove(CHAVES.rascunho);
        form.reset();
        campos.forEach(c => { c.classList.remove('invalid'); c.setAttribute('aria-invalid', 'false'); const e = campoErro(c); if (e) e.textContent = ''; });
        if (status) { status.textContent = 'Rascunho apagado.'; status.classList.remove('success', 'error'); }
      });
    }

    form.addEventListener('submit', async event => {
      event.preventDefault();                               // impede o envio padrão do navegador
      const invalidos = campos.filter(c => !validarCampo(c));
      if (invalidos.length) {
        status.textContent = `Corrija ${invalidos.length} campo(s) destacado(s) em vermelho e tente novamente.`;
        status.classList.remove('success'); status.classList.add('error');
        invalidos[0].focus();                               // leva o foco ao primeiro erro (teclado e leitor de tela)
        return;
      }
      const dados = new FormData(form);
      const mensagem = [
        'Mensagem para a equipe TechVerde', '',
        `Nome: ${dados.get('nome')}`,
        `E-mail: ${dados.get('email')}`,
        `Telefone: ${dados.get('telefone')}`,
        `Data: ${dados.get('data')}`,
        `Equipamentos: ${dados.get('numero') || 'não informado'}`,
        `Assunto: ${dados.get('assunto')}`, '',
        'Mensagem:', dados.get('mensagem')
      ].join('\n');
      status.classList.remove('error');
      store.remove(CHAVES.rascunho);                        // mensagem válida: o rascunho não é mais necessário
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(mensagem);
          status.textContent = 'Mensagem validada e copiada! Este site ainda não tem serviço de envio: cole o texto no seu aplicativo de e-mail.';
        } else {
          status.textContent = 'Mensagem validada. O envio automático ainda não está configurado: copie os dados manualmente.';
        }
        status.classList.add('success');
      } catch (_) {
        status.textContent = 'Mensagem validada, mas não foi possível copiar automaticamente. Copie os dados manualmente.';
        status.classList.remove('success');
      }
    });
  }

  /* ---------- 6. Filtro de notícias ----------
     Os botões têm data-filtro; cada notícia tem data-categoria. */
  const botoesFiltro = document.querySelectorAll('[data-filtro]');
  const noticias = document.querySelectorAll('[data-categoria]');
  if (botoesFiltro.length && noticias.length) {
    const contagem = document.querySelector('#contagem-noticias');
    botoesFiltro.forEach(botao => {
      botao.addEventListener('click', () => {
        const filtro = botao.dataset.filtro;
        botoesFiltro.forEach(b => b.setAttribute('aria-pressed', String(b === botao)));
        let visiveis = 0;
        noticias.forEach(item => {
          const mostrar = filtro === 'todas' || item.dataset.categoria === filtro;
          item.hidden = !mostrar;                           // mostra/oculta no DOM
          if (mostrar) visiveis += 1;
        });
        if (contagem) contagem.textContent = `${visiveis} notícia(s) exibida(s).`;  // anunciado por leitores de tela
      });
    });
  }

  /* ---------- 7. Guia do equipamento (página Projetos) ---------- */
  const guia = document.querySelector('#guia-equipamento');
  if (guia) {
    const respostas = {
      computador: {
        funciona: 'Doe! Computadores e notebooks funcionando podem ser reaproveitados em projetos de inclusão digital. Apague seus dados antes e fale com a equipe.',
        defeito: 'Antes de descartar, avalie o reparo: troca de bateria, memória ou disco costuma devolver anos de uso. Se não valer a pena, encaminhe a um ponto de coleta.',
        'nao-liga': 'Mesmo sem ligar, ele pode ter peças reaproveitáveis. Não jogue no lixo comum: leve a um ponto de coleta de eletrônicos.'
      },
      celular: {
        funciona: 'Doe ou repasse! Remova a conta e restaure o aparelho. Celulares em bom estado ajudam quem ainda não tem acesso à internet.',
        defeito: 'Veja se a troca de tela ou bateria resolve. Bateria estufada é perigosa: pare de usar e leve a um ponto de coleta.',
        'nao-liga': 'Celulares contêm metais valiosos e baterias. Leve a um ponto de coleta ou ao programa de logística reversa do fabricante.'
      },
      baterias: {
        funciona: 'Pilhas e baterias nunca vão no lixo comum, mesmo as que ainda têm carga útil. Use um coletor específico em lojas e supermercados.',
        defeito: 'Pilhas e baterias nunca vão no lixo comum. Guarde em local seco, sem fita adesiva nos polos, e leve a um coletor específico.',
        'nao-liga': 'Pilhas e baterias nunca vão no lixo comum. Guarde em local seco e leve a um coletor específico.'
      },
      cabos: {
        funciona: 'Cabos, mouses e teclados funcionando podem ser doados juntos com computadores. Pergunte à equipe.',
        defeito: 'Cabos danificados podem ser consertados com solda simples. Se não, encaminhe à coleta de eletrônicos.',
        'nao-liga': 'Periféricos sem uso devem ir para coleta de eletrônicos, não para o lixo comum.'
      }
    };
    const resultado = guia.querySelector('#guia-resultado');
    const tipo = guia.querySelector('#guia-tipo');
    const atualizar = () => {
      const estado = guia.querySelector('input[name="estado"]:checked');
      if (!tipo.value || !estado) { resultado.hidden = true; return; }
      resultado.textContent = respostas[tipo.value][estado.value];
      resultado.hidden = false;                             // mostra o resultado
      store.set(CHAVES.equipamento, JSON.stringify({ tipo: tipo.value, estado: estado.value }));
    };
    guia.addEventListener('change', atualizar);
    try {                                                    // recupera a última escolha
      const salvo = JSON.parse(store.get(CHAVES.equipamento) || 'null');
      if (salvo && respostas[salvo.tipo]) {
        tipo.value = salvo.tipo;
        const radio = guia.querySelector(`input[name="estado"][value="${salvo.estado}"]`);
        if (radio) radio.checked = true;
        atualizar();
      }
    } catch (_) { /* ignora dados corrompidos */ }
  }
})();
