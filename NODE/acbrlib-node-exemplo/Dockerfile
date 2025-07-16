# Imagem base oficial do Node.
# Para outras versões do Node consultar as imagens disponiveis em https://hub.docker.com/_/node
FROM node:22-bookworm

# Projeto ACBr
LABEL maintainer="ti@projetoacbr.com.br" \
      version="1.0" \
      description="Imagem Node, com requisitos básicos para rodar os Demos da ACBrLib"

# Use development node environment
ENV NODE_ENV development

# Diretorio de Trabalho.
WORKDIR /opt/acbrlib-nodejs

# Atualizando e Instalando dependencias.
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        openssl \
        libxml2 \
        gcc \
        make \
        python3 \
        subversion \
        wget \
        #<nome_do_pacote_extra> \
     && \
     apt-get clean && \
     rm -rf /var/lib/apt/lists/*
    
    

# Editando Arquivo de Configuração do OpenSSL, para habilitar  modo Default e Legacy.
COPY openssl-legacy.cnf /etc/ssl/
ENV OPENSSL_CONF=/etc/ssl/openssl-legacy.cnf
RUN openssl list -providers


##################################################################################
###               Baixando ACBrLib DEMO para dentro do container               ###
### 1 - Para usar a versão PRO,                                                ### 
### 2 - Comente as linhas abaixo                                               ###
### 2 - Leia as intruções no próximo Bloco                                     ###  
##################################################################################
RUN wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrboleto64.so && \
    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrcep64.so && \
    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrconsultacnpj64.so && \
    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrgtin64.so && \
    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrmdfe64.so && \
    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrnfe64.so && \
    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrnfse64.so

####################################################################################
###               Copiando ACBrLib PRO para dentro do container                  ###
###                                                                              ###
### 1 - Baixe as Bibliotecas PRO do Fórum do ACBr                                ###
###     https://www.projetoacbr.com.br/forum/files/category/36-acbrlib-pro/      ### 
### 2 - No Arquivo baixado, localize a Biblioteca na Pasta:                      ###
###     Linux, CONSOLE-MT                                                        ###          
### 3 - Copie as Biblioteca Pro, no diretorio 'libs/' e descomente o COPY        ###
### 4 - O comando abaixo, cuidará de copiar as novas Libs, no Conteiner          ###
####################################################################################

#COPY libs/*.so /usr/lib/


    
# Criando Links simbolicos das bibliotecas ".SO" necessarias, e com os nomes conforme esperado pelos Fontes do ACBr
RUN ln -s /usr/lib/x86_64-linux-gnu/libxml2.so.2  /usr/lib/libxml2.so && \
    ln -s /usr/lib/x86_64-linux-gnu/libxml2.so.2 /usr/local/lib/libxml2.so && \
    ldconfig

# Copiando.
COPY  . .

# Configurando.
RUN mkdir /opt/acbrlib-nodejs/pdf && \
    npm install -g typescript yalc && \
    mkdir /opt/acbrlib-nodejs/log && \
    cd /opt/acbrlib-nodejs/acbrlib-nodejs/acbrlib-node-comum && \
    npm i && \
    npm run build && \
    yalc publish && \
    cd /opt/acbrlib-nodejs/acbrlib-nodejs/acbrlibnfe-node && \
    npm i && \
    yalc add acbrlib-comum && \
    npm run build && \
    yalc publish && \
    cd /opt/acbrlib-nodejs/acbrlib-nodejs/acbrlibmdfe-node && \
    npm i && \
    yalc add acbrlib-comum && \
    npm run build && \
    yalc publish && \
    cd /opt/acbrlib-nodejs/acbrlib-nodejs/acbrlibcep-node && \
    npm i && \
    yalc add acbrlib-comum && \
    npm run build && \
    yalc publish && \
    cd /opt/acbrlib-nodejs && \
    yalc add acbrlib-comum && \
    yalc add acbrlibnfe-node && \
    yalc add acbrlibmdfe-node && \
    yalc add acbrlibcep-node && \
    npm i

# Expondo a porta 3333
EXPOSE 3333

# Entrypoint
CMD ["npm","run","dev"] 