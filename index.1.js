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
        return reject(error);
      }  
      markdownLinkExtractor(data);
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
function markdownLinkExtractor(markdown, numLine) {
  const renderer = new Marked.Renderer();

  // Taken from https://github.com/markedjs/marked/issues/1279
  const linkWithImageSizeSupport = /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?)\]\(\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?(?:\s+=(?:[\w%]+)?x(?:[\w%]+)?)?)(?:\s+("(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/;

  Marked.InlineLexer.rules.normal.link = linkWithImageSizeSupport;
  Marked.InlineLexer.rules.gfm.link = linkWithImageSizeSupport;
  Marked.InlineLexer.rules.breaks.link = linkWithImageSizeSupport;

  renderer.link = function(href, title, text, numLine) {
    links.push({
      href,
      text,
      title,
      numLine
    });
  };
  renderer.image = function(href, title, text, numLine) {
    // Remove image size at the end, e.g. ' =20%x50'
    href = href.replace(/ =\d*%?x\d*%?$/, '');
    links.push({
      href,
      text,
      title,
      numLine,
    
    });

    if (links === []) {
      console.log(links + 'El archivo no contiene hipervinculos');
    }
  
  };
  Marked(markdown, { renderer });

  // FUNCIÓN QUE LEE LINEAS
  let text = fs.readFileSync(userCLIArgs[0]).toString(); // lee todo el archivo
  let lines = text.split('\n');
  // console.log(lines);

  let lineline = lines.forEach((element, index)=> {
    numLine = index + 1;    
    // console.log(numLine + '...' + element);
  }) ;

  // fin FUNCIÓN QUE LEE LINEAS{}

  links.forEach((element, lineline) => { // busca dentro del objeto links
    const url = element.href;
    const txt = element.text;
    const line = lineline;
    fetch(url).then(response => response).then((data) => {
      validate = {
        'Status': data.status + ' ' + data.statusText + ' // Linea: ' + line + ': [' + txt + ']~ ' + url,
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
}
