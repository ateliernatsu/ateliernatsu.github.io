/* ==========================================================
   ✏️  DATOS DE LA WEB — todo lo que se edita está aquí
   (textos, rangos, miembros, eventos, noticias, add-ons…)
   ========================================================== */

// 1) Invitación permanente de Discord (créala "sin caducidad")
const DISCORD_URL = "https://discord.gg/FX9znU69Ge";

// 2) ID del servidor, para "Ahora en el taller" en directo.
//    Discord → Ajustes del servidor → Widget → activar y copiar el ID.
const DISCORD_SERVER_ID = "1500922112020447234";

// 3) Imágenes propias (ChatGPT). "" = se usan los dibujos por defecto.
const IMAGENES = {
  // Entrada: escritorio con el grimorio cerrado y abierto (día / noche)
  introDia:          "img/intro-dia.webp",
  introNoche:        "img/intro-noche.webp",
  introAbiertoDia:   "img/intro-abierto-dia.webp",
  introAbiertoNoche: "img/intro-abierto-noche.webp",
  // Dónde está el libro dentro de esas imágenes (en píxeles de la imagen de 1672×941)
  libroEnImagen:     { x:430, y:255, ancho:770, alto:615 },
  // Fondo del escritorio vacío, detrás del libro abierto
  escritorioDia:     "img/escritorio-dia.webp",
  escritorioNoche:   "img/escritorio-noche.webp",
  tapa:              "img/tapa.webp",
  logo:              "",
  rangos: { visitante:"img/rango-visitante.webp", aprendiz:"img/rango-aprendiz.webp", artesano:"img/rango-artesano.webp",
            artifice:"img/rango-artifice.webp", guardian:"img/rango-guardian.webp", maestra:"img/rango-maestra.webp" },
  chibi:             "img/chibi-maestra.webp",
  emotes:            "img/emotes/"   // hola, corazon, risa, verguenza, ilusion, enfado, llanto, cafe, guino, manta, gamer, tanque, tesoro, curando, fantasma, galleta, trofeo, sin-oro
};

// 4) Rangos del gremio (de menor a mayor) — los dan los Guardianes
const RANKS = [
  { id:"visitante", icono:"🌱", nombre:"Visitante de Verano", color:"#a8d08d",
    corto:"Recién llegados. ¡Así empezamos todos!", lema:"«Bienvenid@ al taller»",
    quien:["Acabas de cruzar la puerta del Atelier","Ya has rellenado el formulario y aceptado el juramento","Es buen momento para presentarte y saludar en la hoguera"],
    llegar:["Es el rango con el que entra todo el mundo 🌱"] },
  { id:"aprendiz", icono:"🎨", nombre:"Aprendiz", color:"#8bc96a",
    corto:"Encontrando su sitio en el taller.", lema:"«Aprendiendo el oficio»",
    quien:["Ya te has presentado y vas conociendo a la gente","Te apuntas a grupos, expediciones y quedadas"],
    llegar:["Lo dan los Guardianes cuando te ven por el taller"] },
  { id:"artesano", icono:"🔨", nombre:"Artesano", color:"#6fc3d0",
    corto:"Miembros establecidos, llevan tiempo con nosotros.", lema:"«Cada quien con su oficio»",
    quien:["Forman parte del día a día del Atelier","Comparten sus oficios en el mercadillo y echan una mano"],
    llegar:["Lo dan los Guardianes con el tiempo y la convivencia"] },
  { id:"artifice", icono:"⚔️", nombre:"Artífice", color:"#c08ae0",
    corto:"Veteranos de confianza que mantienen vivo el taller.", lema:"«Los que mantienen el fuego encendido»",
    quien:["Veteranos de confianza del Atelier","Mantienen vivo el taller día a día"],
    llegar:["Lo dan los Guardianes"] },
  { id:"guardian", icono:"🔥", nombre:"Guardián del Atelier", color:"#e8835a",
    corto:"Mano derecha de la Maestra: velan por la llama.", lema:"«Velan por la llama»",
    quien:["Cuidan de la comunidad","Dan los rangos del gremio","Tienen su sala: ✦guardianes-del-atelier✧"],
    llegar:["Los elige la Maestra"] },
  { id:"maestra", icono:"👑", nombre:"Maestra del Atelier", color:"#e9c46a",
    corto:"La fundadora, la que encendió la primera hoguera.", lema:"«La que encendió la primera hoguera»",
    quien:["Fundó el Atelier","Lleva la hermandad, el Discord y esta web"],
    llegar:["Solo hay una 🏮"] }
];

// 5) Roles que elige cada uno en "Canales y roles"
const SELF_ROLES = [
  { grupo:"Aventura", nota:"Abre los canales de tu ala", roles:["🌙 Midnight","🍁 Forever"] },
  { grupo:"Papel en grupo", nota:"Te avisan cuando falta tu papel", roles:["🛡️ Tank","💚 Healer","⚔️ DPS"] },
  { grupo:"Ayuda", nota:"Acompañas a los nuevos", roles:["🧭 Mentor"] },
  { grupo:"Horario", nota:"Cuándo sueles conectarte", roles:["🌅 Mañanas","☀️ Tardes","🌃 Noches","🦉 Madrugada","🎉 Fin de semana"] },
  { grupo:"Oficios", nota:"Para encargos en el mercadillo", ancho:true,
    roles:["🧵 Sastrería","✨ Encantamiento","🪡 Peletería","⚒️ Herrería","⚗️ Alquimia","⚙️ Ingeniería","⛏️ Minería","🌿 Herboristería","🔪 Desuello","🍳 Cocina","🩹 Primeros Auxilios","🎣 Pesca"] }
];

// 6) El mapa del Discord: categorías y canales  [emoji, nombre, descripción, privado?]
const CATS = [
  { id:"bienvenida", emoji:"🌸", nombre:"Bienvenida", tag:"Empieza aquí", canales:[
    ["🌸","sobre-el-atelier","Quiénes somos y de dónde venimos"],
    ["📜","el-juramento","Las normas del taller. Acéptalo para poder escribir"],
    ["📩","carta-de-solicitud","Pide tu invitación a la hermandad"],
    ["🗺️","cómo-funciona","Las guías ilustradas del servidor"],
    ["🌸","bienvenida","Aquí saludamos a quien llega"] ]},
  { id:"comun", emoji:"🍵", nombre:"La Sala Común", tag:"Para todos", canales:[
    ["🎭","preséntate","Cuéntanos quién eres"],
    ["🔥","hoguera","El chat general: aquí se habla de todo"],
    ["🎵","música","Lo que suena en el taller"],
    ["🔒","guardianes-del-atelier","Solo Guardianes y Maestra", true],
    ["🍁","wow-forever","Novedades y charla de WoW Forever"] ]},
  { id:"eterna", emoji:"🍂", nombre:"El Ala Eterna", tag:"WoW Forever", nuestra:true, canales:[
    ["🔥","hoguerita-en-pruebas","El chat de hermandad del juego, en Discord (en pruebas)"],
    ["💬","buscar-grupo","Busca gente para mazmorras y misiones"],
    ["🧵","forja-y-telar","Profesiones: recetas, materiales y dudas"],
    ["🐾","bestiario","Bestias y criaturas de Azeroth"],
    ["🗺️","expediciones","Foro: salidas organizadas en grupo"],
    ["🧺","el-mercadillo","Foro: pide u ofrece encargos de oficios"] ]},
  { id:"voz", emoji:"🎙️", nombre:"Voz", tag:"Canales de voz", canales:[
    ["🔥","La hoguerita","El canal de voz principal"],
    ["🫖","La Trastienda","Charla tranquila"],
    ["🗺️","Expedición I","Para grupos de mazmorra"],
    ["🗺️","Expedición II","Para grupos de mazmorra"],
    ["🗺️","Expedición III","Para grupos de mazmorra"],
    ["😴","la-siesta","AFK: aquí se duerme la siesta"] ]},
  { id:"medianoche", emoji:"🌙", nombre:"El Ala de Medianoche", tag:"Midnight", midnight:true, canales:[
    ["🐉","raids-y-mazmorras","Foro de bandas y mazmorras de Midnight"],
    ["🗓️","calendario-eventos","Eventos del ala de Midnight"] ]},
  { id:"taller", emoji:"🧵", nombre:"El Taller", tag:"Foros", canales:[
    ["📷","screenshots","Vuestras capturas"],
    ["👗","transfiguraciones","Conjuntos y modelitos"],
    ["🐴","monturas","Monturas que vais consiguiendo"],
    ["🐾","pets","Mascotas"],
    ["🏠","housing","Casas y decoración"],
    ["🎨","art","Arte de la comunidad"],
    ["⚙️","addons","Addons recomendados y configuraciones"] ]},
  { id:"guerra", emoji:"⚔️", nombre:"Cámara de Guerra", tag:"Guías", canales:[
    ["📢","eltablero","Anuncios del taller"],
    ["📚","biblioteca","Guías y recursos"],
    ["❓","dudas-de-clase","Pregunta lo que quieras de tu clase"] ]}
];

// 7) Eventos de ejemplo — solo se usan si no existe eventos.json
//    (eventos.json lo genera la sincronización con Discord)
//    tipo: "Leveo" | "Mazmorra" | "Banda" | "Quedada"
const EVENTOS_EJEMPLO = [
  { titulo:"Leveo en grupo", tipo:"Leveo", inicio:"2026-11-15T22:00", fin:"2026-11-16T00:00", lugar:"La hoguerita", descripcion:"Subimos de nivel juntos. Trae ganas de matar bichos en área." },
  { titulo:"Mazmorra por nivel", tipo:"Mazmorra", inicio:"2026-11-18T21:30", fin:"2026-11-18T23:30", lugar:"Expedición I", descripcion:"Grupo de cinco para la mazmorra que nos toque por nivel." },
  { titulo:"Ruta de recolección", tipo:"Leveo", inicio:"2026-11-20T19:00", fin:"2026-11-20T21:00", lugar:"La Trastienda", descripcion:"Hierbas, minerales y pieles para los artesanos del taller." },
  { titulo:"Mazmorra nueva de Forever", tipo:"Mazmorra", inicio:"2026-11-22T21:00", fin:"2026-11-22T23:30", lugar:"Expedición I", descripcion:"A descubrirla a ciegas, sin guías. Como en 2004." },
  { titulo:"Leveo en grupo", tipo:"Leveo", inicio:"2026-11-26T22:00", fin:"2026-11-27T00:00", lugar:"La hoguerita", descripcion:"Seguimos donde lo dejamos." },
  { titulo:"Hoguera de fin de mes", tipo:"Quedada", inicio:"2026-11-29T21:00", fin:"2026-11-29T23:00", lugar:"La hoguerita", descripcion:"Charla, capturas del mes y planes para diciembre." }
];

// 8) Noticias de WoW Forever (la más nueva primero) · imagen:"img/..." opcional
const NOTICIAS = [
  { fecha:"2026-11-05", etiqueta:"Lanzamiento", fuente:"Blizzard",
    titulo:"WoW Forever ya está abierto en todo el mundo",
    resumen:"Salida mundial el 5 de noviembre. La historia arranca tras Warcraft III y antes del Núcleo de Magma, y recorre los continentes originales hasta el nivel 60.",
    url:"https://news.blizzard.com/article/24315820/11-5" },
  { fecha:"2026-11-04", etiqueta:"Clases", fuente:"Warcraft Tavern (EN)",
    titulo:"Cambios de clase y correcciones antes del lanzamiento",
    resumen:"Blizzard publicó notas de desarrollo con los ajustes hechos desde que terminó la beta.",
    url:"https://www.warcrafttavern.com/forever/news/wow-forever-pre-launch-class-changes-bug-fixes/" },
  { fecha:"2026-10-10", etiqueta:"Sistema", fuente:"Vandal",
    titulo:"Nombres con apellido… y censura para los graciosos",
    resumen:"Cada personaje lleva nombre y apellido. Blizzard avisa de que las combinaciones vulgares se cambiarán.",
    url:"https://vandal.elespanol.com/noticias/pc/world-of-warcraft-forever/240051" },
  { fecha:"2026-09-14", etiqueta:"Contenido", fuente:"Vandal",
    titulo:"Mucho más que un Classic+",
    resumen:"Zonas nuevas, clases revisadas, megarreinos y una renovación técnica para que los veteranos redescubran Azeroth.",
    url:"https://vandal.elespanol.com/noticias/pc/world-of-warcraft-forever/240051" },
  { fecha:"", etiqueta:"Contenido", fuente:"Blizzard",
    titulo:"Más de 1000 misiones y zonas rediseñadas",
    resumen:"Los Reinos del Este y Kalimdor crecen con zonas nuevas y rediseñadas camino del nivel 60.",
    url:"https://news.blizzard.com/es-mx/article/24315643" },
  { fecha:"", etiqueta:"Contenido", fuente:"GosuGamers (EN)",
    titulo:"Nueve mazmorras y dos bandas nuevas",
    resumen:"Además de las zonas nuevas, el contenido de grupo crece. El nivel máximo se queda en 60 a largo plazo.",
    url:"https://www.gosugamers.net/entertainment/news/79158-world-of-warcraft-forever-revealed-set-to-launch-4-november" }
];

// 9) Miembros (se muestran como carnets del taller)
//    tema: "noche" | "aurora" | "sakura" | "bosque" | "ambar" | "cielo"
//    rango: id de RANKS (visitante, aprendiz, artesano, artifice, guardian, maestra)
//    El carnet de la web genera esta ficha: cada miembro la copia y te la pasa.
//    chibi:"img/..." (opcional) = su dibujo chibi de cuerpo entero, sale junto a su foto
const MEMBERS = [
  { nombre:"Fairy Heart", raza:"Surcacielos", clase:"Maga", rol:"DPS", rango:"maestra", tema:"sakura", sticker:"🌸",
    lema:"Sastrería · Encantamiento", imagen:"img/miembro-maga.webp", chibi:"img/chibi-maestra.webp" },
  { nombre:"Blooms Heart", raza:"Surcacielos", clase:"Cazadora", rol:"DPS", rango:"maestra", tema:"aurora", sticker:"🏹",
    lema:"Su grifo azul la acompaña", imagen:"img/miembro-cazadora.webp", mascota:"img/mascota-grifo.webp", chibi:"img/chibi-arquera.webp" }
];

// 10) Add-ons recomendados por el taller
//     Copia el bloque de ejemplo, quita las barras // y rellénalo.
const ADDONS = [
  // { nombre:"Nombre del addon", icono:"🧭", categoria:"Misiones",
  //   descripcion:"Para qué sirve y por qué nos gusta.",
  //   enlace:"https://www.curseforge.com/...", recomienda:"Tu nombre" },
];

// Colores de clase
const CLASS_COLORS = {
  "Druida":"#ff7c0a","Maga":"#3fc7eb","Mago":"#3fc7eb","Cazadora":"#aad372","Cazador":"#aad372",
  "Sacerdote":"#d8d2c4","Sacerdotisa":"#d8d2c4","Paladín":"#f48cba","Pícaro":"#e8d35a","Pícara":"#e8d35a",
  "Chamán":"#2a8cff","Brujo":"#8788ee","Bruja":"#8788ee","Guerrero":"#c69b6d","Guerrera":"#c69b6d"
};
