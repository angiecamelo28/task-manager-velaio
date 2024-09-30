# Task Manager Velaio

Este proyecto es una aplicación web desarrollada en Angular 16 que permite gestionar tareas y las personas asociadas a ellas. La aplicación permite a los usuarios crear tareas, asignar personas a cada tarea junto con sus habilidades y gestionar el estado de las tareas (pendientes o completadas). Este proyecto es parte de una prueba técnica para **VELAIO S.A.S.**

## Funcionalidades

- **Crear tareas:** Agrega nuevas tareas con nombre y fecha límite.
- **Listar tareas:** Muestra todas las tareas creadas con la opción de filtrar por estado (pendientes o completadas).
- **Marcar tareas como completadas:** Permite actualizar el estado de las tareas.
- **Asignar personas a tareas:** Añade personas con nombre, edad y habilidades asociadas a cada tarea.
- **Añadir y eliminar habilidades:** Gestiona las habilidades de cada persona asignada a una tarea.
- **Validaciones:** Asegura que no se asignen personas menores de 18 años y que cada persona tenga al menos una habilidad.

## Tecnologías Utilizadas

- **Framework:** [Angular 16](https://angular.io/)
- **Gestión de Estado:** Servicios de Angular (opcional: NgRx)
- **Diseño Responsivo:** Desarrollado bajo principios de Mobile-First para asegurar la compatibilidad en diferentes dispositivos.

## Comenzando

### Requisitos Previos

- **Node.js**: Asegúrate de tener [Node.js](https://nodejs.org/) instalado en tu máquina.
- **Angular CLI**: Instala Angular CLI de manera global con:

  ```bash
  npm install -g @angular/cli
