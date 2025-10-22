# Proyecto: Gestión de Empleados

Este es un proyecto Full-Stack para la gestión de empleados y puestos de trabajo, desarrollado como parte de [Nombre de tu curso o asignatura].

## 📜 Descripción

La aplicación permite a los usuarios realizar operaciones CRUD (Crear, Leer, Actualizar, Borrar) tanto para empleados como para los puestos que pueden ocupar. La interfaz está construida con React y se comunica con una API RESTful desarrollada en .NET 8.

## 📁 Estructura del Proyecto

El repositorio está organizado como un monorepo con dos carpetas principales:

- `/frontend`: Contiene la aplicación de React (Vite).
- `/BackEmp.Api`: Contiene la API de backend desarrollada con .NET 8 y Entity Framework Core.

## 🚀 Cómo Ejecutar el Proyecto Localmente

Para probar el proyecto, es necesario ejecutar el backend y el frontend por separado.

### 1. Ejecutar el Backend (API)

La API utiliza una base de datos SQLite que se creará automáticamente.

```bash
# 1. Navega a la carpeta de la API
cd BackEmp.Api

# 2. Restaura las dependencias de .NET
dotnet restore

# 3. Inicia la API (por defecto en http://localhost:5000 o similar)
dotnet run
```

### 2. Ejecutar el Frontend (React)

```bash
# 1. Abre una NUEVA terminal y navega a la carpeta del frontend
cd frontend

# 2. Instala las dependencias de Node.js
npm install

# 3. Inicia la aplicación de React (por defecto en http://localhost:5173)
npm run dev
```

Una vez que ambos servicios estén en ejecución, abre tu navegador en `http://localhost:5173` para usar la aplicación.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React, Vite, CSS.
- **Backend**: .NET 8, ASP.NET Core, Entity Framework Core.
- **Base de Datos**: SQLite (para desarrollo local).
- **Control de Versiones**: Git y GitHub.