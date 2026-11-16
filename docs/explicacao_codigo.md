# Explicação do JavaScript (para a banca)

Arquivo: `js/script.js` (tudo dentro de uma função anônima que roda ao carregar; `'use strict'` evita erros silenciosos).

## `store` (localStorage protegido)
Funções `get`, `set` e `remove` com `try/catch`. Motivo: em modo privado alguns navegadores bloqueiam o localStorage; sem o `try/catch` o site quebraria. As chaves ficam em `CHAVES`.

## Menu do celular
O botão alterna a classe `open` na `<nav>` e o atributo `aria-expanded` (informa o estado ao leitor de tela). `Escape` e clique fora fecham o menu.

## Alto contraste
Cria o botão, lê `localStorage` ao carregar e, no clique, liga/desliga `data-contrast="alto"` no `<html>`. O CSS troca as variáveis de cor nesse seletor. A escolha persiste entre páginas.

## Formulário de contato (a parte mais perguntada)
1. `regras`: objeto com uma função por campo; devolve `''` se válido ou o texto do erro.
2. `validarCampo`: aplica a regra, liga/desliga a classe `invalid` (borda vermelha), define `aria-invalid` e escreve a mensagem no `<span id="erro-...">`, ligado ao campo por `aria-describedby`.
3. Rascunho: a cada `input`, `salvarRascunho` grava todos os campos em JSON no localStorage; ao carregar, `restaurarRascunho` preenche de volta.
4. No `submit`: `event.preventDefault()` impede o envio padrão; se há campos inválidos, mostra o resumo e `focus()` no primeiro; se não há, monta o texto, copia com `navigator.clipboard` (só em HTTPS) e apaga o rascunho. **Não há envio de e-mail**: o site é estático e diz isso.
5. `?assunto=...` na URL pré-seleciona o assunto (`URLSearchParams`).

## Filtro de notícias
Botões com `data-filtro` e notícias com `data-categoria`. No clique, percorre as notícias e define `item.hidden`. `aria-pressed` indica o botão ativo e a contagem fica em uma região `aria-live`.

## Guia do equipamento
Tabela `respostas[tipo][estado]`. Evento `change` do formulário mostra o texto no parágrafo `role="status"` e salva a escolha no localStorage.

## `js/ecobot.js` (EcoBot)
FAQ sem IA externa: `normalizar` tira acentos e põe em minúsculas; `responder` conta quantas palavras-chave de cada item aparecem na pergunta e devolve a resposta do item com mais pontos; sem pontos, devolve a resposta padrão. Mensagens entram com `textContent` (não com `innerHTML`), o que evita injeção de HTML.

## Perguntas prováveis
- *Por que `novalidate` no formulário?* Para usar nossa validação, com mensagens e foco, em vez da caixa padrão do navegador.
- *O que acontece sem localStorage?* O site funciona, só não guarda rascunho nem preferências.
- *Por que `textContent`?* Segurança: texto do visitante nunca vira HTML.
