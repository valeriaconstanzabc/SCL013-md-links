const fs = require('fs')
// const Marked = require ("Marked");


const readDir = () => {
  const ruta = __dirname;

  return new Promise ((resolve, reject) => {
    fs.readdir(ruta, (err, files) => {
      if(err){
        reject(err)
      }
      else{
        resolve(files)
      }
    })
  })

}

const consumiendoPromesaReadDir = () => {
  readDir()
  .then((files) => {
    files.forEach(file => {
      if(file.includes('.md')){
        console.log(file)
      }
    })
  })
  .catch((err) => {
    console.log(err)
  })
}

module.exports.consumiendoPromesaReadDir = consumiendoPromesaReadDir()


// const readLinks = () => {
//   const ruta = __dirname;

//   return new Promise ((resolve, reject) => {

//     fs.readFile(ruta, "UTF-8", (err, data) => {
//       if (err) {
//         reject(error);
//       }
//       let links = []
//       const renderer = new Marked.Renderer()
//       renderer.link = (href, ruta, text) => {
//         links.push({
//           href:href,
//           text:text,
//           file:ruta,
//         })
//       }
//       Marked(data, {rederer:renderer})
//       console.log(links)
//       resolve(links)
//     })

//   })
// }

// module.exports.readLinks = readLinks()
