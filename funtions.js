const fs = require('fs')

const read = () => {
  // const ruta = process.argv[2]
  const ruta = __dirname;
  console.log(ruta);


  fs.readdir(ruta, (error, files) => {

    files.forEach(archivo => {
      if(archivo.includes('.md')){
        //  console.log(archivo)
      }
    })
  })
}

module.exports.read = read()


// module.exports = () => {

// };
