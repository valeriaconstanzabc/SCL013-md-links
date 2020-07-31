const fs = require("fs");
const pathNPM = require('path');
const marked = require("marked");
const fetch = require('node-fetch');
const chalk = require('chalk');

// creamos ruta absoluta
let path = __dirname;
path = pathNPM.resolve(path); //Resuelve la ruta relativa a absoluta
path = pathNPM.normalize(path); //Se desace de elementos extras en la ruta

const getLinks = (links) => {
	let validateLink = [];
	links.map((element) => {
		var prefix = element.Link.substring(0, 4);
		if (prefix == 'http') {
			validateLink.push(element);
		}
	})
	return validateLink;
};

const readDir = () => {
  return new Promise ((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if(err){
        reject('ERROR', err)
      }
      else {
        files.map(file => {
          if(pathNPM.extname(file) === ".md"){
            console.log('Archivos librería', file)

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
                    let resultGet = getLinks(links);
                    // console.log(resultGet)

                    resultGet.map((element) => {
                      fetch(element.Link)
                        .then(res => {
                          if(res.status == 200) {
                            console.log(chalk.blue('[✔]'), chalk.cyan(element.Link), chalk.bgBlue(` ${res.status} ${res.statusText} `), chalk.yellow(element.Titulo));
                          }
                          else {
                            console.log(chalk.red('[X]'), chalk.cyan(element.Link), chalk.bgRed(` ${res.status} ${res.statusText} `), chalk.white(element.Titulo));
                          }
                        })
                        .catch((err) => console.log(chalk.gray('[-]'), chalk.cyan(element.Link), chalk.bgRed(` ${err.type} ${err.code} `), chalk.white(element.Titulo)));
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

const promesa = (err, data) => {
  Promise.all([readDir()])
  .then(()=> {
    console.log(data)
  })
  .catch(() => {
    console.log(err);
  })
}

module.exports.promesa = promesa();

// const promesa = (err, data) => {
//   Promise.all([readDir()])
//     data.map((element) => {
//       fetch(element.Link)
//       .then(res => {
//         if(res.status == 200) {
//           console.log(chalk.blue('[✔]'), chalk.cyan(element.Link), chalk.bgBlue(` ${res.status} ${res.statusText} `), chalk.yellow(element.Titulo));
//         }
//         else {
//           console.log(chalk.red('[X]'), chalk.cyan(element.Link), chalk.bgRed(` ${res.status} ${res.statusText} `), chalk.white(element.Titulo));
//         }
//       })
//       .catch((err) => console.log(chalk.gray('[-]'), chalk.cyan(element.Link), chalk.bgRed(` ${error.type} ${error.code} `), chalk.white(element.Titulo)));
//     })
// }

// module.exports.promesa = promesa();
