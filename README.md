# Md-Links

## 1. Definición del proyecto

### ¿Qué es Markdown?

Creado originalmente por John Gruber, con ayuda de Aaron Swartz en 2004,  Markdown es un **lenguaje de marcado** que facilita la aplicación de formato a un texto plano empleando una serie de caracteres de una forma especial. Con formato nos referimos a itálicas, negritas, listas, encabezados, citas, código en línea o en bloque, vínculos y más.

> Para ver formatos completo [click aquí](https://markdown.es/sintaxis-markdown/)

### Resumen del producto
Markdown es muy utilizado en plataformas como GitHub, foros, blogs como también para crear documentación y es muy común encontrar varios archivos en ese formato en cualquier tipo de repositorio.

Estos archivos Markdown normalmente contienen links (vínculos/ligas) que muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de la información que se quiere compartir.

Dentro de una comunidad de código abierto, nos han propuesto crear una herramienta usando Node.js, que permite al usuario recorrer un directorio, filtrar los archivos en formato Markdown y extraer los links que contengan para verificar su estado: sin conexión, útiles o rotos y dar algunas estadísticas que se imprimirán en consola como la cantidad de links, el estado de los links y los links únicos.

## 2. Diagrama de flujo

![Flujo](https://i.ibb.co/R6ZSyfp/Md-Links-New-frame.jpg)

## 3. Instrucciones de instalación/uso

> 1. Debes tener instalado node.js y npm

> 2. Para instalar nuestra librería

    Aqui va el comando

> 2. Comando de ejecución:

    node tuArchivo.js

> 3. Uso de la librería:

* opc 1: muestra los links

      node tuArchivo.js

* opc 2: muestra estadísticas: Links totales | Links unicos | Links rotos

      node archivo.js -v -s | node archivo.js -v -s

* opc 3: muestra los links con su estado

      node archivo.js -v | node archivo.js --validate

* opc 4: muestra estadísticas: Links totales | Links unicos

      node archivo.js -s | node archivo.js --stats


## 4. Documentación del API

## 5. Ejemplos de como se ve en consola

## 6. Objetivos de aprendizaje

