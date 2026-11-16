# Melhorias do MVP à versão final

**Como esta lista foi feita:** não havia devolutiva escrita do professor sobre a 1ª entrega. Por isso, a equipe revisou a versão anterior do site (recebida em 04/11/2026) com apoio de IA (ver `uso_de_ia.md`), comparou com o roteiro e a rubrica da 2ª entrega e listou os pontos fracos. “Antes” é essa versão anterior; “depois” é a versão final (08/11/2026). Prints em `evidencias/antes-depois/`.

## 1. Antes × depois (visão geral)
| Área | Antes (04/11/2026) | Depois (08/11/2026) |
|---|---|---|
| JavaScript | Menu, botão de topo e `reportValidity()` do navegador; sem localStorage | Validação própria com mensagens e borda vermelha, rascunho e preferências no localStorage, filtro de notícias, guia do equipamento, EcoBot |
| Multimídia (`midia.html`) | Espaços reservados sem vídeo, áudio ou iframe | Vídeo com legendas, áudio com transcrição e mapa em iframe |
| Galeria | 4 placeholders de texto, 0 imagens no site | 4 ilustrações autorais com alt descritivo |
| Orçamento | Tabelas com `[PREENCHER]` | Preços pesquisados, orçamento total e justificativa |
| ODS e dados | Nenhuma menção a ODS; sem dados com fonte | ODS 4, 9, 11 e 12 em todas as páginas; tabela de dados e 3 fontes |
| Apoio/doação | Ausente | Seção “Como apoiar” e guia do equipamento |
| Notícias | 3 cartões fixos | 6 cartões com filtro por categoria |
| Contato | Texto pedindo para preencher a equipe | Lista de integrantes e assunto pré-selecionável por link |
| Acessibilidade | Foco, skip-link, ARIA no menu | Alto contraste, tabelas roláveis focáveis por teclado, legendas e transcrições, axe-core sem violações |
| Documentação | Escopo com “JavaScript opcional”; testes com pendências | Escopo com metas mensuráveis, diário datado, testes com evidências |

## 2. Pontos identificados na revisão da 1ª entrega e como foram resolvidos
| # | Ponto identificado | Como foi resolvido | Antes | Depois |
|---|---|---|---|---|
| 1 | Página Mídia sem vídeo, áudio nem iframe (só espaços reservados) | Vídeo com legendas `.vtt`, áudio com transcrição e mapa OpenStreetMap em iframe | `evidencias/antes-depois/midia-antes.png` | `evidencias/antes-depois/midia-depois.png` |
| 2 | Galeria sem nenhuma imagem real | 4 ilustrações SVG autorais, com texto alternativo descritivo | `evidencias/antes-depois/galeria-antes.png` | `evidencias/antes-depois/galeria-depois.png` |
| 3 | Orçamento de hospedagem com campos `[PREENCHER]` | Comparativo de 3 hospedagens e 3 domínios, orçamento total e justificativa da escolha (GitHub Pages) | `evidencias/antes-depois/orcamento_hospedagem-antes.png` | `evidencias/antes-depois/orcamento_hospedagem-depois.png` |
| 4 | Formulário sem validação própria em JavaScript e sem localStorage | Mensagens de erro por campo, borda vermelha, foco no primeiro erro e rascunho salvo no localStorage | `evidencias/antes-depois/contato-antes.png` | `evidencias/formulario-erros.png` |
| 5 | Tema sem ODS e sem dados com fonte | Tabela de dados com 3 fontes e relação com os ODS 4, 9, 11 e 12 (também em uma faixa em todas as páginas) | `evidencias/antes-depois/impacto-antes.png` | `evidencias/antes-depois/impacto-depois.png` |
| 6 | Sem área de doação ou apoio | Seção “Como apoiar” (equipamentos e voluntariado) e guia interativo do equipamento | `evidencias/antes-depois/projetos-antes.png` | `evidencias/antes-depois/projetos-depois.png` |
| 7 | Escopo e testes desatualizados (“JavaScript opcional”, validação W3C não feita) | Escopo com metas mensuráveis; W3C sem erros e axe-core sem violações registrados em `testes.md` | `escopo.md` e `testes.md` da versão anterior | `docs/escopo.md` e `docs/testes.md` |

O ponto mais difícil foi o 4: validar sem servidor e manter o rascunho do formulário. A solução foi usar `novalidate` com validação própria e guardar os dados no localStorage, com `try/catch` para navegadores que bloqueiam o armazenamento.
