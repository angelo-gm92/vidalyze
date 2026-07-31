# VIDALYZE — Video Analyser

VIDALYZE es una herramienta sencilla y visual para analizar vídeos a partir de una URL directa.  
Permite obtener información técnica del vídeo, ver una vista previa, descargarlo y gestionar un historial de análisis.

---

## Características principales

- Introducción de una **URL directa** a un archivo de vídeo.
- Visualización de **detalles técnicos** del vídeo:
  - duración  
  - resolución  
  - formato  
  - códecs  
  - bitrate  
  - FPS  
  - subtítulos disponibles  
- **Vista previa** del vídeo dentro de la aplicación.
- **Descarga directa** del vídeo (si la URL lo permite).
- **Historial** de análisis con fecha y hora.
- Posibilidad de **borrar entradas** del historial.
- **Modo claro / oscuro** con un interruptor estilo iPhone.
- Elementos de la interfaz que **se adaptan dinámicamente** según la acción del usuario.

---

## Enlaces de prueba

Puedes usar estos vídeos para comprobar el funcionamiento:

- https://www.w3schools.com/html/mov_bbb.mp4  
- https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4  
- https://filesamples.com/samples/video/mp4/sample_640x360.mp4  

---

## Comentarios y estado del proyecto

Actualmente, el análisis funciona correctamente con **enlaces directos a archivos de vídeo**.  
Sin embargo:

- No he logrado obtener información desde **YouTube** ni desde enlaces que no sean directos.
- El código para analizar vídeos de YouTube está presente, pero **no funciona todavía**.
- Me gustaría retomar este proyecto más adelante para:
  - mejorar la compatibilidad con más plataformas  
  - ampliar las funciones de análisis  
  - optimizar el diseño y la experiencia de usuario
  