# Servidor web leve para hospedar apenas arquivos estaticos.
FROM nginx:alpine

# A pagina inicial e seus recursos sao servidos pelo Nginx na porta 80.
COPY index.html /usr/share/nginx/html/index.html
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

# Porta interna usada pelo Nginx; mapeamento externo via docker run -p 8080:80.
EXPOSE 80
