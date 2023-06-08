# webparts

## 2019 SPFX onpremises - Environment set up

## SPFX Version Compatibility 

### Install-Module -Name SharePointPnPPowerShell2019 

### Instalar o Node Version Manager 

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