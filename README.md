# AplicacionTatoo

Agenda móvil para un estudio de tatuajes creada con **Expo + React Native + TypeScript**. Está pensada para trabajar desde **Visual Studio Code en Windows** y ejecutar la misma base de código en **Android, iOS y web**.

## Qué incluye la app

- Pantalla principal con estética negra y dorada inspirada en el diseño de referencia y logo personalizado de Gambo Tattoo.
- Accesos rápidos a **Consentimiento**, **Calendario** y **Facturas**.
- Formulario de consentimiento informado con datos del cliente, fecha de nacimiento, alergias, texto legal previo y firma escrita.
- Agenda de citas con cliente, fecha, hora, diseño, precio y cambio rápido entre pendiente/confirmada.
- Facturas simples con estado pendiente/pagada.
- Datos de ejemplo en memoria para empezar a probar la interfaz sin backend.

## Requisitos en Windows

1. Instala [Node.js LTS](https://nodejs.org/).
2. Instala [Visual Studio Code](https://code.visualstudio.com/).
3. Instala la app **Expo Go** en tu móvil Android o iPhone.
4. Abre este proyecto en VS Code.
5. En la terminal integrada ejecuta:

```bash
npm install
npm start
```

Después escanea el QR de Expo con Expo Go. Para Android también puedes ejecutar:

```bash
npm run android
```

Para iOS desde Windows puedes probar en un iPhone físico con Expo Go. Para compilar una app final de iOS necesitarás EAS Build o un Mac para el firmado/publicación.


## Solución de error `Missing semicolon` en `App.tsx`

Si Expo muestra un error parecido a:

```text
/App.tsx: Missing semicolon. (1:5)
> 1 | mport { useMemo, useState } from 'react';
```

significa que a la primera línea de `App.tsx` le falta la letra inicial `i`. Comprueba que el archivo empiece exactamente así:

```ts
import { useMemo, useState } from 'react';
```

Después puedes comprobar automáticamente que el archivo está bien con:

```bash
npm run check:app-import
```

Si la comprobación pasa, guarda el archivo y reinicia Expo limpiando caché:

```bash
npx expo start -c
```

## Scripts disponibles

- `npm start`: inicia el servidor de desarrollo de Expo.
- `npm run android`: abre la app en Android si hay emulador/dispositivo conectado.
- `npm run ios`: abre la app en iOS cuando el entorno lo permite.
- `npm run web`: abre una vista web de desarrollo.
- `npm run typecheck`: valida TypeScript sin generar archivos.
- `npm run check:app-import`: comprueba que `App.tsx` empieza con `import` y no con `mport`.

## Estructura principal

```text
App.tsx          # Interfaz completa de la agenda
logoData.ts      # Logo incrustado en texto para evitar archivos binarios
app.json         # Configuración Expo para Android/iOS
package.json     # Dependencias y scripts
README.md        # Guía de uso en Windows + VS Code
scripts/         # Comprobaciones auxiliares del proyecto
```

## Siguientes mejoras recomendadas

- Guardar citas y facturas en una base de datos local o en Firebase/Supabase.
- Exportar consentimientos y facturas a PDF.
- Añadir autenticación para proteger datos de clientes.
- Sustituir el logo dibujado por un archivo de marca definitivo.
