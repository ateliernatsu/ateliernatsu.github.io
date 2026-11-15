# Web de El Atelier Natsu

## Qué hay aquí
- `index.html` — el libro: portada, dobles páginas y post-its.
- `js/datos.js` — **lo que se edita**: enlace de Discord, rangos, canales, miembros, eventos de ejemplo, noticias, add-ons e imágenes.
- `js/mapa-datos.js` — zonas y mazmorras del mapa de Azeroth.
- `css/libro.css`, `js/libro.js`, `js/mapa.js` — diseño y funcionamiento (no hace falta tocarlos).
- `img/` — imágenes (personajes, chibi y, cuando las tengas, los escritorios de ChatGPT).
- `scripts/sync-discord.mjs` — lee los eventos del Discord y crea `eventos.json`.
- `.github/workflows/sync-discord.yml` — ejecuta ese script solo, cada 30 minutos.

Mientras no exista `eventos.json`, el calendario muestra los eventos de ejemplo de la zona editable.

## Calendario conectado con Discord (gratis, con GitHub Pages)

1. **Crea el bot**: en https://discord.com/developers/applications → New Application → Bot → *Reset Token* y copia el token. Guárdalo bien, es como una contraseña.
2. **Invítalo al servidor**: OAuth2 → URL Generator → marca `bot` y el permiso *View Channels*. Abre la URL que sale y añádelo al Atelier.
3. **Copia el ID del servidor**: en Discord, Ajustes → Avanzado → Modo desarrollador. Luego clic derecho sobre el servidor → *Copiar ID del servidor*.
4. **Sube esta carpeta a un repositorio de GitHub** y activa Pages (Settings → Pages → rama `main`).
5. En el repositorio, Settings → Secrets and variables → Actions:
   - en *Secrets*, crea `DISCORD_BOT_TOKEN` con el token;
   - en *Variables*, crea `DISCORD_GUILD_ID` con el ID del servidor.
6. Pestaña **Actions** → "Sincronizar calendario con Discord" → *Run workflow* para probarlo.

## Cómo crear eventos para que salgan en la web
Crea un **Evento** normal en Discord (el botón "Eventos" de arriba del todo de la lista de canales) y pon el tipo entre corchetes al principio del título:

- `[Leveo] Subida en grupo por los Baldíos`
- `[Mazmorra] Minas de la Muerte`
- `[Banda] Primera banda al 60`
- `[Quedada] Hoguera de fin de mes`

Sin corchetes sale como "Quedada". El botón "Apuntarme" de la web lleva directamente al evento en Discord.

## "Ahora en el taller" (quién está conectado)
En Discord: Ajustes del servidor → **Widget** → activa *Habilitar widget del servidor* y copia el **ID del servidor**. Pégalo en `DISCORD_SERVER_ID`, en `js/datos.js`. Sale en la primera página del libro quién está conectado, quién está en cada canal de voz y cuántos están jugando a WoW. Se actualiza solo cada minuto. Sin ID, se ven datos de ejemplo.

Discord limita el widget a unos 100 conectados y solo enseña a quien no se ha marcado como invisible.

## Imágenes hechas con ChatGPT
Mira `PROMPTS-CHATGPT.md`. Guarda cada imagen en la carpeta `img/` y escribe su nombre en `IMAGENES`, en `js/datos.js`.

## Dominio ateliernatsu.com
Cómpralo en un registrador y, en GitHub → Settings → Pages → *Custom domain*, escribe `ateliernatsu.com`. GitHub te dice qué registros DNS tienes que añadir en el registrador.

## Añadir un miembro
Cada persona se hace su carnet en el libro (La Hermandad → Tu carnet) y pulsa **Copiar mi ficha**. Te pasa ese texto por Discord: pégalo dentro de `MEMBERS` en `js/datos.js`. Si te manda foto, guárdala en `img/` con el nombre que pone la ficha. Cada miembro tiene su propia hoja en el libro.

## "Ahora en el taller" por rangos
El bot (el mismo del calendario) guarda `taller.json` con el rango y la etiqueta 🍁 Forever
de cada miembro. Reconoce los roles por su nombre: Maestra del Atelier, Guardián del Atelier,
Artífice, Artesano, Aprendiz, Visitante de Verano y cualquier rol que contenga "Forever".
Necesita **Server Members Intent** activado en el Developer Portal → tu app → Bot.
