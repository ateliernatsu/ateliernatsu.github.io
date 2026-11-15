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
