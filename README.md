# DevPortfolio — Site estático com Docker e Nginx

**Disciplina:** Programação de Sistemas Distribuídos  
**Curso:** Tecnologia em Análise e Desenvolvimento de Sistemas (TADS)  
**Atividade:** P2 — Containerizando um site estático com Docker  
**Autor:** Sthevan Vinicius

## 1. Sobre o projeto

O **DevPortfolio** é um portfólio desenvolvido com **HTML, CSS e JavaScript**, com layout responsivo, apresentação de projetos e elementos interativos.

O objetivo da atividade é **containerizar um site estático com Docker**, usando o **Nginx** para disponibilizar a página no navegador. O site pode ser acessado localmente após a construção da imagem e a inicialização do container.

### Links de acesso

- **Versão pública (Vercel):** https://devportfolio-sthevan.vercel.app/
- **Versão local com Docker:** http://localhost:8081 (disponível quando o container estiver em execução no seu computador).

> **Observação:** a publicação na Vercel é independente da execução via Docker. O endereço da Vercel não utiliza a porta local 8081 e não substitui o vídeo de demonstração do container exigido na atividade.

## 2. Tecnologias utilizadas

- **HTML5:** estrutura e conteúdo da página;
- **CSS3:** aparência, animações e responsividade;
- **JavaScript:** interações da interface;
- **Docker:** empacotamento e execução do site em um container;
- **Nginx Alpine:** servidor web que entrega os arquivos estáticos ao navegador.

## 3. Estrutura do projeto

```text
├── index.html
├── Dockerfile
├── .dockerignore
├── README.md
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    └── imagens/
        ├── developer.svg
        └── favicon.svg
```

O site utiliza arquivos HTML, CSS, JavaScript e imagens, sem precisar de backend ou banco de dados.

## 4. Diferença entre imagem Docker e container

**Imagem Docker:** é um modelo pronto, criado a partir de um `Dockerfile`. A imagem contém os arquivos e as configurações necessários para executar uma aplicação. No projeto, a imagem `devportfolio` contém o Nginx e os arquivos do site.

**Container Docker:** é uma instância de uma imagem em execução. Ao executar `docker run`, o Docker cria e inicia um container usando a imagem construída. Esse container executa o Nginx, permitindo acessar o site pelo navegador.

**Exemplo neste projeto:**

- `docker build -t devportfolio .` **constrói a imagem** `devportfolio`;
- `docker run -d --name devportfolio-container -p 8081:80 devportfolio` **cria e inicia o container** `devportfolio-container`.

**Resumindo:** a **imagem** é o modelo preparado; o **container** é uma instância desse modelo executando. Uma mesma imagem pode dar origem a vários containers.

## 5. Dockerfile e Nginx

O **Dockerfile** define como a imagem é construída. Neste projeto, ele parte da imagem oficial `nginx:alpine`, copia os arquivos do site para a pasta padrão de conteúdo web do Nginx (`/usr/share/nginx/html/`) e documenta a porta interna `80`.

O **Nginx** é o servidor HTTP responsável por entregar os arquivos HTML, CSS, JavaScript e imagens quando o navegador acessa a página.

O mapeamento `-p 8081:80` permite acessar o serviço pela **porta 8081 do computador**, encaminhando as requisições à **porta 80 do container**.

## 6. Como executar com Docker

**Pré-requisito:** Docker Desktop ou Docker Engine instalado e em execução.

No terminal, abra a pasta do projeto (a mesma onde está o `Dockerfile`) e execute:

### Passo 1 — Construir a imagem

```bash
docker build -t devportfolio .
```

### Passo 2 — Criar e iniciar o container

```bash
docker run -d --name devportfolio-container -p 8081:80 devportfolio
```

### Passo 3 — Verificar o container

```bash
docker ps
```

O comando deve listar o `devportfolio-container` caso ele esteja em execução.

### Passo 4 — Acessar o site

Abra **http://localhost:8081** no navegador para visualizar e testar a página.

### Passo 5 — Parar ou iniciar novamente

```bash
docker stop devportfolio-container
docker start devportfolio-container
```

Se alterar os arquivos do site, é necessário reconstruir a imagem e recriar o container para aplicar as alterações.

## 7. Evidência de funcionamento

A atividade também exige **um vídeo curto mostrando o site funcionando por meio do Docker**. Essa evidência deve demonstrar o container em execução e a página aberta no navegador. O vídeo é um item da entrega, separado da documentação do projeto.
