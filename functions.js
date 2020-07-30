const fs = require('fs');
const path = require('path')
const mdLinkExtractor= require('markdown-link-extractor');
const chalk = require('chalk');


// creamos ruta absoluta
let ruta = process.argv[2];
ruta = path.resolve(ruta); //Resuelve la ruta relativa a absoluta
ruta = path.normalize(ruta); //Se desace de elementos extras en la ruta


// función (con promesa) busca archivos en el directorio
const readFile = (err, data) => {
  return new Promise ((resolve, reject) => {
      if(err){
        reject(err)
      } else{
        resolve(data)
      }
  })
}

const promesa = () => {
  Promise.all([readFile()])
  .then(() => {
    console.log(chalk.blue.bold('Absolute path:', ruta));

    const markdown = fs.readFileSync(ruta).toString();
    const links = mdLinkExtractor(markdown)

    links.forEach(file => {
      if(file.includes('http')){
        console.log(file)
      }
    })

    // for (let i = 0; i < links.length; i++) {
    //   resolve(links)
    // }
  })
  .catch(err => {
    console.log(err);
  })
}





module.exports.promesa = promesa();
module.exports.readFile = readFile()






