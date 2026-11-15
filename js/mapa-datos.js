/* ==========================================================
   Datos del mapa de Azeroth (WoW Forever)
   - Las zonas clásicas usan los rangos de nivel de Classic:
     Forever ha rediseñado zonas y pueden cambiar un poco.
   - Mapa ilustrado y aproximado (no a escala).
   fac: A = Alianza · H = Horda · C = Disputada · S = Santuario
   r: [x, y, ancho, alto] dentro del lienzo de 600 × 1100
   ========================================================== */
const ZONAS = {
  este: [
    { id:"tirisfal",   n:"Claros de Tirisfal",          lv:[1,10],  fac:"H", r:[30,30,180,110] },
    { id:"wpl",        n:"Tierras de la Peste del Oeste", lv:[51,58], fac:"C", r:[216,30,150,120] },
    { id:"epl",        n:"Tierras de la Peste del Este",  lv:[53,60], fac:"C", r:[372,30,190,130] },
    { id:"silverpine", n:"Bosque de Argénteos",          lv:[10,20], fac:"H", r:[30,146,110,170] },
    { id:"alterac",    n:"Montañas de Alterac",          lv:[30,40], fac:"C", r:[146,156,140,80] },
    { id:"hinterlands",n:"Tierras del Interior",         lv:[40,50], fac:"C", r:[372,166,190,110] },
    { id:"hillsbrad",  n:"Laderas de Trabalomas",        lv:[20,30], fac:"C", r:[146,242,150,84] },
    { id:"arathi",     n:"Tierras Altas de Arathi",      lv:[30,40], fac:"C", r:[302,282,200,100] },
    { id:"wetlands",   n:"Los Humedales",                lv:[20,30], fac:"C", r:[232,388,190,110] },
    { id:"dunmorogh",  n:"Dun Morogh",                   lv:[1,10],  fac:"A", r:[150,504,170,96] },
    { id:"lochmodan",  n:"Loch Modan",                   lv:[10,20], fac:"A", r:[326,504,140,96] },
    { id:"searing",    n:"La Garganta de Fuego",         lv:[43,50], fac:"C", r:[210,606,130,64] },
    { id:"badlands",   n:"Tierras Inhóspitas",           lv:[35,45], fac:"C", r:[346,606,150,90] },
    { id:"burning",    n:"Las Estepas Ardientes",        lv:[50,58], fac:"C", r:[210,676,180,64] },
    { id:"riverglades",n:"The Riverglades",              lv:[35,45], fac:"C", r:[432,702,140,100], nueva:true,
      nota:"Zona nueva de Forever con más de 150 misiones, entre las Montañas Crestagrana y las Estepas Ardientes." },
    { id:"elwynn",     n:"Bosque de Elwynn",             lv:[1,10],  fac:"A", r:[140,746,170,84] },
    { id:"redridge",   n:"Montañas Crestagrana",         lv:[15,25], fac:"C", r:[316,746,110,80] },
    { id:"westfall",   n:"Páramos de Poniente",          lv:[10,20], fac:"A", r:[60,836,120,110] },
    { id:"duskwood",   n:"Bosque del Ocaso",             lv:[18,30], fac:"C", r:[186,836,170,80] },
    { id:"deadwind",   n:"Paso de la Muerte",            lv:[55,60], fac:"C", r:[362,836,70,80] },
    { id:"swamp",      n:"Pantano de las Penas",         lv:[35,45], fac:"C", r:[438,808,130,90] },
    { id:"blasted",    n:"Las Tierras Devastadas",       lv:[45,55], fac:"C", r:[438,904,130,100] },
    { id:"stranglethorn", n:"Vega de Tuercespina",       lv:[30,45], fac:"C", r:[100,922,250,170] },
    { id:"zephras",    n:"Isla de Zephras",              lv:[1,12],  fac:"C", r:[440,1010,140,76], nueva:true, nube:true,
      nota:"Zona inicial de los Surcacielos, en el Plano Elemental del Aire." }
  ],
  kalimdor: [
    { id:"teldrassil", n:"Teldrassil",                   lv:[1,10],  fac:"A", r:[40,30,120,110] },
    { id:"moonglade",  n:"Claro de la Luna",             lv:null,    fac:"S", r:[250,40,80,60] },
    { id:"darkshore",  n:"Costa Oscura",                 lv:[10,20], fac:"A", r:[170,110,80,210] },
    { id:"winterspring", n:"Cuna del Invierno",          lv:[55,60], fac:"C", r:[336,40,220,150] },
    { id:"felwood",    n:"Frondavil",                    lv:[48,55], fac:"C", r:[256,106,74,214] },
    { id:"hyjal",      n:"Monte Hyjal",                  lv:[60,60], fac:"C", r:[336,196,160,96], nueva:true,
      nota:"Zona de nivel 60 tras la derrota de Archimonde. Se entra desde Cuna del Invierno por el desfiladero Darkwhisper." },
    { id:"azshara",    n:"Azshara",                      lv:[45,55], fac:"C", r:[502,196,90,180] },
    { id:"ashenvale",  n:"Vallefresno",                  lv:[18,30], fac:"C", r:[150,326,290,100] },
    { id:"stonetalon", n:"Sierra Espolón",               lv:[15,27], fac:"C", r:[60,432,204,110] },
    { id:"durotar",    n:"Durotar",                      lv:[1,10],  fac:"H", r:[446,382,130,170] },
    { id:"barrens",    n:"Los Baldíos",                  lv:[10,25], fac:"H", r:[270,432,170,300] },
    { id:"desolace",   n:"Desolace",                     lv:[30,40], fac:"C", r:[40,548,140,140] },
    { id:"mulgore",    n:"Mulgore",                      lv:[1,10],  fac:"H", r:[186,548,80,170] },
    { id:"dustwallow", n:"Marjal Revolcafango",          lv:[35,45], fac:"C", r:[446,560,140,150] },
    { id:"shendralas", n:"Shen'dralas",                  lv:[45,53], fac:"C", r:[40,694,140,90], nueva:true,
      nota:"Zona nueva entre Desolace y Feralas, con historia de los Shen'dralar. Las fuentes no se ponen de acuerdo en su nivel (40-45 o 45-53)." },
    { id:"feralas",    n:"Feralas",                      lv:[40,50], fac:"C", r:[40,790,170,140] },
    { id:"needles",    n:"Las Mil Agujas",               lv:[25,35], fac:"C", r:[216,738,230,90] },
    { id:"ungoro",     n:"Cráter de Un'Goro",            lv:[48,55], fac:"C", r:[216,834,140,110] },
    { id:"tanaris",    n:"Tanaris",                      lv:[40,50], fac:"C", r:[362,834,200,170] },
    { id:"silithus",   n:"Silithus",                     lv:[55,60], fac:"C", r:[60,936,150,130] },
    { id:"zephras2",   n:"Isla de Zephras",              lv:[1,12],  fac:"C", r:[400,1016,170,70], nueva:true, nube:true,
      nota:"Zona inicial de los Surcacielos, en el Plano Elemental del Aire." }
  ]
};

// Mazmorras (M) y bandas (B). nueva = de WoW Forever
const INSTANCIAS = [
  // Reinos del Este — clásicas
  { n:"Las Minas de la Muerte", t:"M", lv:[17,26], z:"westfall" },
  { n:"Las Mazmorras de Ventormenta", t:"M", lv:[24,32], z:"elwynn" },
  { n:"Castillo de Colmillo Oscuro", t:"M", lv:[22,30], z:"silverpine" },
  { n:"Gnomeregan", t:"M", lv:[29,38], z:"dunmorogh" },
  { n:"Monasterio Escarlata", t:"M", lv:[30,45], z:"tirisfal" },
  { n:"Uldaman", t:"M", lv:[41,51], z:"badlands" },
  { n:"El Templo de Atal'Hakkar", t:"M", lv:[50,60], z:"swamp" },
  { n:"Profundidades de Roca Negra", t:"M", lv:[52,60], z:"searing" },
  { n:"Cumbre de Roca Negra", t:"M", lv:[55,60], z:"burning" },
  { n:"Scholomance", t:"M", lv:[58,60], z:"wpl" },
  { n:"Stratholme", t:"M", lv:[58,60], z:"epl" },
  // Reinos del Este — nuevas de Forever
  { n:"Hall of Thanes", t:"M", lv:[13,18], z:"dunmorogh", nueva:true },
  { n:"Ruins of Lordaeron", t:"M", lv:[15,20], z:"tirisfal", nueva:true },
  { n:"Excavation Site", t:"M", lv:[24,29], z:"wetlands", nueva:true },
  { n:"City of Dalaran", t:"M", lv:[28,33], z:"alterac", nueva:true, aprox:true },
  { n:"Krol'dok Stronghold", t:"M", lv:[40,45], z:"riverglades", nueva:true },
  // Kalimdor — clásicas
  { n:"Sima Ígnea", t:"M", lv:[13,18], z:"durotar" },
  { n:"Cuevas de los Lamentos", t:"M", lv:[17,24], z:"barrens" },
  { n:"Cavernas de Brazanegra", t:"M", lv:[24,32], z:"ashenvale" },
  { n:"Horado Rajacieno", t:"M", lv:[29,38], z:"barrens" },
  { n:"Zahúrda Rajacieno", t:"M", lv:[37,46], z:"needles" },
  { n:"Maraudon", t:"M", lv:[46,55], z:"desolace" },
  { n:"Zul'Farrak", t:"M", lv:[44,54], z:"tanaris" },
  { n:"La Masacre", t:"M", lv:[55,60], z:"feralas" },
  // Kalimdor — nuevas de Forever
  { n:"Alcaz Prison", t:"M", lv:[48,53], z:"dustwallow", nueva:true },
  { n:"Blackmaw Hold", t:"M", lv:[55,60], z:"azshara", nueva:true },
  { n:"Shaper's Terrace", t:"M", lv:[58,60], z:"ungoro", nueva:true },
  { n:"Hyjal Summit", t:"B", lv:[60,60], z:"hyjal", nueva:true, extra:"Banda de 20 · abre el 9 de diciembre" },
  { n:"Barrow Deeps", t:"B", lv:[60,60], z:"hyjal", nueva:true, extra:"Banda de 10 · abre el 9 de diciembre" }
];
