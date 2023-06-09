# webparts

This is the WebPart documentation.

## Environment set up

SPFX Version Compatibility
2019 SPFX onpremises  

Install-Module -Name SharePointPnPPowerShell2019 

### Node Version Manager 

```NodeJs version 8.17.0:
nvm install 8.17.0
nvm install 10.24.1
```
```Node version: 
nvm use 8.17.0
nvm use 10.24.1 
```

### Installwebparts SPFX packages:
```npm install gulp-cli@2.3.0 --global
npm install yo@2.0.6 --global
npm install @microsoft/generator-sharepoint@1.10.0 --global 
```

* Upgrade memory to avoid error: Javascript heap out of memory 
Execute command line as ADMIN  
setx NODE_OPTIONS "--max_old_space_size=4096" /M 



## Webparts Config
 
```pages debug:  ?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js```

### Build yo inside the WebParts folder: 

```Yeoman Generator:  yo @microsoft/sharepoint --skip-install ```
 
* IMPORTANT: build webpart, undo package.json.  
* Commit empty webpart and install needed packages. 

### Setup to use PNPJS last version and other components: 

#### React version: 
 
```npm install react@17.0.2 react-dom@17.0.2 --save ``` 

* Install version 17 for React types:
```
npm install @types/react@17.0.48 @types/react-dom@17.0.17 --save-dev
```
* Install Typescript version 4.4.4:  
```
npm install typescript@4.4.4 --save-dev
```  
* Install PNPJS version 2.14.0: 
``` 
npm install @pnp/sp@2.14.0 --save
```

### Build options

gulp clean - TODO\
gulp test - TODO\
gulp serve - TODO\
gulp bundle - TODO\
gulp package-solution - TODO