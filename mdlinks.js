#!/usr/bin/env node
const fs = require('fs');
const fetch = require('node-fetch');
const colors = require('colors');
const Marked = require('marked');
let validate = {};
const links = [];

const [, , ...userCLIArgs] = process.argv;

function readFilePromise(filePath) {
  return new Promise((reject) => {
    fs.readFile(filePath, 'utf-8', (error, data) => {
      if (error) {
        let validatePath = filePath.substr(filePath.length - 3);
        if (validatePath !== '.md') {
          console.log('ingrese archivo valido');
          return reject(error);
        }

        if (filePath === '') { 
          console.log('ruta vacia');
          return reject(error);
        }
        return reject(error);
      }  
  
    });
  });
}

readFilePromise(userCLIArgs[0]).then(() => {

}).catch((error) => {
  console.error('Error > ' + error);
});


// Función necesaria para extraer los links usando marked
// (tomada desde biblioteca del mismo nombre y modificada para el ejercicio)
// Recibe texto en markdown y retorna sus links en un arreglo






  // --------------------------- FUNCIÓN QUE LEE LINEAS
  let text = fs.readFileSync(userCLIArgs[0]).toString(); // lee todo el archivo
  let lines = text.split('\n');
  let n = 0; 

  let arrayfinal=[];

  lines.map((element, index)=> {
    numLine = index;    
    let newline = index + '' + element;
    //console.log(newline);
    
    if (newline.search('https://' || 'http://')) {
      n = newline.search('https://' || 'http://');
    }
    if (n !== -1) {
      finalnumline = numLine + 1;
       let rescate=finalnumline + '  ' + element.slice(0,- 2);
       arrayfinal.push(rescate)
    }
  }) ;

  console.log(arrayfinal)

//console.log(links)

  //  ------------------------ fin FUNCIÓN QUE LEE LINEAS{}


  links.forEach((element) => { // busca dentro del objeto links
    const url = element.href;
    const txt = element.text;
    const linea = finalnumline;
    
    
    fetch(url).then(response => response).then((data) => {
      validate = {
        'Status': data.status + ' ' + data.statusText + ' // Linea: ' + linea + ': [' + txt + ']~ ' + url,
      };

      if (data.status >= 200 && data.status <= 399) {
        console.log(colors.green(validate));
      }

      if (data.status >= 400 && data.status <= 499) {
        console.log(colors.red(validate));
      }
    }).catch(() => {
      console.error('error de catch');
    });
  });

