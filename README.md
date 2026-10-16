# Minha história em órbita

Uma página pessoal estática em HTML, CSS e JavaScript. A história é representada por uma linha do tempo vertical em forma de constelação: esferas luminosas conectam os marcos e os cartões alternam ao redor do eixo central.

## Como visualizar

Abra `index.html` no navegador ou sirva a pasta com qualquer servidor estático. Não há dependências JavaScript nem processo de build.

## Como personalizar sua história

Os quatro marcos de exemplo em `index.html` são espaços editáveis, não fatos sobre o autor. Substitua `ANO / DATA`, títulos, descrições e textos de detalhe pelas suas próprias datas e acontecimentos. Para incluir ou remover um marco, duplique ou remova um elemento `.timeline-entry` e mantenha o `data-category` correspondente a um botão de filtro.

As esferas alternam automaticamente entre os dois lados do eixo em telas maiores e se organizam em uma coluna em telas estreitas. Clique numa esfera ou em “Explorar este ponto” para abrir os detalhes; os filtros e o contador são controlados por `script.js`.

## Arquivos

- `index.html` — conteúdo, marcos pessoais e estrutura semântica.
- `styles.css` — visual de constelação, esferas, animações, responsividade e movimento reduzido.
- `script.js` — seleção das esferas, detalhes expansíveis, filtros e contador.
- `manus-routes.json` — declaração da rota da página única.
