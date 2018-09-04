![mdlinks](https://i.imgur.com/Dm8VQx2.png)
# Md-Links

## Presentación

**Md-links** es una librería que te permite revisar los links (*href*) en un `archivo.md` (markdown). **_El propósito de Md-Links es que puedas verificar el status en el que se encuentran los enlaces_**. Por ejemplo, si el link encontrado se encuentra disponible, la aplicación mostrará `status: 200 Ok`. En caso contrario, y el link está roto, la consola mostrará, por ejemplo, `status: 404 Not Found`.
Si los hipervínculos no tienen problemas se visualizarán en **verde**, de lo contrario, aquellos que no estén disponibles se verán en **rojo**.

#### Vista Previa
![mdlinks](https://i.imgur.com/Dm8VQx2.png)
![mdlinks](https://i.imgur.com/Dm8VQx2.png)
![mdlinks](https://i.imgur.com/Dm8VQx2dsadasd.png)





## Instalación y uso (versión de prueba)

Para hacer funcionar **md-links** necesitas primero instalar las dependencias de npm en la carpeta donde ejecutarás a librería. Además necesitarás instalar *npm node-fetch, npm marked y npm colors*.

`$ npm install`  
`$ npm install node-fetch`  
`$ npm install marked`  
`$ npm install colors`  

Luego copia el archivo index.js en la carpeta.  

Para ejecutar la función debes colocar el comando + ruta del archivo, como por ejemplo:  

`/mnt/d/usuarios/documentos/mdlinks: $ node index.js README.md`  

Si el archivo se encuentra fuera de la carpeta donde estás ejecutando la función, debes colocar la ruta completa:  

`/mnt/d/usuarios/documentos/mdlinks: $ node index.js Mnt/d/usuarios/documentos/README.md`  

El programa se ejecutará y te desplegará la lista de links de tu archivo md.  

`{ Status: '200 OK // Linea: 9: [Figma]~ //www.figma.com/' }`

La aplicación mostrará en pantalla si el archivo ingresado no tiene la extensión correcta o si no tiene links.

