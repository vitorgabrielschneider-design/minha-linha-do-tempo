# Minha linha do tempo

Uma página estática e responsiva para registrar uma história em capítulos. O visual usa esferas flutuantes feitas em CSS, sem bibliotecas ou imagens externas; os filtros são implementados com JavaScript nativo.

## Como usar

Abra `index.html` diretamente no navegador ou sirva esta pasta com qualquer servidor estático.

## Personalização

- Edite o texto, as datas e os eventos em `index.html`.
- Para mudar as cores e o movimento das esferas, ajuste as variáveis e estilos em `styles.css`.
- Cada evento usa `data-category`; os botões de filtro em `index.html` devem usar os mesmos valores.
- O contador, o estado dos filtros e a linha do último evento visível são atualizados por `script.js`.

## Arquivos

- `index.html` — conteúdo e estrutura semântica.
- `styles.css` — identidade visual, esferas, animações, responsividade e suporte a movimento reduzido.
- `script.js` — filtros de categoria e contador dinâmico.
- `LICENSE` — licença do repositório.
