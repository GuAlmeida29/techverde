# TechVerde — Tecnologia que Transforma

Site educativo sobre tecnologia sustentável, inclusão digital e acessibilidade. Projeto acadêmico da disciplina **Desenvolvimento Front-End para Web** (UNICID, 2026.2) — AV A1, 2ª entrega.

| | |
|---|---|
| **Site publicado (HTTPS)** | [COLAR A URL DO SITE] |
| **Repositório** | [COLAR O LINK DO REPOSITÓRIO] |
| **Disciplina / Professor** | Front-End para Web · Prof. Paulo Fratta |

## Equipe
| Integrante | RA | Responsabilidade |
|---|---|---|
| [Nome completo 1] | [RA] | [ex.: HTML e páginas] |
| [Nome completo 2] | [RA] | [ex.: CSS e identidade visual] |
| [Nome completo 3] | [RA] | [ex.: JavaScript] |
| [Nome completo 4] | [RA] | [ex.: deploy e documentação] |

## O que o site tem
- 10 páginas HTML5 semânticas e interligadas (W3C sem erros).
- CSS responsivo (Flexbox/Grid, variáveis) e identidade visual única.
- JavaScript: validação do formulário, rascunho no localStorage, alto contraste, filtro de notícias, guia do equipamento e **EcoBot** (FAQ).
- Multimídia: vídeo com legendas, áudio com transcrição e mapa (iframe).
- Dados com fonte e relação com os ODS 4, 9, 11 e 12.

## Como rodar
Não precisa instalar nada. Abra `index.html` no navegador **ou** sirva a pasta:
```bash
python -m http.server 8000
# abra http://localhost:8000
```
(O botão de copiar do formulário exige HTTPS ou localhost.)

## Estrutura de pastas
```
TechVerde/
├── index.html … orcamento_hospedagem.html   (10 páginas)
├── css/style.css
├── js/script.js, js/ecobot.js
├── img/        (ilustrações SVG)
├── assets/     (vídeo, áudio, legendas, favicon)
└── docs/       (README, escopo, diário, orçamento, testes, melhorias, uso de IA)
```

## Documentação (`/docs`)
[Escopo](escopo.md) · [Diário de bordo](diario_de_bordo.md) · [Orçamento](orcamento.md) · [Testes](testes.md) · [Melhorias do MVP](melhorias_mvp.md) · [Uso de IA](uso_de_ia.md) · [Explicação do código](explicacao_codigo.md)

## Créditos e fontes
- Dados: Global E-waste Monitor 2024 (ONU/UIT), conforme fontes em `impacto.html`.
- Mapa: © colaboradores do OpenStreetMap.
- Narração do vídeo e do áudio: voz sintética eSpeak NG.
- Ilustrações: autorais da equipe (SVG).
