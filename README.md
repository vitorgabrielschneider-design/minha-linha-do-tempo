# Minha história em órbita

Uma página pessoal responsiva em HTML, CSS e JavaScript puro. A linha do tempo vertical organiza os marcos em **Passado**, **Presente** e **Futuro**, com esferas conectadas, cartões expansíveis e uma paleta azul profundo + gelo.

## Como usar

Abra `index.html` no navegador ou sirva a pasta com qualquer servidor estático. Não há dependências JavaScript nem processo de build. Use **Adicionar marco** para registrar ou editar conquistas, acontecimentos atuais e objetivos futuros. Cada marco inclui momento, data ou previsão opcional, título e descrição; a exclusão pede confirmação.

## Dados e privacidade

Os marcos são salvos em `localStorage` no navegador e dispositivo em que você os preencheu. Eles não são enviados ao GitHub nem a um servidor. Limpar os dados do navegador pode apagá-los; use **Exportar JSON** para manter uma cópia. **Importar JSON** valida o arquivo e pede confirmação antes de substituir a linha do tempo atual.

Na primeira visita, aparecem exemplos identificados como editáveis — não são acontecimentos reais. Edite-os, exclua-os ou acrescente seus próprios marcos.

## Arquivos

- `index.html` — estrutura, editor, filtros e controles de backup.
- `styles.css` — visual de constelação, cores, animações, responsividade e movimento reduzido.
- `script.js` — cadastro, edição, remoção, ordenação, armazenamento local e importação/exportação JSON.
- `manus-routes.json` — manifesto da rota da página única.
