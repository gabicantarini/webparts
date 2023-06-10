## SPFX Version Setup Compatibility
2019 SPFX onpremises  

#### Install-Module -Name SharePointPnPPowerShell2019 
 
### NodeJs Version Manager 

* Instalar NodeJs 8.17.0: 
```nvm install 8.17.0 
nvm install 10.24.1 
```
* NodeJs version 8.17.0: 
```nvm install 8.17.0 
nvm install 10.24.1 
```

* Node version: 
```nvm use 8.17.0 
nvm use 10.24.1 
```


### Install webparts SPFX packages: 
```npm install gulp-cli@2.3.0 --global 
npm install yo@2.0.6 --global 
npm install @microsoft/generator-sharepoint@1.10.0 --global 
```

* Upgrade memory to avoid ERROR: Javascript heap out of memory 
* Execute command line as ADMIN 
```setx NODE_OPTIONS "--max_old_space_size=4096" /M```


```pages debug:  ?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js```


### Build yo inside the WebParts folder: 

IMPORTANT: build webpart, undo package.json.  
Commit empty webpart and install needed packages. 


## Setup to use PNPJS last version and other components: 


* React version: 
```npm install react@17.0.2 react-dom@17.0.2 --save```  

* Install version 17 for React types:  
```
npm install @types/react@17.0.48 @types/react-dom@17.0.17 --save-dev 
``` 

* Instalar a versão 4.4.4 do Typescript:
```
npm install typescript@4.4.4 --save-dev 
```
* Install Typescript version 4.4.4:
```  
npm install typescript@4.4.4 --save-dev 
``` 
* Instalar a versão 2.14.0 do PNPJS:
```
npm install @pnp/sp@2.14.0 --save
```
* Install PNPJS version 2.14.0:
```  
npm install @pnp/sp@2.14.0 --save
```

Yeoman Generator: 

```yo @microsoft/sharepoint --skip-install ```