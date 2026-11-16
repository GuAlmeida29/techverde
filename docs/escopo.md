# Escopo do Projeto — TechVerde

**Nome:** TechVerde — Tecnologia que Transforma
**Disciplina:** Desenvolvimento Front-End para Web — UNICID, 2026.2 (AV A1 · 2ª entrega)

## Contexto e problema
Em 2022 o mundo gerou **62 milhões de toneladas** de lixo eletrônico e só **22,3%** foi coletado e reciclado de forma documentada (Global E-waste Monitor 2024, ONU/UIT). O Brasil gerou cerca de **2,4 milhões de toneladas**, o 2º maior volume das Américas, e estimativas do setor apontam reciclagem de apenas cerca de 3%. Ao mesmo tempo, parte da população ainda não tem acesso a equipamentos. As fontes estão em `impacto.html`.

## Público-alvo
Estudantes, jovens e adultos interessados em tecnologia, sustentabilidade, inclusão digital e acessibilidade, **incluindo pessoas com deficiência (PCD)**, o que orienta as decisões de acessibilidade do site.

## ODS relacionados
ODS 4 (Educação de qualidade), ODS 9 (Indústria, inovação e infraestrutura), ODS 11 (Cidades e comunidades sustentáveis) e ODS 12 (Consumo e produção responsáveis).

## Objetivo geral
Desenvolver, publicar e versionar um site educativo e acessível que informe sobre tecnologia sustentável e estimule ações concretas de reuso, descarte correto e inclusão digital.

## Objetivos específicos (mensuráveis)
| # | Objetivo | Meta mensurável |
|---|---|---|
| 1 | Informar com dados confiáveis | Pelo menos 1 página com tabela de dados e 3 fontes citadas |
| 2 | Garantir acessibilidade | 0 erros no W3C Validator (HTML); 0 violações no axe-core (WCAG 2.1 A/AA); navegação completa por teclado |
| 3 | Engajar o público | Formulário validado em JS + área de apoio (doação de equipamentos, voluntariado) + guia interativo |
| 4 | Oferecer multimídia | 1 vídeo com legendas, 1 áudio com transcrição e 1 iframe |
| 5 | Publicar e versionar | Site com HTTPS, repositório com commits de todos os integrantes e pelo menos 1 pull request |

## Páginas (10)
index, sobre, projetos, impacto, acessibilidade, galeria, midia, noticias, contato, orcamento_hospedagem.

## Tecnologias
HTML5, CSS3 (Flexbox, Grid, variáveis CSS) e **JavaScript** puro (obrigatório na 2ª entrega); Git/GitHub; deploy em GitHub Pages; IA documentada (EcoBot em JS + registro de uso).

## Critérios de aceitação e status (planejado × entregue)
| Critério de aceitação | Status | Evidência |
|---|---|---|
| 10 páginas navegáveis e interligadas | Entregue | Menu em todas as páginas; teste de links sem quebras (`docs/testes.md`) |
| Formulário validado com JavaScript e rascunho no localStorage | Entregue | `js/script.js`, seção 5 |
| Pelo menos uma interação de DOM por evento | Entregue | Menu mobile, alto contraste, filtro de notícias, guia do equipamento |
| Multimídia (vídeo, áudio, iframe) | Entregue | `midia.html` |
| Área de doação/apoio | Entregue | `projetos.html#apoie` (equipamentos e voluntariado; sem doação em dinheiro por ser projeto acadêmico) |
| Acessibilidade aplicada | Entregue | `acessibilidade.html`; axe-core sem violações |
| W3C sem erros nas 10 páginas | Entregue | Validador (vnu) sem erros em 08/11/2026 |
| ODS e dados com fonte | Entregue | `impacto.html`, faixa de ODS em todas as páginas |
| Site publicado com HTTPS | **A confirmar** | Atualizar após o deploy (ver README) |
| Commits de todos e pull request | **A confirmar** | Atualizar após o fluxo no GitHub |
