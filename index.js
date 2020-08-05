const fs = require('fs');
const pathNPM = require('path');
const marked = require('marked');
const fetch = require('node-fetch');
const chalk = require('chalk');
const emoji = require('node-emoji')

//<-------------------CREAMOS RUTA ABSOLUTA------------------->
let path = process.argv[2];
path = pathNPM.resolve(path); //Resuelve la ruta relativa a absoluta
path = pathNPM.normalize(path); //Se deshace de elementos extras en la ruta


//<-------FUNCIÓN QUE LEE DIRECTORIO-------------------------->
// const readDir = () => {

//     //con readdir, propiedad de fs, leemos todos los archivos que tenemos en el directorio
//     fs.readdir(path, (err, files) => {
//       if(err){
//         console.log('ERROR - No se puede leer el directorio', err)
//       }
//       else {
//         console.log(
//           chalk.cyan('\n','\n','Links validos:', (emoji.get('innocent'))),
//           chalk.blue('|'),
//           chalk.magenta('Links dañados:', (emoji.get('imp'))),
//           chalk.blue('|'),
//           chalk.magenta('Links sin conexión:', (emoji.get('alien')))
//         )

//         console.log(chalk.blue('---------------------------------------------------------------------------------------'))
//         files.map(file => {

//           //con extname, propiedad de path hacemos una comparación con el archivo .md
//           if(pathNPM.extname(file) === '.md'){
//             console.log(chalk.white.italic((emoji.get('open_file_folder')),'Archivo leído: ', file))
//             console.log(chalk.blue('---------------------------------------------------------------------------------------'))

//             readFiles(err, file)
//           }
//         })
//       }
//     })
// }


//<----------FUNCIÓN QUE FILTRA LINKS HTTP----------------------->
const filterLinks = (links) => {
  //Creamos nuevo array vacio
  let arrayFilterLinks = [];

  //recorremos los 'links'
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
const readFiles = (err, file) => {

  return new Promise ((resolve, reject) => {

    if(err){
      reject('ERROR - No se puede leer el directorio', err)
    }
    else {
      //con readFile, propiedad de fs, leemos los archivos que nos arrojó el directorio
      fs.readFile(path, 'utf-8', (err, data) => {

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
          let argv2 = process.argv[3]
          let argv3 = process.argv[4]
          if (argv2 == '-v' && argv3 == '-s' || argv2 == '-s' && argv3 == '-v') {
            // Aquí solo se resuelve con el primer array generado
            linksStats(links, file)
            linksBroken(links, file)
            return;
          } else if (argv2 == '--stats' || argv2 == '-s' ) {
            linksStats(links, file)
            return;
          } else if (argv2 == '--validate' || argv2 == '-v') {
            linksValidate(resultLinks, file)
            return;
          } else if (path) {
            linksDefault(resultLinks, file)
          }

        }
      })
    }
  })
  .then((resultLinks, file) => {
    return linksDefault(resultLinks, file)
  })

  .catch((err) => {
    console.log(err)
  })
}

//<----------FUNCION QUE IMPRIME LINKS----------------------->
const linksDefault = (resultLinks, file) => {
  resultLinks.map((elem) => {
    console.log(
      chalk.yellow(emoji.get('arrow_right')),
      chalk.black.bgBlue(`${' '}${file}${' '}`),
      chalk.yellow.dim(elem.Titulo.substring(0,50)),
      chalk.blue.bold(`${'['}`),
      chalk.blue(`${elem.Link.substring(0,50)}`),
      chalk.blue.bold(`${']'}`)
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
            chalk.cyan((emoji.get('arrow_right'))),
            ((emoji.get('innocent'))),
            chalk.black.bgCyan(`${' '}${file}${' '}`),
            chalk.cyan.dim(elem.Titulo.substring(0,50)),
            chalk.cyan.bold(`${'['}`),
            chalk.cyan(`${elem.Link.substring(0,50)}`),
            chalk.cyan.bold(`${']'}`)
          )
        }
        else {
          console.log(
            chalk.magenta((emoji.get('arrow_right'))),
            ((emoji.get('imp'))),
            chalk.black.bgMagenta(`${' '}${file}${' '}`),
            chalk.magenta.dim(elem.Titulo.substring(0,50)),
            chalk.magenta.bold(`${'['}`),
            chalk.magenta(`${elem.Link.substring(0,50)}`),
            //chalk.magenta.x(`${elem.Link.substring(0,50)}`), //LINKS SIN CONEXIÓN
            chalk.magenta.bold(`${']'}`),
          )
        }
      })
      .catch(() => {
        console.log(
          chalk.magenta((emoji.get('arrow_right'))),
          ((emoji.get('alien'))),
          chalk.black.bgMagenta(`${' '}${file}${' '}`),
          chalk.magenta.dim(elem.Titulo.substring(0,50)),
          chalk.magenta.bold(`${'['}`),
          chalk.magenta(`${elem.Link.substring(0,50)}`),
          chalk.magenta.bold(`${']'}`),
        )
      })
  })
	return;
};


//<----------FUNCION QUE IMPRIME STATS----------------------->
const linksStats = (links, file) => {
  let totalLinks = [];

  links.forEach(elem => {
    totalLinks.push(elem.Link);
  });

  let uniqueLinks = new Set(totalLinks);

  console.log(
    '\n',
    chalk.magenta((emoji.get('arrow_right'))),
    chalk.black.bold.bgMagenta(`${'  '}${file}${'   '}`),
    '\n',
    chalk.black.bgBlue(' Links totales: '),
    chalk.blue.bold(totalLinks.length),
    '\n',
    chalk.black.bgCyan(' Links únicos:  '),
    chalk.cyan.bold(uniqueLinks.size),
    '\n'
  );
}


//<----------FUNCION QUE IMPRIME TOTAL LINKS DAÑADOS---------->
const linksBroken = (resultLinks, file) => {
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
    chalk.yellow((emoji.get('weary'))),
    chalk.black.bold.bgYellow(`${'  '}${file}${' '}`),
    '\n',
    chalk.black.bgYellow('  Links dañados: '),
    chalk.yellow.bold(res.filter(link => link.statusLinks !=200 ).length)
    );
  })

}



//<----------------EXPORTAMOS MÓDULO PROMESA------------------>
module.exports = readFiles();

