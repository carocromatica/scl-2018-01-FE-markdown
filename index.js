#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');
const colors = require('colors');
const Marked = require('marked');
let numLine;

const [, , ...userCLIArgs] = process.argv;

function readFilePromise(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (error, data) => {
      if (error) {
        return reject(error);
      }
      markdownLinkExtractor(data);
      return resolve(data);  
    });
  });
}
readFilePromise(userCLIArgs[0]).then(() => {
  let text = fs.readFileSync(userCLIArgs[0]).toString(); // lee todo el archivo
  let lines = text.split('\n');

  lines.map(element => {
    numLine = (lines.indexOf(element) + 1);
    console.log(numLine + '..............' + element);
  });
}).catch((error) => {
  console.error('Error > ' + error);
});


// Función necesaria para extraer los links usando marked
// (tomada desde biblioteca del mismo nombre y modificada para el ejercicio)
// Recibe texto en markdown y retorna sus links en un arreglo
function markdownLinkExtractor(markdown) {
  const links = [];

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
  };
  Marked(markdown, { renderer });
  validateUrl(links);
  console.log(links);
}

function validateUrl(links) {
  links.forEach((element) => { // busca dentro del objeto links
    const url = element.href;

    fetch(url).then(response => response).then((data) => {
      if (data.status >= 400 && data.status <= 499) {
        console.log((colors.red(url)));
        console.log((colors.red(data.status)));
        console.log((colors.red(data.statusText)));
      }

      if (data.status >= 200 && data.status <= 299) {
        console.log(url);
        console.log((colors.green(data.status)));
        console.log(data.statusText);
      }
    }).catch(() => {
      console.error('ERROR');
    });
  });
}