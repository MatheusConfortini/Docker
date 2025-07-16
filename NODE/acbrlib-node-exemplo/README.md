# Sobre o Docker ACBr Nodejs

O Docker ACBr Nodejs é uma solução que encapsula o uso da biblioteca ACBr em um ambiente Docker, permitindo que aplicações Node.js utilizem os recursos do ACBr de forma simplificada e padronizada. Ele facilita a integração com sistemas fiscais e outros serviços suportados pelo ACBr, eliminando a necessidade de configurações complexas no ambiente local.

# Executando o Projeto na Porta 3333

```bash
    docker run -p 3333:3333 --name acbr_node projetoacbr/acbrlib_node:latest
```

## API de CEP

Acesse http://localhost:3333/cep/info

### Rota: GET /cep/info
- **Descrição**: Mostra informações gerais sobre a biblioteca ACBrLibCEP.
- **Resposta**: Retorna versão da acbrlib

### Rota: GET /cep/:cep
- **Descrição**: Busca informações de um CEP específico.
- **Parâmetros**:
    - **cep** (string): O CEP a ser consultado.
- **Resposta**: Retorna dados como endereço, cidade e estado relacionados ao CEP.




# Transformar o Docker em **ACBr PRO** 
1. Link com informações da ACBr PRO [./libs/README.md](./libs/README.md#versão)
2. Copie as bibliotecas ACBrLib PRO [./libs](./libs)
3. Comente as linhas   [Dockerfile](./Dockerfile)

```dockerfile
RUN wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrboleto64.so && \
    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrcep64.so && \
    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrconsultacnpj64.so && \
    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrgtin64.so && \
    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrmdfe64.so && \
    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrnfe64.so && \
    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrnfse64.so

```
para

```dockerfile
#RUN wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrboleto64.so && \
#    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrcep64.so && \
#    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrconsultacnpj64.so && \
#    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrgtin64.so && \
#    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrmdfe64.so && \
#    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrnfe64.so && \
#    wget -P /usr/lib/ https://github.com/Projeto-ACBr-Oficial/Docker/raw/refs/heads/main/libs/libacbrnfse64.so

```

Descomente

```dockerfile
#COPY libs/pro/*.so /usr/lib/
```

# Customizando o Docker para rodar sua aplicação
1. Comente as linhas 

```dockerfile
# Configurando.
RUN mkdir /opt/acbrlib-nodejs/pdf && \
    npm install -g typescript yalc && \
    mkdir mkdir /opt/acbrlib-nodejs/log && \
    cd /opt/acbrlib-nodejs/acbrlib-nodejs/acbrlib-node-comum && \
    npm i && \
    npm run build && \
    yalc publish && \
    cd /opt/acbrlib-nodejs/acbrlib-nodejs/acbrlibnfe-node && \
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
    yalc add acbrlibcep-node && \
    npm i

# Expondo a porta 3333
EXPOSE 3333

# Entrypoint
CMD ["npm","run","dev"] 
```
2.  Adicione as linhas de sua aplicação.
