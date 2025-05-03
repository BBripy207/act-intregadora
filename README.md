Resumen del Proyecto: Star Wars App
Descripción General
La Star Wars App es una aplicación web diseñada para gestionar personajes y rentas relacionadas con el universo de Star Wars. La aplicación incluye un frontend desarrollado en React, un backend construido con Express y una base de datos SQLite en memoria. Además, se implementan herramientas de monitoreo y despliegue como Prometheus, Grafana y Helm para garantizar un entorno robusto y escalable.

Componentes Principales
1. Frontend
Tecnología: React.
Funcionalidad:
Muestra una lista de personajes de Star Wars con imágenes y descripciones.
Permite realizar rentas de personajes por una duración específica.
Incluye pestañas para alternar entre personajes y rentas realizadas.
Notificaciones visuales para errores y confirmaciones.
Configuración:
El frontend se comunica con el backend a través de la URL configurada en la variable de entorno REACT_APP_BACKEND_URL.
2. Backend
Tecnología: Node.js con Express.
Funcionalidad:
Proporciona endpoints REST para gestionar personajes y rentas.
Base de datos SQLite en memoria para almacenar personajes y rentas.
Endpoints principales:
/characters: Obtiene la lista de personajes.
/rentals: Gestiona las rentas (crear, listar y eliminar).
Configuración:
Expone el puerto 3000 para la comunicación con el frontend.
3. Infraestructura
Docker Compose:
Orquesta los servicios del backend, frontend, Prometheus y Grafana.
Configura los puertos y variables de entorno necesarias para la comunicación entre servicios.
Prometheus:
Monitorea los servicios del backend y frontend.
Configuración definida en el archivo prometheus.yml.
Grafana:
Visualiza métricas recolectadas por Prometheus.
Configuración inicial con usuario y contraseña (admin).
4. Despliegue
CI/CD Pipeline:
Implementado con GitHub Actions en el archivo deploy.yml.
Flujo:
Construcción y pruebas del frontend.
Despliegue de la aplicación en Kubernetes utilizando Helm.
Helm:
Gestiona el despliegue en Kubernetes.
Configuración definida en los archivos Chart.yaml y values.yaml.
Despliega la aplicación en el namespace production con 2 réplicas.
Servicios y Puertos
Servicio	Puerto Host	Puerto Contenedor	Descripción
Backend	3000	3000	API REST para personajes y rentas.
Frontend	3001	3000	Interfaz web de la aplicación.
Prometheus	9090	9090	Monitoreo de métricas.
Grafana	3002	3000	Visualización de métricas.
Tecnologías Utilizadas
Frontend: React, Axios.
Backend: Node.js, Express, SQLite.
Infraestructura: Docker, Docker Compose, Kubernetes, Helm.
Monitoreo: Prometheus, Grafana.
CI/CD: GitHub Actions.
