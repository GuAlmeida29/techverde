# Uso de IA — registro (prompts, aceito e corrigido)

**Ferramenta:** Claude (Anthropic), em conversa única em 08/11/2026.
**Importante para a banca:** a equipe precisa saber explicar todo código gerado. Leia `docs/explicacao_codigo.md`.

## Regras que adotamos ao usar IA
1. Não inventar dados: todo número no site tem fonte citada em `impacto.html`.
2. Não afirmar funções inexistentes: o formulário não envia e-mail e o site diz isso com clareza.
3. Revisar e testar tudo que a IA gerou (validador W3C, axe-core, teste em navegador).
4. Deixar `[PREENCHER]` onde só a equipe sabe a resposta (nomes, RAs, devolutiva do professor).

## Prompts usados
| # | Prompt (resumo) | Resultado | Aceito | Corrigido / recusado |
|---|---|---|---|---|
| 1 | Enviamos o roteiro, a rubrica e o .zip do site e pedimos validar o que falta para tirar nota máxima | Relatório de lacunas por critério da rubrica, com pontos em jogo e entregáveis ausentes | Todas as lacunas | A estimativa de nota foi tratada como aproximada |
| 2 | “Você consegue fazer tudo isso para mim?” | A IA separou o que faz (código, docs, slides) do que depende da equipe (GitHub, deploy, apresentação, dados pessoais) | Divisão proposta | — |
| 3 | “Faça isso; o que não conseguir, instrua com passo a passo” | Código do site, documentação, mídia, slides e guia | Conjunto da entrega | Veja as correções abaixo |

## O que foi corrigido após testes
| Problema encontrado | Como foi achado | Correção |
|---|---|---|
| `loading` no `<iframe>` rejeitado pelo validador | W3C (vnu) | Atributo removido |
| `aria-required` não permitido no campo de data | W3C (vnu) | Trocado por `required` (com `novalidate` no formulário) |
| Rascunho não era apagado se a cópia para a área de transferência falhasse | Teste no Chromium | Rascunho apagado sempre que o formulário é válido |
| Tabelas com rolagem não eram focáveis por teclado no celular | axe-core | `tabindex="0"`, `role="region"` e `aria-label` nas tabelas |

## Sugestões não adotadas e limites
- **Doação em dinheiro (PIX):** a IA não criou chave nem cobrança, pois seria dado inventado e o projeto é acadêmico. O apoio é por equipamentos e voluntariado.
- **Narração do vídeo e do áudio:** é voz sintética (eSpeak NG) e soa robótica. Foi aceita pelo prazo; pode ser regravada pela equipe.
- **Backend para o formulário:** não adotado agora; fica como próximo passo (ex.: Netlify Forms).

## Revisão da equipe (PREENCHER)
- O que cada integrante revisou/testou: Gustavo Braga testou o formulário (erros, rascunho ao recarregar e envio válido); Felipe Melo rodou o validador W3C e o Lighthouse na URL publicada;João Noronha leu o `script.js` e testou a navegação só com o teclado e conferiu as 10 páginas no celular e o GitHub Pages.
- Uma sugestão da IA que recusamos e por quê: a IA não criou uma chave PIX nem cobrança de doações, e nós concordamos, porque o projeto é acadêmico e não deve receber dinheiro. Por isso o apoio é só por equipamentos e voluntariado.
