/* ==========================================================
   El Atelier Natsu · el libro del taller (lógica)
   No hace falta tocar nada aquí: los datos están en datos.js
   ========================================================== */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm = t => String(t).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const isMobile = () => matchMedia('(max-width:900px)').matches;
function toast(msg, emo){ const t=$('toast'); t.innerHTML = (emo && IMAGENES.emotes ? `<img src="${IMAGENES.emotes}${emo}.webp" alt="">` : '') + esc(msg); t.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('show'),2400); }

/* ---------------- Sonidos y confeti ---------------- */
let actx;
const ac = () => (actx ||= new (window.AudioContext||window.webkitAudioContext)());
function chime(i=0){
  try{ const c=ac(), now=c.currentTime, scale=[523.25,587.33,659.25,783.99,880,1046.5,1174.66,1318.5,1567.98];
    const f = scale[Math.abs(i) % scale.length];
    [1, 2.76, 5.4].forEach((m,k)=>{ const o=c.createOscillator(), g=c.createGain();
      o.type='sine'; o.frequency.value=f*m; g.gain.setValueAtTime(0,now);
      g.gain.linearRampToValueAtTime(.1/(k+1),now+.01); g.gain.exponentialRampToValueAtTime(.0001,now+2/(k+1));
      o.connect(g).connect(c.destination); o.start(now); o.stop(now+2.3); });
  }catch{}
}
function rustle(){
  try{ const c=ac(), now=c.currentTime, len=c.sampleRate*.35, buf=c.createBuffer(1,len,c.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<len;i++){ const t=i/len; d[i]=(Math.random()*2-1)*Math.sin(Math.PI*t)*.6; }
    const src=c.createBufferSource(), f=c.createBiquadFilter(), g=c.createGain();
    f.type='bandpass'; f.frequency.value=2400; f.Q.value=.6; g.gain.value=.12; src.buffer=buf; src.connect(f).connect(g).connect(c.destination); src.start(now);
  }catch{}
}
function confetti(x, y, n=26){
  const cols = ['#d0578a','#f2a7c4','#6c8fd8','#ecc77f','#6f9a6a'];
  for (let i=0;i<n;i++){
    const d = document.createElement('span'); const a = Math.random()*Math.PI*2, v = 60+Math.random()*130;
    d.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:8px;height:8px;border-radius:${Math.random()>.5?'50%':'2px'};background:${cols[i%5]};z-index:200;pointer-events:none;transition:transform 1.1s cubic-bezier(.2,.8,.3,1),opacity 1.1s`;
    document.body.appendChild(d);
    requestAnimationFrame(()=>{ d.style.transform = `translate(${Math.cos(a)*v}px,${Math.sin(a)*v+70}px) rotate(${Math.random()*360}deg)`; d.style.opacity = 0; });
    setTimeout(()=>d.remove(), 1200);
  }
}

/* ---------------- Día / noche ---------------- */
let modeManual = null;
const INTRO = !!(IMAGENES.introDia && IMAGENES.introNoche && IMAGENES.introAbiertoDia && IMAGENES.introAbiertoNoche);
function applyMode(m){
  document.body.classList.toggle('dia', m==='dia'); document.body.classList.toggle('noche', m==='noche');
  document.querySelectorAll('#daynight button').forEach(b=>b.classList.toggle('on', b.dataset.m===m));
  const img = m==='dia' ? IMAGENES.escritorioDia : IMAGENES.escritorioNoche;
  $('desk').classList.toggle('has-img', !!img);
  if (img) $('deskImg').style.backgroundImage = `url("${img}")`;
  if (INTRO){ $('introClosed').style.backgroundImage = `url("${m==='dia'?IMAGENES.introDia:IMAGENES.introNoche}")`;
    $('introOpened').style.backgroundImage = `url("${m==='dia'?IMAGENES.introAbiertoDia:IMAGENES.introAbiertoNoche}")`; }
}
const autoMode = () => { const h = new Date().getHours(); return (h >= 8 && h < 20) ? 'dia' : 'noche'; };
document.querySelectorAll('#daynight button').forEach(b => b.onclick = () => { modeManual = b.dataset.m; applyMode(modeManual); chime(b.dataset.m==='dia'?4:1); });
applyMode(autoMode());
setInterval(() => { if (!modeManual) applyMode(autoMode()); }, 60000);

if (IMAGENES.tapa){ const f = document.querySelector('.cv-face'); f.style.backgroundImage = `linear-gradient(rgba(0,0,0,.05),rgba(0,0,0,.25)), url("${IMAGENES.tapa}")`; f.style.backgroundSize = 'cover'; f.style.backgroundPosition = 'center'; f.classList.add('has-tapa'); }

/* motas de polvo (día) / luciérnagas (noche) */
(function(){
  const cv = $('motes'), ctx = cv.getContext('2d'); const dpr = devicePixelRatio||1; let W,H,ps=[];
  function size(){ W=cv.width=innerWidth*dpr; H=cv.height=innerHeight*dpr;
    ps = Array.from({length:46},()=>({x:Math.random()*W,y:Math.random()*H,a:Math.random()*6,s:.15+Math.random()*.35,r:(.8+Math.random()*1.8)*dpr})); }
  size(); addEventListener('resize', size);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  (function f(){ requestAnimationFrame(f); ctx.clearRect(0,0,W,H); const night = document.body.classList.contains('noche');
    for (const p of ps){ p.a += .01; p.x += Math.cos(p.a)*p.s*dpr; p.y += (night ? Math.sin(p.a*1.3)*p.s : -p.s*.6)*dpr; if (p.y < -10) p.y = H+10;
      ctx.globalAlpha = night ? .35+.45*Math.sin(p.a*3) : .25+.25*Math.sin(p.a*2);
      ctx.fillStyle = night ? '#ffd9a0' : '#fff3d0'; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7); ctx.fill(); }
  })();
})();

/* ---------------- Imágenes y Discord ---------------- */
document.querySelectorAll('.js-chibi').forEach(img => { if (IMAGENES.chibi) img.src = IMAGENES.chibi; else img.remove(); });
document.querySelectorAll('.js-discord').forEach(a => a.href = DISCORD_URL);
$('inviteText').textContent = DISCORD_URL.replace(/^https?:\/\//,'');
$('copyBtn').onclick = async () => {
  try { await navigator.clipboard.writeText(DISCORD_URL); toast('Enlace copiado, ¡nos vemos en la hoguera!', 'corazon'); }
  catch { toast('Selecciona el enlace y cópialo a mano'); }
};

/* ==========================================================
   CONTENIDO
   ========================================================== */

/* ---------- Ahora en el taller ---------- */
const LIVE_EJEMPLO = {
  presence_count: 7,
  channels: [{id:"v1", name:"✦La hoguerita✧"},{id:"v3", name:"✦La Trastienda✧"},{id:"v4", name:"✦Expedición I✧"},{id:"v2", name:"✦la-siesta✧"}],
  members: [
    {username:"Fairy Heart", status:"online", channel_id:"v1", game:{name:"World of Warcraft"}},
    {username:"Rainfell", status:"online", channel_id:"v1", game:{name:"World of Warcraft"}},
    {username:"Kairi", status:"online", channel_id:"v4", game:{name:"World of Warcraft"}},
    {username:"Ventus", status:"online", game:{name:"World of Warcraft"}},
    {username:"Naminé", status:"idle", channel_id:"v2"},
    {username:"Lea", status:"dnd"},
    {username:"Terra", status:"idle"}
  ]
};
// Rangos de ejemplo (de verdad salen de taller.json, que escribe el bot)
const TALLER_EJEMPLO = [
  {nombres:["Fairy Heart"], rango:"maestra", forever:true},
  {nombres:["Rainfell"], rango:"guardian", forever:true},
  {nombres:["Kairi"], rango:"artifice", forever:true},
  {nombres:["Ventus"], rango:"artesano", forever:true},
  {nombres:["Naminé"], rango:"aprendiz", forever:false},
  {nombres:["Lea"], rango:"visitante", forever:true}
];
let TALLER = null, LIVE_W = null, LIVE_DEMO = true, LIVE_FILTRO = 'forever';
const STATUS_COL = { online:"#4fae7f", idle:"#e0a82e", dnd:"#e0435c" };
const FACE_COLS = ["#d0578a","#6c8fd8","#9a7ad0","#c9974a","#6f9a6a","#b23d6c","#4b6cf2","#ea8a3f"];
const faceCol = n => FACE_COLS[[...n].reduce((a,c)=>a+c.charCodeAt(0),0) % FACE_COLS.length];
const LIVE_VOICE = {};
function fichaTaller(nombre){
  const lista = TALLER || (LIVE_DEMO ? TALLER_EJEMPLO : []);
  const n = norm(nombre);
  return lista.find(t => (t.nombres||[]).some(x => norm(x) === n)) || {};
}
function renderLive(w, demo){
  if (w){ LIVE_W = w; LIVE_DEMO = demo; } else { w = LIVE_W; demo = LIVE_DEMO; }
  if (!w) return;
  const members = (w.members || []).map(m => ({...m, ...(({rango,forever}) => ({rango,forever}))(fichaTaller(m.username))}));
  const chName = {}; (w.channels||[]).forEach(c => chName[c.id] = c.name.replace(/[✦✧]/g,''));
  for (const k in LIVE_VOICE) delete LIVE_VOICE[k];
  (w.channels||[]).forEach(ch => LIVE_VOICE[norm(ch.name)] = members.filter(m => m.channel_id === ch.id));
  const wow = members.filter(m => /warcraft/i.test(m.game?.name||'')).length;
  const nForever = members.filter(m => m.forever).length;
  const filtro = LIVE_FILTRO === 'forever' && nForever ? 'forever' : 'todos';
  const vis = filtro === 'forever' ? members.filter(m => m.forever) : members;
  const orden = [...RANKS].reverse();   // Maestra primero
  const grupos = orden.map(r => ({r, ms: vis.filter(m => m.rango === r.id)}))
    .concat([{r:{id:'', nombre:'Sin rango aún', icono:'✨', color:'#bbb'}, ms: vis.filter(m => !m.rango)}]).filter(g => g.ms.length);
  const fila = m => `<div class="lp-m"><div class="face" style="background:${faceCol(m.username)}">${m.avatar_url?`<img src="${esc(m.avatar_url)}" alt="">`:esc(m.username[0].toUpperCase())}<span class="st" style="background:${STATUS_COL[m.status]||STATUS_COL.online}"></span></div>
        <div><div class="nm">${esc(m.username)}${m.forever?' <span class="lp-fv" title="Juega a WoW Forever">🍁</span>':''}</div><div class="gm">${m.game?.name?'🎮 '+esc(m.game.name):({idle:'Ausente',dnd:'No molestar'}[m.status]||'En línea')}</div></div>
        ${m.channel_id&&chName[m.channel_id]?`<span class="vc">🔊 ${esc(chName[m.channel_id])}</span>`:''}</div>`;
  $('live').innerHTML = `
    <span class="eyebrow">en directo</span>
    <h3 style="font-size:28px"><span class="dot"></span>Ahora en el taller ${demo?'<span class="sample">ejemplo</span>':''}</h3>
    ${nForever ? `<div class="lp-filtro"><button data-f="forever" class="${filtro==='forever'?'on':''}">🍁 Forever · ${nForever}</button><button data-f="todos" class="${filtro==='todos'?'on':''}">Todo el Discord · ${members.length}</button></div>` : ''}
    <div class="lp-list">${grupos.map(g => `<div class="lp-g" style="--rc:${g.r.color}">
        <div class="lp-gh">${g.r.id ? emblem(g.r.id, g.r.color, 'lp-em') : `<span class="lp-em">${g.r.icono}</span>`}<span>${esc(g.r.nombre)}</span><b>${g.ms.length}</b></div>
        ${g.ms.map(fila).join('')}</div>`).join('') || '<div class="hand" style="padding:8px">Ahora mismo no hay nadie por aquí… ¡sé la primera chispa!</div>'}</div>
    <div class="lp-foot"><span>${w.presence_count} conectad@s${wow?` · ${wow} en Azeroth`:''}</span><a href="${esc(DISCORD_URL)}" target="_blank" rel="noopener">Entrar →</a></div>`;
  $('live').querySelectorAll('.lp-filtro button').forEach(b => b.onclick = () => { LIVE_FILTRO = b.dataset.f; renderLive(); });
  document.querySelectorAll('.room .live-b').forEach(el=>el.remove());
  const inVoice = Object.values(LIVE_VOICE).reduce((a,b)=>a+b.length,0);
  const vr = document.querySelector('.room[data-room="voz"]');
  if (vr && inVoice) vr.insertAdjacentHTML('beforeend', `<span class="live-b">${inVoice} 🔊</span>`);
  const act = document.querySelector('.room.active'); if (act) showRoom(act.dataset.room);
}
fetch('taller.json', {cache:'no-store'}).then(r => r.ok ? r.json() : Promise.reject())
  .then(t => { if (Array.isArray(t)) { TALLER = t; renderLive(); } }).catch(()=>{});
function loadLive(){
  if (!DISCORD_SERVER_ID){ renderLive(LIVE_EJEMPLO, true); return; }
  fetch(`https://discord.com/api/guilds/${DISCORD_SERVER_ID}/widget.json`, {cache:'no-store'})
    .then(r=>r.ok?r.json():Promise.reject()).then(w=>renderLive(w,false)).catch(()=>renderLive(LIVE_EJEMPLO,true));
}

/* ---------- Calendario ---------- */
const TYPE_COLORS = { Leveo:"#ea8a3f", Mazmorra:"#4b6cf2", Banda:"#b23d6c", Quedada:"#4fae7f" };
let EVENTS = [];
const today = new Date(); today.setHours(0,0,0,0);
let calMonth = new Date(today.getFullYear(), today.getMonth(), 1), selDay = null;
const fmtMonth = new Intl.DateTimeFormat('es-ES',{month:'long',year:'numeric'});
const fmtTime = new Intl.DateTimeFormat('es-ES',{hour:'2-digit',minute:'2-digit'});
const fmtDayLong = new Intl.DateTimeFormat('es-ES',{weekday:'long',day:'numeric',month:'long'});
const fmtMon = new Intl.DateTimeFormat('es-ES',{month:'short'});
const sameDay = (a,b) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
const evColor = e => TYPE_COLORS[e.tipo] || TYPE_COLORS.Quedada;
function evHTML(e){ const d = e._start;
  return `<div class="ev"><div class="date" style="background:${evColor(e)}"><b>${d.getDate()}</b><small>${fmtMon.format(d).replace('.','')}</small></div>
    <div><div class="t">${esc(e.titulo)}</div>
      <div class="m">${fmtTime.format(d)}${e._end?'–'+fmtTime.format(e._end):''} · ${esc(e.tipo||'Quedada')}${e.lugar?' · 🔊 '+esc(e.lugar):''}${e.apuntados?` · ${e.apuntados} apuntados`:''}</div>
      ${e.descripcion?`<div class="d">${esc(e.descripcion)}</div>`:''}
      <a href="${esc(e.enlace||DISCORD_URL)}" target="_blank" rel="noopener">Apuntarme en Discord →</a></div></div>`; }
function renderEvList(){
  let evs;
  if (selDay){ evs = EVENTS.filter(e => sameDay(e._start, selDay)); $('evTitle').textContent = fmtDayLong.format(selDay); }
  else { evs = EVENTS.filter(e => (e._end||e._start) >= today).slice(0,4); $('evTitle').textContent = 'Lo próximo'; }
  $('evList').innerHTML = evs.length ? evs.map(evHTML).join('') : `<div class="empty-emo">${IMAGENES.emotes?`<img src="${IMAGENES.emotes}${selDay?'manta':'fantasma'}.webp" alt="">`:''}${selDay?'Nada este día. ¿Lo organizas tú? 🏮':'No hay quedadas programadas todavía.'}</div>`;
}
function renderCal(){
  const mt = fmtMonth.format(calMonth); $('calTitle').textContent = mt[0].toUpperCase()+mt.slice(1);
  const offset = (calMonth.getDay()+6)%7; const start = new Date(calMonth); start.setDate(1-offset);
  let html = '';
  for (let i=0;i<42;i++){ const d = new Date(start); d.setDate(start.getDate()+i);
    if (i===35 && d.getMonth()!==calMonth.getMonth()) break;
    const evs = EVENTS.filter(e => sameDay(e._start,d));
    html += `<div class="day ${d.getMonth()!==calMonth.getMonth()?'other':''} ${sameDay(d,today)?'today':''} ${selDay&&sameDay(d,selDay)?'sel':''}" data-d="${d.toISOString()}">
      <span class="n">${d.getDate()}</span>${evs.slice(0,2).map(e=>`<span class="pill" style="background:${evColor(e)}" title="${esc(e.titulo)}">${fmtTime.format(e._start)} ${esc(e.titulo)}</span>`).join('')}</div>`; }
  $('calDays').innerHTML = html;
  $('calDays').querySelectorAll('.day').forEach(el => el.onclick = () => { const d = new Date(el.dataset.d);
    selDay = (selDay && sameDay(selDay,d)) ? null : d; renderCal(); renderEvList();
    if (isMobile() && selDay) showPage(pageIndexOf('calendario') + 1); });
}
$('calPrev').onclick = () => { calMonth.setMonth(calMonth.getMonth()-1); renderCal(); };
$('calNext').onclick = () => { calMonth.setMonth(calMonth.getMonth()+1); renderCal(); };
$('calToday').onclick = () => { calMonth = new Date(today.getFullYear(), today.getMonth(), 1); selDay=null; renderCal(); renderEvList(); };
$('gameLegend').innerHTML = Object.entries(TYPE_COLORS).map(([g,c])=>`<span><i style="background:${c}"></i>${g}</span>`).join('');
function loadEvents(arr, isSample){
  EVENTS = arr.map(e => ({...e, _start:new Date(e.inicio), _end:e.fin?new Date(e.fin):null})).filter(e => !isNaN(e._start)).sort((a,b)=>a._start-b._start);
  $('sampleBadge').hidden = !isSample; renderCal(); renderEvList(); updateNext();
}
function updateNext(){
  const el = $('nextEv'); const now = new Date(); const e = EVENTS.find(ev => ev._start > now);
  if (!e){ el.hidden = true; return; }
  let ms = e._start - now; const d=Math.floor(ms/864e5); ms%=864e5; const h=Math.floor(ms/36e5); ms%=36e5; const m=Math.floor(ms/6e4); const sec=Math.floor(ms%6e4/1e3);
  const left = d>0 ? `${d}d ${h}h ${m}m` : `${h}h ${String(m).padStart(2,'0')}m ${String(sec).padStart(2,'0')}s`;
  const when = new Intl.DateTimeFormat('es-ES',{weekday:'short',hour:'2-digit',minute:'2-digit'}).format(e._start);
  el.innerHTML = `🏮 <span>Próxima quedada: <b style="color:var(--ink)">${esc(e.titulo)}</b> · ${when} — faltan <b>${left}</b></span>`; el.hidden = false;
}

/* ---------- Rangos y roles ---------- */
function emblem(id, color, cls="emblem"){
  if (IMAGENES.rangos?.[id]) return `<img class="${cls}" src="${esc(IMAGENES.rangos[id])}" alt="">`;
  const r = RANKS.find(x=>x.id===id) || RANKS[0];
  return `<svg class="${cls}" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="${color}" opacity=".25"/><circle cx="50" cy="50" r="40" fill="#fffaf0" stroke="${color}" stroke-width="3"/>
    <circle cx="50" cy="50" r="34" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="2 4"/>
    <path d="M50 4l2 4-2 4-2-4zM50 88l2 4-2 4-2-4zM4 50l4-2 4 2-4 2zM88 50l4-2 4 2-4 2z" fill="${color}"/>
    <text x="50" y="53" text-anchor="middle" dominant-baseline="middle" font-size="34">${r.icono}</text></svg>`;
}
let rankSel = 0;
function renderRanks(){
  $('rankList').innerHTML = RANKS.map((r,i)=>`<button class="rank ${i===rankSel?'on':''}" data-i="${i}" style="--rc:${r.color}">${emblem(r.id, r.color)}
      <span style="flex:1"><b>${esc(r.nombre)}</b><small>${esc(r.corto)}</small><span class="bar" style="display:block;width:${40+i*12}%"></span></span></button>`).join('');
  const r = RANKS[rankSel]; const li = a => a.map(x=>`<li>${esc(x)}</li>`).join('');
  $('rankDetail').innerHTML = `${emblem(r.id, r.color, "big")}<h2>${esc(r.nombre)}</h2><div class="lema">${esc(r.lema)}</div>
    <div class="cols"><div><h5>Quiénes son</h5><ul>${li(r.quien)}</ul></div><div><h5>Cómo se llega</h5><ul>${li(r.llegar)}</ul></div></div>`;
  $('rankList').querySelectorAll('.rank').forEach(el => el.onclick = () => { rankSel = +el.dataset.i; renderRanks(); chime(rankSel+2);
    if (isMobile()) showPage(pageIndexOf('hermandad-rangos') + 1); });
}
(function(){
  const picked = new Set();
  const grp = g => `<div class="sr-group"><h5>${esc(g.grupo)}</h5><small>${esc(g.nota)}</small>${g.roles.map(r=>`<button class="rchip" type="button" data-r="${esc(r)}">${esc(r)}</button>`).join('')}</div>`;
  $('srGridA').innerHTML = SELF_ROLES.filter(g=>!g.ancho).map(grp).join('');
  $('srGridB').innerHTML = SELF_ROLES.filter(g=>g.ancho).map(grp).join('');
  document.querySelectorAll('.rchip').forEach(b => b.onclick = () => {
    const r = b.dataset.r; picked.has(r) ? picked.delete(r) : picked.add(r); b.classList.toggle('on');
    const order = SELF_ROLES.flatMap(g=>g.roles).filter(x=>picked.has(x));
    $('myProfile').innerHTML = order.length ? `Tu perfil: <b>${order.map(esc).join(' · ')}</b>` : 'Tu perfil: <b>elige tus roles</b>';
    if (picked.has(r)) chime(order.length);
  });
})();

/* ---------- Primeros pasos ---------- */
(function(){
  const cards = [...document.querySelectorAll('.ob')]; let celebrated = false;
  cards.forEach(c => c.querySelector('.check').onclick = () => {
    c.classList.toggle('done'); const n = cards.filter(x=>x.classList.contains('done')).length;
    $('obFill').style.width = (n/4*100)+'%'; $('obText').textContent = `${n} de 4`;
    if (c.classList.contains('done')) chime(n*2);
    if (n === 4 && !celebrated){ celebrated = true; toast('¡Bienvenid@ al taller! Ya estás junto a la hoguera', 'trofeo');
      const ch = $('chibi'); if (ch){ ch.classList.remove('cheer'); void ch.offsetWidth; ch.classList.add('cheer');
        const r = ch.getBoundingClientRect(); [0,300,600].forEach(t=>setTimeout(()=>confetti(r.left+r.width/2, r.top+40), t)); } }
  });
})();

/* ---------- Mapa del Discord ---------- */
function renderPlan(){
  $('planGrid').innerHTML = CATS.map(c => { const lim=(c.id==='bienvenida'||c.id==='eterna')?6:4;
    return `<div class="room r-${c.id} ${c.nuestra?'ours':''} ${c.midnight?'midnight':''}" data-room="${c.id}"><span class="tag">${esc(c.tag)}</span>
      <div><div class="name">${c.emoji} ${esc(c.nombre)}</div><div class="chs">${c.canales.slice(0,lim).map(ch=>`<span>${ch[0]} ${esc(ch[1])}</span>`).join('')}${c.canales.length>lim?`<span>+${c.canales.length-lim}</span>`:''}</div></div></div>`; }).join('');
  document.querySelectorAll('.room').forEach(el => el.addEventListener('click', () => { showRoom(el.dataset.room); chime(2);
    if (isMobile()) showPage(pageIndexOf('hermandad-taller') + 1); }));
}
function showRoom(key){
  const c = CATS.find(x=>x.id===key);
  $('planInfo').innerHTML = `<span class="eyebrow">${esc(c.tag)}</span><h2>${c.emoji} ${esc(c.nombre)}</h2>
    <ul class="chlist">${c.canales.map(ch => { const live = c.id==='voz' ? (LIVE_VOICE[norm(ch[1])]||[]) : [];
      return `<li><span>${ch[0]}</span><span class="cn">${c.id==='voz'?'🔊 ':'#'}✦${esc(ch[1])}✧${ch[3]?'<span class="lock">🔒 privado</span>':''}</span><span class="cd">${esc(ch[2])}${live.length?` · <b style="color:var(--mint)">${live.map(m=>esc(m.username)).join(', ')}</b>`:''}</span></li>`; }).join('')}</ul>
    <p class="hand">${isMobile()?'← vuelve a la página anterior para ver otra ala':'← pulsa otra ala del plano'}</p>`;
  document.querySelectorAll('.room').forEach(el => el.classList.toggle('active', el.dataset.room === key));
}

/* ---------- Carnets ---------- */
const THEMES = {
  noche:  { bg:"linear-gradient(140deg,#2a1538,#4a2160 60%,#c94b7e)", acc:"#ec6f9e", acc2:"#f6a8c6", sw:"linear-gradient(140deg,#4a2160,#c94b7e)" },
  aurora: { bg:"linear-gradient(140deg,#152045,#3550b5 55%,#ec6f9e)", acc:"#8ea6ff", acc2:"#c9d4ff", sw:"linear-gradient(140deg,#3550b5,#ec6f9e)" },
  sakura: { bg:"linear-gradient(140deg,#5a2142,#c94b7e 55%,#f6a8c6)", acc:"#ffd1e1", acc2:"#fff0f5", sw:"linear-gradient(140deg,#c94b7e,#f6a8c6)" },
  bosque: { bg:"linear-gradient(140deg,#13261f,#2f6b4f 60%,#a8d08d)", acc:"#a8d08d", acc2:"#dff2c8", sw:"linear-gradient(140deg,#2f6b4f,#a8d08d)" },
  ambar:  { bg:"linear-gradient(140deg,#2a1538,#9d5a2c 55%,#f1c27d)", acc:"#f1c27d", acc2:"#ffe2b0", sw:"linear-gradient(140deg,#9d5a2c,#f1c27d)" },
  cielo:  { bg:"linear-gradient(140deg,#1b2a4a,#4b8bc9 55%,#bfe3ff)", acc:"#bfe3ff", acc2:"#e8f6ff", sw:"linear-gradient(140deg,#4b8bc9,#bfe3ff)" }
};
const STICKERS = ["🌸","🔥","🏮","⭐","🍁","🐾","🏹","✨","🧵","🌙","🍉","🗝️"];
const hashNum = s => [...s].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0, 7);
const rankOf = id => RANKS.find(r=>r.id===id) || RANKS[0];
function carnetHTML(m){
  const rank = rankOf(m.rango), col = CLASS_COLORS[m.clase] || '#ec6f9e';
  return `<div class="pat"></div><div class="blob"></div><div class="shine"></div><div class="stripe" style="background:${col}"></div>
    <div class="in"><div class="top"><span class="marca marca-card">✦ El Atelier Natsu</span><span>WoW Forever</span></div>
      <div class="ava" style="--cc:${col}">${m.imagen?`<img src="${esc(m.imagen)}" alt="">`:esc((m.nombre||'?')[0].toUpperCase())}</div>
      <div class="info"><div class="crank">${rank.icono} ${esc(rank.nombre)}</div><div class="cname">${esc(m.nombre||'Sin nombre')}</div>
        <div class="cclass">${[m.raza, m.clase, m.rol].filter(Boolean).map(esc).join(' · ')}</div>${m.lema?`<div class="motto">${esc(m.lema)}</div>`:''}</div>
      <div class="cfoot"><span>Carnet nº ${String(hashNum(m.nombre||'x')%10000).padStart(4,'0')}</span><span>夏の工房</span></div></div>
    ${m.mascota?`<img class="pet" src="${esc(m.mascota)}" alt="">`:''}<div class="stamp">${emblem(rank.id, rank.color)}</div>${m.sticker?`<div class="stk">${esc(m.sticker)}</div>`:''}`;
}
function paintCarnet(el, m){ const t = THEMES[m.tema] || THEMES.noche;
  el.style.setProperty('--c-bg', t.bg); el.style.setProperty('--c-acc', t.acc); el.style.setProperty('--c-acc2', t.acc2); el.innerHTML = carnetHTML(m); }
function tilt(card){
  card.addEventListener('pointermove', e => { const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
    card.style.transform = `rotateY(${(x-.5)*14}deg) rotateX(${(.5-y)*10}deg)`; card.style.setProperty('--mx', x*100+'%'); card.style.setProperty('--my', y*100+'%'); });
  card.addEventListener('pointerleave', () => card.style.transform = '');
}

/* ---------- Miembros: índice + una hoja por miembro ---------- */
let memberFilter = 'Todos';
function renderMemberIndex(){
  const roles = ['Todos','Tank','Healer','DPS'];
  $('filters').innerHTML = roles.map(g => `<button class="filter ${g===memberFilter?'on':''}" data-g="${g}">${{Tank:'🛡️ ',Healer:'💚 ',DPS:'⚔️ '}[g]||''}${g}</button>`).join('');
  $('filters').querySelectorAll('.filter').forEach(b => b.onclick = () => { memberFilter = b.dataset.g; renderMemberIndex(); });
  const list = MEMBERS.map((m,i)=>({m,i})).filter(({m}) => memberFilter==='Todos' || m.rol===memberFilter);
  $('mIndex').innerHTML = list.length ? list.map(({m,i}) => `<a class="mcard" href="#hermandad-miembros-${Math.floor(i/2)+1}">
      <div class="face" style="background:${CLASS_COLORS[m.clase]||faceCol(m.nombre)}">${m.imagen?`<img src="${esc(m.imagen)}" alt="">`:esc(m.nombre[0])}</div>
      <div><b>${esc(m.nombre)}</b><small>${rankOf(m.rango).icono} ${esc(m.clase)} · ${esc(m.rol)}</small></div></a>`).join('')
    : '<p class="empty">Nadie con este rol todavía.</p>';
}
function memberPage(m, i){
  if (!m) return `<div class="pg-in mpage mpage-empty"><div><p class="hand" style="font-size:26px">Esta hoja está esperando a alguien… ✿</p>
    <a class="btn btn-line btn-sm" href="#nuevo-carnet">🪪 Hazte tu carnet</a></div></div>`;
  const rank = rankOf(m.rango), col = CLASS_COLORS[m.clase] || '#d0578a';
  return `<div class="pg-in mpage">
    ${m.chibi?`<img class="m-chibi" src="${esc(m.chibi)}" alt="">`:''}
    <span class="eyebrow">Aventurer@ ${i+1} de ${MEMBERS.length}</span>
    <div class="polaroid"><span class="tape ${['','b','y','g'][i%4]}"></span>${m.sticker?`<span class="stk">${esc(m.sticker)}</span>`:''}
      <div class="ph" style="--cc:${col}">${m.imagen?`<img src="${esc(m.imagen)}" alt="">`:esc(m.nombre[0])}</div>
      <div class="cap">${esc(m.nombre)}</div>
      ${m.mascota?`<div class="pet"><span class="tape b" style="width:44px;height:12px;top:-6px"></span><img src="${esc(m.mascota)}" alt=""><span>su mascota</span></div>`:''}
    </div>
    <div class="sheet">
      <div class="row"><span class="k">Rango</span><span class="v">${rank.icono} ${esc(rank.nombre)}</span></div>
      <div class="row"><span class="k">Raza</span><span class="v">${esc(m.raza||'—')}</span></div>
      <div class="row"><span class="k">Clase</span><span class="v" style="color:${col};filter:brightness(.75)">${esc(m.clase||'—')}</span></div>
      <div class="row"><span class="k">Papel</span><span class="v">${{Tank:'🛡️ Tanque',Healer:'💚 Sanador',DPS:'⚔️ Daño'}[m.rol]||esc(m.rol)}</span></div>
      ${m.lema?`<div class="row"><span class="k">Lema</span><span class="v">${esc(m.lema)}</span></div>`:''}
    </div></div>`;
}
function buildMemberSpreads(){
  const anchor = $('nuevo');
  for (let k=0; k<MEMBERS.length; k+=2){
    const s = document.createElement('section');
    s.className = 'spread'; s.id = `hermandad-miembros-${k/2+1}`; s.dataset.ch = 'hermandad'; s.dataset.toc = 'no';
    s.dataset.title = [MEMBERS[k], MEMBERS[k+1]].filter(Boolean).map(m=>m.nombre).join(' y ');
    s.innerHTML = `<div class="pg L">${memberPage(MEMBERS[k], k)}</div><div class="pg R">${memberPage(MEMBERS[k+1], k+1)}</div>`;
    anchor.before(s);
  }
}

/* ---------- Editor del carnet ---------- */
(function(){
  const CLS = ["Guerrera","Guerrero","Paladín","Cazadora","Cazador","Pícara","Pícaro","Sacerdotisa","Sacerdote","Chamán","Maga","Mago","Bruja","Brujo","Druida"];
  const st = { nombre:"Tu personaje", raza:"Surcacielos", clase:"Maga", rol:"DPS", rango:"visitante", lema:"", tema:"noche", sticker:"🌸", imagen:"" };
  $('cClass').innerHTML = CLS.map(c=>`<option>${c}</option>`).join('');
  $('cRank').innerHTML = RANKS.map(r=>`<option value="${r.id}">${r.icono} ${esc(r.nombre)}</option>`).join('');
  $('cThemes').innerHTML = Object.entries(THEMES).map(([k,t])=>`<button type="button" class="sw" data-t="${k}" title="${k}" style="--sw:${t.sw}"></button>`).join('');
  $('cStickers').innerHTML = STICKERS.map(s=>`<button type="button" data-s="${s}">${s}</button>`).join('') + `<button type="button" data-s="" title="Sin pegatina">∅</button>`;
  const card = $('carnetCard'); tilt(card);
  function sync(){
    $('cName').value = st.nombre; $('cRace').value = st.raza; $('cClass').value = st.clase; $('cRole').value = st.rol; $('cRank').value = st.rango; $('cMotto').value = st.lema;
    $('cThemes').querySelectorAll('.sw').forEach(b=>b.classList.toggle('on', b.dataset.t===st.tema));
    $('cStickers').querySelectorAll('button').forEach(b=>b.classList.toggle('on', b.dataset.s===st.sticker));
    paintCarnet(card, st);
  }
  [['cName','nombre'],['cRace','raza'],['cClass','clase'],['cRole','rol'],['cRank','rango'],['cMotto','lema']].forEach(([id,k]) =>
    $(id).addEventListener('input', () => { st[k] = $(id).value; paintCarnet(card, st); }));
  $('cThemes').onclick = e => { const b=e.target.closest('.sw'); if(!b) return; st.tema=b.dataset.t; sync(); chime(Object.keys(THEMES).indexOf(st.tema)+2); };
  $('cStickers').onclick = e => { const b=e.target.closest('button'); if(!b) return; st.sticker=b.dataset.s; sync(); };
  $('cFile').onchange = () => { const f=$('cFile').files[0]; if(!f) return; const r=new FileReader();
    r.onload = () => { st.imagen = r.result; $('cFileTxt').textContent = f.name; sync(); }; r.readAsDataURL(f); };
  $('cRandom').onclick = () => { const pick = a => a[Math.floor(Math.random()*a.length)];
    Object.assign(st, { nombre:pick(["Kingdom Key","Oathkeeper","Starlight","Ultima","Rainfell","Wayward Wind","Fenrir","Sweet Memories","Bond of Flame","Lady Luck"]),
      raza:pick(['Humana','Enana','Gnoma','Elfa de la noche','Surcacielos','Humano','Enano','Gnomo','Elfo de la noche']),
      clase:pick(CLS), rol:pick(['DPS','Tank','Healer']), rango:pick(RANKS).id, tema:pick(Object.keys(THEMES)), sticker:pick(STICKERS) });
    sync(); chime(Math.floor(Math.random()*9)); };
  $('cCopy').onclick = async () => {
    const slug = (st.nombre||'personaje').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-');
    const ficha = `{ nombre:${JSON.stringify(st.nombre)}, raza:${JSON.stringify(st.raza)}, clase:${JSON.stringify(st.clase)}, rol:${JSON.stringify(st.rol)}, rango:${JSON.stringify(st.rango)}, tema:${JSON.stringify(st.tema)}, sticker:${JSON.stringify(st.sticker)}, lema:${JSON.stringify(st.lema)}${st.imagen?`, imagen:"img/miembro-${slug}.webp"`:''} },`;
    try { await navigator.clipboard.writeText(ficha); toast(st.imagen ? 'Ficha copiada. Pásasela a la Maestra junto con tu foto' : 'Ficha copiada: pásasela a la Maestra por Discord', 'guino'); }
    catch { toast('No se pudo copiar automáticamente'); }
  };
  $('cDownload').onclick = async () => {
    if (!window.html2canvas){ toast('Un segundo, cargando…'); return; }
    const prev = card.style.transform; card.style.transform='';
    try{ const canvas = await html2canvas(card, {backgroundColor:null, scale:2, useCORS:true});
      const a = document.createElement('a'); a.download = `carnet-${(st.nombre||'atelier').toLowerCase().replace(/\s+/g,'-')}.png`;
      a.href = canvas.toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove(); toast('¡Carnet descargado!', 'ilusion');
    }catch{ toast('No se pudo descargar aquí: prueba desde la web publicada'); }
    card.style.transform = prev;
  };
  sync();
})();

/* ---------- Guía: hoguerita ---------- */
(function(){
  document.querySelectorAll('#hgTabs button').forEach(b => b.onclick = () => {
    document.querySelectorAll('#hgTabs button').forEach(x=>x.classList.toggle('on', x===b));
    $('hgTodos').hidden = b.dataset.t!=='todos'; $('hgGuard').hidden = b.dataset.t!=='guard'; });
  const DCI = '<svg class="dc" viewBox="0 0 24 24"><use href="#i-discord"/></svg>';
  const script = [
    {who:"Rainfell", from:"wow", txt:"¿Alguien para las Minas de la Muerte?"},
    {who:"Kairi", from:"dc", txt:"¡Yo! Me conecto en 10 min 🔥"},
    {who:"Ventus", from:"wow", txt:"Voy de tanque"},
    {who:"Naminé", from:"dc", txt:"Desde el móvil os animo 🌸"},
    {who:"Rainfell", from:"wow", txt:"Grupo hecho, ¡a la Expedición I!"}];
  const cols = {Rainfell:'#3fc7eb',Kairi:'#ec6f9e',Ventus:'#c69b6d','Naminé':'#c3a6ee'};
  let i = 0;
  function step(){
    if (currentId() !== 'nuevo-hoguerita') return;
    const m = script[i % script.length];
    if (i % script.length === 0){ $('mockWow').innerHTML=''; $('mockDc').innerHTML=''; }
    $('mockWow').insertAdjacentHTML('beforeend', `<div class="wl">${m.from==='dc'?DCI:''}[Hermandad] [${m.who}]: ${esc(m.txt)}</div>`);
    $('mockDc').insertAdjacentHTML('beforeend', `<div class="dl"><div class="av" style="background:${cols[m.who]}">${m.who[0]}</div><div><div class="un">${m.who}${m.from==='wow'?'<span class="bot">WOW</span>':''}<small>hoy</small></div>${esc(m.txt)}</div></div>`);
    [$('mockWow'),$('mockDc')].forEach(el => { while (el.children.length>4) el.firstElementChild.remove(); });
    i++;
  }
  setInterval(step, 2300);
})();

/* ---------- Guía: mercadillo ---------- */
(function(){
  const states = ["📝 Borrador","🟢 Abierto","🟡 En proceso","✅ Entregado"], bg = ["#2b2d31","#1f4d2b","#5a4a12","#1f3f4d"];
  document.querySelectorAll('.mks').forEach(b => b.onclick = () => {
    document.querySelectorAll('.mks').forEach(x=>x.classList.toggle('on', x===b));
    const k = +b.dataset.s; $('mkState').textContent = states[k]; $('mkState').style.background = bg[k]; chime(k+2);
    if (k===3){ const r = $('mkState').getBoundingClientRect(); confetti(r.left+r.width/2, r.top); }
  });
  $('tplCopy').onclick = async () => {
    try { await navigator.clipboard.writeText($('tplText').textContent); toast('Plantilla copiada: pégala en ✦el-mercadillo✧', 'tesoro'); }
    catch { toast('Selecciona la plantilla y cópiala a mano'); } };
})();

/* ---------- Guía: add-ons ---------- */
$('addons').innerHTML = ADDONS.length ? ADDONS.map(a => `
  <div class="card addon"><div class="top"><span class="aic">${esc(a.icono||'⚙️')}</span><div><span class="cat">${esc(a.categoria||'Add-on')}</span><h4>${esc(a.nombre)}</h4></div></div>
    <p>${esc(a.descripcion||'')}</p>${a.recomienda?`<div class="meta">Lo recomienda: ${esc(a.recomienda)}</div>`:''}
    ${a.enlace?`<a class="btn btn-line btn-sm" style="margin-top:8px" href="${esc(a.enlace)}" target="_blank" rel="noopener">⬇ Descargar</a>`:''}</div>`).join('')
  : `<div class="addon-empty">${IMAGENES.emotes?`<img src="${IMAGENES.emotes}gamer.webp" alt="" style="width:96px;display:block;margin:0 auto 8px">`:'⚙️ '}Todavía no hay add-ons apuntados.<br>Los iremos añadiendo con los que el taller vaya probando.</div>`;

/* ---------- Noticias: varias dobles páginas ---------- */
const NEWS_ART = { Lanzamiento:['#5a2a5e','#f2a7c4'], Clases:['#22336a','#9db4f0'], Sistema:['#25432f','#a8d08d'], Contenido:['#5a3420','#ecc77f'] };
function newsArt(tag, seed){
  const [bg, fg] = NEWS_ART[tag] || ['#5a2a5e','#f2a7c4']; const r = n => ((Math.sin(seed*99+n)*10000)%1+1)%1;
  let stars=''; for(let i=0;i<14;i++) stars+=`<circle cx="${(r(i)*400).toFixed(0)}" cy="${(r(i+40)*80).toFixed(0)}" r="${(r(i+80)*1.5+.4).toFixed(1)}" fill="#fff" opacity=".7"/>`;
  return `<svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="ng${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${fg}" stop-opacity=".6"/></linearGradient></defs>
    <rect width="400" height="140" fill="url(#ng${seed})"/>${stars}<circle cx="${290+r(3)*70}" cy="44" r="22" fill="${fg}"/>
    <path d="M0 100 L70 ${55+r(5)*20} L130 95 L200 ${50+r(6)*20} L270 98 L330 ${65+r(7)*18} L400 92 V140 H0Z" fill="#000" opacity=".28"/></svg>`;
}
const fmtNewsDate = s => s ? new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'long',year:'numeric'}).format(new Date(s+'T12:00')) : '';
const postHTML = (n,i) => `<a class="card post" href="${esc(n.url)}" target="_blank" rel="noopener"><span class="tape ${['','y','b','g'][i%4]}" style="z-index:2"></span>
    <div class="art">${n.imagen?`<img src="${esc(n.imagen)}" alt="">`:newsArt(n.etiqueta, i+n.titulo.length)}<span class="tg">${esc(n.etiqueta)}</span></div>
    <div class="body"><div class="meta">${[fmtNewsDate(n.fecha), esc(n.fuente)].filter(Boolean).join(' · ')}</div><h4>${esc(n.titulo)}</h4><p>${esc(n.resumen)}</p><span class="more">Leer en ${esc(n.fuente.replace(/ \(.*\)/,''))} →</span></div></a>`;
function buildNews(){
  const head = `<span class="eyebrow">Noticias</span><h2>Lo último de <span class="pk">WoW Forever</span></h2><p class="muted">Resumido por el taller, con enlace a la fuente original.</p>`;
  const foot = `<p class="hand">Más en <a href="https://news.blizzard.com/es-es/world-of-warcraft" target="_blank" rel="noopener" style="color:var(--pink)">Blizzard News</a> ✦</p>`;
  const N = NOTICIAS.map((n,i)=>postHTML(n,i));
  $('newsL').innerHTML = head + (N[0]||'') ; $('newsR').innerHTML = (N[1]||'') + (N[2]||'') + (N.length<=3?foot:'');
  let rest = N.slice(3), k = 2, after = $('noticias');
  while (rest.length){
    const s = document.createElement('section'); s.className='spread'; s.id=`noticias-${k}`; s.dataset.ch='noticias'; s.dataset.title='Noticias'; s.dataset.toc='no';
    const l = rest.splice(0,2), r = rest.splice(0,2);
    s.innerHTML = `<div class="pg L"><div class="pg-in">${l.join('')}</div></div><div class="pg R"><div class="pg-in">${r.join('')}${rest.length?'':foot}</div></div>`;
    after.after(s); after = s; k++;
  }
}

/* ---------- Pegatinas de papelería repartidas por el libro ---------- */
const DECO = [
  ['inicio','R','luna',      'right:58px;top:26px;width:70px;transform:rotate(10deg)'],
  ['inicio','R','estrellas', 'right:132px;top:40px;width:44px'],
  ['indice','R','sello-brujula','right:46px;bottom:60px;width:120px;transform:rotate(-8deg);opacity:.9'],
  ['indice','L','flor',      'right:30px;top:30px;width:80px;transform:rotate(12deg)'],
  ['calendario','R','taza',  'right:40px;bottom:56px;width:120px;transform:rotate(-5deg)'],
  ['hermandad-filosofia','L','lacre','right:40px;bottom:46px;width:70px;transform:rotate(14deg)'],
  ['hermandad-rangos','R','washi','right:70px;bottom:40px;width:120px;transform:rotate(-8deg)'],
  ['hermandad-rangos','R','washi','left:-18px;top:22px;width:110px;transform:rotate(-38deg);opacity:.9'],
  ['hermandad-taller','R','varita','right:34px;bottom:58px;width:120px;transform:rotate(-20deg)'],
  ['hermandad-miembros','L','flor','left:40px;bottom:60px;width:96px;transform:rotate(-10deg)'],
  ['nuevo','R','lacre',      'right:42px;bottom:56px;width:88px;transform:rotate(-12deg)'],
  ['nuevo-carnet','L','estrellas','right:36px;top:32px;width:50px'],
  ['nuevo-hoguerita','R','varita','left:40px;bottom:60px;width:100px;transform:rotate(-25deg)'],
  ['guias-mercadillo','L','pociones','right:30px;bottom:56px;width:130px;transform:rotate(4deg)'],
  ['guias','R','emo:hola','right:40px;bottom:56px;width:110px;transform:rotate(5deg)'],
  ['guias-addons','R','tarjeta-clip','right:40px;bottom:56px;width:150px;transform:rotate(6deg)'],
  ['noticias','L','luna',    'right:40px;top:30px;width:56px;transform:rotate(-12deg)'],
  // emotes de la elfa repartidos por el libro
  ['indice','L','emo:corazon',          'right:120px;top:40px;width:70px;transform:rotate(-8deg)'],
  ['hermandad-filosofia','R','emo:galleta','right:40px;bottom:56px;width:110px;transform:rotate(6deg)'],
  ['hermandad-rangos','L','emo:trofeo', 'right:36px;bottom:52px;width:96px;transform:rotate(8deg)'],
  ['hermandad-roles','R','emo:tanque',  'left:44px;bottom:56px;width:92px;transform:rotate(-6deg)'],
  ['hermandad-roles','R','emo:curando', 'left:150px;bottom:60px;width:92px;transform:rotate(5deg)'],
  ['hermandad-roles','R','emo:risa',    'right:40px;bottom:56px;width:100px'],
  ['hermandad-taller','L','emo:manta',  'left:40px;bottom:50px;width:84px;transform:rotate(-6deg)'],
  ['hermandad-miembros','R','emo:guino','right:40px;bottom:56px;width:100px;transform:rotate(6deg)'],
  ['nuevo-carnet','R','emo:verguenza',  'left:40px;bottom:50px;width:90px;transform:rotate(-6deg)'],
  ['nuevo-hoguerita','L','emo:llanto',  'right:36px;bottom:52px;width:84px;transform:rotate(5deg)'],
  ['guias-mercadillo','R','emo:sin-oro','left:44px;bottom:52px;width:96px;transform:rotate(-5deg)'],
  ['guias-addons','L','emo:gamer',      'right:40px;bottom:56px;width:100px'],
  ['mapa','L','emo:tanque',             'left:38px;bottom:30px;width:80px;transform:rotate(-8deg)'],
  ['noticias','R','emo:ilusion',        'right:40px;bottom:56px;width:96px;transform:rotate(5deg)']
];
DECO.forEach(([id, side, img, css]) => {
  const pg = document.querySelector(`#${id} .pg.${side}`); if (!pg) return;
  const src = img.startsWith('emo:') ? `${IMAGENES.emotes}${img.slice(4)}.webp` : `img/deco/${img}.webp`;
  pg.insertAdjacentHTML('beforeend', `<img class="deco${img.startsWith('emo:')?' emo-deco':''}" src="${src}" alt="" style="${css}">`);
});

/* ==========================================================
   EL LIBRO: abrir, pasar páginas, post-its
   ========================================================== */
buildMemberSpreads(); buildNews();
const SPREADS = [...document.querySelectorAll('.spread')];
const PAGES = []; SPREADS.forEach((sp,i) => { PAGES.push({i,side:0}); if (!sp.classList.contains('wide')) PAGES.push({i,side:1}); });
let cur = 0, side = 0, busy = false;
SPREADS.forEach((sp,i) => {
  const pgs = [...sp.querySelectorAll('.pg')];
  if (sp.classList.contains('wide')) pgs[0].insertAdjacentHTML('beforeend', `<span class="folio">— ${i*2+1} · ${i*2+2} —</span>`);
  else pgs.forEach((p,j) => p.insertAdjacentHTML('beforeend', `<span class="folio">— ${i*2+j+1} —</span>`));
});

/* índice */
(function(){
  const CH = { inicio:'🏠 Portada', calendario:'🗓️ Calendario', hermandad:'🏮 La Hermandad', nuevo:'🌱 Recién llegad@', guias:'📚 Guías', mapa:'🗺️ Mapa de Azeroth', noticias:'📰 Noticias' };
  const groups = []; SPREADS.forEach((sp,i) => { if (sp.dataset.toc==='no' || sp.id==='indice') return;
    const ch = sp.dataset.ch; let g = groups.find(x=>x.ch===ch); if (!g){ g = {ch, items:[]}; groups.push(g); } g.items.push({id:sp.id, t:sp.dataset.title, pn:i*2+1}); });
  const html = g => g.items.length===1
    ? `<a class="chap" href="#${g.items[0].id}" style="text-decoration:none">${CH[g.ch]||g.ch}<span class="dots" style="flex:1;border-bottom:2px dotted rgba(90,52,40,.3)"></span><span class="pn" style="font-family:var(--head);font-style:italic;font-size:15px;color:var(--ink-soft)">${g.items[0].pn}</span></a>`
    : `<div class="chap">${CH[g.ch]||g.ch}</div>` + g.items.map(it=>`<a href="#${it.id}"><span>${esc(it.t)}</span><span class="dots"></span><span class="pn">${it.pn}</span></a>`).join('');
  const half = Math.ceil(groups.length/2);
  $('tocL').innerHTML = groups.slice(0,half).map(html).join(''); $('tocR').innerHTML = groups.slice(half).map(html).join('');
})();

const currentId = () => SPREADS[cur].id;
const pIdx = (i, sd=0) => { const k = PAGES.findIndex(p=>p.i===i && p.side===sd); return k<0 ? PAGES.findIndex(p=>p.i===i) : k; };
const pageIndexOf = id => { const i = SPREADS.findIndex(s=>s.id===id); return i<0 ? 0 : pIdx(i,0); };
const ALIAS = { 'inicio-calendario':'calendario', 'inicio-filosofia':'hermandad-filosofia', 'inicio-unete':'nuevo', 'hermandad-pasos':'nuevo-pasos',
  'hermandad-carnet':'nuevo-carnet', 'guias-hoguerita':'nuevo-hoguerita', };
function idxForHash(h){
  if (!h) return 0; h = ALIAS[h] || h;
  let i = SPREADS.findIndex(s => s.id === h); if (i >= 0) return i;
  if (/^hermandad-miembro-(\d+)$/.test(h)){ const n = +h.split('-').pop(); i = SPREADS.findIndex(s => s.id === `hermandad-miembros-${Math.ceil(n/2)}`); if (i>=0) return i; }
  i = SPREADS.findIndex(s => s.dataset.ch === h); return i >= 0 ? i : 0;
}
function paint(){
  SPREADS.forEach((s,i) => { s.classList.toggle('on', i===cur); s.classList.toggle('show-r', i===cur && side===1); });
  document.body.classList.toggle('on-wide', SPREADS[cur].classList.contains('wide'));
  const ch = SPREADS[cur].dataset.ch;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.ch===ch));
  const pi = pIdx(cur, side);
  $('prev').disabled = isMobile() ? pi<=0 : cur<=0;
  $('next').disabled = isMobile() ? pi>=PAGES.length-1 : cur>=SPREADS.length-1;
  const id = SPREADS[cur].id; if (location.hash.slice(1) !== id) history.replaceState(null, '', '#'+id);
  document.title = `${SPREADS[cur].dataset.title} · El Atelier Natsu`;
  window.dispatchEvent(new Event('resize'));
}
function snapshot(pg){
  const c = pg.cloneNode(true); c.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id')); c.removeAttribute('id');
  const inner = c.querySelector('.pg-in'), src = pg.querySelector('.pg-in'); if (inner && src) inner.scrollTop = src.scrollTop;
  return c;
}
function underlay(pg, where){
  const u = document.createElement('div'); u.className = 'underlay';
  const wide = pg.closest('.spread')?.classList.contains('wide');
  u.style.cssText = `position:absolute;top:0;bottom:0;width:${isMobile()?'100%':'50%'};left:${where==='R'&&!isMobile()?'50%':'0'};z-index:20;overflow:hidden`;
  const c = snapshot(pg); c.style.cssText = `position:absolute;top:0;bottom:0;left:${wide&&where==='R'?'-100%':'0'};width:${wide&&!isMobile()?'200%':'100%'};display:block`; u.appendChild(c);
  $('pages').appendChild(u); return u;
}
function halfOf(sp, which){
  // devuelve la media página visible ('L' o 'R') de una doble página, aunque sea desplegable
  if (!sp.classList.contains('wide')) return snapshot(sp.querySelector('.pg.'+which));
  const c = snapshot(sp.querySelector('.pg.L')); const w = document.createElement('div');
  w.className = 'pg'; w.style.cssText = 'position:absolute;inset:0;overflow:hidden;display:block';
  c.style.cssText = `position:absolute;top:0;bottom:0;width:200%;left:${which==='R'?'-100%':'0'};display:block`; w.appendChild(c); return w;
}
function leaf(front, back, dir){
  const l = document.createElement('div'); l.className = 'leaf' + (dir<0?' back-dir':'');
  const a = document.createElement('div'); a.className = 'side a'; const b = document.createElement('div'); b.className = 'side b';
  if (front) a.appendChild(front); if (back) b.appendChild(back);
  const sh = document.createElement('div'); sh.className='shade'; a.appendChild(sh);
  l.append(a,b); $('pages').appendChild(l); return l;
}
function hideHalf(sp, which){ // oculta la mitad que tapará la hoja mientras gira
  const el = sp.classList.contains('wide') ? sp.querySelector('.pg.L') : sp.querySelector('.pg.'+which);
  if (sp.classList.contains('wide')){ el.style.clipPath = which==='L' ? 'inset(0 0 0 50%)' : 'inset(0 50% 0 0)'; return () => el.style.clipPath=''; }
  el.style.visibility = 'hidden'; return () => el.style.visibility='';
}
function goSpread(n, dir){
  n = Math.max(0, Math.min(SPREADS.length-1, n));
  if (busy || n===cur){ if (!busy) paint(); return; }
  dir = dir ?? (n > cur ? 1 : -1);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const old = SPREADS[cur], neu = SPREADS[n];
  if (reduce || document.body.classList.contains('closed')){ cur = n; side = 0; paint(); return; }
  busy = true; rustle();
  const fwd = dir > 0;
  const keepWide = old.classList.contains('wide');
  const ul = keepWide ? (()=>{ const u=document.createElement('div'); u.className='underlay'; u.style.cssText=`position:absolute;top:0;bottom:0;width:50%;left:${fwd?'0':'50%'};z-index:20;overflow:hidden`; const h=halfOf(old, fwd?'L':'R'); u.appendChild(h); $('pages').appendChild(u); return u; })()
                      : underlay(old.querySelector(fwd?'.pg.L':'.pg.R'), fwd?'L':'R');
  const lf = leaf(halfOf(old, fwd?'R':'L'), halfOf(neu, fwd?'L':'R'), fwd?1:-1);
  cur = n; side = 0; paint(); const restore = hideHalf(neu, fwd?'L':'R');
  requestAnimationFrame(()=>lf.classList.add('go'));
  setTimeout(()=>{ restore(); ul.remove(); lf.remove(); busy=false; }, 780);
}
/* móvil: una página cada vez */
function showPage(pi){
  pi = Math.max(0, Math.min(PAGES.length-1, pi));
  const now = pIdx(cur, side); if (busy || pi===now) return;
  const dir = pi > now ? 1 : -1; const curPg = SPREADS[cur].querySelectorAll('.pg')[side];
  const target = PAGES[pi];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce){ cur = target.i; side = target.side; paint(); return; }
  busy = true; rustle();
  if (dir > 0){
    const lf = leaf(snapshot(curPg), null, 1); cur = target.i; side = target.side; paint();
    requestAnimationFrame(()=>lf.classList.add('go')); setTimeout(()=>{ lf.remove(); busy=false; }, 620);
  } else {
    cur = target.i; side = target.side; paint();
    const lf = leaf(snapshot(SPREADS[cur].querySelectorAll('.pg')[side]), null, -1);
    requestAnimationFrame(()=>lf.classList.add('go')); setTimeout(()=>{ lf.remove(); busy=false; }, 620);
  }
}
const step = d => isMobile() ? showPage(pIdx(cur, side)+d) : goSpread(cur+d, d);
$('prev').onclick = () => step(-1); $('next').onclick = () => step(1);
function navigate(h){ if (document.body.classList.contains('closed')) openBook(true);
  const n = idxForHash(h); if (isMobile()) showPage(pIdx(n,0)); else goSpread(n); closeTabs(); }

/* abrir / cerrar */
function openBook(instant){
  if (document.body.classList.contains('open')) return;
  try { localStorage.setItem('atelier-visto','1'); } catch {}
  if (instant) document.body.classList.add('instant');
  document.body.classList.remove('closed','resting'); document.body.classList.add('open');
  if (!instant){ chime(5); setTimeout(()=>chime(7),180); setTimeout(()=>chime(9),360);
    const r = $('cover').getBoundingClientRect(); confetti(r.left+r.width/2, r.top+r.height/2, 40); }
  setTimeout(()=>document.body.classList.add('cover-gone'), instant?0:1400);
  if (instant) setTimeout(()=>document.body.classList.remove('instant'), 50);
  paint();
}
function closeBook(){ document.body.classList.remove('open','cover-gone'); document.body.classList.add('closed'); history.replaceState(null,'',location.pathname+location.search); rustle();
  if (INTRO){ cur = 0; side = 0; startIntro(); } }

/* entrada con las ilustraciones del grimorio */
const IMG_W = 1672, IMG_H = 941;
function placeHot(){
  if (!INTRO) return;
  const vw = innerWidth, vh = innerHeight, b = IMAGENES.libroEnImagen || {x:430,y:255,ancho:770,alto:615};
  const s = Math.max(vw/IMG_W, vh/IMG_H);
  const cx = (b.x + b.ancho/2)/IMG_W, cy = (b.y + b.alto/2)/IMG_H;
  const portrait = vw/vh < IMG_W/IMG_H;
  const px = portrait ? cx : .5, py = portrait ? .5 : cy;
  const ox = (vw - IMG_W*s)*px, oy = (vh - IMG_H*s)*py;
  document.querySelectorAll('.intro-img').forEach(el => { el.style.setProperty('--bp', `${px*100}% ${py*100}%`);
    el.style.setProperty('--ox', `${ox + (b.x+b.ancho/2)*s}px`); el.style.setProperty('--oy', `${oy + (b.y+b.alto/2)*s}px`); });
  const hot = $('introHot');
  if (isMobile()){ Object.assign(hot.style, {left:'0', top:'0', width:'100%', height:'100%'}); }
  else Object.assign(hot.style, {left:`${ox + b.x*s}px`, top:`${oy + b.y*s}px`, width:`${b.ancho*s}px`, height:`${b.alto*s}px`});
}
function startIntro(){
  const it = $('intro'); it.hidden = false; it.classList.remove('opening','zoom','fade');
  document.body.classList.add('intro'); placeHot();
}
let entering = false;
function enterFromIntro(){
  if (entering) return; entering = true; const it = $('intro');
  chime(4); setTimeout(()=>chime(7),160); rustle();
  it.classList.add('opening');                                   // el grimorio se abre sobre la mesa
  setTimeout(()=>{ it.classList.add('zoom'); chime(9); }, 650);  // la cámara se acerca
  setTimeout(()=>{
    openBook(true); document.body.classList.remove('intro');
    const bk = $('book'); bk.classList.remove('enter'); void bk.offsetWidth; bk.classList.add('enter');
    it.classList.add('fade');
    const r = bk.getBoundingClientRect(); confetti(r.left + r.width/2, r.top + r.height/2, 36);
  }, 1650);
  setTimeout(()=>{ it.hidden = true; it.classList.remove('opening','zoom','fade'); entering = false; }, 2500);
}
$('introHot').onclick = enterFromIntro;
addEventListener('resize', placeHot);
function liftAndOpen(){
  if (!document.body.classList.contains('resting')){ openBook(false); return; }
  document.body.classList.remove('resting'); chime(3); rustle();
  setTimeout(()=>openBook(false), 1250);
}
$('cover').onclick = liftAndOpen;
$('cover').onkeydown = e => { if (e.key==='Enter' || e.key===' '){ e.preventDefault(); liftAndOpen(); } };
$('closeBook').onclick = closeBook;
$('ribbon').onclick = () => navigate('inicio');

/* post-its */
function closeTabs(){ document.querySelectorAll('.tab.open').forEach(t=>t.classList.remove('open')); }

document.addEventListener('click', e => { if (!e.target.closest('.tab')) closeTabs(); });
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return; const h = a.getAttribute('href').slice(1); if (!h) return;
  e.preventDefault(); navigate(h); });
addEventListener('hashchange', () => navigate(location.hash.slice(1)));
addEventListener('keydown', e => { if (document.body.classList.contains('closed')) return;
  if (e.target.closest('input,select,textarea')) return;
  if (e.key==='ArrowRight') step(1); if (e.key==='ArrowLeft') step(-1); });
(function(){ let x0=null, y0=0; const el = $('pages');
  el.addEventListener('touchstart', e => { if (e.target.closest('.map-box,input,select')) return; x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, {passive:true});
  el.addEventListener('touchend', e => { if (x0===null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)*1.5) step(dx < 0 ? 1 : -1); }, {passive:true}); })();
addEventListener('resize', () => { if (!isMobile()) side = 0; });

/* ---------------- Arranque ---------------- */
renderRanks(); renderPlan(); showRoom('eterna'); renderMemberIndex();
loadEvents(EVENTOS_EJEMPLO, true);
fetch('eventos.json', {cache:'no-store'}).then(r => r.ok ? r.json() : Promise.reject()).then(d => { if (Array.isArray(d)) loadEvents(d, false); }).catch(()=>{});
setInterval(updateNext, 1000);
loadLive(); if (DISCORD_SERVER_ID) setInterval(loadLive, 60000);
let visto = false; try { visto = localStorage.getItem('atelier-visto') === '1'; } catch {}
if (location.hash.length > 1){ cur = idxForHash(location.hash.slice(1)); openBook(true); }
else if (visto){ cur = 0; openBook(true); }
else if (INTRO){ paint(); startIntro(); }
else paint();
