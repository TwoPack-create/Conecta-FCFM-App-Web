# Conecta FCFM Web MVP

Este repositorio contiene el prototipo funcional de la plataforma Conecta FCFM. El objetivo es mantener la estetica del MVP original mientras se habilitan flujos reales de registro, autenticacion y gestion de viajes para la comunidad FCFM.

## Estructura general

```
src/
  data/              # Datos semilla y constantes de configuracion
  state/             # Estado centralizado, preferencias y manejo de sesion
  ui/                # Capas de interfaz: navegacion, formularios, renderizadores
  utils/             # Utilidades DOM reutilizables
index.html           # Maquetacion principal en vistas por secciones
style.css            # Sistema visual base del MVP
```

La aplicacion se carga como un modulo ES (`src/main.js`) que inicializa autenticacion, UI y renderizados.

## Flujos habilitados

- **Registro institucional** con validacion de dominios (`@ug.uchile.cl`, `@ing.uchile.cl`, `@uchile.cl`, `@idiem.cl`).
- **Verificacion por codigo** simulado y persistencia en localStorage.
- **Inicio de sesion** que desbloquea las secciones principales.
- **publicacion y reporte de viajes** con datos en memoria y actualizacion reactiva de la interfaz.
- **Configuracion de preferencia** (tema, idioma, alertas del boton de panico).

## Escalabilidad inmediata

- Estado centralizado (`src/state/app-state.js`) listo para conectar con un backend REST/GraphQL.
- Componentizacion por modulo para migrar a un bundler o framework SPA sin rehacer la UI.
- Datos semilla separados de la vista para reemplazarlos por respuestas de API.

## Siguientes pasos sugeridos

1. Sustituir el almacenamiento en memoria/localStorage por servicios API reales.
2. Integrar mapas y geolocalizacion para rutas y viajes en vehiculo.
3. Extender el sistema de notificaciones y el boton de panico a canales externos (SMS, mail, push).
4. Automatizar pruebas unitarias y de interfaz para los modulos de estado y UI.

## Acceso rapido

- Cuenta demo: `demo@ing.uchile.cl` / `demo1234` (preverificada para exploracion rapida).
- Tras iniciar sesion puedes registrar nuevos usuarios institucionales y conservaran la sesion en el navegador gracias a localStorage.


### Nueva funcionalidad

- Modulo **Vehiculo** ahora admite filtro por tipo, publicacion con fecha y solicitud de viajes con control de cupos y donaciones.
- Seccion **Mis Viajes** refleja los trayectos asociados al usuario, permite marcar completados y aplicar acciones rapidas (chat, ruta, contacto) ademas de calificar experiencias.
- Seccion **Rutas** incorpora filtros por tipo/riesgo, badges de severidad y votaciones en cada reporte.
- **Perfil y Configuracion** muestran los datos personales/bancarios del usuario y sincronizan preferencias (tema, idioma, notificaciones y boton de panico) con su cuenta.
- El **Boton de panico** incluye cuenta regresiva configurable, registro de ubicacion y auditoria de eventos; el nuevo panel de **Operaciones** permite descargar el log para cumplimiento.

