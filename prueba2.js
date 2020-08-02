const fs = require("fs");
const pathNPM = require('path');
const marked = require("marked");
const fetch = require('node-fetch');
const chalk = require('chalk');
const emoji = require('node-emoji')

//<-------------------CREAMOS RUTA ABSOLUTA-------......------>
let path = __dirname;
path = pathNPM.resolve(path); //Resuelve la ruta relativa a absoluta
path = pathNPM.normalize(path); //Se desace de elementos extras en la ruta


//<----------FUNCIÓN QUE FILTRA SOLO ARCHIVOS HTML------------>
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


//<-------FUNCIÓN QUE LEE DIRECTORIO, ARCHIVO Y VERIFICA------>
const readDir = () => {

  return new Promise ((resolve, reject) => {
    //------leyendo directorio------------------------------->
    fs.readdir(path, (err, files) => {

      if(err){
        reject('ERROR - No se puede leer el directorio', err)
      }
      else {
        console.log('--------------------------------------------------------------')
        files.map(file => {
          if(pathNPM.extname(file) === ".md"){
            console.log((emoji.get('exclamation')),'Archivo leído: ', file)
            console.log('--------------------------------------------------------------')

            //-----leyendo archivos del directorio leído------>
            fs.readFile(file, 'utf-8', (err, data) => {

              if(err){
                console.log('ERROR - No se puede leer el archivo', err)
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

                resultLinks.map((elem) => {
                  fetch(elem.Link)
                    .then(res => {
                      if(res.status == 200) {
                        console.log(
                          chalk.green((emoji.get('heavy_check_mark')), ' '),
                          chalk.cyan(elem.Link),
                          chalk.green(`${'['}${file}${']'}`),
                          chalk.black.bgGreen(` ${'Link bueno buenito'} `)
                        )
                      }
                      else {
                        console.log(
                          chalk.red((emoji.get('x')), ''),
                          chalk.red(elem.Link),
                          chalk.black.red(`${'['}${file}${']'}`),
                          chalk.black.bgRed(` ${'ERROR 404 - link dañado'} `)
                        )
                      }
                    })
                    .catch((err) => {
                      console.log(
                        chalk.gray((emoji.get('no_entry')), ' '),
                        chalk.cyan(elem.Link),
                        chalk.redBright(`${'['}${file}${']'}`),
                        chalk.black.bgRed(` ${'Error de conexión. Vuelve a intentarlo más tarde '} `)
                      )
                    })
                })
              }
            })
          }
        })
      }
    })
  })
}

//<----------------EXPORTAMOS MÓDULO PROMESA------------------>
module.exports.readDir = readDir();
