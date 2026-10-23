# Minha história em órbita

Uma página pessoal responsiva em HTML, CSS e JavaScript puro. As abas **Principal** e **Minha linha do tempo** apresentam o resumo e os marcos da jornada. A aba **Entrar** é somente uma demonstração visual: não cria contas, não autentica e não armazena nem envia os valores digitados. Os recursos de servidor e banco de dados permanecem desativados.

## Como usar

Abra `index.html` no navegador ou sirva a pasta com qualquer servidor estático. Não há dependências JavaScript nem processo de build. Na aba Principal, selecione uma etapa para ver os marcos daquele período ou comece a adicionar um marco. Use as teclas de seta, Home e End para alternar entre as abas. Em Minha linha do tempo, cadastre ou edite conquistas, acontecimentos atuais e objetivos futuros; cada marco aceita momento, data ou previsão opcional, título e descrição. A exclusão pede confirmação.

## Dados e privacidade

Os marcos da linha do tempo são salvos em `localStorage` no navegador e dispositivo em que você os preencheu. Eles não são enviados ao GitHub nem a um servidor. Use **Exportar JSON** para guardar uma cópia; **Importar JSON** valida o arquivo e pede confirmação antes de substituir a linha do tempo atual.

Na primeira visita, aparecem exemplos identificados como editáveis — não são acontecimentos reais. Edite-os, exclua-os ou acrescente seus próprios marcos. Os campos da aba Entrar não participam desse armazenamento.

## Arquivos

- `index.html` — abas Principal, Minha linha do tempo e Entrar; editor, filtros e controles de backup.
- `styles.css` — visual de constelação, cores, navegação, animações, responsividade e movimento reduzido.
- `script.js` — navegação por abas, resumo dinâmico, edição de marcos, armazenamento local e demonstração visual de login.
- `manus-routes.json` — manifesto da rota da página única.
