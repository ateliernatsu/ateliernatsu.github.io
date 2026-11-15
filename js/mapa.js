/* ==========================================================
   Mapa de Azeroth interactivo (WoW Forever)
   ========================================================== */
(function(){
  const svg = $('mapSvg'), tip = $('mapTip'), box = $('mapBox');
  const DIFF = {
    imposible:{ c:"#e0435c", t:"Imposible" }, dificil:{ c:"#f08a3c", t:"Difícil" }, tu:{ c:"#f2c94c", t:"Tu nivel" },
    facil:{ c:"#5cc98a", t:"Fácil" }, gris:{ c:"#8a8494", t:"Sin experiencia" }, santuario:{ c:"#b9a7d8", t:"Santuario" }
  };
  const FAC = { A:"Alianza", H:"Horda", C:"Disputada", S:"Santuario" };
  const CONT_NAME = { este:"Reinos del Este", kalimdor:"Kalimdor" };
  let cont = 'este', lvl = 10, sel = null;
  const VB0 = { x:-20, y:-70, w:640, h:1190 };
  let vb = {...VB0};

  function diff(lv){
    if (!lv) return 'santuario';
    const [a,b] = lv;
    if (lvl < a-4) return 'imposible';
    if (lvl < a) return 'dificil';
    if (lvl <= b) return 'tu';
    if (lvl <= b+5) return 'facil';
    return 'gris';
  }
  const lvTxt = lv => !lv ? '—' : (lv[0]===lv[1] ? `Nivel ${lv[0]}` : `Niveles ${lv[0]}–${lv[1]}`);
  const allZones = () => [...ZONAS.este.map(z=>({...z,cont:'este'})), ...ZONAS.kalimdor.map(z=>({...z,cont:'kalimdor'}))];
  const zoneById = id => allZones().find(z=>z.id===id);

  function rng(seed){ let x = seed % 2147483647 || 7; return () => (x = x*16807 % 2147483647) / 2147483647; }
  function blob(x, y, w, h, seed, pad=0, amp=3.2){
    x-=pad; y-=pad; w+=pad*2; h+=pad*2;
    const R = rng(seed), pts = [], step = 22, r = Math.min(16, w/3, h/3);
    const edge = (x1,y1,x2,y2) => { const len = Math.hypot(x2-x1,y2-y1), n = Math.max(2, Math.round(len/step));
      for (let i=0;i<n;i++){ const t=i/n, nx=-(y2-y1)/len, ny=(x2-x1)/len, d=(i===0?0:(R()-.5)*2*amp);
        pts.push([x1+(x2-x1)*t+nx*d, y1+(y2-y1)*t+ny*d]); } };
    edge(x+r,y,x+w-r,y); edge(x+w,y+r,x+w,y+h-r); edge(x+w-r,y+h,x+r,y+h); edge(x,y+h-r,x,y+r);
    let d = `M${((pts[0][0]+pts[pts.length-1][0])/2).toFixed(1)} ${((pts[0][1]+pts[pts.length-1][1])/2).toFixed(1)}`;
    for (let i=0;i<pts.length;i++){ const a=pts[i], b=pts[(i+1)%pts.length]; d += ` Q${a[0].toFixed(1)} ${a[1].toFixed(1)} ${((a[0]+b[0])/2).toFixed(1)} ${((a[1]+b[1])/2).toFixed(1)}`; }
    return d + 'Z';
  }
  const seedOf = id => [...id].reduce((a,c)=>a*31+c.charCodeAt(0),7) % 100000 + 11;

  function wrapName(n, w){
    const max = Math.max(8, Math.floor(w/7.2));
    if (n.length <= max) return [n];
    const words = n.split(' '); let a = '', lines = [];
    for (const wd of words){ if ((a+' '+wd).trim().length > max && a){ lines.push(a); a = wd; } else a = (a+' '+wd).trim(); }
    lines.push(a); return lines.slice(0,3);
  }

  function render(){
    const F = { zonas:$('fZonas').checked, maz:$('fMaz').checked, ban:$('fBan').checked, nuevo:$('fNew').checked };
    const zones = ZONAS[cont];
    let s = `<defs>
      <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#162a52"/><stop offset="1" stop-color="#0d1834"/></linearGradient>
      <pattern id="waves" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M0 10 Q10 4 20 10 T40 10" fill="none" stroke="rgba(142,166,255,.12)" stroke-width="1.2"/></pattern>
      <filter id="sh" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
    </defs>
    <rect x="-600" y="-600" width="1800" height="2300" fill="url(#sea)"/><rect x="-600" y="-600" width="1800" height="2300" fill="url(#waves)"/>`;
    // coastline / landmass under the zones
    s += zones.filter(z=>!z.nube).map(z => `<path d="${blob(...z.r, seedOf(z.id)+3, 9, 6)}" fill="#3b2f2a" stroke="#c9a46a" stroke-opacity=".55" stroke-width="2"/>`).join('');
    s += zones.filter(z=>!z.nube).map(z => `<path d="${blob(...z.r, seedOf(z.id)+3, 4, 5)}" fill="#5a4636"/>`).join('');
    for (const z of zones){
      const [x,y,w,h] = z.r, d = diff(z.lv), col = DIFF[d].c;
      const dim = F.nuevo && !z.nueva;
      const lines = wrapName((z.nueva?'✦ ':'')+z.n, w);
      const ty = y + h/2 - (lines.length-1)*6 - 2;
      s += `<g class="zone ${z.nueva?'new':''} ${sel===z.id?'sel':''} ${dim?'dim':''}" data-id="${z.id}">
        <path class="z" d="${z.nube?blob(x,y,w,h,seedOf(z.id),0,7):blob(x+2,y+2,w-4,h-4,seedOf(z.id))}" fill="${F.zonas?col:'#2a2440'}" fill-opacity="${F.zonas?.86:.9}"/>
        ${z.nube?`<text x="${x+w-18}" y="${y+20}" font-size="16">☁️</text>`:''}
        ${(z.fac==='A'||z.fac==='H')?`<circle cx="${x+14}" cy="${y+14}" r="8" fill="${z.fac==='A'?'#2f55d4':'#b8312f'}" stroke="#fff" stroke-width="1.2"/><text x="${x+14}" y="${y+17.5}" text-anchor="middle" font-size="9" style="fill:#fff">${z.fac}</text>`:''}
        ${lines.map((l,i)=>`<text x="${x+w/2}" y="${ty+i*12}" text-anchor="middle" font-size="11" style="fill:${F.zonas?'#1b0f24':'#f7eef6'}">${esc(l)}</text>`).join('')}
        <text class="zl" x="${x+w/2}" y="${ty+lines.length*12+2}" text-anchor="middle" style="fill:${F.zonas?'#1b0f24':'#c9bfd6'}">${z.lv?(z.lv[0]===z.lv[1]?z.lv[0]:z.lv[0]+'–'+z.lv[1]):'santuario'}</text>
      </g>`;
    }
    // instances
    const byZone = {};
    INSTANCIAS.forEach(inst => { if (!zones.find(z=>z.id===inst.z)) return;
      if (inst.t==='M' && !F.maz) return; if (inst.t==='B' && !F.ban) return; if (F.nuevo && !inst.nueva) return;
      (byZone[inst.z] ||= []).push(inst); });
    for (const [zid, list] of Object.entries(byZone)){
      const z = zones.find(q=>q.id===zid); const [x,y,w,h] = z.r;
      list.forEach((inst,k) => {
        const cx = x + (k+1)*w/(list.length+1), cy = y + h - 13;
        const idx = INSTANCIAS.indexOf(inst);
        s += `<g class="marker" data-inst="${idx}" data-z="${zid}"><circle cx="${cx}" cy="${cy}" r="9" fill="${inst.t==='B'?'#c94b7e':'#4b6cf2'}" ${inst.nueva?'stroke="#f1c27d" stroke-width="2.5"':''}/><text x="${cx}" y="${cy+3.2}" text-anchor="middle">${inst.t}</text></g>`;
      });
    }
    svg.innerHTML = s;
    setVB();
    $('mapTitle').textContent = CONT_NAME[cont];
    bindHover(); renderRec(); renderInfo();
  }
  function setVB(){ svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`); }

  function bindHover(){
    svg.querySelectorAll('.zone').forEach(g => {
      const z = ZONAS[cont].find(q=>q.id===g.dataset.id);
      g.addEventListener('mousemove', e => showTip(e, `<b>${esc(z.n)}</b>${z.nueva?'<span class="badge-new">Forever</span>':''}<br>${lvTxt(z.lv)} · ${FAC[z.fac]}<br><span style="color:${DIFF[diff(z.lv)].c}">● ${DIFF[diff(z.lv)].t}</span>`));
      g.addEventListener('mouseleave', hideTip);
      g.addEventListener('click', () => { if (moved) return; sel = z.id; render(); chime(3); });
    });
    svg.querySelectorAll('.marker').forEach(g => {
      const inst = INSTANCIAS[+g.dataset.inst];
      g.addEventListener('mousemove', e => { e.stopPropagation(); showTip(e, `<b>${inst.t==='B'?'🐉 Banda':'🏰 Mazmorra'}: ${esc(inst.n)}</b>${inst.nueva?'<span class="badge-new">Forever</span>':''}<br>${lvTxt(inst.lv)}${inst.extra?'<br>'+esc(inst.extra):''}`); });
      g.addEventListener('mouseleave', hideTip);
      g.addEventListener('click', e => { e.stopPropagation(); if (moved) return; sel = g.dataset.z; render(); });
    });
  }
  function showTip(e, html){ const r = box.getBoundingClientRect(); tip.innerHTML = html; tip.hidden = false;
    let x = e.clientX - r.left + 14, y = e.clientY - r.top + 14; if (x > r.width - 250) x -= 270; tip.style.left = x+'px'; tip.style.top = y+'px'; }
  function hideTip(){ tip.hidden = true; }

  function instLine(i){ return `<li>${i.t==='B'?'🐉':'🏰'} <b>${esc(i.n)}</b>${i.nueva?'<span class="badge-new">Forever</span>':''}<small>${lvTxt(i.lv)}${i.extra?' · '+esc(i.extra):''}${i.aprox?' · ubicación aproximada':''}</small></li>`; }
  function renderInfo(){
    const el = $('zInfo');
    if (!sel){ el.innerHTML = `<h3>Pulsa una zona</h3><p style="color:var(--muted);font-size:14.5px;margin:6px 0 0">Verás su rango de nivel, de qué facción es y qué mazmorras o bandas tiene.</p>`; return; }
    const z = zoneById(sel); const d = diff(z.lv); const ins = INSTANCIAS.filter(i=>i.z===z.id);
    el.innerHTML = `<h3>${esc(z.n)}${z.nueva?'<span class="badge-new">Forever</span>':''}</h3>
      <div class="lv">${lvTxt(z.lv)} · <span style="color:${DIFF[d].c}">${DIFF[d].t}</span></div>
      <div class="fac">${FAC[z.fac]}${z.fac==='H'?' · ojo, zona de la Horda':''}</div>
      ${z.nota?`<p style="font-size:14px;color:var(--muted);margin:0 0 12px">${esc(z.nota)}</p>`:''}
      ${ins.length?`<ul>${ins.map(instLine).join('')}</ul>`:'<p style="font-size:14px;color:var(--muted);margin:0">Sin mazmorras ni bandas en esta zona.</p>'}`;
  }
  function renderRec(){
    const zs = allZones().filter(z => diff(z.lv)==='tu' && z.fac!=='H');
    const ins = INSTANCIAS.filter(i => lvl >= i.lv[0]-2 && lvl <= i.lv[1]);
    const items = [...zs.map(z=>({t:`🗺️ ${z.n}${z.nueva?' ✦':''}`, s:lvTxt(z.lv), z:z.id, c:z.cont})),
                   ...ins.map(i=>({t:`${i.t==='B'?'🐉':'🏰'} ${i.n}${i.nueva?' ✦':''}`, s:lvTxt(i.lv), z:i.z, c:zoneById(i.z)?.cont}))];
    const seen = new Set(); for (let i=items.length-1;i>=0;i--){ if (seen.has(items[i].t)) items.splice(i,1); else seen.add(items[i].t); }
    $('recList').innerHTML = items.length ? items.map(it=>`<button type="button" data-z="${it.z}" data-c="${it.c}"><span>${esc(it.t)}</span><span>${esc(it.s)}</span></button>`).join('')
      : `<p style="color:var(--muted);font-size:14px;margin:0">Nada a tu nivel por aquí.</p>`;
    $('recList').querySelectorAll('button').forEach(b => b.onclick = () => { sel = b.dataset.z; if (b.dataset.c && b.dataset.c!==cont) setCont(b.dataset.c); else render(); });
  }
  function setCont(c){ cont = c; vb = {...VB0};
    $('contSeg').querySelectorAll('button').forEach(b=>b.classList.toggle('on', b.dataset.c===c)); render(); }

  // controls
  const setLvl = v => { lvl = Math.max(1, Math.min(60, +v||1)); $('lvlRange').value = lvl; $('lvlNum').value = lvl; render(); };
  $('lvlRange').oninput = e => setLvl(e.target.value);
  $('lvlNum').oninput = e => setLvl(e.target.value);
  $('contSeg').querySelectorAll('button').forEach(b => b.onclick = () => setCont(b.dataset.c));
  ['fZonas','fMaz','fBan','fNew'].forEach(id => $(id).onchange = render);
  $('fAll').onclick = () => { $('fZonas').checked = $('fMaz').checked = $('fBan').checked = true; $('fNew').checked = false; render(); };
  $('fNone').onclick = () => { $('fZonas').checked = $('fMaz').checked = $('fBan').checked = false; render(); };

  // zoom & pan
  function zoom(f, cx, cy){
    const nw = Math.max(150, Math.min(900, vb.w*f)); const k = nw / vb.w; const nh = vb.h*k;
    cx ??= vb.x + vb.w/2; cy ??= vb.y + vb.h/2;
    vb = { x: cx - (cx-vb.x)*k, y: cy - (cy-vb.y)*k, w: nw, h: nh }; setVB();
  }
  $('zIn').onclick = () => zoom(.75); $('zOut').onclick = () => zoom(1.33);
  $('zReset').onclick = () => { vb = {...VB0}; setVB(); };
  function svgPoint(e){ const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
  svg.addEventListener('wheel', e => { e.preventDefault(); const p = svgPoint(e); zoom(e.deltaY < 0 ? .85 : 1.18, p.x, p.y); }, {passive:false});
  let drag = null, moved = false;
  svg.addEventListener('pointerdown', e => { drag = { x:e.clientX, y:e.clientY, vb:{...vb} }; moved = false; });
  addEventListener('pointermove', e => { if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx)+Math.abs(dy) > 4){ moved = true; svg.classList.add('drag'); hideTip(); }
    if (!moved) return; const r = svg.getBoundingClientRect(); const s = Math.max(vb.w / r.width, vb.h / r.height);
    vb.x = drag.vb.x - dx*s; vb.y = drag.vb.y - dy*s; setVB(); });
  addEventListener('pointerup', () => { drag = null; svg.classList.remove('drag'); setTimeout(()=>moved=false, 0); });

  render();
})();
