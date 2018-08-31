#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');
const colors = require('colors');
const Marked = require('marked');
let numLine=[];

const [, , ...userCLIArgs] = process.argv;

function readFilePromise(filePath) {
  return new Promise((reject) => {
    fs.readFile(filePath, 'utf-8', (error, data) => {
      if (error) {


        let validatePath=filePath.substr(filePath.length - 3);

        if (validatePath!='.md'){
          console.log('ingrese archivo valido')
          return reject(error);
         
        }
    

        return reject(error);
      }
      markdownLinkExtractor(data,numLine);
      
   
     
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
function markdownLinkExtractor(markdown) {



  let text = fs.readFileSync(userCLIArgs[0]).toString(); // lee todo el archivo
  let lines = text.split('\n');
  console.log(userCLIArgs[0])
  lines.map(element => {
    numLine = (lines.indexOf(element) + 1);
    //console.log(numLine+ '..............' + element);

    
  });

  
  const links = [];

  const renderer = new Marked.Renderer();

  // Taken from https://github.com/markedjs/marked/issues/1279
  const linkWithImageSizeSupport = /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?)\]\(\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?(?:\s+=(?:[\w%]+)?x(?:[\w%]+)?)?)(?:\s+("(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/;

  Marked.InlineLexer.rules.normal.link = linkWithImageSizeSupport;
  Marked.InlineLexer.rules.gfm.link = linkWithImageSizeSupport;
  Marked.InlineLexer.rules.breaks.link = linkWithImageSizeSupport;

  renderer.link = function(href, title, text, line) {
    links.push({
      href,
      text,
      title,
      line:line
    });
  };
  renderer.image = function(href, title, text,line) {
    // Remove image size at the end, e.g. ' =20%x50'
    href = href.replace(/ =\d*%?x\d*%?$/, '');
    links.push({
      href,
      text,
      title,
      line:line
    });
  };
  Marked(markdown, { renderer });

  links.forEach((element) => { // busca dentro del objeto links
    const url = element.href;
    const txt = element.text;
    const line = element.line;

    fetch(url).then(response => response).then((data) => {
      validate = {
        'text': txt,
        'url': url,
        'status': data.statusText + ' ' + data.status,
        'linea': line
      };

      // if (data.status >= 400 && data.status <= 499) {
      //   console.log((colors.red(txt)));
      //   console.log((colors.red(url)));
      //   console.log((colors.red(data.status)));
      //   console.log((colors.red(data.statusText)));
      //   console.log(numberlist);
      // }

      // if (data.status >= 200 && data.status <= 299) {
      //   console.log(txt);
      //   console.log(url);
      //   console.log((colors.green(data.status)));
      //   console.log(data.statusText);
      //   console.log(numberlist);
      // }

      console.log(validate);
    }).catch(() => {
      console.error('error de catch');
    });
  });
}
