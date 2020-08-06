const fs = require('fs')
const pathNPM = require('path')
const marked = require('marked')
const fetch = require('node-fetch')
const chalk = require('chalk');
const emoji = require('node-emoji')

//<-------------------CREAMOS RUTA ABSOLUTA------------------->
let path = process.argv[2];
//Resuelve la ruta relativa a absoluta
path = pathNPM.resolve(path);
//Se deshace de elementos extras en la ruta
path = pathNPM.normalize(path);


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
const readFiles = (err) => {

  return new Promise ((resolve, reject) => {

    if(err){
      reject('ERROR - No se puede leer el directorio', err)
    }
    else {
      //Console.log que imprime ruta leída y diccionario de íconos.
      console.log(
        chalk.blue.bold('\n','---------------------------------------------------------------------------------------'),
        chalk.white.italic('\n',(emoji.get('open_file_folder')),'Archivo leído: ', path, '\n'),
        chalk.blue.bold('---------------------------------------------------------------------------------------'),
        chalk.cyan('\n','Links validos:', (emoji.get('innocent'))),
        chalk.blue.bold('|'),
        chalk.magenta('Links dañados:', (emoji.get('imp'))),
        chalk.blue.bold('|'),
        chalk.magenta('Links sin conexión:', (emoji.get('alien')), '\n'),
        chalk.blue.bold('---------------------------------------------------------------------------------------')
      )
      //Con readFile, propiedad de fs, leemos los archivos que nos arrojó el directorio.
      fs.readFile(path, 'utf-8', (err, data) => {

        if(err){
          reject('ERROR - No se puede leer el archivo', err)
        }
        else {
          //Creamos un array vacio para luego guardar info de links.
          let links = []

          //Creamos una constante para acceder a la libreria Marked
          //crea nuevas instancias(links)
          const renderer = new marked.Renderer()
          //Dentro de renderer quedan guardados los links con título y ruta
          renderer.link = (href, title, text) => {
            links.push({
            Link:href,
            Titulo:text,
            Ruta:path,
            })
          }
          //Lamamos a la libreria y le entregamos nuestra data de likes y
          //creamos un objeto con la info de renderer(links)
          marked(data, { renderer : renderer })
          let resultLinks = filterLinks(links);

          //Info ingresada por el usuario que rescatamos con process.
          let argv2 = process.argv[3]
          let argv3 = process.argv[4]

          if (argv2 == '-v' && argv3 == '-s' || argv2 == '-s' && argv3 == '-v') {
            linksStats(links)
            linksBroken(links)
            return;
          } else if (argv2 == '--stats' || argv2 == '-s' ) {
            linksStats(links)
            return;
          } else if (argv2 == '--validate' || argv2 == '-v') {
            linksValidate(resultLinks)
            return;
          } else if (path) {
            linksDefault(resultLinks)
          }
        }
      })
    }
  })
  .then((resultLinks) => {
    return linksDefault(resultLinks)
  })
  .catch((err) => {
    console.log(err)
  })
}

//<----------FUNCION QUE IMPRIME LINKS----------------------->
const linksDefault = (resultLinks) => {

  console.log(' ')
  //Recorremos el resultado de nuestros links.
  resultLinks.map((elem) => {
    console.log(
      chalk.yellow(emoji.get('arrow_right')),
      //Con elem.titulo traemos el título del link, desde el array creado con marked
      chalk.black.bgBlue(' ',elem.Titulo.substring(0,50),' ','\n'),
      chalk.blue.bold('  ['),
      //Con elem.link traemos nuestro link desde el array creado con marked
      chalk.blue(elem.Link.substring(0,50)),
      chalk.blue.bold(']')
    )
  })
  console.log('  ')
  return;

};


//<----------FUNCIÓN QUE VALIDA LINKS----------------------->
const linksValidate = (resultLinks) => {

  console.log(' ')
  //Recorremos el resultado de nuestros links.
  resultLinks.map((elem) => {
    //Llamamos a fetch para poder acceder a status de cada uno de nuestros links.
    fetch(elem.Link)
      .then(res => {
        //al acceder al status podemos dar como condición que nos entregue todos
        //los links que esten válidos (con 200)
        if(res.status == 200) {
          console.log(
            chalk.blue((emoji.get('arrow_right'))),
            ((emoji.get('innocent'))),
            chalk.black.bgBlue('  ',elem.Titulo.substring(0,50),'  ', '\n'),
            chalk.blue.bold('['),
            chalk.blue(elem.Link.substring(0,50)),
            chalk.blue.bold(']')
          )
        }
        else {
          //En su defecto que nos entregue los links dañados
          console.log(
            chalk.magenta((emoji.get('arrow_right'))),
            ((emoji.get('imp'))),
            chalk.black.bgMagenta('  ',elem.Titulo.substring(0,50),'  ', '\n'),
            chalk.magenta.bold('['),
            chalk.magenta(elem.Link.substring(0,50)),
            //chalk.magenta.x(elem.Link.substring(0,50)), //LINKS SIN CONEXIÓN
            chalk.magenta.bold(']'),
          )
        }
      })
      .catch(() => {
        //Con catch le damos la opción a que esos links den error por conexión.
        console.log(
          chalk.magenta((emoji.get('arrow_right'))),
          ((emoji.get('alien'))),
          chalk.black.bgMagenta('  ',elem.Titulo.substring(0,50),'  ', '\n'),
          chalk.magenta.bold('['),
          chalk.magenta(elem.Link.substring(0,50)),
          chalk.magenta.bold(']'),
        )
      })
  })
  return;

};


//<----------FUNCION QUE IMPRIME STATS----------------------->
const linksStats = (links) => {
  //Creamos array vacio
  let totalLinks = [];
  //recorremos todos nuestros links con un forEach
  links.forEach(elem => {
    //pusheamos esa info encontra al array creado anteriormente.
    totalLinks.push(elem.Link);
  });
  //el set es parecido al array solo que permite almacenar elementos
  //sin que se repitan, por lo que podemos contar los links únicos.
  let uniqueLinks = new Set(totalLinks);
  console.log(
    chalk.blue('\n',(emoji.get('arrow_right'))),
    chalk.black.bgBlue(' Links totales: '),
    chalk.blue.bold(totalLinks.length, '\n'),
    chalk.cyan((emoji.get('arrow_right'))),
    chalk.black.bgCyan(' Links únicos:  '),
    chalk.cyan.bold(uniqueLinks.size),'\n'

  );
}


//<----------FUNCION QUE IMPRIME TOTAL LINKS DAÑADOS---------->
const linksBroken = (resultLinks) => {
  //creamos un nuevo array vacio.
  let brokenLinks = [];
  return new Promise((resolve, reject) => {
    resultLinks.map((elem) => {
      //al arraya vacio de afuera le pushearemos la info que encontremos
      //agregando fetch para obtener la validación de nuestros links.
      brokenLinks.push(fetch(elem.Link)
      .then(res => {
        //retornamos un objeto en donde guarde los status de cada link
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
    chalk.black.bgYellow('  Links dañados: '),
    //filtramos los estatus de los links pidiendo que entregue los links
    //que son diferentes a 200(osea los links malos)
    chalk.yellow.bold(res.filter(link => link.statusLinks !=200 ).length),
    chalk.yellow((emoji.get('weary')), '\n'),
    );
  })
}


//<----------------EXPORTAMOS MÓDULO PROMESA------------------>
module.exports = readFiles();

