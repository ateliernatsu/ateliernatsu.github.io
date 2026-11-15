// Lee los eventos programados del servidor de Discord y los guarda en eventos.json
// La web lee ese archivo para pintar el calendario.
//
// Necesita dos variables de entorno:
//   DISCORD_BOT_TOKEN  → token del bot (secreto, NUNCA lo pegues en la web)
//   DISCORD_GUILD_ID   → ID del servidor de Discord
//
// Para saber de qué tipo es cada evento, pon el tipo entre corchetes al principio
// del título del evento en Discord, por ejemplo:  "[Mazmorra] Minas de la Muerte"
// Tipos reconocidos: Leveo, Mazmorra, Banda, Quedada. Si no hay corchetes → "Quedada".
//
// Además guarda taller.json con el rango y la etiqueta Forever de cada miembro,
// para que "Ahora en el taller" los agrupe por rango. Para eso el bot necesita
// tener activado "Server Members Intent" en el Developer Portal (pestaña Bot).

import { writeFile } from "node:fs/promises";

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD = process.env.DISCORD_GUILD_ID;
if (!TOKEN || !GUILD) {
  console.error("Faltan DISCORD_BOT_TOKEN o DISCORD_GUILD_ID");
  process.exit(1);
}

const res = await fetch(
  `https://discord.com/api/v10/guilds/${GUILD}/scheduled-events?with_user_count=true`,
  { headers: { Authorization: `Bot ${TOKEN}` } }
);
if (!res.ok) {
  console.error("Discord respondió", res.status, await res.text());
  process.exit(1);
}
const raw = await res.json();

// Nombres de canales de voz, para mostrar "La Trastienda" en vez de un ID
const chRes = await fetch(`https://discord.com/api/v10/guilds/${GUILD}/channels`, {
  headers: { Authorization: `Bot ${TOKEN}` },
});
const channels = chRes.ok ? await chRes.json() : [];
const chName = id => channels.find(c => c.id === id)?.name ?? "";

const TIPOS = { leveo: "Leveo", mazmorra: "Mazmorra", banda: "Banda", raid: "Banda", quedada: "Quedada" };

let eventos = raw.map(e => {
  const m = e.name.match(/^\s*\[([^\]]+)\]\s*(.*)$/);
  const tipo = m ? (TIPOS[m[1].trim().toLowerCase()] ?? "Quedada") : "Quedada";
  return {
    titulo: m ? m[2] : e.name,
    tipo,
    inicio: e.scheduled_start_time,
    fin: e.scheduled_end_time ?? null,
    lugar: e.entity_metadata?.location || chName(e.channel_id),
    descripcion: (e.description ?? "").slice(0, 280),
    apuntados: e.user_count ?? 0,
    enlace: `https://discord.com/events/${GUILD}/${e.id}`,
  };
}).sort((a, b) => a.inicio.localeCompare(b.inicio));

// ---------- Posts del foro de expediciones ----------
// Cada post del foro "expediciones" sale en el calendario si su título lleva fecha:
//   [Mazmorra] 16/11 19:00 Ruinas de Lordaeron
//   [Banda] 22/11/2026 21:30 Núcleo de Magma
//   Minas de la Muerte 18/11 18:00            (sin corchetes → tipo por etiqueta del foro o Quedada)
// La hora se entiende en hora de España. Sin hora → 20:00. Sin fecha → no sale.
const ZONA = "Europe/Madrid";
function aISO(dia, mes, anyo, h, min) {
  // calcula el desfase de Madrid para esa fecha (invierno +01:00, verano +02:00)
  const guess = new Date(Date.UTC(anyo, mes - 1, dia, h, min));
  const enMadrid = new Date(guess.toLocaleString("en-US", { timeZone: ZONA }));
  const enUTC = new Date(guess.toLocaleString("en-US", { timeZone: "UTC" }));
  return new Date(guess.getTime() - (enMadrid - enUTC)).toISOString();
}
try {
  const foro = channels.find(c => c.type === 15 && /expedicion/i.test(c.name));
  if (foro) {
    const etiqueta = id => foro.available_tags?.find(t => t.id === id)?.name ?? "";
    const hilos = [];
    const act = await fetch(`https://discord.com/api/v10/guilds/${GUILD}/threads/active`, { headers: { Authorization: `Bot ${TOKEN}` } });
    if (act.ok) hilos.push(...(await act.json()).threads.filter(t => t.parent_id === foro.id));
    const arc = await fetch(`https://discord.com/api/v10/channels/${foro.id}/threads/archived/public?limit=50`, { headers: { Authorization: `Bot ${TOKEN}` } });
    if (arc.ok) hilos.push(...(await arc.json()).threads);
    const vistos = new Set(), ahora = new Date(), deForo = [];
    for (const t of hilos) {
      if (vistos.has(t.id)) continue; vistos.add(t.id);
      let nombre = t.name;
      let tipo = null;
      const br = nombre.match(/^\s*\[([^\]]+)\]\s*/);
      if (br) { tipo = TIPOS[br[1].trim().toLowerCase()] ?? null; nombre = nombre.slice(br[0].length); }
      if (!tipo) for (const id of t.applied_tags ?? []) { const k = etiqueta(id).toLowerCase().replace(/[^a-záéíóú]/g, ""); if (TIPOS[k]) { tipo = TIPOS[k]; break; } }
      const f = nombre.match(/(\d{1,2})[\/\-.](\d{1,2})(?:[\/\-.](\d{2,4}))?/);
      if (!f) continue;
      const hm = nombre.slice(f.index + f[0].length).match(/(\d{1,2})[:.h](\d{2})/) ?? nombre.match(/(\d{1,2}):(\d{2})/);
      const dia = +f[1], mes = +f[2];
      let anyo = f[3] ? (+f[3] < 100 ? 2000 + +f[3] : +f[3]) : ahora.getFullYear();
      if (!f[3] && new Date(anyo, mes - 1, dia) < new Date(ahora - 60 * 864e5)) anyo++;
      const inicio = aISO(dia, mes, anyo, hm ? +hm[1] : 20, hm ? +hm[2] : 0);
      if (new Date(inicio) < new Date(ahora - 2 * 864e5)) continue; // ya pasó
      let titulo = nombre.replace(f[0], "");
      if (hm) titulo = titulo.replace(hm[0], "");
      titulo = titulo.replace(/\s*(a las|·|-|–|—)\s*$/i, "").replace(/^\s*(·|-|–|—)\s*/, "").replace(/\s{2,}/g, " ").trim();
      deForo.push({
        titulo: titulo || "Expedición", tipo: tipo ?? "Quedada", inicio, fin: null,
        lugar: "Foro de expediciones", foro: true, descripcion: "", apuntados: 0,
        enlace: `https://discord.com/channels/${GUILD}/${t.id}`,
      });
    }
    // si ya existe un Evento de Discord con el mismo título y día, no lo duplicamos
    const clave = e => e.titulo.toLowerCase().replace(/[^a-z0-9]/g, "") + e.inicio.slice(0, 10);
    const ya = new Set(eventos.map(clave));
    eventos = eventos.concat(deForo.filter(e => !ya.has(clave(e)))).sort((a, b) => a.inicio.localeCompare(b.inicio));
    console.log(`Foro de expediciones: ${deForo.length} posts con fecha`);
  }
} catch (e) {
  console.error("No se pudo leer el foro de expediciones:", e.message);
}

await writeFile("eventos.json", JSON.stringify(eventos, null, 2) + "\n");
console.log(`Guardados ${eventos.length} eventos en eventos.json`);

// ---------- Rangos y etiqueta Forever (taller.json) ----------
// Se busca el rango por el NOMBRE del rol en Discord (sin emojis ni mayúsculas).
const RANGOS = [ // de mayor a menor: si alguien tiene varios, gana el primero
  ["maestra",   ["maestra del atelier", "maestra"]],
  ["guardian",  ["guardian del atelier", "guardian", "guardiana"]],
  ["artifice",  ["artifice"]],
  ["artesano",  ["artesano", "artesana", "artesan@"]],
  ["aprendiz",  ["aprendiz"]],
  ["visitante", ["visitante de verano", "visitante"]],
];
const limpia = t => String(t ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9@ ]/g, " ").replace(/\s+/g, " ").trim();

try {
  const rRes = await fetch(`https://discord.com/api/v10/guilds/${GUILD}/roles`, { headers: { Authorization: `Bot ${TOKEN}` } });
  const roles = rRes.ok ? await rRes.json() : [];
  const rolNombre = Object.fromEntries(roles.map(r => [r.id, limpia(r.name)]));

  let miembros = [], after = "0";
  for (let i = 0; i < 20; i++) {
    const mRes = await fetch(`https://discord.com/api/v10/guilds/${GUILD}/members?limit=1000&after=${after}`,
      { headers: { Authorization: `Bot ${TOKEN}` } });
    if (!mRes.ok) throw new Error(`miembros: ${mRes.status} ${await mRes.text()}`);
    const lote = await mRes.json();
    miembros.push(...lote);
    if (lote.length < 1000) break;
    after = lote.at(-1).user.id;
  }

  const taller = miembros.filter(m => !m.user.bot).map(m => {
    const nombres = m.roles.map(id => rolNombre[id] ?? "");
    const rango = RANGOS.find(([, claves]) => nombres.some(n => claves.includes(n)))?.[0] ?? null;
    const forever = nombres.some(n => n.split(" ").includes("forever"));
    const alias = [...new Set([m.nick, m.user.global_name, m.user.username].filter(Boolean))];
    return { nombres: alias, rango, forever };
  }).filter(m => m.rango || m.forever);

  await writeFile("taller.json", JSON.stringify(taller, null, 2) + "\n");
  console.log(`Guardados ${taller.length} miembros en taller.json`);
} catch (e) {
  console.error("No se pudieron leer los rangos (¿falta Server Members Intent?):", e.message);
}
