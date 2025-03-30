# NodePop

Aplicación de compra/venta de artículos de segunda mano.

## Requisitos

- Node.js
- MongoDB

## Configuración

1. Clona este repositorio
2. Instala las dependencias:

```
npm install
```

## Base de datos

Para inicializar la base de datos con datos de ejemplo:

```
npm run initDB
```

Este comando ejecutará el script `initDB.js` que creará usuarios y productos de ejemplo.

> Importante: El script pedirá confirmación antes de borrar la base de datos actual. Escribe 'y' para confirmar.

## Ejecución

Para iniciar la aplicación en modo desarrollo:

```
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Credenciales de prueba

- Email: userOne@mail.com
- Contraseña: 01234

- Email: userTwo@mail.com
- Contraseña: 01234

## Estructura del proyecto

- `models/`: Modelos de datos para MongoDB
- `controllers/`: Controladores de la aplicación
- `views/`: Plantillas HTML para las vistas
- `public/`: Archivos estáticos (imágenes, CSS, etc.)
  - `public/assets/`: Imágenes de los productos

## Funcionalidades

- Inicio de sesión y registro de usuarios
- Visualización de productos disponibles
- Añadir nuevos productos
- Filtrado por etiquetas

