# Minha história em órbita

Uma página pessoal responsiva em HTML, CSS e JavaScript puro. A navegação tem uma aba **Principal**, com visão geral e contagens dinâmicas de Passado, Presente e Futuro, e a aba **Minha linha do tempo**, para consultar e editar os marcos da jornada.

## Como usar

Abra `index.html` no navegador ou sirva a pasta com qualquer servidor estático. Não há dependências JavaScript nem processo de build. Na aba Principal, selecione uma etapa para ver os marcos daquele período, abra a linha do tempo ou comece a adicionar um marco. Use as teclas de seta, Home e End para alternar entre as abas. Em Minha linha do tempo, cadastre ou edite conquistas, acontecimentos atuais e objetivos futuros. Cada marco inclui momento, data ou previsão opcional, título e descrição; a exclusão pede confirmação.

## Dados e privacidade

Os marcos são salvos em `localStorage` no navegador e dispositivo em que você os preencheu. Eles não são enviados ao GitHub nem a um servidor. Limpar os dados do navegador pode apagá-los; use **Exportar JSON** para manter uma cópia. **Importar JSON** valida o arquivo e pede confirmação antes de substituir a linha do tempo atual.

Na primeira visita, aparecem exemplos identificados como editáveis — não são acontecimentos reais. Edite-os, exclua-os ou acrescente seus próprios marcos.

## Arquivos

- `index.html` — abas Principal e Minha linha do tempo, editor, filtros e controles de backup.
- `styles.css` — visual de constelação, cores, navegação, animações, responsividade e movimento reduzido.
- `script.js` — navegação por abas, resumos dinâmicos, cadastro, edição, remoção, armazenamento local e JSON.
- `manus-routes.json` — manifesto da rota da página única.
