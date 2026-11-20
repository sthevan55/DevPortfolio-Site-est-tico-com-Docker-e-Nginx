# DevPortfolio — Site estático com Docker e Nginx

**Disciplina:** Programação de Sistemas Distribuídos  
**Curso:** Tecnologia em Análise e Desenvolvimento de Sistemas (TADS)  
**Atividade:** P2 — Containerizando um site estático com Docker  
**Prazo de entrega:** 26/11/2026, às 14h  
**Autor:** Sthevan Vinicius (edite, se necessário)  
**IA utilizada como apoio:** ChatGPT (OpenAI)

## 1. Sobre o projeto

O **DevPortfolio** é um portfólio acadêmico desenvolvido com HTML5, CSS3 e JavaScript puro. Ele apresenta uma página inicial, informações sobre o estudante, tecnologias, projetos demonstrativos, uma explicação sobre Docker e um espaço de contato com dados de exemplo.

A ideia da atividade é **servir os arquivos do site com Nginx dentro de um container Docker**, de modo que a aplicação fique acessível em `http://localhost:8080` no computador em que o Docker está executando.

O projeto foi mantido intencionalmente simples: não possui backend, banco de dados, login, APIs obrigatórias ou dependências de terceiros. Todos os recursos do site são locais.

### Funcionalidades

- Layout moderno e responsivo, adaptado para celular e computador;
- Alternância entre temas escuro e claro, com preferência salva no navegador;
- Menu móvel acessível;
- Elementos com animações leves ao rolar a página;
- Filtro de projetos por categoria;
- Janela com detalhes de cada projeto;
- Botão para voltar ao topo;
- Botões para copiar exemplos de contato e os comandos Docker.

> **Personalização:** o nome apresentado e os projetos são textos demonstrativos/editáveis. Os dados `contato@exemplo.com` e `https://github.com/seu-usuario` são fictícios. Substitua-os por dados reais, se desejar, antes de compartilhar seu portfólio.

## 2. Tecnologias utilizadas

| Tecnologia | Finalidade |
| --- | --- |
| HTML5 | Estrutura e conteúdo da página |
| CSS3 | Identidade visual, responsividade e animações |
| JavaScript | Tema, menu, filtros, detalhes e botões |
| Docker | Empacotamento e execução do site em um container |
| Nginx (imagem `nginx:alpine`) | Servidor HTTP que entrega os arquivos estáticos |
| Git e GitHub | Versionamento e disponibilização do repositório |

## 3. Estrutura de arquivos

```text
devportfolio-docker/
├── index.html               # Conteúdo e estrutura da página
├── Dockerfile               # Instruções para construir a imagem Docker
├── .dockerignore            # Arquivos ignorados durante o build
├── README.md                # Documentação do projeto
├── css/
│   └── style.css            # Estilos e versão responsiva
├── js/
│   └── script.js            # Interações da página
└── assets/
    └── imagens/
        ├── developer.svg    # Ilustração local
        └── favicon.svg      # Ícone da aba
```

O `Dockerfile` fica na raiz e copia para o Nginx apenas os arquivos usados pelo site. O `README.md` **não precisa** ser copiado para a imagem, por isso foi excluído pelo `.dockerignore`.

## 4. Pré-requisitos

1. **Docker Desktop** instalado e em execução (Windows, com WSL 2 quando aplicável) ou Docker Engine no Linux.
2. Terminal (PowerShell, Prompt de Comando ou terminal do VS Code).
3. Navegador atualizado (Chrome, Firefox, Edge etc.).

Confira se o Docker está acessível no terminal:

```bash
docker --version
docker info
```

O `docker info` deve responder sem erro de conexão com o daemon Docker. Se aparecer erro de conexão, abra o Docker Desktop antes de continuar.

## 5. Como executar

Abra a pasta `devportfolio-docker` no VS Code e execute os comandos abaixo **na raiz do projeto**, onde está o Dockerfile.

### Passo 1 — Construir a imagem

```bash
docker build -t devportfolio .
```

- `docker build`: cria uma imagem a partir do Dockerfile.
- `-t devportfolio`: atribui o nome `devportfolio` à imagem.
- `.`: usa a pasta atual como contexto de build.

### Passo 2 — Criar e iniciar o container

```bash
docker run -d --name devportfolio-container -p 8080:80 devportfolio
```

- `docker run`: cria e executa um novo container.
- `-d`: deixa o container executando em segundo plano.
- `--name devportfolio-container`: define um nome para identificá-lo.
- `-p 8080:80`: associa a porta **8080 do computador** à porta **80 do Nginx** no container.
- `devportfolio`: é a imagem criada no passo anterior.

### Passo 3 — Verificar se o container está ativo

```bash
docker ps
```

Confirme que a lista mostra `devportfolio-container` em execução e a publicação da porta `8080` para a porta `80`.

### Passo 4 — Abrir o site

Acesse no navegador:

**http://localhost:8080**

Verifique se a página abre, se a imagem aparece, se o CSS é aplicado e se os botões funcionam.

### Passo 5 — Consultar os logs (opcional)

```bash
docker logs devportfolio-container
```

Exibe as mensagens registradas pelo servidor e ajuda a investigar possíveis problemas.

## 6. Outros comandos úteis

| Comando | O que faz |
| --- | --- |
| `docker images` | Lista as imagens disponíveis, inclusive `devportfolio` |
| `docker ps` | Lista containers em execução |
| `docker ps -a` | Lista também containers que estão parados |
| `docker logs devportfolio-container` | Mostra os logs do servidor |
| `docker stop devportfolio-container` | Para o container |
| `docker start devportfolio-container` | Inicia novamente o mesmo container |
| `docker rm devportfolio-container` | Remove o container **depois de pará-lo** |

Se o container já existir e você tentar executar outro com o mesmo nome, o Docker mostrará um conflito. Nesse caso, você pode **reiniciar o existente**:

```bash
docker start devportfolio-container
```

Ou, se quiser recriá-lo após alterar os arquivos:

```bash
docker stop devportfolio-container
docker rm devportfolio-container
docker build -t devportfolio .
docker run -d --name devportfolio-container -p 8080:80 devportfolio
```

**Importante:** as alterações feitas nos arquivos do site não atualizam automaticamente o container já criado; é necessário reconstruir a imagem e recriar o container. Se a porta `8080` já estiver ocupada, libere-a ou, para testar, use outra porta no computador, como `-p 8081:80` e acesse `http://localhost:8081`.

## 7. Qual é a diferença entre imagem e container?

**Imagem Docker:** é como um modelo pronto do ambiente de execução. Ela reúne o servidor Nginx e os arquivos HTML, CSS, JS e imagens do meu site. Depois de construída, posso usar a mesma imagem para criar containers.

**Container Docker:** é a imagem colocada para funcionar. Quando executo `docker run`, o Docker cria um container com Nginx, que passa a responder às requisições do navegador.

Em outras palavras: **a imagem é o modelo; o container é esse modelo em execução**. Uma mesma imagem pode ser usada para criar vários containers.

## 8. Por que utilizar Nginx?

O Nginx é um servidor web que recebe requisições HTTP e entrega arquivos aos navegadores. Como o projeto usa apenas HTML, CSS, JavaScript e imagens, o Nginx consegue servir todo o conteúdo sem precisar executar uma aplicação backend.

O Dockerfile começa com `FROM nginx:alpine`, uma imagem do Nginx baseada no Alpine Linux. Em seguida, copia os arquivos do projeto para `/usr/share/nginx/html/`, que é a pasta padrão usada pelo Nginx para servir conteúdo estático nessa imagem. A porta interna do servidor é a `80`.

O Dockerfile é:

```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/
EXPOSE 80
```

> `EXPOSE 80` documenta a porta usada dentro do container. É a opção `-p 8080:80` do comando `docker run` que realmente publica a porta para acesso pelo navegador.

## 9. Checklist de validação

**Status inicial:** os itens relacionados ao Docker precisam ser comprovados **no seu computador**. Marque cada caixa somente após verificar o resultado.

- [ ] O Docker Desktop/Engine está funcionando (`docker info`).
- [ ] O build terminou sem erros (`docker build -t devportfolio .`).
- [ ] O container iniciou sem erros (`docker run ...`).
- [ ] O comando `docker ps` lista `devportfolio-container`.
- [ ] O navegador abre `http://localhost:8080`.
- [ ] O layout e os arquivos CSS carregam corretamente.
- [ ] A ilustração e o favicon aparecem.
- [ ] O botão de tema alterna entre claro e escuro.
- [ ] O menu funciona em largura de celular.
- [ ] As animações aparecem ao rolar (salvo preferência por movimento reduzido).
- [ ] Os filtros de projetos funcionam corretamente.
- [ ] Os botões de detalhes abrem e fecham as janelas.
- [ ] O botão de voltar ao topo funciona.
- [ ] Os botões de copiar apresentam feedback.
- [ ] O container pode ser parado e iniciado novamente.
- [ ] O site não depende de banco de dados, API externa ou variáveis secretas.
- [ ] Um vídeo real comprova o acesso via Docker.

### O que fazer se o site não abrir?

1. Execute `docker ps -a` para conferir se o container está parado.
2. Consulte `docker logs devportfolio-container` e veja se há mensagens de erro.
3. Verifique se outro programa já usa a porta 8080.
4. Confira se você executou o build na pasta onde está o Dockerfile.
5. Reconstrua a imagem e recrie o container após alterações.
6. No navegador, faça uma atualização forçada (`Ctrl + F5`) para evitar arquivos antigos em cache.

## 10. Evidência solicitada: vídeo de 1 a 2 minutos

**Não é possível considerar um vídeo como evidência de Docker sem mostrar o container rodando no seu próprio ambiente.** Grave a tela usando a Ferramenta de Captura do Windows, Xbox Game Bar, OBS Studio ou outra ferramenta de sua preferência.

### Roteiro recomendado

| Tempo sugerido | O que mostrar | O que explicar |
| --- | --- | --- |
| 0:00–0:15 | VS Code e estrutura das pastas | O site usa HTML, CSS e JS separados. |
| 0:15–0:30 | Arquivo `Dockerfile` | O Nginx serve os arquivos estáticos. |
| 0:30–0:50 | Comando `docker build -t devportfolio .` | O build cria a imagem Docker. |
| 0:50–1:05 | Comando `docker run ...` e `docker ps` | O container foi criado com mapeamento de porta. |
| 1:05–1:35 | Navegador em `localhost:8080` | Navegue, alterne tema, filtre projetos e abra detalhes. |
| 1:35–1:50 | Volte ao terminal ou mostre o site | Explique imagem x container e finalize. |

**Texto que você pode falar:**

> "Esse é o DevPortfolio, um site estático que desenvolvi usando HTML, CSS e JavaScript. Eu organizei o código em arquivos separados e criei um Dockerfile usando a imagem Nginx Alpine. Com o comando `docker build`, gero uma imagem que contém o servidor e os arquivos do site. Depois, com o `docker run`, coloco essa imagem em execução como um container e libero a porta 8080 no meu computador. Aqui no navegador dá para ver que a página está funcionando e que os botões também respondem. Resumindo: a imagem é o modelo preparado, enquanto o container é esse modelo executando. Assim consigo disponibilizar o site sem precisar instalar o Nginx diretamente na minha máquina." 

**Arquivo sugerido para a entrega:** `evidencia-docker.mp4`. Você pode colocá-lo no repositório se o professor exigir e o tamanho permitir, ou incluir um link para a gravação no README. Não inclua uma evidência simulada ou gravação que não mostre o Docker realmente funcionando.

## 11. Como publicar o código no GitHub

1. Crie um repositório vazio, por exemplo `devportfolio-docker`, no seu perfil do GitHub.
2. Abra o terminal na pasta do projeto.
3. Execute os comandos abaixo (troque `SEU-USUARIO` pelo seu usuário do GitHub):

```bash
git init
git add .
git commit -m "Entrega P2: site estatico containerizado com Docker"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/devportfolio-docker.git
git push -u origin main
```

Se o Git solicitar identificação, configure seu nome e e-mail com `git config`. Se o repositório já estiver inicializado ou já possuir um remote `origin`, não é necessário repetir esses passos; ajuste o remote existente conforme o caso.

**Atenção:** publicar no GitHub **não é o mesmo que executar o container**. O repositório guarda o código e o Dockerfile; a evidência prática deve mostrar o build, a execução do container e a página no navegador.

## 12. Uso de inteligência artificial

**Ferramenta de IA utilizada: ChatGPT (OpenAI).**

A ferramenta auxiliou na organização da estrutura do site, no desenvolvimento dos arquivos HTML, CSS e JavaScript, na escrita do Dockerfile e na elaboração desta documentação. A revisão do projeto, a execução do Docker no computador do estudante e a gravação da evidência de funcionamento devem ser feitas pelo responsável pela entrega.

## 13. Escopo e entrega

O projeto atende ao escopo proposto: uma página estática com CSS/JS/ilustração, `Dockerfile` na raiz, arquivo `.dockerignore` e documentação própria. **Não utiliza** volumes, Docker Compose, bancos de dados, builds multi-stage ou credenciais.

**Para entregar até 26/11/2026 às 14h:** disponibilize o repositório com os arquivos e envie a evidência real em vídeo, conforme orientações do professor.
