const fs = require('fs');
const fetch = require('node-fetch');
const colors = require('colors');
const Marked = require('marked');

// console.log('Process.argv  HOLO HOLO>' + JSON.stringify(process.argv));
// console.log('HELOW HELOW > ' + process.cwd());
// Me va a indicar donde se está ejecutando el archivo

const [, , ...userCLIArgs] = process.argv;
// console.log('QUE ES ESTOOOO > ' + JSON.stringify(userCLIArgs));
// User args > ["HoliHoli","--validate","--stats"]

/*
 * Función que lee un archivo y retorna promesa con su contenido
 */
function readFilePromise(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (error, data) => {
      if (error) {
        return reject(error);// Sabemos que hay un error, así que rechazamos la promesa
        // Si hay error, también nos aseguramos con return de no seguir ejecutando nada más en esta función
      }
      markdownLinkExtractor(data);// agregado x caro
      return resolve(data); // si elimino esta linea no muestra texto de readme
    });
  });
}

readFilePromise(userCLIArgs[0]).then(() => {

  const path = userCLIArgs[0];


  let text = fs.readFileSync(path).toString();
  let lines = text.split('\n');
  let newlinesCount = lines.length - 1;
  console.log(newlinesCount);
  console.log('..................................FUNCION READ PROMISE')
  console.log('LINEA QUINCE......................'+lines[15])

  //console.log('EXPERIMENTO CHAN CHAN CHAN> ' + (data.split('\r\n') + 'OMG')); // \r\n porque uso windows
  // forEach((elemento, index)=>{})
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

  renderer.link = function(href, title, text) {
    links.push({
      href,
      text,
      title,
    });
  };
  renderer.image = function(href, title, text) {
    // Remove image size at the end, e.g. ' =20%x50'
    href = href.replace(/ =\d*%?x\d*%?$/, '');
    links.push({
      href,
      text,
      title,
    });
  };
  Marked(markdown, { renderer });
  validateUrl(links);
  //console.log(links);
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
    }).catch((error) => {
      console.error('ERROR');
    });
  });
}
