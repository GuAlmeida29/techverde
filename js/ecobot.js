/* =====================================================================
   EcoBot — assistente de perguntas frequentes (FAQ) do TechVerde.
   Funciona 100% no navegador: compara palavras-chave da pergunta com
   uma base de respostas escritas pela equipe. Não usa serviço externo
   e não envia dados do visitante para lugar nenhum.
   ===================================================================== */
(() => {
  'use strict';

  /* Base de conhecimento: cada item tem palavras-chave e uma resposta. */
  const BASE = [
    { chaves: ['lixo eletronico', 'e-lixo', 'quanto', 'mundo', 'geramos', 'dados', 'numeros'],
      r: 'Em 2022 o mundo gerou 62 milhões de toneladas de lixo eletrônico e só 22,3% foi coletado e reciclado de forma documentada (Global E-waste Monitor 2024). Veja os dados completos na página Impacto.' },
    { chaves: ['brasil', 'brasileiro'],
      r: 'O Brasil gerou cerca de 2,4 milhões de toneladas de lixo eletrônico em 2022, o segundo maior volume das Américas, e estimativas do setor apontam que apenas cerca de 3% é reciclado.' },
    { chaves: ['descartar', 'descarte', 'jogar fora', 'onde levar', 'coleta', 'ponto'],
      r: 'Não jogue eletrônicos no lixo comum. Procure um ponto de coleta de eletrônicos ou o programa de logística reversa do fabricante. Na página Projetos, o guia “O que fazer com o meu equipamento?” indica o melhor destino.' },
    { chaves: ['doar', 'doacao', 'doacoes', 'apoiar', 'apoio', 'ajudar'],
      r: 'Você pode apoiar doando equipamentos em bom estado, sendo voluntário ou divulgando o projeto. Veja a seção “Como apoiar” na página Projetos e fale com a equipe pela página Contato.' },
    { chaves: ['voluntario', 'voluntariado', 'participar'],
      r: 'Para ser voluntário, preencha o formulário da página Contato escolhendo o assunto “Voluntariado”.' },
    { chaves: ['reparar', 'consertar', 'conserto', 'reaproveitar', 'reutilizar', 'reuso'],
      r: 'Antes de trocar, vale reparar: troca de bateria, memória ou disco pode prolongar a vida útil do aparelho. É o primeiro passo de “usar, reparar, reutilizar”.' },
    { chaves: ['ods', 'objetivos de desenvolvimento', 'onu'],
      r: 'O TechVerde se relaciona com os ODS 4 (educação de qualidade), 9 (inovação e infraestrutura), 11 (cidades e comunidades sustentáveis) e 12 (consumo e produção responsáveis).' },
    { chaves: ['acessibilidade', 'teclado', 'contraste', 'leitor de tela', 'deficiencia', 'pcd'],
      r: 'O site tem navegação completa por teclado, link para pular ao conteúdo, foco visível, textos alternativos e um botão de alto contraste no topo. Detalhes na página Acessibilidade.' },
    { chaves: ['contato', 'falar', 'email', 'mensagem', 'formulario'],
      r: 'Use o formulário da página Contato. Ele valida os campos e salva um rascunho neste navegador caso você precise sair e voltar depois.' },
    { chaves: ['quem', 'equipe', 'criou', 'projeto', 'sobre'],
      r: 'O TechVerde é um projeto acadêmico de Front-End para Web (UNICID, 2026) sobre tecnologia sustentável, inclusão digital e acessibilidade. Conheça a missão na página Sobre.' }
  ];
  const SUGESTOES = ['Quanto lixo eletrônico o mundo gera?', 'Onde descartar meu celular?', 'Como posso apoiar?', 'Quais ODS o projeto trabalha?'];
  const PADRAO = 'Ainda não sei responder isso. Tente perguntar sobre lixo eletrônico, descarte, doação, voluntariado, ODS ou acessibilidade — ou escreva pela página Contato.';

  // Remove acentos e põe em minúsculas para comparar palavras.
  const normalizar = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const responder = pergunta => {
    const texto = normalizar(pergunta);
    let melhor = null, pontos = 0;
    BASE.forEach(item => {
      const p = item.chaves.reduce((soma, c) => soma + (texto.includes(normalizar(c)) ? 1 : 0), 0);
      if (p > pontos) { pontos = p; melhor = item; }
    });
    return melhor ? melhor.r : PADRAO;
  };

  /* ---------- Interface ---------- */
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'ecobot-toggle';
  botao.setAttribute('aria-expanded', 'false');
  botao.setAttribute('aria-controls', 'ecobot-painel');
  botao.textContent = '🌱 EcoBot';

  const painel = document.createElement('section');
  painel.id = 'ecobot-painel';
  painel.className = 'ecobot-painel';
  painel.hidden = true;
  painel.setAttribute('aria-label', 'EcoBot, assistente de perguntas frequentes');
  painel.innerHTML =
    '<h2 class="ecobot-titulo">EcoBot</h2>' +
    '<p class="ecobot-aviso">Assistente de perguntas frequentes. As respostas vêm de uma base escrita pela equipe.</p>' +
    '<div class="ecobot-log" role="log" aria-live="polite" aria-label="Conversa com o EcoBot"></div>' +
    '<div class="ecobot-sugestoes"></div>' +
    '<div class="ecobot-form"><label for="ecobot-pergunta">Sua pergunta</label>' +
    '<input id="ecobot-pergunta" type="text" autocomplete="off" maxlength="200">' +
    '<button type="button" class="btn primary" id="ecobot-enviar">Perguntar</button></div>';

  document.body.appendChild(painel);
  document.body.appendChild(botao);

  const log = painel.querySelector('.ecobot-log');
  const campo = painel.querySelector('#ecobot-pergunta');
  const sugestoes = painel.querySelector('.ecobot-sugestoes');

  // Adiciona uma mensagem usando textContent (evita injetar HTML do visitante).
  const adicionar = (quem, texto) => {
    const p = document.createElement('p');
    p.className = 'ecobot-msg ' + quem;
    p.textContent = (quem === 'bot' ? 'EcoBot: ' : 'Você: ') + texto;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  };
  const perguntar = texto => {
    const limpo = texto.trim();
    if (!limpo) return;
    adicionar('user', limpo);
    adicionar('bot', responder(limpo));
    campo.value = '';
  };

  SUGESTOES.forEach(s => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ecobot-chip'; b.textContent = s;
    b.addEventListener('click', () => perguntar(s));
    sugestoes.appendChild(b);
  });
  painel.querySelector('#ecobot-enviar').addEventListener('click', () => perguntar(campo.value));
  campo.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); perguntar(campo.value); } });

  const alternar = abrir => {
    painel.hidden = !abrir;
    botao.setAttribute('aria-expanded', String(abrir));
    if (abrir) {
      if (!log.children.length) adicionar('bot', 'Olá! Sou o EcoBot. Pergunte sobre lixo eletrônico, descarte, doação ou acessibilidade.');
      campo.focus();
    } else { botao.focus(); }
  };
  botao.addEventListener('click', () => alternar(painel.hidden));
  painel.addEventListener('keydown', e => { if (e.key === 'Escape') alternar(false); });
})();
