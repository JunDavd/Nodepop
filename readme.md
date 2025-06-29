# NodePop

Aplicación de venta de artículos de segunda mano.

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

- Email: admin@example.com
- Contraseña: 1234

- Email: user1@example.com
- Contraseña: 1234

## Estructura del proyecto

- `models/`: Modelos de datos para MongoDB
- `controllers/`: Controladores de la aplicación
- `controller/api`: controladores del API
- `views/`: Plantillas HTML para las vistas
- `public/`: Archivos estáticos (imágenes, CSS, etc.)
  - `public/assets/`: Imágenes de los productos

## Funcionalidades

- Inicio de sesión y registro de usuarios
- Visualización de productos disponibles
- Eliminar y añadir nuevos productos
- Autorización por JWT token
- upload de imágenes con multer
- Internacionalización de aplicación, con opción de lenguajes en inglés o español.


# Nodepop API - Documentación

API REST para gestionar usuarios y productos en Nodepop.

## Autenticación

Esta API utiliza **JWT (JSON Web Tokens)** para proteger la mayoría de los endpoints.

- El token JWT se envía en la cabecera:
  ```
  Authorization: <JWT>
  ```

- O en el body o query string como `jwt`.

Si el token es inválido o no está presente, la API responde con:

```json
{
  "status": 401,
  "message": "Invalid token" // o "Not token provided"
}
```

## Endpoints

### 1. POST /api/login

**Descripción**: Inicia sesión y devuelve un JWT para autenticación.

**Público** (no requiere token)

**Request body (ejemplo):**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (ejemplo):**
```json
{
  "token": "<JWT>"
}
```

### 2. GET /api/products

**Descripción**: Lista los productos del usuario autenticado.

**Requiere JWT**

**Query params (opcional):**
- `name`: filtrar por nombre
- `price`: filtrar por precio exacto
- `tags`: filtrar por tags
- `limit`: paginación
- `skip`: paginación
- `sort`: campos para ordenar (por ejemplo `price name`)
- `fields`: campos específicos a devolver
- `count=true`: incluir número total de resultados

**Request ejemplo:**
```bash
GET /api/products?name=phone&limit=10&sort=price
```

**Response ejemplo:**
```json
{
  "results": [
    {
      "_id": "123",
      "name": "Phone",
      "price": 120,
      "tags": ["work"],
      "image": "phone.jpg",
      "owner": "userid"
    }
  ],
  "count": 1
}
```

### 3. GET /api/products/:productId

**Descripción**: Obtiene un producto específico del usuario autenticado.

**Requiere JWT**

**Response ejemplo:**
```json
{
  "result": {
    "_id": "123",
    "name": "Phone",
    "price": 120,
    "tags": ["work"],
    "image": "phone.jpg",
    "owner": "userid"
  }
}
```

### 4. POST /api/products

**Descripción**: Crea un nuevo producto.

**Requiere JWT** | **Soporta subida de imagen** (multipart/form-data)

**Body params:**
- `name` (string)
- `price` (number)
- `tags` (array o string)
- `image` (archivo)

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: <JWT>" \
  -F "name=Phone" \
  -F "price=120" \
  -F "tags=work" \
  -F "image=@/path/to/image.jpg"
```

**Response ejemplo:**
```json
{
  "result": {
    "_id": "123",
    "name": "Phone",
    "price": 120,
    "tags": ["work"],
    "image": "phone.jpg",
    "owner": "userid"
  }
}
```

### 5. PUT /api/products/:productId

**Descripción**: Actualiza un producto existente del usuario.

**Requiere JWT** | **Soporta subida de imagen** (multipart/form-data)

**Body params** (campos opcionales):
- `name`
- `price` 
- `tags`
- `image` (archivo)

**Response ejemplo:**
```json
{
  "result": {
    "_id": "123",
    "name": "Updated Phone",
    "price": 130,
    "tags": ["work"],
    "image": "updated.jpg",
    "owner": "userid"
  }
}
```

### 6. DELETE /api/products/:productId

**Descripción**: Elimina un producto del usuario.

**Requiere JWT**

**Response:**
```json
{}
```

## Errores

- **401 Unauthorized**: token inválido o inexistente
- **404 Not Found**: producto no encontrado
- **400 Bad Request**: datos inválidos

Formato típico de error:
```json
{
  "status": 404,
  "message": "Not Found"
}
```

## Subida de imágenes

- Usar campo `image` en multipart/form-data.
- Las imágenes se almacenan en `/public/img-products`.


