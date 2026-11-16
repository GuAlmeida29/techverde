# Relatório de testes — TechVerde (08/11/2026)

## Testes automatizados executados (evidência)
| Teste | Ferramenta | Resultado |
|---|---|---|
| HTML válido nas 10 páginas | W3C Nu HTML Checker (vnu, mesmo motor do validator.w3.org) via `html5validator` | **0 erros** |
| Links internos e âncoras (17 distintos) | Script de teste (`evidencias/teste_e2e.py`) | Nenhum link quebrado |
| Erros de console e recursos 404 nas 10 páginas | Chromium (Playwright) | Nenhum (exceto fontes e mapa externos, que dependem de internet) |
| Acessibilidade WCAG 2.1 A/AA e boas práticas, desktop (1440 px) | axe-core, 10 páginas | **0 violações** |
| Acessibilidade e layout no celular (390 px) | axe-core + checagem de rolagem lateral | **0 violações; sem rolagem lateral** |
| Formulário: envio vazio mostra 6 erros, borda vermelha, foco no 1º campo | Chromium | Passou |
| Formulário: rascunho sobrevive ao recarregar (localStorage) | Chromium | Passou |
| Formulário: envio válido apaga o rascunho; “apagar rascunho” limpa os campos | Chromium | Passou |
| Assunto pré-selecionado por `?assunto=` | Chromium | Passou |
| Alto contraste liga, persiste entre páginas e desliga | Chromium | Passou |
| Filtro de notícias (contagem e visibilidade) | Chromium | Passou |
| Guia do equipamento + recuperação da última escolha | Chromium | Passou |
| EcoBot responde, Esc fecha e devolve o foco | Chromium | Passou |
| Primeiro Tab leva ao “Pular para o conteúdo” | Chromium | Passou |
| Vídeo e áudio carregam; iframe tem título | Chromium | Passou |

Total: **24 de 24** verificações passaram. Prints em `docs/evidencias/`.

## O que não foi testado aqui (a equipe deve fazer e anotar)
- [ ] Abrir o **site publicado** (HTTPS) no computador e no celular real.
- [ ] Rodar o **Lighthouse** (Chrome > F12 > Lighthouse) na URL publicada e guardar o print.
- [ ] Rodar o **W3C Validator online** (validator.w3.org) nas 10 URLs publicadas.
- [ ] Testar em Firefox, Edge e Safari.
- [ ] Testar com leitor de tela (NVDA ou VoiceOver) ao menos o formulário.
- [ ] Testar o mapa (iframe) e as fontes do Google com internet.

## Observações
- O validador de **CSS** antigo marca propriedades modernas usadas desde o MVP (`aspect-ratio`, `margin-inline`, `backdrop-filter`, `inset`, `border-block`, `color-scheme`) como desconhecidas. São válidas nos navegadores atuais e o requisito do roteiro é o validador de HTML.
- O formulário não envia e-mail (site estático). Isso está dito na própria página.
- A narração do vídeo e do áudio é sintética.

## Limitações conhecidas
Site estático, sem backend, banco de dados, autenticação ou analytics.
