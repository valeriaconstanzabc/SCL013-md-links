const fs = require("fs");
const pathNPM = require('path');
const marked = require("marked");
const fetch = require('node-fetch');
const chalk = require('chalk');

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
    fs.readdir(path, (err, files) => {

      if(err){
        reject('ERROR', err)
      }
      else {
        files.map(file => {
          if(pathNPM.extname(file) === ".md"){
            console.log('Archivo leído: ', file)

            fs.readFile(file, 'utf-8', (err, data) => {

                if(err){
                  console.log('ERROR', err)
                }
                else {
                  if(data.includes('http')){
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

                    resultLinks.map((element) => {
                      fetch(element.Link)
                        .then(res => {
                          if(res.status == 200) {
                            console.log(
                              chalk.green('[✔]'),
                              chalk.cyan(element.Link),
                              chalk.bgGray(` ${res.status} ${res.statusText} `))
                          }
                          else {
                            console.log(
                              chalk.red('[X]'),
                              chalk.cyan(element.Link),
                              chalk.bgRed(` ${res.status} ${res.statusText} `))
                          }
                        })
                        .catch((err) => {
                          console.log(
                            chalk.gray('[-]'),
                            chalk.cyan(element.Link),
                            chalk.bgRed(` ${err.type} ${err.code} `))
                        })
                    })
                  }
                }
            })
          }
        })
      }
    })
  })
}


//<----------------FUNCIÓN QUE CONSUME PROMESA---------------->
const promise = (err, data) => {
  Promise.all([readDir()])
  .then(()=> {
    console.log(data)
  })
  .catch(() => {
    console.log(err);
  })
}


//<----------------EXPORTAMOS MÓDULO PROMESA------------------>
module.exports.promise = promise();
