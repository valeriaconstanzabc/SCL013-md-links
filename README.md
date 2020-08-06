# Md-Links

![Click aquí](./imagenes/markdown.png)


## 1. Definición del proyecto

### ¿Qué es Markdown?

Creado originalmente por John Gruber, con ayuda de Aaron Swartz en 2004,  Markdown es un **lenguaje de marcado** que facilita la aplicación de formato a un texto plano empleando una serie de caracteres de una forma especial. Con formato nos referimos a itálicas, negritas, listas, encabezados, citas, código en línea o en bloque, vínculos y más.

> Para ver formatos completo [Click aquí](https://markdown.es/sintaxis-markdown/)

### Resumen del producto
Markdown es muy utilizado en plataformas como GitHub, foros, blogs como también para crear documentación y es muy común encontrar varios archivos en ese formato en cualquier tipo de repositorio.

Estos archivos Markdown normalmente contienen links (vínculos/ligas) que muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de la información que se quiere compartir.

Dentro de una comunidad de código abierto, nos han propuesto crear una herramienta usando Node.js, que permite al usuario recorrer un directorio, filtrar los archivos en formato Markdown y extraer los links que contengan para verificar su estado: sin conexión, útiles o rotos y dar algunas estadísticas que se imprimirán en consola como la cantidad de links, el estado de los links y los links únicos.

***

## 2. Diagrama de flujo

![Flujo](./imagenes/Flujo.jpg)

***

## 3. Instrucciones de instalación y uso

> ### 1. Debes tener instalado node.js y npm

> ### 2. Para instalar nuestra librería:

    npm install AleKristen/SCL013-md-links

> ### 3. Importa la librería en tu proyecto:

    const nombreLibreria = require('md-links')

> ### 4. Uso de la librería:

* **Opción 1:** Muestra los links extraidos del archivo con extensión .md que ingreses

      node tuArchivo.js tuArchivo.md

* **Opción 2:** Muestra la validación de links del archivo con extensión .md que ingreses

      node archivo.js tuArchivo.md -v | node archivo.js tuArchivo.md --validate

* **Opción 3:** Muestra estadísticas del archivo con extensión .md que ingreses: Links totales | Links únicos

      node archivo.js tuArchivo.md -s | node archivo.js tuArchivo.md --stats

* **Opción 4:** Muestra estadísticas más links dañados del archivo con extensión .md que ingreses: Links totales | Links únicos | Links dañados

      node archivo.js tuArchivo.md -s -v | node archivo.js tuArchivo.md -v -s

***


## 4. Ejemplos de como se ve en consola

>### Opción 1: **node tuArchivo.js**

![Links](./imagenes/1.png)

>### Opción 2: **node tuArchivo.js -v | node tuArchivo.js --validate**

![Validación](./imagenes/2.png)
![Validación](./imagenes/3.png)

>### Opción 3: **node tuArchivo.js -s | node tuArchivo.js --stats**

![Flujo](./imagenes/4.png)

>### Opción 4: **node tuArchivo.js -s -v| node tuArchivo.js -v -s**

![Flujo](./imagenes/5.png)

***

## 5. Objetivos de aprendizaje

### JavaScript

* [x] Uso de condicionales (if-else | switch | operador ternario)
* [x] Uso de funciones (parámetros | argumentos | valor de retorno)
* [x] Manipular arrays (filter | map | sort | reduce)
* [x] Manipular objects (key | value)
* [ ] Uso ES modules (import | export)
* [x] Uso de callbacks
* [x] Consumo de Promesas
* [x] Creación de Promesas

### Node

* [x] Uso de sistema de archivos. (fs, path)
* [x] Instalar y usar módulos (npm)
* [x] Creación de modules (CommonJS)
* [x] Configuración de package.json
* [x] Configuración de npm-scripts
* [x] Uso de CLI (Command Line Interface - Interfaz de Línea de Comando)

### Testing

* [ ] Testeo unitario
* [ ] Testeo asíncrono
* [ ] Uso de Mocks manuales.

### Estructura del código y guía de estilo

* [x] Organizar y dividir el código en módulos (Modularización)
* [x] Uso de identificadores descriptivos (Nomenclatura | Semántica)
* [x] Uso de linter (ESLINT)

### Git y GitHub

* [x] Uso de comandos de git (add | commit | pull | status | push)
* [x] Manejo de repositorios de GitHub (clone | fork | gh-pages)
* [x] Colaboración en Github (branches | pull requests | |tags)
* [ ] Organización en Github (projects | issues | labels | milestones)

### HTTP

* [ ] Verbos HTTP (http.get)

### Fundamentos de programación

* [x] Recursión
