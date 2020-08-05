const fs = require('fs');
const pathNPM = require('path');
const marked = require('marked');
const fetch = require('node-fetch');
const chalk = require('chalk');
const emoji = require('node-emoji')

//<-------------------CREAMOS RUTA ABSOLUTA------------------->
let path = process.argv[2];
path = pathNPM.resolve(path);
path = pathNPM.normalize(path);


//<----------FUNCIÓN QUE FILTRA LINKS HTTP----------------------->
const filterLinks = (links) => {

  let arrayFilterLinks = [];
	links.map((element) => {
		let prefix = element.Link.substring(0, 4);
		if (prefix == 'http') {
			arrayFilterLinks.push(element);
		}
  })
  return arrayFilterLinks;

};


//<----------FUNCIÓN QUE LEE ARCHIVOS .MD------------------------->
const readFiles = (err) => {

  return new Promise ((resolve, reject) => {

    if(err){
      reject('ERROR - No se puede leer el directorio', err)
    }
    else {
      console.log(
        chalk.blue.bold('\n','---------------------------------------------------------------------------------------'),
        chalk.white.italic('\n',(emoji.get('open_file_folder')),'Archivo leído: ', path, '\n'),
        chalk.blue.bold('---------------------------------------------------------------------------------------'),
        chalk.cyan('\n','Links validos:', (emoji.get('innocent'))),
        chalk.blue.bold('|'),
        chalk.magenta('Links dañados:', (emoji.get('imp'))),
        chalk.blue.bold('|'),
        chalk.magenta('Links sin conexión:', (emoji.get('alien')), '\n'),
        chalk.blue.bold('---------------------------------------------------------------------------------------')
      )
      fs.readFile(path, 'utf-8', (err, data) => {

        if(err){
          reject('ERROR - No se puede leer el archivo', err)
        }
        else {
          let links = []
          const renderer = new marked.Renderer()
          renderer.link = (href, title, text) => {
            links.push({
            Link:href,
            Titulo:text,
            Ruta:path,
            })
          }
          marked(data, { renderer : renderer })
          let resultLinks = filterLinks(links);

          let argv2 = process.argv[3]
          let argv3 = process.argv[4]
          if (argv2 == '-v' && argv3 == '-s' || argv2 == '-s' && argv3 == '-v') {
            linksStats(links)
            linksBroken(links)
            return;
          } else if (argv2 == '--stats' || argv2 == '-s' ) {
            linksStats(links)
            return;
          } else if (argv2 == '--validate' || argv2 == '-v') {
            linksValidate(resultLinks)
            return;
          } else if (path) {
            linksDefault(resultLinks)
          }
        }
      })
    }
  })
  .then((resultLinks) => {
    return linksDefault(resultLinks)
  })
  .catch((err) => {
    console.log(err)
  })
}

//<----------FUNCION QUE IMPRIME LINKS----------------------->
const linksDefault = (resultLinks) => {

  console.log(' ')
  resultLinks.map((elem) => {
    console.log(
      chalk.yellow(emoji.get('arrow_right')),
      chalk.black.bgBlue(' ',elem.Titulo.substring(0,50),' ','\n'),
      chalk.blue.bold('  ['),
      chalk.blue(elem.Link.substring(0,50)),
      chalk.blue.bold(']')
    )
  })
  console.log('  ')
  return;

};


//<----------FUNCIÓN QUE VALIDA LINKS----------------------->
const linksValidate = (resultLinks) => {

  console.log(' ')
  resultLinks.map((elem) => {
    fetch(elem.Link)
      .then(res => {
        if(res.status == 200) {
          console.log(
            chalk.blue((emoji.get('arrow_right'))),
            ((emoji.get('innocent'))),
            chalk.black.bgBlue('  ',elem.Titulo.substring(0,50),'  ', '\n'),
            chalk.blue.bold('['),
            chalk.blue(elem.Link.substring(0,50)),
            chalk.blue.bold(']')
          )
        }
        else {
          console.log(
            chalk.magenta((emoji.get('arrow_right'))),
            ((emoji.get('imp'))),
            chalk.black.bgMagenta('  ',elem.Titulo.substring(0,50),'  ', '\n'),
            chalk.magenta.bold('['),
            //chalk.magenta(elem.Link.substring(0,50)),
            chalk.magenta.x(elem.Link.substring(0,50)), //LINKS SIN CONEXIÓN
            chalk.magenta.bold(']'),
          )
        }
      })
      .catch(() => {
        console.log(
          chalk.magenta((emoji.get('arrow_right'))),
          ((emoji.get('alien'))),
          chalk.black.bgMagenta('  ',elem.Titulo.substring(0,50),'  ', '\n'),
          chalk.magenta.bold('['),
          chalk.magenta(elem.Link.substring(0,50)),
          chalk.magenta.bold(']'),
        )
      })
  })
  return;

};


//<----------FUNCION QUE IMPRIME STATS----------------------->
const linksStats = (links) => {

  let totalLinks = [];
  links.forEach(elem => {
    totalLinks.push(elem.Link);
  });
  let uniqueLinks = new Set(totalLinks);
  console.log(
    chalk.blue('\n',(emoji.get('arrow_right'))),
    chalk.black.bgBlue(' Links totales: '),
    chalk.blue.bold(totalLinks.length, '\n'),
    chalk.cyan((emoji.get('arrow_right'))),
    chalk.black.bgCyan(' Links únicos:  '),
    chalk.cyan.bold(uniqueLinks.size),'\n'

  );
}


//<----------FUNCION QUE IMPRIME TOTAL LINKS DAÑADOS---------->
const linksBroken = (resultLinks) => {
  let brokenLinks = [];
  return new Promise((resolve, reject) => {
  resultLinks.map((elem) => {
    brokenLinks.push(fetch(elem.Link)
    .then(res => {
      return {
        statusLinks: res.status
      }
    })
    .catch((err) => {
      reject(err)
    }));
  })
  resolve (Promise.all(brokenLinks))
  })
  .then((res) => {
   console.log(
    '\n',
    chalk.yellow((emoji.get('arrow_right'))),
    chalk.black.bgYellow('  Links dañados: '),
    chalk.yellow.bold(res.filter(link => link.statusLinks !=200 ).length),
    chalk.yellow((emoji.get('weary')), '\n'),
    );
  })
}


//<----------------EXPORTAMOS MÓDULO PROMESA------------------>
module.exports = readFiles();

