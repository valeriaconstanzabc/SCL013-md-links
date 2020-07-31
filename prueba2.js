const fs = require("fs");
const pathNPM = require('path');
const marked = require("marked");
const chalk = require('chalk');

// creamos ruta absoluta
let path = __dirname;
path = pathNPM.resolve(path); //Resuelve la ruta relativa a absoluta
path = pathNPM.normalize(path); //Se desace de elementos extras en la ruta

const readDir = () => {
  return new Promise ((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if(err){
        reject('ERROR', err)
      }
      else {
        files.forEach(file => {
          if(pathNPM.extname(file) === ".md"){
            console.log('Archivos librería', file)

            fs.readFile(file, 'utf-8', (err, data) => {
                if(err){
                  console.log('ERROR', err)
                }
                else {
                  let links = []
                  const renderer = new marked.Renderer()

                  renderer.link = (href, title, text) => {
                    links.push({
                      Link:href,
                      Titulo:text,
                      Ruta:path,
                      //Archivo: file
                    })
                  }
                  marked(data, { renderer : renderer })
                  console.log(links)
                  resolve()
                }
              })
            }
          })

      }
    })
  })
}

// readDir()
const promesa = () => {
  Promise.all([readDir()])
  .then(links => {
    console.log(links)

  })
  .catch(err => {
    console.log(err);
  })
}

module.exports.promesa = promesa();
