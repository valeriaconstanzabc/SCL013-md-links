const fs = require("fs");
const pathNPM = require('path');
const marked = require("marked");
const fetch = require('node-fetch');
const chalk = require('chalk');
const emoji = require('node-emoji')

//<-------------------CREAMOS RUTA ABSOLUTA------------------->
let path = __dirname;
path = pathNPM.resolve(path); //Resuelve la ruta relativa a absoluta
path = pathNPM.normalize(path); //Se deshace de elementos extras en la ruta




//<-------FUNCIÓN QUE LEE DIRECTORIO-------------------------->
const readDir = () => {

  return new Promise ((resolve, reject) => {

    //con readdir, propiedad de fs, leemos todos los archivos que tenemos en el directorio
    fs.readdir(path, (err, files) => {
      if(err){
        reject('ERROR - No se puede leer el directorio', err)
      }
      else {
        console.log('---------------------------------------------------------------------------------------')
        files.map(file => {

          //con extname, propiedad de path hacemos una comparación con el archivo .md
          if(pathNPM.extname(file) === ".md"){
            console.log((emoji.get('exclamation')),'Archivo leído: ', file)
            console.log('---------------------------------------------------------------------------------------')

            readFiles(err, file)
            .then((file) => {
              console.log(file)
              return;
            })
            .catch(err => {
              console.log(err);
            })

          }

        })
      }
    })
  })
}



//<----------FUNCIÓN QUE FILTRA LINKS HTTP----------------------->
const filterLinks = (links) => {
  //Creamos nuevo array vacio
  let arrayFilterLinks = [];

  //recorremos los "links"
	links.map((element) => {

    //Creamos una variable en donde entramos a nuestra propiedad Link, con
    //substring nos devuelve una parte de la cadena que comparamos con http
		let prefix = element.Link.substring(0, 4);
		if (prefix == 'http') {
			arrayFilterLinks.push(element);
		}
  })

	return arrayFilterLinks;
};



//<----------FUNCIÓN QUE LEE ARCHIVOS .MD------------------------->
const readFiles = (err, file, options) => {

  return new Promise ((resolve, reject) => {

    if(err){
      reject('ERROR - No se puede leer el directorio', err)
    }
    else {
      //con readFile, propiedad de fs, leemos los archivos que nos arrojó el directorio
      fs.readFile(file, 'utf-8', (err, data) => {

        if(err){
          reject('ERROR - No se puede leer el archivo', err)
        }
        else {
          //Creamos un array vacio para luego guardar info
          let links = []

          //Creamos una constante para accesder a la libreria Marked
          //crea nuevas instancias(links)
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

          linksDefault(resultLinks, file)
          linksValidate(resultLinks, file)
          linksStats(links)
          linksBroken(links)

        }
      })
    }
  })
}

//<----------FUNCION QUE IMPRIME LINKS----------------------->
const linksDefault = (resultLinks, file) => {
  resultLinks.map((elem) => {
    console.log(
      chalk.green('>>>'),
      chalk.cyan(elem.Link.substring(0,50)),
      chalk.green(`${'['}${file}${']'}`)
    )
  })
	return;
};


//<----------FUNCIÓN QUE VALIDA LINKS----------------------->
const linksValidate = (resultLinks, file) => {
  resultLinks.map((elem) => {
    fetch(elem.Link)
      .then(res => {
        if(res.status == 200) {
          console.log(
            chalk.green((emoji.get('heavy_check_mark')), ' '),
            chalk.cyan(elem.Link.substring(0,50)),
            chalk.green(`${'['}${file}${']'}`),
            chalk.black.bgGreen(` ${res.status} ${res.statusText} `)
          )
        }
        else {
          console.log(
            chalk.red((emoji.get('x')), ''),
            chalk.red(elem.Link.substring(0,50)),
            chalk.black.red(`${'['}${file}${']'}`),
            chalk.black.bgRed(` ${res.status} ${res.statusText} `)
          )
        }
      })
      .catch((err) => {
        console.log(
          chalk.gray((emoji.get('no_entry')), ' '),
          chalk.cyan(elem.Link.substring(0,50)),
          chalk.redBright(`${'['}${file}${']'}`),
          chalk.black.bgRed(` ${err.type} ${err.code} `)
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
    "\n",
    chalk.black.bgBlue("Links totales: "),
    chalk.blue(totalLinks.length),
    "\n",
    chalk.black.bgCyan("Links únicos: "),
    chalk.cyan(uniqueLinks.size)
  );
}



//<----------FUNCION QUE IMPRIME TOTAL LINKS DAÑADOS---------->
const linksBroken = (links) => {
  let brokenLinks = 0;

  for(let i = 0; i < links.length; i++) {
    if (links[i].status != 200 ) {
      brokenLinks++
    }
  }


  console.log(
    "\n",
    chalk.black.bgMagenta("Links dañados: "),
    chalk.magenta(brokenLinks)
  );
}

//<----------------EXPORTAMOS MÓDULO PROMESA------------------>
module.exports.readDir = readDir();
