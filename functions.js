const fs = require('fs');
const ruta = process.argv[2];
const mdLinkExtractor= require('markdown-link-extractor');


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
  .then( () => {
    const markdown = fs.readFileSync(ruta).toString();
    const links = mdLinkExtractor(markdown)
    links.forEach((link) => {
      console.log(link)
    })
  })
  .catch(err => {
    console.log(err);
  })
}





module.exports.promesa = promesa();
module.exports.readFile = readFile()






