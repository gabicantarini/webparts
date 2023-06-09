# webparts

## Environment set up

## SPFX Version Compatibility
### 2019 SPFX onpremises  

#### Install-Module -Name SharePointPnPPowerShell2019 

#### Instalar o Node Version Manager 

### Instalar NodeJs 8.17.0: 
### nvm install 8.17.0 
### nvm install 10.24.1 

### Aplicar a versão do node: 
### nvm use 8.17.0 
### nvm use 10.24.1 

### Instalar pacotes necessários para gerar webparts SPFX: 
### npm install gulp-cli@2.3.0 --global 
### npm install yo@2.0.6 --global 
### npm install @microsoft/generator-sharepoint@1.10.0 --global 

### Aumentar a memória para evitar o erro Javascript heap out of memory 
### Executar na linha de comandos como ADMIN 
### setx NODE_OPTIONS "--max_old_space_size=4096" /M 

## fix yo generator

## debug em páginas:  ?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js

## Webparts Config

Para fazer debug acrescentar a query string à página 
 
?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js 
 

Na pasta WebParts criar uma nova diretoria com o nome da WebPart e aceder à mesma: 
 
mkdir Article 
cd Article 
 

Correr o Yeoman Generator: 
 
yo @microsoft/sharepoint --skip-install 
 
IMPORTANTE: Depois de gerar a webpart, fazer undo ao package.json.  
Fazer commit com a webpart vazia e só depois instalar os pacotes necessários 
 

Para usarmos as últimas versões do PNPJS e de outros componentes devemos seguir estes passos: 

Instalar a versão 17.0.2 do React: 
 
npm install react@17.0.2 react-dom@17.0.2 --save 
 

Instalar a versão 17 dos types de React: 
 
npm install @types/react@17.0.48 @types/react-dom@17.0.17 --save-dev 
 

Instalar a versão 4.4.4 do Typescript 
 
npm install typescript@4.4.4 --save-dev 
 

Instalar a versão 2.14.0 do PNPJS: 
 
npm install @pnp/sp@2.14.0 --save