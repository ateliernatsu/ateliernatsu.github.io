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

const eventos = raw.map(e => {
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
