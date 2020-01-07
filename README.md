# CONTACTS ZAM WEB APP 


This project was created with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.20.

# Developer tips

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build
Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Environment management 

The environment configuration files are located under the src/environment 

*Warning*
Since there is an issue for the index.html file configuration using angular cli [Ref here](https://github.com/angular/angular-cli/issues/10881), you should copy manually the src/environments/index.ENV.html into src/index.html before the `npm run build` step. 


## Running unit tests
 
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).## Switch to another file

# Excel to JSON file 


## Convert  

To convert Data file into readable Json Files, please follow the steps below : 
Use  [beautifytools.com](http://beautifytools.com/excel-to-json-converter.php). upload the xls file into the tool, a json text will be generated, download the json. 

## Clean 
Open the json file in your code editor remove the geoloc attribute and it's value, and keep only a json table with the data without any other keys.

Replace all `\r\n` with `\n` (if exists). 

## Put the Json files in the right place  

All the json file must be placed in the assets/data/XXX.json. 
Please do not change the name of the files crc_com.json, crc_sin.json, pap.json, sgd.json, support.json. 


