# DevPortfolio — Site estático com Docker e Nginx

**Disciplina:** Programação de Sistemas Distribuídos  
**Curso:** Tecnologia em Análise e Desenvolvimento de Sistemas (TADS)  
**Atividade:** P2 — Containerizando um site estático com Docker  
**Autor:** Sthevan Vinicius

## Sobre o projeto

O **DevPortfolio** é um site de portfólio desenvolvido com HTML, CSS e JavaScript. A página apresenta informações pessoais, tecnologias, projetos e contato, com layout responsivo e elementos interativos.

Nesta atividade, o site é disponibilizado por um servidor **Nginx** executado dentro de um **container Docker**. Por ser um site estático, não precisa de backend nem de banco de dados.

## Tecnologias utilizadas

- **HTML5:** estrutura da página;
- **CSS3:** estilização e responsividade;
- **JavaScript:** interações e funcionalidades da interface;
- **Docker:** criação da imagem e execução do container;
- **Nginx Alpine:** servidor web responsável por disponibilizar os arquivos estáticos.

## Estrutura do projeto

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

O `Dockerfile` utiliza a imagem `nginx:alpine` e copia o HTML, o CSS, o JavaScript e as imagens para a pasta `/usr/share/nginx/html/`, utilizada pelo Nginx para servir o site.

## Como executar com Docker

**Pré-requisito:** ter o Docker Desktop ou Docker Engine instalado e em execução.

Abra o terminal na pasta do projeto, onde está o `Dockerfile`, e siga os passos:

### 1. Construir a imagem

```bash
docker build -t devportfolio .
```

### 2. Iniciar o container

```bash
docker run -d --name devportfolio-container -p 8080:80 devportfolio
```

A porta **8080** do computador será direcionada à porta **80** do Nginx no container.

### 3. Acessar o site

Abra no navegador:

**http://localhost:8080**

Para confirmar que o container está em execução:

```bash
docker ps
```

### 4. Parar ou iniciar novamente

Para parar o container:

```bash
docker stop devportfolio-container
```

Para iniciar novamente o mesmo container:

```bash
docker start devportfolio-container
```

Se alterar os arquivos do site, reconstrua a imagem e recrie o container para aplicar as mudanças.
