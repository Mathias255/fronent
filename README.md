# Senderos · descubre Ecuador a tu ritmo

Interfaz web adaptable para explorar sitios turísticos, hospedajes y restaurantes; consultar ubicaciones en el mapa y guardar caminatas en una cuenta.

## Iniciar en desarrollo

1. Inicia MongoDB y la API siguiendo las instrucciones de [`../backend/README.md`](../backend/README.md).
2. Desde esta carpeta, instala las dependencias con `npm install`.
3. Ejecuta `npm start` y abre `http://localhost:4200`.

El cliente consume la API en `http://localhost:3000/api`. Configura `CORS_ORIGIN` en el backend para el origen del frontend si usas una dirección o puerto distinto.

El mapa usa OpenStreetMap y Leaflet; el mapa base y las fotografías requieren conexión a internet. Para calcular una ruta, el origen y el destino se envían a los servicios públicos de rutas de OpenStreetMap. Las búsquedas de direcciones se envían a Nominatim; las indicaciones de transporte público se consultan en Google Maps. La ubicación del navegador solo se solicita cuando la persona pulsa «Usar mi ubicación» y no se envía al servicio de rutas hasta que pulsa «Calcular cómo llegar». El mapa solo muestra lugares publicados con coordenadas GeoJSON válidas; si la API no está disponible, informa del error en lugar de mostrar ubicaciones de demostración.

## Funcionalidades

- Inicio con información de destinos y senderos. Las páginas HTML independientes son `http://localhost:4200/descubrir.html`, `/senderos.html`, `/guias.html` y `/mapa.html`.
- Descubrir consulta el catálogo del backend con búsqueda, filtros por categoría/provincia/dificultad, ordenamiento, detalle y favoritos por usuario. Senderos solo muestra destinos con metadatos publicados; no presenta distancias o trazados no verificados.
- Guías y equipo adapta consejos generales de vestimenta, calzado y preparación al destino elegido. También ofrece una búsqueda de guías locales; Senderos no certifica proveedores ni confirma disponibilidad.
- Cada lugar permite abrir el mapa con ese destino seleccionado. Calcula distancia y tiempo estimados en auto o a pie; la opción de transporte público abre Google Maps para consultar horarios y transbordos disponibles.
- Registro e inicio de sesión; el token se usa en las peticiones protegidas. Los favoritos se guardan en la cuenta.
- Planificador con fecha, duración, dificultad, participantes y preferencias; permite editar, eliminar y cambiar el estado de las caminatas propias.
- Formulario para que un administrador publique lugares en el catálogo.
- Diseño adaptable a móviles y escritorio.

## Validar

- `npm run build`
- `npm test -- --watch=false`
