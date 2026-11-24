/* Modo «Estudiar»: temario por partes + recuerdo activo + repetición espaciada. Sincroniza por Drive (core.js). */
(()=>{
const DAY=864e5,MIN=6e4,Zs=()=>QZ.Z,$$=s=>document.querySelector(s),cmp=(a,b)=>a<b?-1:a>b?1:0;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),br=s=>esc(s).replace(/\n/g,'<br>');
let ST={v:'home'};
const css=document.createElement('style');css.textContent=`.eb{display:flex;height:8px;border-radius:4px;overflow:hidden;background:#cbd5e1;margin:6px 0 2px}.eb i{display:block}
.ec{min-height:170px;font-size:19px;line-height:1.55;padding:22px 20px}.ec hr{border:0;border-top:1px solid var(--bd);margin:14px 0}
.cz{background:#d9770622;color:#b45309;border-radius:4px;padding:0 6px;font-weight:700}.cz2{color:#0f766e;background:#0f766e1c;border-radius:4px;padding:0 4px;font-weight:700}
.gr{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.gr button{padding:12px 2px;font-size:14px;line-height:1.25}
.es textarea{width:100%;min-height:150px;padding:10px 12px;border:1px solid var(--bd);border-radius:8px;background:var(--bg);color:var(--tx);font:inherit}
.es input[type=date],.es input[type=number]{padding:7px 9px;border:1px solid var(--bd);border-radius:8px;background:var(--bg);color:var(--tx);font:inherit}
.es .box{border-left:4px solid #0f766e;background:#0f766e12;padding:10px 14px;border-radius:6px;margin:12px 0}.es .mn{border-left-color:#d97706;background:#d9770614}.es li{margin:5px 0}.es p.t{margin:.7em 0;line-height:1.6}`;
document.head.appendChild(css);
const save=()=>QZ.guardar(),R=()=>{window.go('estudio');scrollTo(0,0)};
// ---- contenido
function temario(){const T={};for(const[f,t]of Object.entries(Zs().est||{})){let j;try{j=JSON.parse(t)}catch{continue}if(!Array.isArray(j.partes))continue;
 const k=String(j.tema||f).toUpperCase(),o=T[k]??={tema:k,titulo:j.titulo||'',partes:[]};if(j.titulo&&!o.titulo)o.titulo=j.titulo;
 j.partes.forEach((p,pi)=>{const pid=String(p.id??pi+1).replace(/[^\w.-]/g,'_');
  o.partes.push({id:pid,titulo:p.titulo||'Parte '+(pi+1),texto:[].concat(p.texto||[]),claves:p.claves||[],entender:p.entender||'',mnemo:p.mnemo||'',pagina:p.pagina,
   cards:(p.tarjetas||[]).map((x,i)=>({cid:`${k}:${pid}:${x.id??i}`,tema:k,parte:pid,q:x.q,a:x.a,c:x.c})).filter(c=>c.c||(c.q&&c.a))})})}
 return Object.values(T).sort((a,b)=>cmp(a.tema,b.tema))}
const part=(t,p)=>temario().find(x=>x.tema==t)?.partes.find(x=>x.id==p);
const front=c=>c.c?br(c.c).replace(/\{\{(.+?)\}\}/g,'<span class=cz>[…]</span>'):br(c.q),back=c=>c.c?br(c.c).replace(/\{\{(.+?)\}\}/g,'<span class=cz2>$1</span>'):br(c.a);
// ---- configuración y notas (se fusionan entre dispositivos por fecha)
const cfgs=()=>[Zs().rev.cfg,...Object.values(Zs().revOtros||{}).map(r=>r.cfg)].filter(x=>x&&x.ts).sort((a,b)=>b.ts-a.ts)[0]||{};
const exam=()=>{const c=cfgs();return c.examen?new Date(c.examen+'T23:59:59').getTime():0};
const notas=()=>{const n={};[Zs().rev,...Object.values(Zs().revOtros||{})].forEach(r=>{for(const[k,v]of Object.entries(r.notas||{}))if(!n[k]||v.t>n[k].t)n[k]=v});return n};
// ---- repetición espaciada (tipo SM-2; se recalcula siempre desde el registro de repasos de todos los dispositivos)
const nuevo=t=>({ease:2.5,ivl:0,due:0,reps:0,lap:0,first:t});
function paso(s,t,g){const ex=exam();
 if(!s.reps){if(g==1)s.due=t+MIN;else if(g==2)s.due=t+6*MIN;else{s.reps=1;s.ivl=g==3?1:4;s.due=t+s.ivl*DAY}}
 else if(g==1){s.lap++;s.ease=Math.max(1.3,s.ease-.2);s.ivl=1;s.due=t+10*MIN}
 else{const k=g==2?1.2:g==3?s.ease:s.ease*1.3;if(g==2)s.ease=Math.max(1.3,s.ease-.15);if(g==4)s.ease+=.15;s.ivl=Math.max(s.ivl+1,Math.round(s.ivl*k));s.due=t+s.ivl*DAY}
 if(ex>t&&s.reps){const mx=Math.max(1,Math.floor((ex-t)/DAY/2));if(s.ivl>mx){s.ivl=mx;s.due=t+mx*DAY}}return s}
const logs=()=>{const l=[...(Zs().rev.log||[])];Object.values(Zs().revOtros||{}).forEach(r=>l.push(...(r.log||[])));return l.sort((a,b)=>a.t-b.t)};
function estados(){const E={},act={};for(const e of logs()){if(e.a){act[e.a]=1;continue}E[e.c]=paso(E[e.c]??nuevo(e.t),e.t,e.g)}return{E,act}}
const lab=(s,t)=>{const d=s.due-t;return d<36e5?Math.max(1,Math.round(d/MIN))+' min':d<DAY?Math.round(d/36e5)+' h':Math.round(d/DAY)+' d'};
const hint=(c,g)=>{const t=Date.now(),e=ST.E[c.cid];return lab(paso(e?{...e}:nuevo(t),t,g),t)};
const nivel=s=>!s?0:s.ivl>=21?2:1;
const bar=(cs,E)=>{const n=[0,0,0];cs.forEach(c=>n[nivel(E[c.cid])]++);const t=cs.length||1;return`<div class=eb><i style="width:${100*n[2]/t}%;background:#0f766e"></i><i style="width:${100*n[1]/t}%;background:#d97706"></i></div><small>${n[2]} dominadas · ${n[1]} aprendiendo · ${n[0]} nuevas</small>`};
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
function cola(n){const T=temario(),{E,act}=estados(),cs=T.flatMap(t=>t.partes.flatMap(p=>p.cards)),now=Date.now(),h0=new Date().setHours(0,0,0,0),lim=cfgs().nuevas??10,nh=Object.values(E).filter(s=>s.first>=h0).length;
 const due=shuf(cs.filter(c=>E[c.cid]&&E[c.cid].due<=now)),nw=cs.filter(c=>!E[c.cid]&&act[c.tema+':'+c.parte]).slice(0,Math.max(0,lim-nh));return[...due,...nw].slice(0,n)}
function empieza(q,vuelta){if(!q.length)return alert('No hay tarjetas pendientes.');ST={v:'ses',q,i:0,m:false,E:estados().E,t0:Date.now(),g:[0,0,0,0,0],vuelta,n:q.length};R()}
// ---- vistas
function home(){const T=temario(),{E,act}=estados(),cs=T.flatMap(t=>t.partes.flatMap(p=>p.cards)),now=Date.now(),L=logs().filter(e=>!e.a),c=cfgs(),lim=c.nuevas??10,h0=new Date().setHours(0,0,0,0);
 const nh=Object.values(E).filter(s=>s.first>=h0).length,due=cs.filter(x=>E[x.cid]&&E[x.cid].due<=now).length,nw=Math.min(cs.filter(x=>!E[x.cid]&&act[x.tema+':'+x.parte]).length,Math.max(0,lim-nh)),pend=due+nw;
 const f=d=>new Date(d-d.getTimezoneOffset()*MIN).toISOString().slice(0,10),dias=new Set(L.map(e=>f(new Date(e.t))));let racha=0,d=new Date();if(!dias.has(f(d)))d=new Date(d-DAY);while(dias.has(f(d))){racha++;d=new Date(d-DAY)}
 const sem=L.filter(e=>e.t>now-7*DAY),ret=sem.length?Math.round(100*sem.filter(e=>e.g>1).length/sem.length)+'%':'–',dom=cs.filter(x=>nivel(E[x.cid])==2).length,ex=exam();
 return`<div class=es><h1>Estudiar</h1><p class=sub>Una parte cada vez: leer, recordar sin mirar y tarjetas. Sesiones cortas, a diario.</p>
<div class=card><h2>Hoy</h2><p style="margin:4px 0 12px"><b style="font-size:26px">${pend}</b> tarjetas pendientes <small>(${due} repasos + ${nw} nuevas · ~${Math.max(1,Math.round(pend/5))} min)</small></p>
<div class=row><button class="btn pri" onclick="EST.cola(10)" ${pend?'':'disabled'}>Sesión corta (10)</button><button class=btn onclick="EST.cola(30)" ${pend?'':'disabled'}>Sesión larga (30)</button></div>
${pend?'':'<p class=sub style="margin:10px 0 0">Nada pendiente. Abre un tema y estudia una parte nueva ↓</p>'}</div>
<div class="grid g2" style="margin-bottom:12px"><div class=card><small>Racha</small><br><b style="font-size:22px">${racha}</b> días</div><div class=card><small>Dominadas · Acierto 7 d</small><br><b style="font-size:22px">${dom}/${cs.length} · ${ret}</b></div></div>
${T.length?T.map(t=>{const cc=t.partes.flatMap(p=>p.cards);return`<div class=card onclick="EST.tema('${t.tema}')" style="cursor:pointer"><b>${esc(t.tema)}</b> ${esc(t.titulo)} <small>· ${t.partes.length} partes · ${cc.length} tarjetas</small>${bar(cc,E)}</div>`}).join(''):'<div class=card><b>Aún no hay temas de estudio.</b><p class=sub>Importa los archivos de estudio (.json) desde «Sincronizar».</p></div>'}
<div class=card><b>Ajustes</b><div class=row style="margin-top:8px"><label>Fecha de examen <input type=date id=ex value="${esc(c.examen||'')}" onchange="EST.cfg()"></label><label>Nuevas al día <input type=number id=nu min=0 max=50 value="${lim}" style="width:70px" onchange="EST.cfg()"></label></div>
<p class=sub style="margin:8px 0 0">${ex>now?`Faltan ${Math.ceil((ex-now)/DAY)} días: los repasos se acortan para que todo se repase antes del examen.`:'Con fecha de examen, la app ajusta los intervalos para llegar con todo repasado.'}</p></div></div>`}
function vTema(){const t=temario().find(x=>x.tema==ST.t);if(!t)return home();const{E}=estados();
 return`<div class=es><p><button class=btn onclick="EST.home()">◀ Estudiar</button></p><h1>${esc(t.tema)} ${esc(t.titulo)}</h1>
${t.partes.map((p,i)=>`<div class=card><b>${i+1}. ${esc(p.titulo)}</b>${p.pagina?` <small>· pág. ${esc(p.pagina)}</small>`:''}${p.cards.length?bar(p.cards,E):'<br><small>Sin tarjetas</small>'}<div class=row style="margin-top:8px"><button class="btn pri" onclick="EST.parte('${t.tema}','${p.id}')">Estudiar</button>${p.cards.some(c=>E[c.cid])?`<button class=btn onclick="EST.rep('${t.tema}','${p.id}')">Repasar</button>`:''}</div></div>`).join('')}</div>`}
function vParte(){const P=part(ST.t,ST.p);if(!P)return home();const k=ST.t+':'+ST.p,nt=notas()[k]?.x||'',s=ST.s,hd=`<div class=es><p><button class=btn onclick="EST.tema('${ST.t}')">◀ ${esc(ST.t)}</button></p><h1>${esc(P.titulo)}</h1><p class=sub>Paso ${s+1} de 3 · ${['Leer (≈5 min)','Recordar sin mirar','Comparar'][s]}</p>`,cl=P.claves.length?`<ul>${P.claves.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';
 if(s==0)return hd+`<div class=card>${P.texto.map(x=>`<p class=t>${br(x)}</p>`).join('')}${cl?'<b>Claves</b>'+cl:''}${P.entender?`<div class=box><b>Para entenderlo</b><br>${br(P.entender)}</div>`:''}${P.mnemo?`<div class="box mn"><b>Regla para recordar</b><br>${br(P.mnemo)}</div>`:''}</div><button class="btn pri" style="width:100%;padding:14px" onclick="EST.s(1)">Ya lo he leído → recordar</button></div>`;
 if(s==1)return hd+`<div class=card><p class=t>Sin mirar el texto, escribe (o di en voz alta) todo lo que recuerdes y explícalo con tus palabras, como si se lo contaras a alguien. No pasa nada si te dejas cosas: el esfuerzo de recordar es lo que graba.</p><textarea id=nt>${esc(nt)}</textarea></div><button class="btn pri" style="width:100%;padding:14px" onclick="EST.comp()">Comparar con las claves</button></div>`;
 return hd+`<div class=card><b>Lo esencial</b>${cl||'<p class=sub>Esta parte no tiene claves.</p>'}${nt?`<hr style="border:0;border-top:1px solid var(--bd)"><small>Lo que has escrito</small><p class=t>${br(nt)}</p>`:''}<p class=sub>Marca mentalmente qué te faltó. Si fue mucho, relee; si no, pasa a las tarjetas.</p></div><div class=row><button class=btn onclick="EST.s(0)">Volver a leer</button><button class="btn pri" onclick="EST.tarj()">Pasar a tarjetas (${P.cards.length})</button></div></div>`}
function vSes(){const q=ST.q;if(ST.i>=q.length){const n=ST.g.reduce((a,b)=>a+b,0),ok=ST.g[2]+ST.g[3]+ST.g[4];
 return`<div class=es><h1>¡Sesión completada!</h1><div class=card><p class=big style="margin:0">${n} repasos · ${n?Math.round(100*ok/n):0}% bien · ${Math.max(1,Math.round((Date.now()-ST.t0)/MIN))} min</p><p class=sub style="margin:6px 0 0">Otra vez: ${ST.g[1]} · Difícil: ${ST.g[2]} · Bien: ${ST.g[3]} · Fácil: ${ST.g[4]}. Hacer un poco cada día rinde más que mucho un día. Descansa un momento antes de seguir.</p></div><div class=row><button class="btn pri" onclick="EST.cola(10)">Otra sesión corta</button><button class=btn onclick="EST.home()">Volver</button></div></div>`}
 const c=q[ST.i],P=part(c.tema,c.parte),col=['','#dc2626','#d97706','#0f766e','#2563eb'],nom=['','Otra vez','Difícil','Bien','Fácil'];
 return`<div class=es><div class=row style="justify-content:space-between"><b>${ST.i+1}/${q.length}</b><small>${esc(c.tema)} · ${esc(P?.titulo||'')}</small><button class=btn onclick="EST.home()">Salir</button></div><div class=eb><i style="width:${100*ST.i/q.length}%;background:#0f766e"></i></div>
<div class="card ec">${c.c?(ST.m?back(c):front(c)):front(c)+(ST.m?'<hr>'+back(c):'')}</div>
${ST.m?`<div class=gr>${[1,2,3,4].map(g=>`<button class=btn style="border-color:${col[g]}" onclick="EST.g(${g})"><b>${nom[g]}</b><br><small>${hint(c,g)}</small></button>`).join('')}</div>`:'<button class="btn pri" style="width:100%;padding:14px" onclick="EST.m()">Mostrar respuesta</button>'}</div>`}
window.vEstudio=()=>!(QZ.Z&&QZ.Z.rev)?'<p class=sub>Cargando…</p>':({home,tema:vTema,parte:vParte,ses:vSes}[ST.v]||home)();
window.EST={home(){ST={v:'home'};R()},tema(t){ST={v:'tema',t};R()},parte(t,p){ST={v:'parte',t,p,s:0};R()},s(n){ST.s=n;R()},
 comp(){const a=$$('#nt');if(a){const r=Zs().rev;(r.notas??={})[ST.t+':'+ST.p]={x:a.value,t:Date.now()};save()}ST.s=2;R()},
 tarj(){Zs().rev.log.push({t:Date.now(),a:ST.t+':'+ST.p});save();const{E}=estados(),now=Date.now(),P=part(ST.t,ST.p);empieza(P.cards.filter(c=>!E[c.cid]||E[c.cid].due<=now),{v:'tema',t:ST.t})},
 rep(t,p){const{E}=estados(),now=Date.now();empieza(shuf(part(t,p).cards.filter(c=>E[c.cid]&&E[c.cid].due<=now)),{v:'tema',t})},
 cola(n){empieza(cola(n))},m(){ST.m=true;R()},
 g(g){const c=ST.q[ST.i],t=Date.now();Zs().rev.log.push({t,c:c.cid,g});ST.E[c.cid]=paso(ST.E[c.cid]?{...ST.E[c.cid]}:nuevo(t),t,g);ST.g[g]++;save();
  if(g==1)ST.q.splice(Math.min(ST.q.length,ST.i+5),0,c);ST.i++;ST.m=false;if(ST.i>=ST.q.length)QZ.bg();R()},
 cfg(){Zs().rev.cfg={examen:$$('#ex').value,nuevas:Math.max(0,+$$('#nu').value||0),ts:Date.now()};save();R()}};
document.addEventListener('keydown',e=>{if(ST.v!='ses'||!$$('.ec')||ST.i>=ST.q.length||e.target.matches('input,textarea'))return;
 if(!ST.m&&(e.key==' '||e.key=='Enter')){e.preventDefault();EST.m()}else if(ST.m&&'1234'.includes(e.key)&&e.key)EST.g(+e.key)});
})();
