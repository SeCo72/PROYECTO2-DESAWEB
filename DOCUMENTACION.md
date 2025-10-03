# DOCUMENTACIÓN TÉCNICA - Panel Administrativo de Liga Deportiva (Proyecto II)

Este documento detalla la arquitectura, el stack tecnológico implementado, los estándares de seguridad y las directrices de despliegue para el Panel Administrativo de la Liga Deportiva, conforme a los requerimientos establecidos en el Proyecto II.

---

## 1. Arquitectura y Stack Tecnológico

El proyecto utiliza una arquitectura **desacoplada (API RESTful)**, donde el Frontend se comunica exclusivamente con el Backend a través de una API.

### 1.1. Stack Tecnológico Implementado

| Capa | Tecnología Usada (Ejemplo) | Propósito |
| :--- | :--- | :--- |
| **Backend (API)** | Node.js / Express | Manejo de lógica de negocio, autenticación, y capa de persistencia. |
| **Frontend (Cliente)** | React (o Vue.js) | Interfaz de usuario para la gestión de datos (UI/UX) (RNF-ADM-03). |
| **Base de Datos** | PostgreSQL / MySQL | Almacenamiento eficiente y relacional de datos (RNF-ADM-05). |
| **Gestor de Procesos** | PM2 | Asegura la ejecución continua y manejo de concurrencia (RNF-ADM-06). |

### 1.2. Estructura del Repositorio

El código fuente se organiza en directorios separados para el cliente y el servidor.

---

## 2. Implementación de Seguridad y Autenticación

### 2.1. Protección de la API (JWT)
El acceso a la API para todas las funcionalidades administrativas está protegido mediante **JSON Web Tokens (JWT)**.

* **Generación de Token:** El servidor emite un JWT al iniciar sesión exitosamente (`/api/auth/login`).
* **Validación de Rutas (RNF-ADM-02):** Un *middleware* en el Backend verifica la validez y la expiración del token incluido en el encabezado `Authorization: Bearer <token>` de todas las peticiones a rutas privadas.

### 2.2. Manejo de Credenciales (RNF-ADM-01)
* **Almacenamiento Seguro:** Las contraseñas de los usuarios administradores se almacenan mediante la función de hash **bcrypt** para cumplir con la política de seguridad (RNF-ADM-01).
* **Gestión de Sesiones (RF-ADM-03):** La expiración y el *logout* se gestionan a través del ciclo de vida del JWT.

---

## 3. Guía de Despliegue en Producción

El proyecto debe desplegarse en un entorno de producción **Gnu/Linux sin entorno gráfico** en una VPS.

### 3.1. Configuración del Servidor

1.  **Acceso SSH:** El servidor debe tener configurado el acceso basado en llaves con el usuario `melgust`. La llave pública requerida es:
    ```
    ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHx1yR2zNcjAFGdWn4fvuzqak1n6shVOJEdv/Df3XcWS melgust
    ```
2.  **Proxy Inverso (Nginx):** Se utiliza Nginx para:
    * Servir los archivos estáticos generados por el Frontend (build).
    * Redirigir las peticiones de la API (`/api/*`) al proceso del Backend.

### 3.2. Pasos para el Despliegue Continuo
1.  **Clonación:** `git clone https://github.com/SeCo72/PROYECTO2-DESAWEB.git`
2.  **Instalación y Build:**
    * `cd server && npm install`
    * `cd ../client && npm install && npm run build`
3.  **Ejecución del Backend:** El proceso del servidor se gestiona mediante **PM2** (o similar) para mantenerlo activo y monitoreado (RNF-ADM-06).
    ```bash
    cd server
    pm2 start index.js --name "admin-api"
    pm2 save
    ```

---

## 4. Funcionalidades CRUD y Persistencia

La gestión de datos cumple con los requerimientos CRUD para las entidades principales del sistema.

| Entidad | Funcionalidades Clave | Requerimientos cubiertos |
| :--- | :--- | :--- |
| **Equipos** | Creación, Edición, Eliminación, Listado con Búsqueda/Filtrado. | RF-ADM-04, RF-ADM-05, RF-ADM-06 |
| **Jugadores** | Registro, Edición, Eliminación, Listado por Equipo con Búsqueda/Filtrado. | RF-ADM-07, RF-ADM-08, RF-ADM-09 |
| **Partidos** | Creación (selección de equipos/fecha), Asignación de Roster, Historial con Marcadores. | RF-ADM-10, RF-ADM-11, RF-ADM-12 |
